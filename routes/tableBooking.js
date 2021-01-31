const {Router} = require('express')
const {validationResult} = require('express-validator')
const Table = require('../models/table')
const router = Router()
const auth = require('../middleware/auth')
const {tableValidators} = require('../utils/validators')

function isOwner(table, req) {
    return table.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
    try {
        const table = await Table.find().lean()
        res.render('index', {
            title: 'Бронирование столов',
            isTableBooking: true,
            userId: req.user ? req.user._id.toString() : null,
            table
        })
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    try {
        const table = await Table.findById(req.params.id).lean()
        if (!isOwner(table, req)) {
            return res.redirect('/')
        }
        res.render('editTable', {
            title: `Редактировать ${table.title}`,
            table
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/edit/remove', auth, async (req, res) => {
    try {
        await Table.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        })
        res.redirect('/')
    } catch (e) {
        console.log(e)
    }
})

router.post('/edit', auth, tableValidators, async (req, res) => {
    const error = validationResult(req)
    const {id} = req.body
    if (!error.isEmpty()) {
        return res.status(422).redirect(`/${id}/edit?allow=true`)
    }
    try {
        delete req.body.id
        const table = await Table.findById(id)
        if (!isOwner(table, req)) {
            return res.redirect('/')
        }
        Object.assign(table, req.body)
        await table.save()
        res.redirect('/')
    } catch (e) {

    }
})

router.get('/tableInfo/:id', async (req, res) => {
    try {
        if (req.params.id !== 'favicon.ico') {
            const table = await Table.findById(req.params.id).lean()
            res.render('table', {
                title: `Стол: ${table.title}`,
                table
            })
        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router
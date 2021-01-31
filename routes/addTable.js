const {Router} = require('express')
const router = Router()
const {validationResult} = require('express-validator')
const Table = require('../models/table')
const auth = require('../middleware/auth')
const {tableValidators} = require('../utils/validators')

router.get('/', auth, (req, res) => {
    res.render('addTable', {
        title: 'Добавить стол',
        isAddTable: true
    })
})

router.post('/', auth, tableValidators, async (req, res) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(422).render('addTable', {
            title: 'Добавить стол',
            isAddTable: true,
            error: error.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.img
            }
        })
    }
    const table = new Table({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    })

    try {
        await table.save()
        res.redirect('/')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router
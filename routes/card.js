const {Router} = require('express')
const Table = require('../models/table')
const router = Router()
const auth = require('../middleware/auth')
const Reservation = require('../models/reservation')
const moment = require('moment')

function mapCartItems(cart) {
    return cart.items.map(t => ({
        ...t.tableId._doc,
        id: t.tableId.id,
        count: t.count
    }))
}

function calculatePrice(tables) {
    return tables.reduce((total, table) => {
        return total += table.price * table.count
    }, 0)
}

router.post('/add', auth, async (req, res) => {
    var date = moment().format('YYYY-MM-DD')

    if (typeof req.body.timeClient !== "undefined") {
        date = date + 'T' + req.body.timeClient + ':00.000Z'
    } else {
        date = new Date()
    }

    const reservation = new Reservation ({
        tableId: req.body.id,
        clientName: req.body.clientName,
        quantity: req.body.quantity,
        dateTime: date,
    })
    try {
        await reservation.save()
        res.redirect('/control')
    } catch (e) {
        console.log(e)
    }
})

router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.tableId').execPopulate()
    const tables = mapCartItems(user.cart)
    const cart = {
        tables, price: calculatePrice(tables)
    }
    res.status(200).json(cart)
})

router.get('/', auth, async (req, res) => {
    const user = await req.user
    .populate('cart.items.tableId')
    .execPopulate()

    const tables = mapCartItems(user.cart)

    res.render('card', {
        title: 'Корзина',
        isCard: true,
        tables: tables,
        price: calculatePrice(tables)
    })
})

module.exports = router
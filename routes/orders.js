const {Router} = require('express')
const router = Router()
const Order = require('../models/order')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
    try {
        const order = await Order.find({'user.userId': req.user._id})
            .populate('user.userId')
        res.render('orders', {
            isOrder: true,
            title: 'Заказы',
            orders: order.map(o => {
                return {
                    ...o._doc,
                    price: o.tables.reduce((total, c) => {
                        return total += c.count * c.table.price
                    }, 0)
                }
            })
        })
    } catch(e) {
        console.log(e)
    }
})

router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.tableId').execPopulate()
        const tables = user.cart.items.map(t => ({
            count: t.count,
            table: {...t.tableId._doc}
        }))
        const order = new Order ({
            user: {
                name: req.user.name,
                userId: req.user
            },
            tables: tables
        })

        await order.save()
        await req.user.clearCart()

        res.redirect('/orders')
    } catch(e) {
        console.log(e)
    }
})

module.exports = router
const {Schema, model} = require('mongoose')

const user = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    password: {
        type: String,
        required: true
    },
    avatarUrl: String,
    resetToken: String,
    resetTokenExp: Date,
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                tableId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Table',
                    required: true
                }
            }
        ]
    }
})

user.methods.addToCart = function(table) {
    const items = [...this.cart.items]
    const idx = items.findIndex(t => {
        return t.tableId.toString() === table._id.toString()
    })
    if (idx >= 0) {
        items[idx].count = items[idx].count + 1
    } else {
        items.push({
            tableId: table._id,
            count: 1
        })
    }
    this.cart = {items}
    return this.save()
}

user.methods.removeFromCart = function(id) {
    let items = [...this.cart.items]
    const idx = items.findIndex(t => {
        return t.tableId.toString() === id.toString()
    })
    if (items[idx].count === 1) {
        items = items.filter(t => t.tableId.toString() !== id.toString())
    } else {
        items[idx].count--
    }
    this.cart = {items}
    return this.save()
}

user.methods.clearCart = function() {
    this.cart = {items: []}
    return this.save()
}

module.exports = model('User', user)
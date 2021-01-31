const {Schema, model} = require('mongoose')

const table = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

table.method('toClient', function() {
    const table = this.toObject()
    table.id = table._id
    delete table._id
    return table
})

module.exports = model('Table', table)
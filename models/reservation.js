const {Schema, model} = require('mongoose')

const reservation = new Schema({
    tableId: {
        type: Schema.Types.ObjectId,
        ref: 'Table',
        required: true
    },
    clientName: String,
    quantity: Number,
    dateTime: {
        type: Date,
        default: Date.now
    }
})

reservation.methods.removeReservation = function(id) {
    console.log(id)
}

module.exports = model('Reservation', reservation)
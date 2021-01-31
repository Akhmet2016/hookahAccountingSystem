const {Router} = require('express')
const auth = require('../middleware/auth')
const Reservation = require('../models/reservation')
const router = Router()
const moment = require('moment')

router.get('/', auth, async (req, res) => {
    const date = moment().format('YYYY-MM-DD')
    const startDate = date + 'T00:00:00.000+00:00'
    const endDate = date + 'T23:59:59.000+00:00'
    const reservationSQL = await Reservation.find({
        dateTime: {
            $gte: startDate,
            $lt: endDate,
        }
    }).populate('tableId').exec()
    const reservation = reservationFunction(reservationSQL)
    res.render('reservationControl', {
        title: 'История бронирования',
        isControl: true,
        reservation
    })
})

router.post('/', auth, async (req, res) => {
    const date = req.body.dateReservation;
    if (typeof date !== 'undefined') {
        const dateParts = date.split('.')
        const startDate = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0] + 'T00:00:00.000+00:00'
        const endDate = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0] + 'T23:59:59.000+00:00'
        const reservationSQL = await Reservation.find({
            dateTime: {
                $gte: startDate,
                $lt: endDate
            }
        }).populate('tableId').exec()
        const reservation = reservationFunction(reservationSQL)
        res.render('reservationControl', {
            title: 'История бронирования',
            isControl: true,
            reservation
        })
    }
})

router.delete('/remove/:id', auth, async (req, res) => {
    if (typeof req.params.id != 'undefined' && typeof req.body.date != 'undefined') {
        await Reservation.deleteOne({ '_id': req.params.id })
        const date = moment(new Date(req.body.date)).format("YYYY-MM-DD")
        const startDate = date + 'T00:00:00.000+00:00'
        const endDate = date + 'T23:59:59.000+00:00'
        const reservationSQL = await Reservation.find({dateTime: {$gte: startDate, $lt: endDate}}).populate('tableId').exec()
        const reservation = reservationFunction(reservationSQL)
        res.status(200).json(reservation)
    } else {
        res.redirect('/control')
    }
})

const reservationFunction = reservationSQL => {
    let minutes = 0
    let reservation = []
    for (let key in reservationSQL) {
        if (+reservationSQL[key].dateTime.getUTCMinutes() < 10) {
            minutes = '0' + reservationSQL[key].dateTime.getUTCMinutes()
        } else {
            minutes = reservationSQL[key].dateTime.getUTCMinutes()
        }
        reservation._id = reservationSQL[key].tableId._id
        reservation[key] = {
            _id: reservationSQL[key]._id,
            name: reservationSQL[key].clientName,
            quantity: reservationSQL[key].quantity,
            tableId: reservationSQL[key].tableId,
            time: reservationSQL[key].dateTime.getUTCHours() + ':' + minutes,
            date: reservationSQL[key].dateTime
        }
    }
    return reservation
}

module.exports = router
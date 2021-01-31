const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.render('bookkeeping', {
        title: 'Бухгалтерия',
        isBookkeeping: true
    })
})

module.exports = router
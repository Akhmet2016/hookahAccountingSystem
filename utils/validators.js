const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body('email')
        .isEmail().withMessage('Введите коректный email')
        .custom(async (value, {req}) => {
        try {
            const user = await User.findOne({ email: value })
            if (user) {
                return Promise.reject('Пользователь с таким email уже существует!')
            }
        } catch (e) {
            console.log(e)
        }
    })
    .normalizeEmail(),
    body('password', 'Минимальная длинна пароля 6 символов, пароль должен состоять из цифр и букв')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim(),
    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Пароли должны совпадать')
            }
            return true
        })
        .trim(),
    body('name')
        .isLength({min: 3})
        .withMessage('Минимальная длинна имени 3 символа')
        .trim()
]

exports.logValidators = [
    body('email')
        .isEmail().withMessage('Введите коректный email')
        .normalizeEmail(),
    body('password', 'Минимальная длина пароля 6 символов, пароль должен состоять из цифр и букв')
        .isAlphanumeric()
        .trim()
]

exports.tableValidators = [
    body('title')
        .isLength({min: 3})
        .withMessage('Минимальная длинна названия 3 символа')
        .trim(),
    body('price')
        .isNumeric()
        .withMessage('Введите корректную цену')
]
const compression = require('compression')
const express = require('express')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const helmet = require('helmet')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const addTableRoute = require('./routes/addTable')
const cardRoute = require('./routes/card')
const bookkeepingRoute = require('./routes/bookkeeping')
const tableBookingRoute = require('./routes/tableBooking')
const profileRoute = require('./routes/profile')
const ordersRoute = require('./routes/orders')
const authRoute = require('./routes/auth')
const controlRoute = require('./routes/control')
const varVariables = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorHandler = require('./middleware/error')
const fileMiddleware = require('./middleware/file')
const keys = require('./keys')

const PORT = process.env.PORT || 3000

const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers')
})
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
app.use(helmet())
app.use(compression())
app.use(varVariables)
app.use(userMiddleware)


app.use('/', tableBookingRoute)
app.use('/addTable', addTableRoute)
app.use('/card', cardRoute)
app.use('/bookkeeping', bookkeepingRoute)
app.use('/orders', ordersRoute)
app.use('/auth', authRoute)
app.use('/profile', profileRoute)
app.use('/control', controlRoute)
app.use(errorHandler)


async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()


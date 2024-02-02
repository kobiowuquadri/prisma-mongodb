const express = require('express')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const userRouter = require('./Routes/userRoutes')
const app = express()



const port = process.env.PORT

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(userRouter)

app.get('/', (req, res) => {
    res.send("Hi, from Quadri.")
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
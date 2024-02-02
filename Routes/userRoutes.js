const express = require('express');
const {
    SignUp,
    SignIn
  } = require('../Controllers/userController')  

const userRouter = express.Router()

// sign up
userRouter.post('/signup-user', SignUp)
// sign in
userRouter.post('/signin-user', SignIn)


module.exports = userRouter
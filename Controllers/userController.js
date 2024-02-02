const prisma = require('../prisma/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// period
const period = 1000 * 60 * 60 * 24 * 3

// register

const SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide all fields.' })
    }

    // exsiting user
    let user = await prisma.user.findUnique({where: { email }})
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already in use.' })
    }
    // hash password
    const salt = await bcrypt.genSalt()
    const hashPassworrd = await bcrypt.hash(password, salt)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassworrd
      }
    })

    res
      .status(201)
      .json({ success: true, message: 'User created successfully', newUser })
  } catch (err) {
    console.log(err)
    res.status(404).json({ success: false, message: err.message })
  }
}

const SignIn = async (req, res) => {
  try {
    const {email, password} = req.body
    if(!email || !password){
      return res.status(400).json({success: false, message: "Please provide the fields."})
    }
    // validate email
    const isEmail = await prisma.user.findUnique({where: {email}})
    if(!isEmail){
      return res.status(400).json({success: false, message: "Invalid email."})
    }
    // compare passwords
    const isPassword = await bcrypt.compare(password, isEmail.password)
    if(!isPassword){
     return res.status(400).json({success: false, message: "Invalid password."})
    }
    // sign in user
    jwt.sign({id: isEmail.id}, process.env.SECRECT, {expiresIn: "1d"}, async (err, token) => {
      if(err){
        throw new Error(err)
      }
      res.status(200).cookie('userId', isEmail.id, {maxAge: period ,httpOnly:true})
      res.status(200).json({success: true, message:"User Logged in successfully", isEmail, token})
    })

  }
  catch(err){
    console.log(err.message)
    res.status(404).json({success: false, message: err.message})
  }
}

module.exports = {
  SignUp,
  SignIn
}

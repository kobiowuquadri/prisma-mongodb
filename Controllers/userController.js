const prisma = require('../prisma/index')
const bcrypt = require('bcrypt')

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

const SignIn = () => {}

module.exports = {
  SignUp,
  SignIn
}

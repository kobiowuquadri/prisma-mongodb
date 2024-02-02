const prisma = require('../prisma/index')

// register

const SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: 'Please provide all fields.' })

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    })
    await newUser.save()
  } catch (err) {
    throw new Error(err)
  }
}

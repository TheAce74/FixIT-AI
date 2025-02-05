import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"

const router = express.Router()

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body
    const user = new User({ username, email, password })
    await user.save()
    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    res.status(400).json({ message: "Registration failed", error })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" })
    }
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" })
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" })
    res.json({ token, userId: user._id })
  } catch (error) {
    res.status(400).json({ message: "Login failed", error })
  }
})

export default router


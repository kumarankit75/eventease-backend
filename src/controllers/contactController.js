const Contact = require('../models/Contact')
const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
  })
}

// @desc    Submit contact form
// @route   POST /api/contact
const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body

    const contact = await Contact.create({ name, email, phone, message })

    // send email notification
    try {
      await sendEmail({
        to: process.env.EMAIL_USER,
        subject: `New Contact from ${name} — EventEase`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      })
    } catch (emailError) {
      console.log('Email sending failed:', emailError.message)
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      contact,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all contacts (admin)
// @route   GET /api/contact
const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.status(200).json({ success: true, contacts })
  } catch (error) {
    next(error)
  }
}

module.exports = { submitContact, getContacts }
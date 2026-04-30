const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')

dotenv.config()
connectDB()

const app = express()

app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth',     require('./routes/auth'))
app.use('/api/bookings', require('./routes/bookings'))
app.use('/api/vendors',  require('./routes/vendors'))
app.use('/api/contact',  require('./routes/contact'))
app.use('/api/users',    require('./routes/users'))

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'EventEase API is running 🚀' })
})

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
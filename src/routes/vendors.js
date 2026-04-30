const express = require('express')
const router = express.Router()
const { getVendors, getVendor, createVendor, updateVendor, deleteVendor } = require('../controllers/vendorController')
const { protect, adminOnly } = require('../middleware/auth')

router.get('/', getVendors)
router.get('/:id', getVendor)
router.post('/', protect, adminOnly, createVendor)
router.put('/:id', protect, adminOnly, updateVendor)
router.delete('/:id', protect, adminOnly, deleteVendor)

module.exports = router
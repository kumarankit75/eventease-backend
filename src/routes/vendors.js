const express = require('express')
const router = express.Router()
const {
  getVendors,
  getAdminVendors,
  getVendor,
  getMyVendorProfile,
  createVendor,
  updateVendor,
  updateMyVendorProfile,
  approveVendor,
  deleteVendor,
} = require('../controllers/vendorController')
const { protect, adminOnly, vendorOnly } = require('../middleware/auth')

router.get('/', getVendors)
router.get('/admin-all', protect, adminOnly, getAdminVendors)
router.get('/my-profile', protect, vendorOnly, getMyVendorProfile)
router.get('/:id', getVendor)
router.post('/', protect, adminOnly, createVendor)
router.put('/my-profile', protect, vendorOnly, updateMyVendorProfile)
router.put('/:id', protect, adminOnly, updateVendor)
router.put('/:id/approve', protect, adminOnly, approveVendor)
router.delete('/:id', protect, adminOnly, deleteVendor)

module.exports = router
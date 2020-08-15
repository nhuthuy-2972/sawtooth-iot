const express = require('express')
const router = express.Router()

const DeviceController = require('../controllers/device')
router.post('/getdata', DeviceController.getdata)
router.post('/insertdata', DeviceController.insertdata)
module.exports = router

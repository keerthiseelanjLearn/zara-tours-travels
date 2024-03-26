// routes/users.js
const express = require('express');
const router = express.Router();
const {cabBooking, getBooking, quickCabBooking, updateBooking, getFarePrice} = require("../controller/bookingController")

// GET /users
router.get('/', (req, res) => {
    res.send('List of users');
  });

router.post("/booking", cabBooking);
router.post("/update_booking", updateBooking);
router.post("/quick_booking", quickCabBooking);
router.get('/get_booking_details/:page/:id',getBooking)
router.post('/get_fare',getFarePrice)


  
module.exports = router;
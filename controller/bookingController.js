// author: Keerthiseelan
// date: 12-09-2023
const pool = require('../db');
const fetch = require("node-fetch");
const nodemailer = require('nodemailer');

function cabBooking(req, res) {
    const { user_name, mobile_number, booking_date,pickup_time, pickup_location, dropoff_location, cab_type, fare, status, round_trip, return_date,numberOfday } = req.body;
    console.log("+++++++++++++", req.body)
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);

            return { status_code: 500, result: "Internal Server Error" };
        }
  
                connection.query('call cab_booking(?,?,?,?,?,?,?,?,?,?,?,?)', [user_name, mobile_number, booking_date,pickup_time, pickup_location, dropoff_location, cab_type, fare, status, round_trip, return_date,numberOfday], async(error, Finalresults, fields) => {
                    connection.release();
                    if (error) {
                        console.error('Error executing query:', error);
                        return { status_code: 500, result: "Internal Server Error" };
                    }
                
                        return res.json(Finalresults[0][0])
                 
                    
                });
            

        });



}



function getBooking(req, res) {
    
    let offSetPage = (req.params.page - 1) * 20;
    let id = req.params.id
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);

            return { status_code: 500, result: "Internal Server Error" };
        }
  
                connection.query('call get_booking(?,?)', [offSetPage,id], async(error, Finalresults, fields) => {
                    connection.release();
                    if (error) {
                        console.error('Error executing query:', error);
                        return { status_code: 500, result: "Internal Server Error" };
                    }
                console.log(Finalresults[0].length)
                        return res.json(Finalresults)
                 
                    
                });
            

        });



}

//  for quick booking process below
function quickCabBooking(req, res) {
    const { user_name, mobile_number, pickup_location } = req.body;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);

            return { status_code: 500, result: "Internal Server Error" };
        }
  
                connection.query('call cab_quick_booking(?,?,?)', [user_name, mobile_number, pickup_location], async(error, Finalresults, fields) => {
                    connection.release();
                    if (error) {
                        console.error('Error executing query:', error);
                        return { status_code: 500, result: "Internal Server Error" };
                    }
                
                        return res.json(Finalresults[0][0])
                 
                    
                });
            

        });



}

function updateBooking(req, res) {

    const { id, booking_id, status,comments } = req.body;
    pool.getConnection((err, connection) => {
        if (err) {     
            console.error('Error connecting to database:', err);

            return { status_code: 500, result: "Internal Server Error" };
        }
        console.log(status)  
  
                connection.query('call update_booking(?,?,?,?)', [id, booking_id, status,comments], async(error, Finalresults, fields) => {
                    connection.release();
                    if (error) {
                        console.error('Error executing query:', error);
                        return { status_code: 500, result: "Internal Server Error" };
                    }
                  
                        return res.json(Finalresults[0])
                 
                    
                });
            

        });



}

async function getFarePrice(req, res){
  
    let {pickup_location, dropoff_location, mobile_number} = req.body
  
    let template = `
                    <html>
                    <body>
                  <h4>Booking Details</h4>
                  <p>PickupLocation : ${pickup_location}</p>
                  <p>DropLocation: ${dropoff_location}
                  <p>Contact Number: ${mobile_number}
                  </body>
                  </html>
                  `;
                      // Create a transporter object using the SMTP server details
    let transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "booking@zaratourstravels.com", // your email address
            pass: "Zara@Booking123" // your email password
        }
    });

    let mailOptions = {
        from: '"Zara Tours Travels" <booking@zaratourstravels.com>', // sender address
        // to: "zaratourstravels@outlook.com", // list of receivers
        to: "jkeerthiseelan@outlook.com, keerthidevelopment@gmail.com, zaratourstravels@outlook.com", // list of receivers
        subject: "Someone try for booking", // Subject line
        html: template, // html body,

    };


    try {
  let getapicall = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${dropoff_location}&origins=${pickup_location}&units=imperial&key=${process.env.API_KEY}`);
  let allData =  await getapicall.json();
    // Send mail with defined transport object
    console.log("one")
    transporter.sendMail(mailOptions, (er, info) => {
        if (er) {
          
            return { status_code: 500, result: "Internal Server Error",error:er };
        }
   
        return res.json(allData) 
    });


    } catch (error) {
        return { status_code: 500, result: "Internal Server Error" };
    }






}



module.exports = {getBooking, cabBooking, quickCabBooking, updateBooking, getFarePrice}

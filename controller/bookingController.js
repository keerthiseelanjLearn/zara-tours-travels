// author: Keerthiseelan
// date: 12-09-2023
const pool = require('../db');
const fetch = require("node-fetch");
const nodemailer = require('nodemailer');

                      // Create a transporter object using the SMTP server details
                      const transporter = nodemailer.createTransport({
                        host: "smtp.hostinger.com",
                        port: 587,
                        secure: false, // true for 465, false for other ports
                        auth: {
                            user: "booking@zaratourstravels.com", // your email address
                            pass: "Zara@Booking123" // your email password
                        }
                    });

function cabBooking(req, res) {
    const { distance,         pricePerKM,
        fare,             driver_fare,
        day_rent,         total_fare,
        booking_type,     booking_date,
        pickup_time,      return_date,
        mail,             pickup_location,
        dropoff_location, cab_type,
        mobile_number,    numberOfday } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);

            return { status_code: 500, result: "Internal Server Error" };
        }
                const today = new Date();
                const date = today.getDate();
                const year = today.getFullYear();
                let book_Code = year + "BOOK" + date + Math.floor(Math.random() * 1000) + 100
                connection.query('call cab_booking(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [book_Code, mail, mobile_number, booking_date,pickup_time, pickup_location, dropoff_location, 
                    cab_type, total_fare, 'Pending',booking_type, return_date,numberOfday,distance,driver_fare,pricePerKM], async(error, Finalresults, fields) => {
                    connection.release();
                    if (error) {
                        console.error('Error executing query:', error);
                        return res.code(500).json({ status_code: 500, result: "Internal Server Error" });
                    }

                        let template = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Booking confirmed</title>
                            <style>
                        
                        .w-80{
                            width: 80%;
                            margin: 0 auto;
                        }
                        
                        .text-center{
                            text-align: center;
                        }
                        .color{
                           color: #fdbe59
                        }
                        table {
                          font-family: arial, sans-serif;
                          border-collapse: collapse;
                          width: 100%;
                        }
                        
                        td, th {
                          border: 1px solid #dddddd;
                          text-align: left;
                          padding: 8px;
                        }
                        
                        tr:nth-child(even) {
                          background-color: #dddddd;
                        }
                            </style>
                        </head>
                        <body>
                            <section class="w-80">
                                <div class="text-center"  style="background-color: black;">
                                    <img src="https://www.zaratourstravels.com/assets/img/zara-logo.jpg" alt="" srcset="" style="width:20%">
                                </div>
                                <div  class="text-center">
                                    <h2 style="text-decoration: underline;">Thanks for choosing Zara Tours Travels</h2>
                                    <p style="font-size: 20px;">Your cab booking has been successfully confirmed! A representative will call you back within the <b>next 30 minutes</b> to finalize all necessary details and ensure everything is ready for your journey. </p>
                                </div>
                                <div>
                                    <h3 class="text-center color">Trip Details</h3>
                                    <table style="margin: 0 auto;">
                                        <tr>
                                            <td>Booking Id</td>
                                            <td>${book_Code}</td>
                                           
                                          </tr>
                                        <tr>
                                          <td>Mobile Number</td>
                                          <td>${mobile_number}</td>
                                         
                                        </tr>
                                        <tr>
                                          <td>Pickup Location</td>
                                          <td>${pickup_location}</td>
                                         
                                        </tr>
                                        <tr>
                                            <td>Drop Location</td>
                                            <td>${dropoff_location}</td>
                                         
                                        </tr>
                                        <tr>
                                          <td>Pickup Date</td>
                                          <td>${booking_date}</td>
                                         
                                        </tr>
                                        <tr>
                                            <td>Pickup Time</td>
                                            <td>${pickup_time}</td>
                                        
                                        </tr>
                                        <tr>
                                          <td>Cab Type</td>
                                          <td>${cab_type}</td>
                                        
                                        </tr>
                                        <tr>
                                            <td>Journey Distance</td>
                                            <td>${distance}</td>
                                          
                                          </tr>
                                          <tr>
                                            <td>Journey Type</td>
                                            <td>${booking_type}</td>
                                          </tr>
                                          <tr>
                                            <td>Toll</td>
                                            <td>Extra</td>   
                                          </tr>
                                          <tr>
                                            <td>Trip estimate</td>
                                            <td>₹ ${total_fare}(Include driver estimate)</td>   
                                          </tr>
                                      </table>
                        
                                    <div class="text-center" style="background-color: #fdbe59;padding: 20px; margin-top: 20px;">
                                        <h5>For any query please contact below</h2>
                                        <a href="tel:+919629719676">9629719676</a>
                                    </div>
                                </div>
                            </section>
                        </body>
                        </html>`
                        let mailOptions = {
                            from: '"Zara Tours Travels" <booking@zaratourstravels.com>', // sender address
 
                            to: mail, // list of receivers
                            subject: "Thanks for booking in Zara Tours Travels", // Subject line
                            html: template, // html body,
                    
                        };
                        transporter.sendMail(mailOptions, (er, info) => {
                            if (er) {
                              
                                console.log("err mail", er)
                            }
                       
                            return res.json(Finalresults[0][0])
                        });
                       
                 
                    
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


    let mailOptions = {
        from: '"Zara Tours Travels" <booking@zaratourstravels.com>', // sender address
        // to: "zaratourstravels@outlook.com", // list of receivers
        to: "droptaxi9@gmail.com, jkeerthiseelan@outlook.com", // list of receivers
        // to: "jkeerthiseelan@outlook.com", // list of receivers
        subject: "Someone try for booking", // Subject line
        html: template, // html body,

    };


    try {
  let getapicall = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${dropoff_location}&origins=${pickup_location}&units=imperial&key=${process.env.API_KEY}`);
  let allData =  await getapicall.json();
    // Send mail with defined transport object
    console.log("one", allData)
    transporter.sendMail(mailOptions, (er, info) => {
        if (er) {
          
            return res.code(500).json({ status_code: 500, result: "Internal Server Error",error:er });
        }
   
        return res.json(allData) 
    });


    } catch (error) {
        return { status_code: 500, result: "Internal Server Error" };
    }






}



module.exports = {getBooking, cabBooking, quickCabBooking, updateBooking, getFarePrice}

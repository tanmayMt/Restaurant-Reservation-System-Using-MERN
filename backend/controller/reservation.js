import ErrorHandler from "../middlewares/error.js";
import { Reservation } from "../models/reservation.js";
import nodemailer from "nodemailer";


const send_reservation = async (req, res, next) => {
  const { firstName, lastName, email, date, time, phone } = req.body;
  if (!firstName || !lastName || !email || !date || !time || !phone) {
    return next(new ErrorHandler("Please Fill Full Reservation Form!", 400));
  }

  try {
    await Reservation.create({ firstName, lastName, email, date, time, phone });
    res.status(201).json({
      success: true,
      message: "Reservation Sent Successfully!",
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
                            //It collects all validation error messages into an array.
      return next(
        new ErrorHandler(validationErrors.join(', '), 
                         //It joins multiple error messages into a single string
                         400)
      );
    }

    // Handle other errors
    return next(error);  // the error is handled properly.
    // req.status(404).json({
    //   success:false,
    //   message: "Reservation Failed"
    // })
  }
};
export default send_reservation;


// import ErrorHandler from "../middlewares/error.js";
// import { Reservation } from "../models/reservation.js";
// import nodemailer from "nodemailer";

// const send_reservation = async (req, res, next) => {
//   const { firstName, lastName, email, date, time, phone } = req.body;
//   if (!firstName || !lastName || !email || !date || !time || !phone) {
//     return next(new ErrorHandler("Please Fill Full Reservation Form!", 400));
//   }

//   try {
//     // Create reservation in the database
//     await Reservation.create({ firstName, lastName, email, date, time, phone });

//     // Setup Nodemailer transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER, // Your Gmail address
//         pass: process.env.EMAIL_PASS, // Your App password (Enable "Less Secure Apps" or use OAuth)
//       },
//     });

//     // Email content
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Reservation Confirmation",
//       // text: `Dear ${firstName} ${lastName},\n\nYour reservation is confirmed for ${date} at ${time}.\n\nThank you!`,
//       text: `Dear ${firstName} ${lastName},\n\nYour reservation at **DineMate** is confirmed for ${date} at ${time}.\n\nRestaurant Details:\n📍 Address: RDB Boulevard, GP Block, Sector V, Bidhannagar, Kolkata, West Bengal\n🌐 Website: [Visit Us](https://restaurant-reservation-system-using-mern.vercel.app/)\n\nWe look forward to serving you!\n\nThank you!`,
//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);

//     res.status(201).json({
//       success: true,
//       message: "Reservation Sent Successfully! A confirmation email has been sent.",
//     });
//   } catch (error) {
//     // Handle Mongoose validation errors
//     if (error.name === "ValidationError") {
//       const validationErrors = Object.values(error.errors).map(
//         (err) => err.message
//       );
//       return next(new ErrorHandler(validationErrors.join(", "), 400));
//     }

//     return next(error);
//   }
// };

// export default send_reservation;
import ErrorHandler from "../middlewares/error.js";
import { Reservation } from "../models/reservation.js";


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

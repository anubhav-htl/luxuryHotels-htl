import express from "express";
import Contact from "../models/contact.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await Contact.find();
    return res.send({
      status: 200,
      content: data,
      message: "successfuly fetched contact",
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "internal server error",
      error: error.message,
    });
  }
});


//21-10-2024
// router.post("/create-contact", async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       hotelYouRepresent,
//       hotel,
//       message,
//       reqVisit,
//       from_date,
//       to_date,
//       sampleMagazine,
//       magazineType,
//     } = req.body;

//     const contact = new Contact({
//       name,
//       email,
//       hotelYouRepresent,
//       hotel,
//       message,
//       reqVisit,
//       from_date,
//       to_date,
//       sampleMagazine,
//       magazineType,
//     });

//     const saveContact = await contact.save();

//     res.status(201).json({
//       message: "contact created successfully",
//       data: saveContact,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       message: "Failed to create contact",
//       error: error.message,
//     });
//   }
// });

router.post("/create-contact", async (req, res) => {
  try {
    const {
      name,
      email,
      hotelYouRepresent,
      hotel,
      message,
      reqVisit,
      from_date,
      to_date,
      sampleMagazine,
      magazineType,
    } = req.body;

    // Log the incoming request data
    console.log('Received Data:', req.body);

    if (!name || !email || !message) {
      throw new Error('Required fields missing');
    }

    const contact = new Contact({
      name,
      email,
      hotelYouRepresent,
      hotel,
      message,
      reqVisit,
      from_date,
      to_date,
      sampleMagazine,
      magazineType,
    });

    const saveContact = await contact.save();
    res.status(201).json({
status:true,
      message: "Contact created successfully",
      data: saveContact,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Failed to create contact",
      error: error.message,
    });
  }
});
//21-10-2024

export default router;

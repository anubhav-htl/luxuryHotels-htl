import Hotel from "../models/hotel.js";
import HotelOffer from "../models/hoteloffer.js";
import HotelAddOn from "../models/hoteladdon.js";
import Holiday from "../models/holiday.js";
import Highlight from "../models/highlight.js";
import Transport from "../models/transport.js";
import Nomination from "../models/nomination.js";
import Inspection from "../models/inspection.js";
import AddOns from "../models/addon.js";
import ExclusiveOffer from "../models/exclusiveoffer.js";
import HotelRepresentative from "../models/hotelrep.js";
import Countries from "../models/country.js";
import Subscriptions from "../models/subscription.js";
import Transaction from "../models/transaction.js";
import HotelSubscription from "../models/hotelsubscription.js";

import chalk from "chalk";
import multer from "multer";
import * as cheerio from "cheerio";
import { fileURLToPath } from "url";

import path from "path";
import fs, { stat } from "fs";
import crypto from "crypto";
import mongoose from "mongoose";
import Stripe from "stripe";
import PayPal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";
import config from "../config/config.js";

//import { createCharge } from "../services/coinbaseService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();
const env = process.env.NODE_ENV;

const backendUrl = config[env].backend;

const stripe = new Stripe(process.env.STRIPE_API_KEY);

let environment = new PayPal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
let client = new PayPal.core.PayPalHttpClient(environment);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.session.passport.user.id;
    const dir = `uploads/hotelNews${userId}`;
    // const dir = `uploads/rep_id_${userId}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, raw) => {
      if (err) return cb(err);

      const originalExtenstion = path.extname(file.originalname);
      const filename = `${raw.toString("hex")}${originalExtenstion}`;
      cb(null, filename);
    });
  },
});

export const upload = multer({ storage: storage });

export const getProfile = async (req, res, next) => {
  const { hotel_id } = req.params;

  try {
    const hotelData = await Hotel.findById(hotel_id);
res.status(200).json({
      message: "fetch hotel details successfully",
      data: hotelData,
    });
    // res.render("hotels/profile", { hotelData, pageTitle: "Hotel Profile" }); //21-10-2024
  } catch (err) {
    next(err);
  }
};

// export const getGeneralInformation = async (req, res, next) => {
//   try {
//     const countryData = await Countries.find();

//     if (!countryData) {
//       console.warn("No country data found for user:", userId);
//     }

//     const userId = req.session.passport.user.id;
//     const hotelData = await Hotel.findOne({ representative: userId }).populate(
//       "country",
//     );
//     let maxImages = 10;

//     if (!hotelData) {
//       console.warn("No hotel profile found for user:", userId);
//       maxImages = 10;
//     } else {
//       maxImages =
//         hotelData && hotelData.images ? 10 - hotelData.images.length : 10;
//     }

//     res.render("hotels/generalinformation", {
//       countries: countryData,
//       maxImages,
//       hotelData,
//       pageTitle: "General Information",
//     });
//   } catch (err) {
//     next(err);
//   }
// };
export const getGeneralInformation = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const countryData = await Countries.find();

    if (!countryData) {
      console.warn("No country data found for user:", user_id);
      // console.warn("No country data found for user:", userId);
    }

    // const userId = req.session.passport.user.id;
    const hotelData = await Hotel.findOne({ representative: user_id }).populate(
      "country"
    );
    let maxImages = 10;

    if (!hotelData) {
      console.warn("No hotel profile found for user:", user_id);
      // console.warn("No hotel profile found for user:", userId);
      maxImages = 10;
    } else {
      maxImages =
        hotelData && hotelData.images ? 10 - hotelData.images.length : 10;
    }
    res.status(200).json({
      message: "fetched hotels",
      status: true,
      hotel: hotelData,
    });

    // res.render("hotels/generalinformation", {
    //   countries: countryData,
    //   maxImages,
    //   hotelData,
    //   pageTitle: "General Information",
    // });
  } catch (err) {
    console.log("error - ", err);
    next(err);
  }
};

function iframeModifier(iframe) {
  let $ = cheerio.load(iframe);
  $("iframe").attr("className", "w-full h-full mx-auto rounded-md");

  return $("iframe").toString();
}

//17-10-2024
// export const createGeneralInformation = async (req, res) => {
//   try {
//     const {
//       hotel_name,
//       website,
//       location,
//       country,
//       youtube,
//       description,
//       about,
//       rooms_suites,
//       restaurants_bars,
//       spa_wellness,
//       other_facilities,
//       additional_information,
//       room_amenities,
//       hotel_facilities,
//       hotel_manager_name,
//       hotel_manager_email,
//       hotel_manager_telephone,
//       marketing_manager_name,
//       marketing_manager_email,
//       marketing_manager_telephone,
//       representative,
//       lat,
//       long,
//       map_url,
//     } = req.body;
//     console.log("createGeneralInformation req.body====>", req.body);
//     // const userId = req.session.passport.user.id;
//     // const imageArray = images
//     //   .toString()
//     //   .split(",")
//     //   .map((image) => `uploads/rep_id_${Date.now()}/${image.trim()}`);
//     // // .map((image) => `uploads/rep_id_${userId}/${image.trim()}`);
//     // console.log("imageArrar==>", imageArray);
//     const hotel = new Hotel({
//       hotel_name,
//       website,
//       location,
//       country,
//       youtube,
//       description,
//       about,
//       rooms_suites,
//       restaurants_bars,
//       spa_wellness,
//       other_facilities,
//       additional_information,
//       room_amenities,
//       hotel_facilities,
//       hotel_manager_name,
//       hotel_manager_email,
//       hotel_manager_telephone,
//       marketing_manager_name,
//       marketing_manager_email,
//       marketing_manager_telephone,
//       representative,
//       lat,
//       long,
//       map_url,
//     });
//     let saveHotelData = await hotel.save();
//     // res.redirect(`/hotels/topattractions`);
//     res.status(200).json({
//       message: "hotel was created successfully",
//       data: saveHotelData,
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
// 16-10-2024

//23-10-2024
// export const createGeneralInformation = async (req, res) => {
//   try {
//     const {
//       hotel_name,
//       website,
//       location,
//       country,
//       youtube,
//       description,
//       about,
//       rooms_suites,
//       restaurants_bars,
//       spa_wellness,
//       other_facilities,
//       additional_information,
//       room_amenities,
//       hotel_facilities,
//       hotel_manager_name,
//       hotel_manager_email,
//       hotel_manager_telephone,
//       marketing_manager_name,
//       marketing_manager_email,
//       marketing_manager_telephone,
//       representative,
//       lat,
//       long,
//       status,
//       map_url,
//     } = req.body;
//     console.log(`Received country: ${country}`);
//     console.log(`Received representative: ${representative}`);
//     const countryId = mongoose.Types.ObjectId.isValid(country.trim()) ? new mongoose.Types.ObjectId(country.trim()) : null;
//     const representativeId = mongoose.Types.ObjectId.isValid(representative.trim()) ? new mongoose.Types.ObjectId(representative.trim()) : null;
//     if (!countryId || !representativeId) {
//       throw new Error('Invalid country or representative ID');
//     }
//     const imageArray = req.files.map(image => image.path);
//     const parsedRoomAmenities = room_amenities ? room_amenities.split(',').map(item => item.trim()) : [];
//     const parsedHotelFacilities = hotel_facilities ? hotel_facilities.split(',').map(item => item.trim()) : [];
//     const hotel = new Hotel({
//       hotel_name,
//       website,
//       location,
//       country: countryId,
//       youtube,
//       description,
//       about,
//       rooms_suites,
//       restaurants_bars,
//       spa_wellness,
//       images: imageArray,
//       other_facilities,
//       additional_information,
//       room_amenities: parsedRoomAmenities,
//       hotel_facilities: parsedHotelFacilities,
//       hotel_manager_name,
//       hotel_manager_email,
//       hotel_manager_telephone,
//       marketing_manager_name,
//       marketing_manager_email,
//       marketing_manager_telephone,
//       representative: representativeId,
//       lat,
//       long,
// status,
//       map_url,
//     });
//     console.log("hotel -", hotel);
//     let saveHotelData = await hotel.save();
//     res.status(200).json({
//       message: "hotel was created successfully",
//       data: saveHotelData,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ message: error.message });
//   }
// };
//23-10-2024

export const createGeneralInformation = async (req, res) => {
  try {
    const {
      hotel_name,
      website,
      location,
      country,
      youtube,
      description,
      about,
      rooms_suites,
      restaurants_bars,
      spa_wellness,
      other_facilities,
      hotel_highlights,
      additional_information,
      room_amenities,
      hotel_facilities,
      hotel_manager_name,
      hotel_manager_email,
      hotel_manager_telephone,
      marketing_manager_name,
      marketing_manager_email,
      marketing_manager_telephone,
      representative,
      lat,
      long,
      status,
      map_url,
    } = req.body;
    console.log(`Received country: ${country}`);
    console.log(`Received representative: ${representative}`);
    const countryId = mongoose.Types.ObjectId.isValid(country.trim()) ? new mongoose.Types.ObjectId(country.trim()) : null;
    const representativeId = mongoose.Types.ObjectId.isValid(representative.trim()) ? new mongoose.Types.ObjectId(representative.trim()) : null;
    if (!countryId || !representativeId) {
      throw new Error('Invalid country or representative ID');
    }
    const imageArray = req.files['images'] ? req.files['images'].map(image => image.path) : [];
    const hotelLogo = req.files['hotel_logo'] ? req.files['hotel_logo'][0].path : '';
    const parsedRoomAmenities = room_amenities ? room_amenities.split(',').map(item => item.trim()) : [];
    const parsedHotelFacilities = hotel_facilities ? hotel_facilities.split(',').map(item => item.trim()) : [];
    const parsedHotelHighlights = hotel_highlights ? hotel_highlights.split(',').map(item => item.trim()) : [];
    const hotel = new Hotel({
      hotel_name,
      website,
      location,
      country: countryId,
      youtube,
      description,
      about,
      rooms_suites,
      restaurants_bars,
      spa_wellness,
      images: imageArray,
      hotel_logo: hotelLogo,
      other_facilities,
      hotel_highlights: parsedHotelHighlights,
      additional_information,
      room_amenities: parsedRoomAmenities,
      hotel_facilities: parsedHotelFacilities,
      hotel_manager_name,
      hotel_manager_email,
      hotel_manager_telephone,
      marketing_manager_name,
      marketing_manager_email,
      marketing_manager_telephone,
      representative: representativeId,
      lat,
      long,
      status,
      map_url,
    });
    let saveHotelData = await hotel.save();
    res.status(200).json({
      message: "hotel was created successfully",
      data: saveHotelData,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};


export const updateGeneralInformation = async (req, res) => {
  const { hotel_id } = req.params;

  try {
    const {
      hotel_name,
      description,
      location,
      rooms_suites,
      restaurants_bars,
      spa_wellness,
      other_facilities,
      additional_information,
      room_amenities,
      hotel_facilities,
      youtube,
      website,
      country,
      representative,
      map_iframe,
      images,
      top_attractions,
    } = req.body;

    const hotel = await Hotel.findById(hotel_id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    let existingImages = hotel.images || [];
    let newImages = [];

    const userId = req.session.passport.user.id;

    if (images) {
      if (Array.isArray(images)) {
        newImages = images;
      } else {
        newImages = images
          .toString()
          .split(",")
          .map((image) => `uploads/rep_id_${userId}/${image.trim()}`);
      }
    }

    let updatedImages = [...existingImages, ...newImages];

    const updateData = {
      hotel_name,
      description,
      location,
      rooms_suites,
      restaurants_bars,
      spa_wellness,
      other_facilities,
      additional_information,
      room_amenities,
      hotel_facilities,
      youtube,
      website,
      country,
      map_iframe: iframeModifier(req.body.map_iframe),
      representative,
      images: updatedImages,
      top_attractions,
    };

    const result = await Hotel.findByIdAndUpdate(hotel_id, updateData, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.redirect(`/hotels/topattractions`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const uploadHotelImages = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(422).json({
        error: "The uploaded file must be an image",
      });
    }

    console.log("Uploaded file:", req.file.filename);
    res.status(200).json({ fileName: req.file.filename });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

export const deleteHotelImage = async (req, res) => {
  try {
    const { hotel_identifier, imageName, Model } = req.body;

    console.log("Received Model:", Model);

    const ModelClass = mongoose.model(Model);
    let hotel = await ModelClass.findById(hotel_identifier);

    if (!hotel) {
      hotel = await ModelClass.findOne({
        hotelRepId: req.session.passport.user.id,
        status: "active",
      });
    }

    hotel.images = hotel.images.filter((image) => image !== imageName);
    await hotel.save();

    const imagePath = path.join(__dirname, `../`, imageName);

    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image from server:", err);
        return res
          .status(500)
          .json({ message: "Failed to delete image from server" });
      }

      console.log(chalk.green("Image deleted from server:", imagePath));
      res.status(200).json({ message: "Image deleted successfully" });
    });
  } catch (error) {
    console.error("Error deleting image from server:", error);
    return res.status(500).json({ message: "Failed to delete image from S3" });
  }
};

export const getTopAttractions = async (req, res) => {
  try {
    res.render("hotels/topattractions", {
      hotelProfile: req.hotelProfile,
      pageTitle: "Top Attractions",
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const createTopAttractions = async (req, res) => {
  try {
    const { hotel_id, top_attractions } = req.body;

    const attractionsArray = Object.values(top_attractions);

    console.log("Parsed hotel_id:", hotel_id);
    console.log("Parsed top_attractions:", attractionsArray);

    if (!attractionsArray.length) {
      return res
        .status(400)
        .json({ message: "Top attractions data is missing" });
    }

    const result = await Hotel.findByIdAndUpdate(
      hotel_id,
      {
        $set: { top_attractions: attractionsArray },
      },
      { new: true }
    );

    res.redirect(`/hotels/facilitiesamenities`);
  } catch (error) {
    console.log("Failure");
    res.status(400).json({ message: error.message });
  }
};

export const createExclusiveOffers = async (req, res) => {
  const x = await Hotel.findAll();
  res.status(200).json({ data: x });
  // res.redirect("/hotels/holiday");
};

export const getExclusiveOffers = async (req, res) => {
  try {
    const countryData = await Countries.find();
    const giftData = await ExclusiveOffer.find();

    res.render("hotels/exclusiveoffers", {
      countryData,
      giftData,
      hotelProfile: req.hotelProfile,
      hotelId: (req.hotelProfile && req.hotelProfile._id) || "",
      pageTitle: "Exclusive Offers (Optional)",
    });
  } catch (error) {
    console.error(error);
  }
};

export const getFacilitiesAmenities = async (req, res) => {
  try {
    const userId = req.session.passport.user.id;
    const hotelProfile = await Hotel.findOne({ representative: userId }).lean();

    if (!hotelProfile) {
      console.warn("No hotel profile found for user:", userId);
    }

    res.render("hotels/facilitiesamenities", {
      hotelProfile,
      pageTitle: "Hotel Facilities and Amenities",
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const createFacilitiesAmenities = async (req, res) => {
  console.log(req.body);
  try {
    const { hotelId } = req.body;
    await Hotel.findByIdAndUpdate(hotelId, {
      $set: {
        room_amenities: req.body.room_amenities,
        hotel_facilities: req.body.hotel_facilities,
        hotel_facilities_user: req.body.hotel_facilities_user,
        room_amenities_user: req.body.room_amenities_user,
      },
    });
    res.redirect(`/hotels/highlights`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getContactInformation = async (req, res) => {
  try {
    const userId = req.session.passport.user.id;
    const countryData = await Countries.find();
    const countryPercievedCountryCode = req.hotelProfile.country.code;
    const hotelData = await Hotel.findOne({ representative: userId });

    res.render("hotels/contactinformation", {
      hotelData,
      countryData,
      countryPercievedCountryCode,
      pageTitle: "Contact Information",
    });
  } catch (error) {
    console.log(error);
  }
};

export const createContactInformation = async (req, res) => {
  try {
    const { userId, hotelId } = req.body;

    const hotelUpdate = await Hotel.findByIdAndUpdate(hotelId, {
      $set: {
        hotel_manager_name: req.body.hotel_manager_name,
        hotel_manager_email: req.body.hotel_manager_email,
        hotel_manager_telephone: req.body.hotel_manager_telephone,
        country_code_manager: req.body.country_code_manager,
        marketing_manager_name: req.body.marketing_manager_name,
        marketing_manager_email: req.body.marketing_manager_email,
        marketing_manager_telephone: req.body.marketing_manager_telephone,
        country_code_marketing: req.body.country_code_marketing,
      },
    });

    if (!hotelUpdate) {
      throw new Error("Hotel update failed");
    }

    const representativeUpdate = await HotelRepresentative.findByIdAndUpdate(
      userId,
      {
        $set: {
          name: req.body.hotel_representative_name,
          email: req.body.hotel_representative_email,
          telephone: req.body.hotel_representative_telephone,
          country_code_hotelrepresentative:
            req.body.country_code_hotelrepresentative,
        },
      }
    );

    if (!representativeUpdate) {
      throw new Error("Contact information creation failed");
    }

    res.redirect(`/hotels/additionalexposure`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAddedExposure = async (req, res) => {
  try {
    const addonData = await AddOns.find();

    res.render("hotels/additionalexposure", {
      addonData,
      hotelId: (req.hotelProfile && req.hotelProfile._id) || "",
      pageTitle: "Additional Exposure Add-Ons",
    });
  } catch (error) {
    console.error(error);
  }
};

export const getHoliday = async (req, res) => {
  try {
    const holidayData = await Holiday.find({
      hotelRepId: req.session.passport.user.id,
    });

    res.render("hotels/winaholiday", {
      holidayData,
      hotelId: (req.hotelProfile && req.hotelProfile._id) || "",
      pageTitle: 'Add "Win A Holiday" (Optional)',
    });
  } catch (error) {
    console.error(error);
  }
};

export const createHoliday = async (req, res) => {
  try {
    const {
      title,
      images,
      dateFrom,
      dateTo,
      adult_attendees,
      children_attendees,
      competitionclosure,
      holidaydescription,
      holidayincludes,
      hotelId,
      hotelRepId,
    } = req.body;

    const imageArray = images
      .toString()
      .split(",")
      .map((image) => `uploads/rep_id_${hotelRepId}/${image.trim()}`);

    const result = await Holiday.create({
      title,
      images: imageArray,
      dateFrom,
      dateTo,
      adult_attendees,
      children_attendees,
      competitionclosure,
      holidaydescription,
      holidayincludes,
      hotelId,
      hotelRepId,
    });

    if (result) {
      console.log(result);
    }

    req.flash(
      "success",
      `Holiday Creation Successful, We will email you shortly for follow-up.`
    );
    res.redirect(`/hotels/nomination`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const submitNomination = async (req, res) => {
  try {
    const {
      hotelName,
      hotelWebsite,
      images,
      nominatorName,
      nominatorEmail,
      hotel,
      country,
      hotelRepId,
    } = req.body;

    const imageArray = images
      .toString()
      .split(",")
      .map((image) => `uploads/rep_id_${hotelRepId}/${image.trim()}`);

    const nominationdetails = await Nomination.create({
      hotelName,
      hotelWebsite,
      images: imageArray,
      nominatorName,
      nominatorEmail,
      hotel,
      country,
      hotelRepId,
    });

    if (nominationdetails) {
      console.log(nominationdetails);
    }

    req.flash(
      "success",
      `Your Nomination was successful. We will notify you once ypur nomination is up!`
    );
    res.redirect("/hotels/inspection");
  } catch (err) {
    console.log("Error creating nomination: " + err.message);
    res.status(400).json({ message: error.message });
  }
};

export const getNomination = async (req, res) => {
  try {
    const countryData = await Countries.find();
    const nominationData = await Nomination.findOne({
      hotelRepId: req.session.passport.user.id,
      status: "active",
    });

    res.render("hotels/nomination", {
      nominationData,
      countryData,
      hotelId: (req.hotelProfile && req.hotelProfile._id) || "",
      hotelProfile: req.hotelProfile,
      pageTitle: "Nomination for Best Luxury Hotel (Optional)",
    });
  } catch (error) {
    console.error(error);
  }
};

export const getInspection = async (req, res) => {
  try {
    const countryData = await Countries.find();

    res.render("hotels/inspection", {
      countryData,
      hotelId: (req.hotelProfile && req.hotelProfile._id) || "",
      hotelProfile: req.hotelProfile,
      pageTitle: "Book an inspection (Optional)",
    });
  } catch (error) {
    console.error(error);
  }
};

export const requestInspection = async (req, res) => {
  try {
    const {
      bookerName,
      country_code,
      telephone,
      from_date_1,
      to_date_1,
      from_date_2,
      to_date_2,
      from_date_3,
      to_date_3,
      description,
      hotelId,
      hotelRepId,
    } = req.body;

    const inspection = await Inspection.create({
      bookerName,
      country_code,
      telephone,
      from_date_1,
      to_date_1,
      from_date_2,
      to_date_2,
      from_date_3,
      to_date_3,
      description,
      hotelId,
      hotelRepId,
    });

    if (inspection) {
      console.log(inspection);
    }

    req.flash(
      "info",
      `Hotel Inspection Request submitted. We will email you shortly for follow-up.`
    );
    res.redirect("/hotels/inspection");
  } catch (err) {
    console.log("Error creating inspection request: " + err.message);
    res.status(400).json({ message: err.message });
  }
};

export const getSubscriptions = async (req, res) => {
  try {
    const hotelSubscriptionData = await HotelSubscription.findOne({
      hotelRepId: req.session.passport.user.id,
      status: "active",
    });

    if (hotelSubscriptionData) {
      res.redirect("/hotels/current-subscriptions");
    } else {
      const subscriptionsData = await Subscriptions.find({ billable: true });
      const trialData = await Subscriptions.findOne({ billable: false });

      if (!subscriptionsData) {
        console.log("Subscriptions data not found");
      } else {
        console.log("Subscriptions data found");
      }

      res.render("hotels/subscriptions", {
        hotelProfile: req.hotelProfile,
        pageTitle: "Select a subscription",
        subscriptionsData,
        trialData,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const sevenDayTrial = async (req, res) => {
  const { payment_element, subscriptions, hotel } = req.body;

  let transformedSubscriptions = {};
  let subscriptionsIds = "";
  let durations = "";

  Object.entries(subscriptions)
    .filter(([subscriptionId, subscriptionsData]) =>
      Object.values(subscriptionsData).some(
        (subscriptionsDetails) => subscriptionsDetails.option
      )
    )
    .forEach(([subscriptionId, subscriptionsData]) => {
      Object.entries(subscriptionsData)
        .filter(
          ([subscriptionsName, subscriptionsDetails]) =>
            subscriptionsDetails.option
        )
        .forEach(([subscriptionsName, subscriptionsDetails]) => {
          const [label, duration, durationMeasure, price, stripe_price_id] =
            subscriptionsDetails.option.split(",");
          transformedSubscriptions[subscriptionsName] = {
            id: subscriptionId,
            price: parseFloat(price),
            details: {
              label,
              duration,
              durationMeasure,
              stripe_price_id,
            },
          };
          durations = duration;
          subscriptionsIds = subscriptionId;
        });
    });

  try {
    let transaction = await Transaction.findOne({
      hotelRepId: req.session.passport.user.id,
      status: "ongoing",
    });

    if (!transaction) {
      transaction = new Transaction({
        hotelRepId: req.session.passport.user.id,
        hotelId: hotel,
        paymentElements: { [payment_element]: transformedSubscriptions },
        status: "complete",
      });
      await transaction.save();
      console.log("Transaction created:", transaction);
    } else {
      transaction.paymentElements = {
        ...transaction.paymentElements,
        [payment_element]: transformedSubscriptions,
      };
      await transaction.save();
      console.log("Transaction updated:", transaction);
    }
  } catch (err) {
    console.log("Error handling transaction:", err);
  }

  try {
    let hotelSubscriptions = await HotelSubscription.find({
      hotelRepId: req.session.passport.user.id,
      status: "pending",
    });

    if (hotelSubscriptions.length > 0) {
      try {
        await HotelSubscription.deleteMany({
          hotelRepId: req.session.passport.user.id,
          status: "pending",
        });

        console.log("Deletions completed successfully");
      } catch (error) {
        console.log("Error performing deletions:", error);
      }
    }

    const today = new Date();

    const hotelSubscription = new HotelSubscription({
      hotelRepId: req.session.passport.user.id,
      subscription: subscriptionsIds,
      status: "active",
      endDate: new Date(today.setDate(today.getDate() + 7)),
    });

    await hotelSubscription.save();

    res.status(201).json({
      message: "Trial subscription created successfully",
      request: "Success",
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating subscription", error });
  }
};

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const transactAdditionalFeatures = async (req, res) => {
  const { payment_element, addons, hotel } = req.body;

  let transformedAddons = {};
  const addonIds = [];
  const durations = [];

  Object.entries(addons)
    .filter(([addonId, addonData]) =>
      Object.values(addonData).some((addonDetails) => addonDetails.option)
    )
    .forEach(([addonId, addonData]) => {
      Object.entries(addonData)
        .filter(([addonName, addonDetails]) => addonDetails.option)
        .forEach(([addonName, addonDetails]) => {
          const [label, duration, durationMeasure, price, stripe_price_id] =
            addonDetails.option.split(",");
          transformedAddons[addonName] = {
            id: addonId,
            price: parseFloat(price),
            details: {
              label,
              duration,
              durationMeasure,
              stripe_price_id,
            },
          };
          addonIds.push(addonId);
          durations.push(duration);
        });
    });

  try {
    let transaction = await Transaction.findOne({
      hotelRepId: req.session.passport.user.id,
      status: "ongoing",
    });

    if (!transaction) {
      transaction = new Transaction({
        hotelRepId: req.session.passport.user.id,
        hotelId: hotel,
        paymentElements: { [payment_element]: transformedAddons },
      });
      await transaction.save();
      console.log("Transaction created:", transaction);
    } else {
      transaction.paymentElements = {
        ...transaction.paymentElements,
        [payment_element]: transformedAddons,
      };
      await transaction.save();
      console.log("Transaction updated:", transaction);
    }
  } catch (err) {
    console.log("Error handling transaction:", err);
  }

  try {
    let hoteladdons = await HotelAddOn.find({
      hotelRepId: req.session.passport.user.id,
      status: "pending",
    });

    if (hoteladdons.length > 0) {
      try {
        await HotelAddOn.deleteMany({
          hotelRepId: req.session.passport.user.id,
          status: "pending",
        });

        console.log("Deletions completed successfully");
      } catch (error) {
        console.log("Error performing deletions:", error);
      }
    }

    let i = 0;
    for (const ids of addonIds) {
      const hoteladdon = new HotelAddOn({
        hotelRepId: req.session.passport.user.id,
        addOn: ids,
        endDate: addDays(new Date(), parseInt(durations[i])),
      });
      await hoteladdon.save();
      console.log("Hotel Offer created");
      i += 1;
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

  res.redirect("/hotels/precheckout");
};

export const transactHotelOffers = async (req, res) => {
  const {
    country_code,
    telephone,
    from_date,
    to_date,
    title,
    description,
    exclusiveoffers,
    redeem_link,
    payment_element,
    hotel,
  } = req.body;

  let durations = "";
  let offerid = "";

  const transformedOffers = Object.entries(exclusiveoffers)
    .filter(([key, value]) => value.option)
    .reduce((acc, [key, value]) => {
      const [id, label, duration, durationMeasure, price, stripe_price_id] =
        value.option.split(",");
      acc[key] = {
        id: id,
        price: parseFloat(price),
        details: {
          label,
          duration,
          durationMeasure,
          stripe_price_id,
        },
      };
      offerid = id;
      durations = duration;
      return acc;
    }, {});

  const transaction = await Transaction.findOne({
    hotelRepId: req.session.passport.user.id,
    status: "ongoing",
  });

  if (!transaction) {
    try {
      await Transaction.create({
        hotelRepId: req.session.passport.user.id,
        hotelId: hotel,
        paymentElements: { [payment_element]: transformedOffers },
      });
    } catch (error) {
      console.log("Could not create transaction:", error);
    }
  } else {
    try {
      await Transaction.findOneAndUpdate(
        { _id: transaction._id },
        { $set: { [`paymentElements.${payment_element}`]: transformedOffers } }
      );
    } catch (error) {
      console.log("Could not create transaction:", error);
    }
  }

  try {
    const hotelOffer = await HotelOffer.findOne({
      hotelRepId: req.session.passport.user.id,
      status: "pending",
    });

    if (!hotelOffer) {
      try {
        await HotelOffer.create({
          hotelRepId: req.session.passport.user.id,
          exclusiveoffer: offerid,
          hotelId: hotel,
          countryCode: country_code,
          phoneNumber: telephone,
          dateFrom: from_date,
          dateTo: to_date,
          title: title,
          description: description,
          redeemLink: redeem_link,
          endDate: addDays(new Date(), parseInt(durations)),
        });
      } catch (err) {
        console.log("Error creating hotel offer:", error);
      }
    } else {
      try {
        const updateData = {
          hotelRepId: req.session.passport.user.id,
          exclusiveoffer: offerid,
          hotelId: hotel,
          countryCode: country_code,
          phoneNumber: telephone,
          dateFrom: from_date,
          dateTo: to_date,
          title: title,
          description: description,
          redeemLink: redeem_link,
          endDate: addDays(new Date(), parseInt(durations)),
        };

        await HotelOffer.findByIdAndUpdate(hotel, updateData, { new: true });
      } catch (err) {
        console.log("Error updating hotel offer:", err);
      }
    }
  } catch (error) {
    console.log("Error creating hotel exclusive offer:", error);
  }

  res.redirect("/hotels/precheckout");
};

export const transactSubscriptions = async (req, res) => {
  const { payment_element, subscriptions, hotel } = req.body;

  let transformedSubscriptions = {};
  let subscriptionsIds = "";
  let durations = "";

  Object.entries(subscriptions)
    .filter(([subscriptionId, subscriptionsData]) =>
      Object.values(subscriptionsData).some(
        (subscriptionsDetails) => subscriptionsDetails.option
      )
    )
    .forEach(([subscriptionId, subscriptionsData]) => {
      Object.entries(subscriptionsData)
        .filter(
          ([subscriptionsName, subscriptionsDetails]) =>
            subscriptionsDetails.option
        )
        .forEach(([subscriptionsName, subscriptionsDetails]) => {
          const [label, duration, durationMeasure, price, stripe_price_id] =
            subscriptionsDetails.option.split(",");
          transformedSubscriptions[subscriptionsName] = {
            id: subscriptionId,
            price: parseFloat(price),
            details: {
              label,
              duration,
              durationMeasure,
              stripe_price_id,
            },
          };
          durations = duration;
          subscriptionsIds = subscriptionId;
        });
    });

  try {
    let transaction = await Transaction.findOne({
      hotelRepId: req.session.passport.user.id,
      status: "ongoing",
    });

    if (!transaction) {
      transaction = new Transaction({
        hotelRepId: req.session.passport.user.id,
        hotelId: hotel,
        paymentElements: { [payment_element]: transformedSubscriptions },
      });
      await transaction.save();
      console.log("Transaction created:", transaction);
    } else {
      transaction.paymentElements = {
        ...transaction.paymentElements,
        [payment_element]: transformedSubscriptions,
      };
      await transaction.save();
      console.log("Transaction updated:", transaction);
    }
  } catch (err) {
    console.log("Error handling transaction:", err);
  }

  try {
    let hotelSubscriptions = await HotelSubscription.find({
      hotelRepId: req.session.passport.user.id,
      status: "pending",
    });

    if (hotelSubscriptions.length > 0) {
      try {
        await HotelSubscription.deleteMany({
          hotelRepId: req.session.passport.user.id,
          status: "pending",
        });

        console.log("Deletions completed successfully");
      } catch (error) {
        console.log("Error performing deletions:", error);
      }
    }

    const today = new Date();
    const futureDate = new Date(today);

    const hotelSubscription = new HotelSubscription({
      hotelRepId: req.session.passport.user.id,
      subscription: subscriptionsIds,
      endDate: futureDate.setMonth(today.getMonth() + parseInt(durations)),
    });

    await hotelSubscription.save();
    console.log("Hotel subscription created");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

  res.redirect("/hotels/precheckout");
};

export const getPrecheckout = async (req, res) => {
  try {
    const transactionData = await Transaction.findOne({
      hotelRepId: req.session.passport.user.id,
      status: "ongoing",
    });

    if (!transactionData) {
      console.log("Data not found");
      return res.render("hotels/precheckout", {
        hotelProfile: req.hotelProfile,
        pageTitle: "Confirm selection",
        transactionData: null,
        cartTotal: 0,
      });
    }

    let cartTotal = 0;
    for (const key in transactionData.paymentElements) {
      if (
        Object.prototype.hasOwnProperty.call(
          transactionData.paymentElements,
          key
        )
      ) {
        const items = transactionData.paymentElements[key];

        for (const itemId in items) {
          if (Object.prototype.hasOwnProperty.call(items, itemId)) {
            const item = items[itemId];
            cartTotal += item.price;
          }
        }
      }
    }

    res.render("hotels/precheckout", {
      hotelProfile: req.hotelProfile,
      pageTitle: "Confirm selection",
      transactionData,
      cartTotal,
    });
  } catch (error) {
    console.error(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  const { itemType, itemName } = req.body;

  try {
    const transaction = await Transaction.findOne({
      hotelRepId: req.session.passport.user.id,
      status: "ongoing",
    });

    const updatedItemType = { ...transaction.paymentElements[itemType] };
    delete updatedItemType[itemName];

    const updatedPaymentElements = { ...transaction.paymentElements };

    if (Object.keys(updatedItemType).length === 0) {
      delete updatedPaymentElements[itemType];
    } else {
      updatedPaymentElements[itemType] = updatedItemType;
    }

    transaction.paymentElements = updatedPaymentElements;

    let cartTotal = 0;
    for (const key in transaction.paymentElements) {
      if (
        Object.prototype.hasOwnProperty.call(transaction.paymentElements, key)
      ) {
        const items = transaction.paymentElements[key];

        for (const itemId in items) {
          if (Object.prototype.hasOwnProperty.call(items, itemId)) {
            const item = items[itemId];
            cartTotal += item.price;
          }
        }
      }
    }

    await transaction.save();

    const newItemCount = Object.values(transaction.paymentElements).reduce(
      (total, items) => total + Object.keys(items).length,
      0
    );

    console.log(
      "Cart item removed successfully and carttotal updated to",
      cartTotal
    );
    res.status(200).json({
      message: "Item removed successfully",
      cartTotal: cartTotal,
      itemCount: newItemCount,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTransactionSummary = async (req, res) => {
  try {
    const transactionData = await Transaction.findOne({
      hotelRepId: req.session.passport.user.id,
      status: "ongoing",
    });
    const countryData = await Countries.find();

    if (!transactionData) {
      console.log("Transaction data not found");
    }

    if (!countryData) {
      console.log("Country data not found");
    }

    let cartTotal = 0;
    for (const key in transactionData.paymentElements) {
      const items = transactionData.paymentElements[key];
      for (const id in items) {
        cartTotal += items[id].price;
      }
    }

    res.render("hotels/transactionsummary", {
      hotelProfile: req.hotelProfile,
      pageTitle: "Payment",
      transactionData,
      cartTotal,
      countryData,
    });
  } catch (error) {
    console.error(error);
  }
};

export const processStripePayment = async (req, res, next) => {
  try {
    const userData = req.body;
    const paymentMethod = req.body.paymentMethod;
    const userId = req.session.passport.user.id;
    const transactionId = req.body.transaction;
    const transactionData = await findTransaction(transactionId, userId);

    const lineItems = extractLineItems(
      paymentMethod,
      transactionData.paymentElements
    );

    await updateTransactionData(transactionData, userData);

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${backendUrl}/hotels/update-post-payment-tables`, //remember to change this
      cancel_url: `${backendUrl}/hotels/cancel-payment`, //remember to change this
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.error("Error processing stripe payment:", error);
    res.status(500).json({ error: "Failed to process payment." });
  }
};

const updateStatus = async (Model, query, status) => {
  try {
    const records = await Model.find(query);
    for (const record of records) {
      record.status = status;
      await record.save();
    }
  } catch (error) {
    throw new Error(
      `Error updating ${Model.modelName} status : ${error.message}`
    );
  }
};

export const updatePostPaymentTables = async (req, res) => {
  const hotelRepId = req.session.passport.user.id;

  try {
    await updateStatus(HotelOffer, { hotelRepId, status: "pending" }, "active");
    await updateStatus(HotelAddOn, { hotelRepId, status: "pending" }, "active");
    await updateStatus(
      HotelSubscription,
      { hotelRepId, status: "pending" },
      "active"
    );

    const transactionData = await Transaction.findOne({
      hotelRepId,
      status: "ongoing",
    });
    if (transactionData) {
      transactionData.status = "complete";
      await transactionData.save();
      res.render("hotels/payment-success", { pageTitle: "Successful payment" });
    } else {
      res.redirect("/hotels/generalinformation");
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const cancelStripePayment = (req, res) => {
  try {
    res.render("hotels/cancel-payment", { pageTitle: "Payment Cancelled" });
  } catch (error) {
    console.error(error);
  }
};

const findTransaction = async (transactionId, userId) => {
  try {
    const transactionData = await Transaction.findOne({
      _id: transactionId,
      hotelRepId: userId,
      status: "ongoing",
    });
    if (!transactionData) {
      throw new Error("Transaction not found");
    }
    return transactionData;
  } catch (error) {
    throw new Error(
      "Error encountred while fetchin transaction data: " + error.message
    );
  }
};

const extractLineItems = (paymentMethod, paymentElements) => {
  const lineItems = [];
  let lineItem = {};

  for (const category in paymentElements) {
    if (Object.hasOwnProperty.call(paymentElements, category)) {
      const items = paymentElements[category];

      for (const itemName in items) {
        if (Object.hasOwnProperty.call(items, itemName)) {
          const itemDetails = items[itemName];

          if (paymentMethod === "stripe") {
            lineItem = {
              price: itemDetails.details.stripe_price_id,
              quantity: 1,
            };
          } else {
            lineItem = {
              name: itemDetails.details.label
                ? itemDetails.details.label
                : itemDetails.details.name,
              price: itemDetails.price,
              quantity: 1,
            };
          }

          lineItems.push(lineItem);
        }
      }
    }
  }
  return lineItems;
};

const updateTransactionData = async (transactionData, userData) => {
  try {
    transactionData.cardholder_first_name = userData.cardholder_first_name;
    transactionData.cardholder_last_name = userData.cardholder_last_name;
    transactionData.cardholder_email = userData.cardholder_email;
    transactionData.cardholder_country = userData.cardholder_country;
    transactionData.cardholder_telephone = userData.cardholder_telephone;
    transactionData.paymentMethod = userData.paymentMethod;

    const result = await transactionData.save();

    if (!result) {
      throw new Error("Failed to update transaction");
    }
  } catch (error) {
    throw new Error("Failed to update transaction: " + error.message);
  }
};

const createPayPalOrder = async (lineItems) => {
  console.log(lineItems);
  const totalValue = lineItems
    .reduce((sum, item) => sum + item.price, 0)
    .toFixed(2);

  const request = new PayPal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "EUR",
          value: totalValue,
          breakdown: {
            item_total: {
              currency_code: "EUR",
              value: totalValue,
            },
          },
        },
        items: lineItems.map((item) => ({
          name: item.name,
          unit_amount: {
            currency_code: "EUR",
            value: item.price.toFixed(2),
          },
          quantity: item.quantity,
        })),
      },
    ],
  });

  try {
    const order = await client.execute(request);
    return order.result.id;
  } catch (err) {
    throw new Error("Error creating PayPal order: " + error.message);
  }
};

export const processPaypalPayment = async (req, res) => {
  const transactionId = req.body.transaction;
  const paymentMethod = req.body.paymentMethod;
  const userId = req.session.passport.user.id;
  const userData = req.body;

  console.log("This is the req.body output:", req.body);

  try {
    const transactionData = await findTransaction(transactionId, userId);
    const lineItems = extractLineItems(
      paymentMethod,
      transactionData.paymentElements
    );
    await updateTransactionData(transactionData, userData);
    const orderId = await createPayPalOrder(lineItems);

    res.json({ id: orderId });
    console.log("Successfully processed 'process PayPalpayment' function");
  } catch (err) {
    console.log("Error in 'processPayPalpayment' function:", err.message);
    res.status(500).send(err.message);
  }
};

export const capturePaypalOrder = async (req, res) => {
  const request = new PayPal.orders.OrdersCaptureRequest(req.body.orderID);
  request.requestBody({});
  console.log(request);

  try {
    const capture = await client.execute(request);
    console.log("Capture: ", capture);
    res.json(capture.result);
    console.log("Capture.Result: ", capture);
  } catch (error) {
    console.log("An error occured:", error);
    res.status(500).send(error);
  }
};

// export const processCoinbasePayment = async (req, res) => {
//   const chargeData = {
//     name: "The Avenging Son",
//     description: "A book about Roboute Guilliman, The Avenging Son",
//     local_price: {
//       amount: "1",
//       currency: "USD",
//     },
//     pricing_type: "fixed_price",
//     metadata: {
//       orderId: "FASDFA34454352343524325FDSA",
//       customerId: "ROBOUTEGUILLIMAN",
//     },
//   };

//   try {
//     const charge = await createCharge(chargeData);
//     res.redirect(charge.hosted_url);
//   } catch (error) {
//     res.status(500).json({ error: `Failed to create payment: ${error}` });
//   }
// };

const formatDate = (date) => {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getSubscriptionData = async (userId) => {
  const subscriptionData = await HotelSubscription.findOne({
    hotelRepId: userId,
    status: "active",
  }).populate("subscription");

  if (subscriptionData) {
    subscriptionData.endDateFormatted = formatDate(subscriptionData.endDate);
    subscriptionData.purchaseDateFormatted = formatDate(
      subscriptionData.purchaseDate
    );
  }

  return subscriptionData;
};

const getAddonData = async (userId) => {
  const addonData = await HotelAddOn.find({
    hotelRepId: userId,
    status: "active",
  }).populate("addOn");

  if (addonData.length === 0) {
    console.log("Addondata is empty");
  }

  return addonData.map((addon) => {
    addon.endDateFormatted = formatDate(addon.endDate);
    addon.purchaseDateFormatted = formatDate(addon.purchaseDate);
    return addon;
  });
};

const getExclusiveOffersData = async (userId) => {
  const exclusiveOffersData = await HotelOffer.findOne({
    hotelRepId: userId,
    status: "active",
  }).populate("exclusiveoffer");

  if (exclusiveOffersData) {
    exclusiveOffersData.endDateFormatted = formatDate(
      exclusiveOffersData.endDate
    );
    exclusiveOffersData.purchaseDateFormatted = formatDate(
      exclusiveOffersData.purchaseDate
    );
  }

  return exclusiveOffersData;
};

export const getCurrentSubscriptions = async (req, res) => {
  try {
    const userId = req.session.passport.user.id;

    const [subscriptionData, addonData, exclusiveOffersData] =
      await Promise.all([
        getSubscriptionData(userId),
        getAddonData(userId),
        getExclusiveOffersData(userId),
      ]);

    res.render("hotels/current-subscriptions", {
      pageTitle: "Current Subscriptions",
      subscriptionData,
      addonData,
      exclusiveOffersData,
    });
  } catch (error) {
    console.log("An error occurred fetching subscription data:", error);
    res.status(500).send("Internal server error");
  }
};

const highlightLabels = {
  ideal_location: "Ideal Location",
  free_airport_transfers: "Free Airport Transfers",
  free_parking: "Free Parking",
  varied_breakfast: "Varied Breakfast",
  free_breakfast: "Free Breakfast",
  high_speed_wifi: "High-Speed Wi-Fi",
  concierge_24_7: "24-Hour Concierge",
  fitness_center: "Fitness Center",
  swimming_pool: "Swimming Pool",
  spa_services: "Spa Services",
  business_center: "Business Center",
  pet_friendly: "Pet-Friendly",
  eco_friendly: "Eco-Friendly",
  family_friendly: "Family-Friendly",
  rooftop_lounge: "Rooftop Lounge",
  room_service: "Room Service",
  laundry_services: "Laundry Services",
  accessible_rooms: "Accessible Rooms",
  restaurant_and_bar: "Restaurant & Bar",
  event_spaces: "Event Spaces",
};

export const getHighlights = async (req, res) => {
  try {
    const renderData = {
      pageTitle: "Highlights",
      highlightLabels,
    };

    if (req.hotelProfile) {
      const highlight = await Highlight.findOne({
        hotel_id: req.hotelProfile._id,
      });
      Object.assign(renderData, {
        highlight,
        hotelId: req.hotelProfile._id,
      });
    }

    res.render("hotels/highlights", renderData);
  } catch (error) {
    console.error("An error occurred fetching highlights: ", error);
    res.status(500).send("Error fetching highlights");
  }
};

export const createHighlights = async (req, res) => {
  try {
    const { hotelId, _csrf, ...highlights } = req.body;
    const highlightFields = Object.keys(highlightLabels);

    const highlightData = highlightFields.reduce((acc, field) => {
      acc[field] = highlights[field] === "on";
      return acc;
    }, {});

    const hotel = await Highlight.findOneAndUpdate(
      { hotel_id: hotelId },
      { $set: highlightData },
      { new: true, upsert: true }
    );

    console.log("Updated hotel highlights:", hotel);
    res.redirect("/hotels/transportation");
  } catch (error) {
    console.error("Error creating/updating highlights:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getTransportation = async (req, res) => {
  let hotelId = null;
  let transportstations = null;

  if (req.hotelProfile) {
    hotelId = req.hotelProfile._id;

    transportstations = await Transport.findOne({
      hotelId: hotelId,
    });
  }

  res.render("hotels/transportation", {
    pageTitle: "Nearby Transportation",
    transportstations,
    hotelId,
  });
};

function estimateDistance(minutes, averageSpeedMph = 25) {
  const hours = minutes / 60;
  return (averageSpeedMph * hours).toFixed(2);
}

function formatTransportationValues(transportation_category) {
  const transportationArray = Object.values(transportation_category);

  const updatedTransportationArray = transportationArray
    .map((entry) => {
      if (Array.isArray(entry.time_to_station)) {
        return entry.time_to_station.map((time, index) => ({
          ...entry,
          time_to_station: time,
          distance_to_station: estimateDistance(parseInt(time)),
          station_category: entry.station_category[index],
          station_name: entry.station_name[index],
        }));
      } else {
        return {
          ...entry,
          distance_to_station: estimateDistance(
            parseInt(entry.time_to_station)
          ),
        };
      }
    })
    .flat();

  return updatedTransportationArray;
}

export const createTransportation = async (req, res) => {
  try {
    const { hotelId, transportation_category } = req.body;

    const updatedTransportationArray = formatTransportationValues(
      transportation_category
    );

    await Transport.findOneAndUpdate(
      { hotelId },
      { $set: { transportation_category: updatedTransportationArray } },
      { upsert: true, new: true }
    );

    res.redirect("/hotels/contactinformation");
  } catch (error) {
    console.error("Error saving transport category:", error);
    res.status(500).json({ message: "Failed to save transportation data" });
  }
};

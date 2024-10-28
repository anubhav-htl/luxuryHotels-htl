import express from "express";
import bodyParser from "body-parser";
import axios from "axios"
import multer from "multer";
import path from "path";
import { ensureRepAuthenticated } from "../middleware/auth.js";
import { fetchHotelProfile } from "../middleware/hotelProfile.js";
import { createMulterMiddleware } from "../utils/uploads.js";

import {
  createFacilitiesAmenities,
  createContactInformation,
  createGeneralInformation,
  createTopAttractions,
  createHoliday,
  createExclusiveOffers,
  createHighlights,
  createTransportation,
  getProfile,
  getTopAttractions,
  getFacilitiesAmenities,
  getContactInformation,
  getAddedExposure,
  getExclusiveOffers,
  getHoliday,
  getGeneralInformation,
  getNomination,
  getInspection,
  getSubscriptions,
  getTransactionSummary,
  getPrecheckout,
  getCurrentSubscriptions,
  getTransportation,
  getHighlights,
  updateGeneralInformation,
  uploadHotelImages,
  upload,
  deleteHotelImage,
  submitNomination,
  requestInspection,
  transactAdditionalFeatures,
  transactHotelOffers,
  transactSubscriptions,
  removeFromCart,
  processStripePayment,
  updatePostPaymentTables,
  cancelStripePayment,
  processPaypalPayment,
  //processCoinbasePayment,
  capturePaypalOrder,
  sevenDayTrial,
} from "../controllers/hotels.js";

// import pkg from "coinbase-commerce-node";
// const { Webhook } = pkg;

const router = express.Router();

router.use(fetchHotelProfile);

const bearerToken = `Bearer ${process.env.CHATGPT_TOKEN_ABHI}`; //21-10-2024 abhishek sir personal
// const bearerToken =`Bearer ${process.env.CHATGPT_TOKEN_CLIENT}` //client
const chatgptURL = 'https://api.openai.com/v1/chat/completions'

//const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET;

// Combine both hotel logo and multiple images upload in one middleware
const uploadFiles = () =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, file.fieldname === "hotel_logo" ? "uploads/hotelLogo" : "uploads/hotel");
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      }
    }),
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only .jpeg, .jpg, and .png formats are allowed!'), false);
      }
    }
  }).fields([
    { name: 'hotel_logo', maxCount: 1 },  // Handle single hotel logo
    { name: 'images', maxCount: 10 }      // Handle multiple images
  ]);

// Use the combined middleware in your router
router.post(
  "/generalinformation",
  uploadFiles(),
  createGeneralInformation
);

router.post(
  "/upload",
  ensureRepAuthenticated,
  upload.single("file"),
  uploadHotelImages,
);

router.post("/delete-image", ensureRepAuthenticated, deleteHotelImage);

router.get(
  "/generalinformation",
  ensureRepAuthenticated,
  getGeneralInformation,
);

//create hotel details api
// router.post("/generalinformation",uploadMulti("uploads/hotel"),createGeneralInformation);

router.post(
  "/editgeneralinformation/:hotel_id",
  ensureRepAuthenticated,
  updateGeneralInformation,
);

router.get("/profile/:hotel_id", getProfile);

router.get("/topattractions", ensureRepAuthenticated, getTopAttractions);

router.post("/topattractions", ensureRepAuthenticated, createTopAttractions);

router.get(
  "/facilitiesamenities",
  ensureRepAuthenticated,
  getFacilitiesAmenities,
);

router.post(
  "/facilitiesamenities",
  ensureRepAuthenticated,
  createFacilitiesAmenities,
);

router.get("/highlights", ensureRepAuthenticated, getHighlights);

router.get("/transportation", ensureRepAuthenticated, getTransportation);

router.post("/highlights", ensureRepAuthenticated, createHighlights);

router.post("/transportation", ensureRepAuthenticated, createTransportation);

router.get(
  "/contactinformation",
  ensureRepAuthenticated,
  getContactInformation,
);

router.post(
  "/contactinformation",
  ensureRepAuthenticated,
  createContactInformation,
);

router.get("/additionalexposure", ensureRepAuthenticated, getAddedExposure);

router.post(
  "/addedexposure",
  ensureRepAuthenticated,
  transactAdditionalFeatures,
);

router.post("/hoteloffers", ensureRepAuthenticated, transactHotelOffers);

router.get("/exclusiveoffers", ensureRepAuthenticated, getExclusiveOffers);

router.post("/exclusiveoffers", ensureRepAuthenticated, createExclusiveOffers);

router.get("/holiday", ensureRepAuthenticated, getHoliday);

router.post("/holiday", ensureRepAuthenticated, createHoliday);

router.get("/nomination", ensureRepAuthenticated, getNomination);

router.post("/nomination", ensureRepAuthenticated, submitNomination);

router.get("/inspection", ensureRepAuthenticated, getInspection);

router.post("/inspection", ensureRepAuthenticated, requestInspection);

router.get("/subscriptions", ensureRepAuthenticated, getSubscriptions);

router.post("/subscriptions", ensureRepAuthenticated, transactSubscriptions);

router.post("/create-trial", ensureRepAuthenticated, sevenDayTrial);

router.get(
  "/transactionsummary",
  ensureRepAuthenticated,
  getTransactionSummary,
);

router.get("/precheckout", ensureRepAuthenticated, getPrecheckout);

router.post("/remove-item-from-cart", ensureRepAuthenticated, removeFromCart);

router.post(
  "/process-stripe-payment",
  ensureRepAuthenticated,
  processStripePayment,
);

router.post(
  "/process-paypal-payment",
  ensureRepAuthenticated,
  processPaypalPayment,
);

router.post(
  "/capture-paypal-order",
  ensureRepAuthenticated,
  capturePaypalOrder,
);

router.get(
  "/update-post-payment-tables",
  ensureRepAuthenticated,
  updatePostPaymentTables,
);

router.get("/cancel-payment", ensureRepAuthenticated, cancelStripePayment);

router.get(
  "/current-subscriptions",
  ensureRepAuthenticated,
  getCurrentSubscriptions,
);

// router.post(
//   "/webhook",
//   bodyParser.raw({ type: "application/json" }),
//   (req, res) => {
//     const signature = req.headers["x-cc-webhook-signature"];

//     try {
//       const event = Webhook.verifyEventBody(req.body, signature, webhookSecret);

//       if (event.type === "charge:confirmed") {
//         console.log("Cryptocurrency payment confirmed:", event.data);
//       }

//       res.status(200).send("Webhook received");
//     } catch (error) {
//       console.error("Error processing webhook:", error);
//       res.status(400).send("Webhook Error");
//     }
//   },
// );

// router.post(
//   "/create-coinbase-payment",
//   ensureRepAuthenticated,
//   processCoinbasePayment,
// );

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// add routers 04-10-2024
router.post("/fetch-hotels", async (req, res) => {
  const { hotel, location } = req.body;
  if (!hotel) {
    return res.status(400).json({ error: "hotel is required" });
  }
  try {
    if (hotel && location) {
      let data = JSON.stringify({
        textQuery: `${hotel} in ${location}`,
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://places.googleapis.com/v1/places:searchText",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": `${GOOGLE_API_KEY}`,
          "X-Goog-FieldMask": "*",
        },
        data: data,
      };
      axios
        .request(config)
        .then((response) => {
          res
            .status(200)
            .json({ message: "Fetch hotel", response: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        // url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${hotel}&key=AIzaSyAN-RY595XViAsgKD5nXRkH3zmtc6iqzjE`,
        url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${hotel}&key=${GOOGLE_API_KEY}`,
        headers: {},
      };

      axios
        .request(config)
        .then((response) => {
          res
            .status(200)
            .json({ message: "Fetch hotels", response: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  } catch (error) {
    console.log("error - ", error);
    res.status(500).json({ error: "Failed to fetch hotel details...." });
  }
});

router.post("/fetch-hotel-details", async (req, res) => {
  const { placeId } = req.body;
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyAN-RY595XViAsgKD5nXRkH3zmtc6iqzjE`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        res
          .status(200)
          .json({ message: "Fetch hotel", response: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel details" });
  }
});

router.post("/content", (req, res) => {
  try {
    let data = JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: req.body.content,
        },
      ],
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: chatgptURL,
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        res
          .status(200)
          .json({ message: "data fetched", response: response.data });
        // console.log(JSON.stringify(response.data));
        // console.log('X-RateLimit-Limit-Requests:', response.headers['x-ratelimit-limit-requests']);
        // console.log('X-RateLimit-Remaining-Requests:', response.headers['x-ratelimit-remaining-requests']);
        // console.log('X-RateLimit-Reset-Requests:', response.headers['x-ratelimit-reset-requests']);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  } catch (error) {
    console.log(error);
  }
});

// ---------- 23-10-2024 ----------

// Function to get nearby transport based on type
const getNearbyTransportation = async (lat, lng, type) => {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=3000&type=${type}&key=${GOOGLE_API_KEY}`;
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return [];
  }
};

router.post("/nearby-transport", async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const types = ["subway_station", "train_station", "airport"];
    const transportPromises = types.map((type) =>
      getNearbyTransportation(lat, lng, type)
    );
    const transportResults = await Promise.all(transportPromises);
    const [subwayStations, trainStations, airports] = transportResults;

    res.status(200).json({
      message: "Success",
      transport: {
        subwayStations,
        trainStations,
        airports,
      },
      status: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error while fetching",
      status: false,
      error: error.message,
    });
  }
});

// get the nearby attractions
const getNearbyAttractions = async (lat, lng, radius, type) => {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${GOOGLE_API_KEY}`;
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return [];
  }
};

router.post("/nearby-attraction", async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const types = ["tourist_attraction"];
    const radius = 3000;

    const attractionPromises = types.map((type) =>
      getNearbyAttractions(lat, lng, radius, type)
    );
    const results = await Promise.all(attractionPromises);
    const [attraction] = results;

    res.status(200).json({
      message: "Success",
      attraction: {
        attraction,
      },
      status: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error while fetching",
      status: false,
      error: error.message,
    });
  }
});


export default router;

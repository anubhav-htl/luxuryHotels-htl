import Hotel from "../models/hotel.js";
import HotelOffer from "../models/hoteloffer.js";
import Country from "../models/country.js";
import Nomination from "../models/nomination.js";
import Review from "../models/review.js";

export const getHotel = async (req, res) => {
  const { hotelId } = req.params;

  try {
    const hotel = await Hotel.findById(hotelId).populate('country'); //changed by HTL
    let coverPhoto = hotel?.images[0];

    const similarHotels = await Hotel.find({
      country: hotel.country,
      _id: { $ne: hotelId },
    })
      .select("hotel_name images country")
      .limit(8).populate("country");  // 08-10-2024 populate implement

    const similarHotelsData = similarHotels.map((similarHotel) => {
      return {
        id: similarHotel?._id,
        name: similarHotel?.hotel_name,
        coverPhoto: similarHotel?.images[0],
        country: similarHotel?.country,
      };
    });

    res.json({
      hotel: hotel,
      similarHotels: similarHotelsData,
      coverPhoto: coverPhoto,
    });
  } catch (error) {
    console.error("Error fetching hotel information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const formatHotelData = (hotel) => {
  const baseImageUrl = !hotel.representative
    ? "https://luxuryhotelsplatform.com/luxuryimages/"
    : `${process.env.BACKEND}/`;

  const imagesWithUrls = baseImageUrl
    ? hotel.images.map((image) => `${baseImageUrl}${image}`)
    : hotel.images;

  const coverImagesWithUrls = baseImageUrl
    ? `${baseImageUrl}${hotel.images[0]}`
    : hotel.images[0];

  return {
    ...hotel._doc,
    coverPhoto: coverImagesWithUrls,
    images: imagesWithUrls,
  };
};

export const getAllHotels = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  try {
    const count = await Hotel.countDocuments();
    const hotels = await Hotel.find({ status: "approved" }).populate("country");
    //commented by HTL//
    // .skip((page - 1) * limit)
    //.limit(limit)
    //.select("-__v");

    const hotelsData = hotels.map(formatHotelData);

    res.json({
      hotels: hotelsData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ error: `Internal Server Error` });
  }
};

export const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find();

    res.json({ countries });
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllHotelsByCountry = async (req, res) => {
  const { countryId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  try {
    const count = await Hotel.countDocuments();
    const hotels = await Hotel.find({ country: countryId })
      .populate("country")
      .skip((page - 1) * limit)
      .limit(limit);

    const hotelsData = hotels.map((hotel) => {
      return {
        ...hotel._doc,
        coverPhoto: hotel.images[0],
      };
    });

    res.status(200).json({
      hotels: hotelsData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching hotels by country:", error);
    res
      .status(500)
      .json({ message: "Server error encountered whiile fetching countries" });
  }
};

// 08-10-2024 commented by anubhav start
// export const submitGuestReview = async (req, res) => {
//   try {
//     const {
//       reviewer_name,
//       reviewer_email,
//       cleanliness_rating,
//       facilities_rating,
//       comfort_rating,
//       freewifi_rating,
//       overall_rating,
//       review,
//       hotelId,
//     } = req.body;

//     const result = await Review.create({
//       reviewer_name,
//       reviewer_email,
//       cleanliness_rating,
//       facilities_rating,
//       comfort_rating,
//       freewifi_rating,
//       overall_rating,
//       review,
//       hotelId,
//     });
//     res.status(201).json(result);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const submitGuestReview = async (req, res) => {
  try {
    const {
      reviewer_name,
      reviewer_email,
      country,
      formDate,
      toDate,
      cleanliness_rating,
      facilities_rating,
      comfort_rating,
      freewifi_rating,
      overall_rating,
      review,
      hotelId,
    } = req.body;
    const isImage = req.file ? req.file.path : "";

    const result = await Review.create({
      reviewer_name,
      reviewer_email,
      country,
      formDate,
      toDate,
      cleanliness_rating,
      facilities_rating,
      comfort_rating,
      freewifi_rating,
      overall_rating,
      review,
      hotelId,
      reviewer_image: isImage,
    });
    res.status(201).json({
      message: "reviews created successfully",
      review: result,
      status: 201,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getHotelReviews = async (req, res) => {
  const { hotelId } = req.params;

  try {
    const reviews = await Review.find({ hotelId: hotelId });
    // res.json({ reviews });
    res.json({
      message: "review get successfully",
      reviews: reviews,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching hotel information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 08-10-2024 commented by anubhav end



export const getAllNominatedHotels = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  try {
    const count = await Nomination.countDocuments();
    const hotels = await Nomination.find()
      .populate("hotel")
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-__v");

    const hotelsData = hotels.map(formatHotelData);

    res.json({
      hotels: hotelsData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ error: `Internal Server Error: ${error}` });
  }
};

export const getAllExclusiveOffers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  try {
    const count = await HotelOffer.countDocuments();
    const offers = await HotelOffer.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-__v");

    res.json({
      offers: offers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const hello = async (req, res) => {
  try {
    res.json({ hello: "world" });
  } catch (error) {
    console.error("Error fetching greeting:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

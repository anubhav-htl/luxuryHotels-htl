import HomeContent from "../models/homecontent.js";
import CountryVideos from "../models/countryVideosSchema.js";
import HotelNews from "../models/hotelNews.js";

export const getHotelNews = async (req, res) => {
  try {
    const data = await HotelNews.find().populate("country").populate("hotel");
    res.send({
      status: 200,
      content: data,
    });
  } catch (error) {
    console.log("catch error - ", error);
  }
};

export const createHotelNews = async (req, res) => {
  try {
    const {
      business_name,
      news_type,
      country,
      hotel,
      user_name,
      email,
      news_title,
      news_description,
      news_images,
      youtube_video_url,
      paymaent_status,
      likes,
      views,
    } = req.body;

    // const imagePaths = req.files.map(file => file.path);

    const news = new HotelNews({
      business_name,
      news_type,
      country,
      hotel,
      user_name,
      email,
      news_title,
      news_description,
      // news_images: imagePaths,
      news_images: req?.file?.path,
      youtube_video_url,
      paymaent_status,
      likes,
      views,
    });

    const savedNews = await news.save();

    res.status(201).json({
      message: "News created successfully",
      data: savedNews,
      status:true
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Failed to create news",
      error: error.message,
      status:false
    });
  }
};
export const getHotelTravelNews = async (req, res) => {
  try {
    const data = await HotelNews.find({ news_type: "hotel" })
      .select("news_title news_images")
      .populate("hotel", "hotel_name , updatedAt")
      .populate("country", "country ");
    return res.send({
      status: 200,
      content: data,
      message: "successfuly fetched travel news",
    });
  } catch (error) {
    console.log("catch error - ", error);
    return res.send({
      status: 500,
      message: "internal server error",
    });
  }
};
export const getHotelLatestNews = async (req, res) => {
  try {
    const data = await HotelNews.find({
      news_type: "other_business",
    })
      .select("news_title news_images")
      .populate("hotel", "hotel_name , updatedAt")
      .populate("country", "country ");
    return res.send({
      status: 200,
      content: data,
      message: "successfuly fetched latest news",
    });
  } catch (error) {
    console.log("catch error - ", error);
    return res.send({
      status: 500,
      message: "internal server error",
    });
  }
};
export const getNewsDetails = async (req, res) => {
  try {
    const data = await HotelNews.find({
      _id: req.body.news_id,
    })
      .populate("hotel")
      .populate("country");
    return res.send({
      status: 200,
      content: data,
      message: "successfuly fetched news details.",
    });
  } catch (error) {
    console.log("catch error - ", error);
    return res.send({
      status: 500,
      message: "internal server error",
      error: error.message,
    });
  }
};

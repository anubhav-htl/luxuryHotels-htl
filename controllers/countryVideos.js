import CountryVideos from "../models/countryVideosSchema.js";

export const getCountryVideos = async (req, res) => {
  try {
    // const data = await CountryVideos.find()
    //   .populate("hotel_id","hotel_name")

    // Calculate the date 7 days ago from today
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Query to find documents where 'updatedAt' is within the last 7 days
    const recentContent = await CountryVideos.find({
      // updatedAt: { $gte: sevenDaysAgo },
    }).populate(["nomination", "hotel_id"])
    // .populate({
    //   path: "hotel_id",
    //   select: "_id hotel_name country"
    // });


    if (recentContent.length === 0) {
      return res.status(404).json({ message: "No recent content found." });
    }
    res.send({
      status: 200,
      content: recentContent,
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

export const addCountryVideos = async (req, res) => {
  try {
    const { country_name, video_url, hotel_id, nomination } = req.body;
    const data = await CountryVideos.create({
      country_name,
      video_url,
      hotel_id,
      nomination
    });
    res.send({
      status: 200,
      content: data,
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

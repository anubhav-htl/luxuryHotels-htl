import HomeContent from "../models/homecontent.js";

export const getHomeContent = async (req, res) => {
  try {
    const data = await HomeContent.find();
    res.send({
      status: 200,
      content: data,
    });
  } catch (error) {
    console.log("catch error - ", error);
  }
};

export const addHomeContent = async (req, res) => {
  try {
    const { top_banner_video, top_banner_desc, banner_video } = req.body;
    const data = await HomeContent.create({
      top_banner_video: top_banner_video,
      top_banner_desc: top_banner_desc,
      banner_video: banner_video,
    });
    res.send({
      status: 200,
      content: data,
    });
  } catch (error) {
    console.log("catch error - ", error);
  }
};
export const removeHomeContent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedContent = await HomeContent.findByIdAndDelete(id);

    if (!deletedContent) {
      return res.status(404).json({
        status: 404,
        message: "Content not found.",
      });
    }
    res.json({
      status: 200,
      message: "Home content deleted successfully.",
      deletedContent,
    });
  } catch (error) {
    console.log("Error while deleting content - ", error);
    res.status(500).json({
      status: 500,
      message: "Server error while deleting content.",
      error: error.message,
    });
  }
};

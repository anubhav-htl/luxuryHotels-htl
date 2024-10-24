import HotelRep from "../models/hotelrep.js";
import Hotel from "../models/hotel.js";

import bcrypt from "bcrypt";
import emailQueue from "../queues/emailQueue.js";
import dotenv from "dotenv";
import config from "../config/config.js";

dotenv.config();

const env = process.env.NODE_ENV;
const frontendUrl = config[env].frontend;
const backendUrl = config[env].backend;

export const getList = (req, res) => {
  res.render("representatives/list");
};

export const getRegistration = (req, res) => {
  res.render("representatives/register");
};

export const getVerification = (req, res) => {
  res.render("representatives/verification");
};

export const verification = async (req, res) => {
  const { token } = req.params;

  try {
    const hotelRep = await HotelRep.findOne({ verificationToken: token });

    if (!hotelRep) {
      req.flash("error", "Invalid or expired token");
      return res.render(`representatives/login`);
    }

    hotelRep.verificationStatus = true;
    hotelRep.verificationToken = undefined;
    await hotelRep.save();

    const successMessage = "Email verified. You can now log in";
    return res.render(`representatives/login`, { successMessage });
  } catch (error) {
    console.error("Error verifying email:", error);
    const errorMessage = encodeURIComponent("Failed to verify email");
    res
      .status(500)
      .redirect(
        `${backendUrl}/representatives/login?errorMessage=${errorMessage}`,
      );
  }
};

export const login = async (req, res) => {
  res.render("representatives/login");
};

function formatDistanceToNow(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} years ago`;
}

export const getHotelProfiles = async (req, res) => {
  const userId = req.session.passport.user.id;

  try {
    const hotelProfiles = await Hotel.find({ representative: userId }).lean();
    hotelProfiles.forEach((hotel) => {
      hotel.updatedAtFormatted = formatDistanceToNow(
        new Date(hotel.updatedAt),
        { addSuffix: true },
      );
    });
    res.render("representatives/hotelprofiles", {
      hotelProfiles,
      pageTitle: "Hotel Profile",
    });
  } catch (error) {
    console.error("Error: ", error);
  }
};

export const register = async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  try {
    const existingUser = await HotelRep.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.random().toString(36).substring(7);

    const hotelRep = new HotelRep({
      name,
      email,
      password: hashedPassword,
      verificationToken: verificationToken,
      isApproved: false,
    });

    await hotelRep.save();

    emailQueue.add({
      email,
      subject: "Verify your email",
      content: `<html><p>Please click <a href="${backendUrl}/representatives/verify/${verificationToken}">here</a> to verify your email.</p></html>`,
    });

    req.flash(
      "info",
      `Registration successful. Please check your email for verification.`,
    );

    res
      .status(200)
      .json({ message: "Registration successful. Please check your email" });
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).json({
      message: `Registration failed. Please try again, ${err.message}`,
    });
  }
};

import express from "express";
import HotelRep from "../models/hotelrep.js";
import dotenv from "dotenv";
import passport from "passport";
import {
  ensureRepAuthenticated,
  redirectIfAuthenticated,
} from "../middleware/auth.js";
import {
  register,
  getList,
  getRegistration,
  verification,
  getVerification,
  login,
  getHotelProfiles,
} from "../controllers/representatives.js";
import registerValidator from "../validators/registerValidator.js";
import { verifyToken } from "../utils/auth.js";
import Hotel from "../models/hotel.js"

dotenv.config();
const router = express.Router();

router.get("/", redirectIfAuthenticated, getList);

router.get("/register", redirectIfAuthenticated, getRegistration);

router.post("/register", registerValidator, register);
// router.post('/register', redirectIfAuthenticated, registerValidator, register);

router.get("/verification", redirectIfAuthenticated, getVerification);

router.get("/verify/:token", redirectIfAuthenticated, verification);

router.get("/login", login);

//router.post('/login', (req, res, next) => {
//  passport.authenticate('hotelRep', (err, user, info) => {
//  if (err) {
//  console.error('Error during authentication:', err);
//  if (req.headers['x-requested-from'] === 'frontend') {
//   return res.status(500).json({ message: 'Internal Server Error' });
// } else {
//   return res.redirect('/representatives/login');
//  }
// }
//  if (!user) {
//  if (req.headers['x-requested-from'] === 'frontend') {
//  return res.status(401).json({ message: req.flash('error') || info.message });
// } else {
//  return res.redirect('/representatives/login');
// }
// }
// req.logIn(user, (err) => {
// if (err) {
//  console.error('Error during login:', err);
// if (req.headers['x-requested-from'] === 'frontend') {
//   return res.status(500).json({ message: 'Login failed' });
//  } else {
//   return res.redirect('/representatives/login');
// }
// }
// if (req.headers['x-requested-from'] === 'frontend') {
//  return res.status(200).json({ message: 'Login successful' });
//  } else {
//   return res.redirect('/hotels/generalinformation');
//  }
// });
// })(req, res, next);
//});

// 21-10-2024
// router.post("/login", (req, res, next) => {
//   passport.authenticate("hotelRep", (err, user, info) => {
//     console.log("user ==>", user);
//     if (err) {
//       console.error("Error during authentication:", err);
//       if (req.headers["x-requested-from"] === "frontend") {
//         return res.status(500).json({ message: "Internal Server Error" });
//       } else {
//         return res.redirect("/representatives/login");
//       }
//     }
//     if (!user) {
//       if (req.headers["x-requested-from"] === "frontend") {
//         // return res.status(401).json({ message: req.flash('error') || info.message });
//         return res.status(401).json({ message: "user credentials not valid" });
//       } else {
//         return res.redirect("/representatives/login");
//       }
//     }
//     req.logIn(user, (err) => {
//       if (err) {
//         console.error("Error during login:", err);
//         if (req.headers["x-requested-from"] === "frontend") {
//           return res.status(500).json({ message: "Login failed" });
//         } else {
//           return res.redirect("/representatives/login");
//         }
//       }
//       // Respond with user data if the request is from the frontend
//       if (req.headers["x-requested-from"] === "frontend") {
//         return res.status(200).json({ message: "Login successful", user });
//       } else {
//         // return res.redirect('/hotels/generalinformation');
//         return res.status(200).json({ message: "login successful", user });
//       }
//     });
//   })(req, res, next);
// });

router.post("/login", (req, res, next) => {
  passport.authenticate("hotelRep", (err, user, info) => {
    if (err) {
      if (req.headers["x-requested-from"] === "frontend") {
        return res.status(500).json({ message: "Internal Server Error" });
      }
      // else {
      //   return res.redirect("/representatives/login");
      // }
    }

    if (!user) {
      if (req.headers["x-requested-from"] === "frontend") {
        // return res.status(401).json({ message: req.flash('error') || info.message });
        return res.status(401).json({ message: "user credentials not valid" });
      }
      // else {
      //   return res.redirect("/representatives/login");
      // }
    }

    req.logIn(user, async (err) => {
      if (err) {
        if (req.headers["x-requested-from"] === "frontend") {
          return res.status(500).json({ message: "Login failed" });
        }
      }

      let representative_id = user._id;
      let getHotelInfo;

      if (req.headers["x-requested-from"] === "frontend") {
        getHotelInfo = await Hotel.findOne({ representative: representative_id }).populate(
          "country",
        )
        return res.status(200).json({ message: "Login successful", user, detail:getHotelInfo });
      } else {
        getHotelInfo = await Hotel.findOne({ representative: representative_id }).populate(
          "country",
        )
        return res.status(200).json({ message: "login successful", user, detail:getHotelInfo });
      }
    });
  })(req, res, next);
});

// 21-10-2024

router.get("/logout", (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) {
        console.error("Error signing out:", err);
        return res.status(500).json({
          message: "There was an issue signing you out. Please try again later",
        });
      }

      if (req.headers["x-requested-from"] === "frontend") {
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logged out successfully" });
      } else {
        res.clearCookie("connect.sid");
        res.redirect("/representatives/login");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/logout", async (req, res) => {
  try {
    const { authToken } = req.body;
    // console.log("filterToken==>", filterToken);
    let verify = verifyToken(authToken);
    let id = verify.Id;
    const filterToken = await HotelRep.findOneAndUpdate(
      { _id: id },
      { authToken: "" },
      { new: true }
    );

    if (!filterToken) {
      return res.status(200).json({ message: "not found." });
    }
    res.status(200).json({ message: "user logout successfuly.", status: true });
  } catch (error) {
    console.log("error while logging out", error);
  }
});

router.get("/hotelprofiles", ensureRepAuthenticated, getHotelProfiles);

export default router;

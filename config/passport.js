import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import HotelRep from "../models/hotelrep.js";
import Admin from "../models/admin.js";
import bcrypt from "bcrypt";
import chalk from "chalk";
import { generateToken } from "../utils/auth.js";

async function initialize(passport) {
  passport.use(
    "admin",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const admin = await Admin.findOne({ email });

          if (!admin) {
            console.log(chalk.red("Incorrect email address"));
            return done(null, false, { message: "Incorrect email address" });
          }

          const isMatch = await bcrypt.compare(password, admin.password);

          if (!isMatch) {
            console.log(chalk.red("Incorrect password"));
            return done(null, false, { message: "Incorrect password" });
          }

          return done(null, admin);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "hotelRep",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const hotelRep = await HotelRep.findOne({ email });
          // console.log("hotelRep - ", hotelRep);
          
          const token = generateToken(hotelRep._id);

          if (!hotelRep) {
            req.flash(
              "error",
              "You account does not exist in our database, please register an account"
            );
            return done(null, false);
          }
          const updateToken = await HotelRep.findOneAndUpdate(
            { email },
            { authToken: token },
            { new: true }
          );
          
          const passwordMatch = await bcrypt.compare(
            password,
            hotelRep.password
          );
          if (!passwordMatch) {
            req.flash("error", "Incorrect password for this account");
            return done(null, false);
          }

          // return done(null, hotelRep );
          return done(null, updateToken );
        } catch (err) {
          console.log(err);
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, {
      id: user.id,
      type: user instanceof HotelRep ? "hotelRep" : "admin",
    });
  });

  passport.deserializeUser(async (obj, done) => {
    try {
      let user;
      if (obj.type === "hotelRep") {
        user = await HotelRep.findById(obj.id).exec();
      } else {
        user = await Admin.findById(obj.id).exec();
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

export default initialize;

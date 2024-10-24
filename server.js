import dotenv from 'dotenv';
import express from 'express';

import flash from 'connect-flash';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './config/passport.js';
import MongoStore from 'connect-mongo';
import bodyParser from 'body-parser';
import csrf from 'csurf';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import chalk from 'chalk';

import path from 'path';
import { fileURLToPath } from 'url';
import { parseFormData } from './middleware/formParser.js';
import { fetchHotelProfile } from './middleware/hotelProfile.js';


import db from './config/db.js';
import config from './config/config.js';
import expressWinston from 'express-winston';
import morgan from 'morgan';
import logger from './logger.js';
import { expireOffers } from './cronJobs.js';

import countryRoutes from './routes/countries.js'
import representativesRouter from './routes/representatives.js';
import hotelsRouter from './routes/hotels.js';
import addOnsRouter from './routes/addons.js';
import exclusiveOffersRouter from './routes/exclusiveoffers.js';
import adminsRouter from './routes/admins.js';
import sdRouter from './routes/sd.js';
import hotelsAPIRouter from './routes/hotelsAPI.js';
import { auth } from "./utils/auth.js"

//start 26-09-2024
import homeRoutes from "./routes/home.js";
import countryVideosRoutes from "./routes/countryVideos.js";
import hotelNewsRoutes from "./routes/hotelNews.js"
// end 26-09-2024

import partnersRoute from "./routes/partners.js"; //09-10-2024
import servicesRoutes from './routes/servicesRoutes.js' //09-10-2024
import contactRoutes from './routes/contactRoutes.js' //09-10-2024

import testimonialsRoutes from './routes/testimonialsRoutes.js' //10-10-2024
import roomAmenitiesRoutes from './routes/roomAmenitiesRoutes.js' //10-10-2024
import hotelFacilitiesRoutes from './routes/hotelFacilitiesRoutes.js' //10-10-2024

import NominateRoutes from './routes/nominateRoutes.js' // 16-10-2024
import subscriptionRoutes from "./routes/subscriptionRoutes.js"; // 16-10-2024
import hotelsubscription from "./routes/hotelsubscription.js"; // 16-10-2024
import hotelHighlightsRoutes from"./routes/hotelHighlightsRoutes.js" //23-10-2024

dotenv.config();

const env = process.env.NODE_ENV;
const dbUrl = config[env].db;
const frontendUrl = config[env].frontend;
const aliIpAddress = '103.248.238.162'; 
const luxuryHotelsIPAddress = '77.37.120.23'; 
const aliLocalhost = 'http://localhost';
const app = express();


const __dirname = path.dirname(fileURLToPath(import.meta.url));

const morganMiddleware = morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1090,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: 'your_secret_key', //remember to change this
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: dbUrl, //remember to change this
    collectionName: 'sessions'
  }),
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

initializePassport(passport);

app.use(passport.initialize());
app.use(passport.session());
//app.use(limiter);

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

app.use(helmet());
app.use(cookieParser());
app.use(parseFormData);
app.use(fetchHotelProfile);

// const csrfProtection = csrf({ cookie: true }); change in 26-09-2024
// app.use(csrfProtection); change in 26-09-2024

// const corsOptions = {
//  origin: [
//    frontendUrl,
//    aliIpAddress,
//    aliLocalhost,
//   'https://luxuryhotelsplatform.com/',
//   'http://192.168.1.7:3003',
//   'http://192.168.1.7:3001',
//   'https://luxuryhotels.click',
//   'https://luxuryhotels.click',
//   luxuryHotelsIPAddress
//   'http://localhost:5173',
//  ],
//  credentials: true,
//};

 const corsOptions =  {
   origin: '*',
   credential: true
 };

app.use(cors(corsOptions));
// app.use(cors());

const cspOptions = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      'https://js.stripe.com/v3/', 
      'https://www.paypal.com/',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
      'https://unpkg.com/dropzone@5/dist/min/dropzone.min.js',
      'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
      'https://cdn.jsdelivr.net/npm/flatpickr',
      "'unsafe-inline'"
    ],
    scriptSrcAttr: [
      "'self'",
      "'unsafe-inline'",
    ],
    styleSrc: [
      "'self'",
      frontendUrl,
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
      'https://getbootstrap.com/docs/5.3/examples/sidebars/sidebars.css',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
      'https://unpkg.com/dropzone@5/dist/min/dropzone.min.css',
      "'unsafe-inline'",
      'https://fonts.googleapis.com',
      'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
      'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css'
    ],
    imgSrc: [
      "'self'",
      frontendUrl,
      'https://luxuryhotelsplatform.com', 
      'https://www.luxuryhotelsmagazines.com',
      'https://www.paypalobjects.com',
      'https://luxuryhotels.s3.eu-north-1.amazonaws.com',
      'https://tile.openstreetmap.org',
      'https://cdnjs.cloudflare.com',
      'https://unpkg.com',
      'https://raw.githubusercontent.com',
      'data:',
    ],
    connectSrc: [
      "'self'",
      'http://77.37.120.23:3000',
      'https://www.sandbox.paypal.com'
    ],
    fontSrc: [
      "'self'", 
      'https://fonts.gstatic.com'      
    ],
    objectSrc: [
      "'self'", 
    ],
    mediaSrc: [
      "'self'",
    ],
    frameSrc: [
      "'self'",
      'https://www.sandbox.paypal.com',
      'https://js.stripe.com',
      'https://www.google.com/',
    ],
    formAction: [
      "'self'", 
      `${process.env.BACKEND}`,
    ],
    upgradeInsecureRequests: null //remove once ssl certificate is available
  },
};

app.use(helmet.contentSecurityPolicy(cspOptions));

app.use(flash());

app.use(express.json());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.reactUrl = process.env.FRONTEND;
  res.locals.informationMessages = req.flash('info');
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages = req.flash('error');
  // res.locals.csrfToken = req.csrfToken(); change in 26-09-2024


  if (Object.keys(req.body).length > 0) {
    if (req.body.password || req.body.passwordConfirm) {
      const maskedBody = { ...req.body, password: '****', passwordConfirm: '****' };
      console.dir(maskedBody, { depth: null, colors: true });
    } else {
      console.dir(req.body,{ depth: null, colors: true });
    }
  };
  next();
});


app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,  
}));

app.use(morganMiddleware);

app.use(expressWinston.errorLogger({
  winstonInstance: logger,
}))

app.get('/', (req, res) => {
  res.redirect('hotels/generalinformation');
});

app.get('/issue-csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// 26-09-2024 changes start
// app.get('/logged-in-status', (req, res) => {
//   if(req.isAuthenticated()) {
//     res.json({ userDetails: req.user });
//   } else {
//     res.status(201).json({ user: null });
//   }
// });

app.get("/logged-in-status", (req, res) => {
  if (req.isAuthenticated()) {
    let checkLogin = req.user;
    if (checkLogin.authToken == "") {
      res.status(201).json({ user: null });
    } else {
      res.json({ userDetails: req.user });
    }
  } else {
    res.status(201).json({ user: null });
  }
});
// 26-09-2024 changes end

app.get('/CORS-test', (req, res) => {
  res.json({ message: 'If you are seeing this message, you have made it past the CORS check' });
});


app.use('/countries', countryRoutes);
app.use('/representatives', representativesRouter);
app.use('/hotels', hotelsRouter);
app.use('/addons', addOnsRouter);
app.use('/exclusiveoffers', exclusiveOffersRouter);
app.use('/admin', adminsRouter);
app.use('/sd', sdRouter);
app.use('/hotelsAPI', hotelsAPIRouter);
//start 26-09-2024
app.use("/homecontent", homeRoutes);
app.use("/country-videos", countryVideosRoutes);
app.use("/news", hotelNewsRoutes);
//end 26-09-2024
app.use("/partners", partnersRoute); //09-10-2024
app.use("/services", servicesRoutes); //09-10-2024
app.use("/contact", contactRoutes); //09-10-2024
app.use("/testimonials", testimonialsRoutes); //10-10-2024
app.use("/room-amenities", roomAmenitiesRoutes); //10-10-2024
app.use("/hotel-facilities", hotelFacilitiesRoutes); //10-10-2024

//vishwas work start 16-10-2024
app.use("/subscription", subscriptionRoutes);
app.use("/hotelsubscription", hotelsubscription)
app.use("/nominate", NominateRoutes);
//vishwas work end 16-10-2024
app.use("/hotel-highlights", hotelHighlightsRoutes); //23-10-2024


app.listen(process.env.PORT, '0.0.0.0', () => {
  logger.info(chalk.cyan(`Server is running on port ${config[env].backend}`));
});

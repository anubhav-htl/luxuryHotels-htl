import express from 'express'
import Subscription from '../models/subscription.js';
const router = express.Router();

router.get('/get-subscriptions',async(req,res)=>{
    try {
        const getAllSubscriptions = await Subscription.find()
        res.send({
            status: 200,
            message:"All Subscription",
            response: getAllSubscriptions,
          })
    } catch (error) {
        console.log("catch error - ", error);
    return res.send({
      status: 500,
      message: "internal server error",
      error: error.message,
    });
    }
})

export default router
import express from "express";
const router = express.Router();
import HotelSubscription from "../models/hotelsubscription.js";

router.post("/add-hotel-subscription", async (req, res) => {
    try {
        const {
            hotel,
            nomination,
            purchaseDate,
            endDate,
            stripe_price_id,
            billable,
            status
        } = req.body;

        const hotelSubscription = new HotelSubscription({
            hotel,
            nomination,
            purchaseDate,
            endDate,
            stripe_price_id,
            billable,
            status
        });

        const savehotelSubscription = await hotelSubscription.save();

        res.status(201).json({
            status: true,
            message: "Hotel subscription added successfully",
            response: savehotelSubscription,
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to create nominate",
            error: error.message,
        });
    }
}
);

export default router;

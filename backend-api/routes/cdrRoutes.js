const express = require("express");
const router = express.Router();
const Cdr = require("../models/Cdr");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/roleMiddleware");

router.use(authMiddleware);

router.get("/", async(req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 25;
        const skip = (page - 1) * limit;

        const cdrs = await Cdr.find().skip(skip).limit(limit);
        const total = await Cdr.countDocuments();

        res.json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total/limit),
            data: cdrs,
        });
    } catch (err) {
        res.status(500).json({ error: "Server error"});
    }
});

router.get("/filter", async(req, res) => {
    try {
        const { city, callerNumber, receiverNumber, startDate, endDate } = req.query;
        const filter = {};

        if (city) filter.city = city;
        if (callerNumber) filter.callerNumber = callerNumber;
        if (receiverNumber) filter.receiverNumber = receiverNumber;
        if (startDate && endDate) {
            filter.callStartTime = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const cdrs = await Cdr.find(filter);
        res.json({ total: cdrs.length, data: cdrs });
    } catch (err) {
        res.status(500).json({ error: "Server error"});
    }
});

router.get("/analytics/total-calls", async (req, res) => {
    try {
        const total = await Cdr.countDocuments();
        res.json({ totalCalls: total });
    } catch (err) {
        res.status(500).json({ error: "Server error"});
    }
});

router.get("/analytics/total-duration", async (req, res) => {
    try {
        const result = await Cdr.aggregate([
            { $group: { _id: null, totalDuration: { $sum: "$callDuration" } } },
        ]);
        res.json({ totalDuration: result[0]?.totalDuration || 0});
    } catch (err) {
        res.status(500).json({ error: "Server error"});
    }
});

router.get("/analytics/call-distribution", async (req, res) => {
    try {
        const result = await Cdr.aggregate([
            { $group: { _id: "$callDirection", count: { $sum: 1 } } },
        ]);
        res.json({
            distribution: result.map((r) => ({
               type: r._id ? "Incoming" : "Outgoing",
               count: r.count,
            })),
        });
    } catch (err) {
        res.status(500).json({ error: "Server error"});
    }
});

router.get("/analytics/top-callers", roleMiddleware("admin"), async (req, res) => {
    try {
        const result = await Cdr.aggregate([
            { $group: { _id: "$callerName", totalCalls: { $sum: 1 } } },
            { $sort: { totalCalls: -1 } },
            { $limit: 10},
        ]);
        res.json({ topCallers: result});
    } catch (err) {
        res.status(500).json({ error: "Server error" } );
    }
});

module.exports = router;
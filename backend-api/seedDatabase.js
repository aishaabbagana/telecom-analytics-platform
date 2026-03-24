const mongoose = require("mongoose");
const csv = require("csv-parser");
const fs = require("fs");
require("dotenv").config();

const Cdr = require("./models/Cdr");

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Connection error:", err));

const records = [];

fs.createReadStream("mock-cdr.csv")
    .pipe(csv())
    .on("data", (row) => {
        records.push({
            callerName: row.callerName,
            callerNumber:row.callerNumber,
            receiverNumber: row.receiverNumber,
            city: row.city,
            callDirection: row.callDirection === "True",
            callStatus: row.callStatus === "True",
            callDuration: Number(row.callDuration),
            callCost: Number(row.callCost),
            callStartTime: new Date(row.callStartTime),
            callEndTime: new Date(row.callEndTime),
            id: Number(row.id),
        });
    })
    .on("end", async () => {
        try {
            await Cdr.deleteMany();
            await Cdr.insertMany(records);
            console.log(`${records.length} records inserted`);
            mongoose.connection.close();
        } catch (err) {
            console.log("Error inserting data:", err);
            mongoose.connection.close();
        }
    });
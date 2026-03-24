const mongoose = require("mongoose");

const cdrSchema = new mongoose.Schema({
    callerName: {type: String, required: true},
    callerNumber: {type: String, required: true},
    receiverNumber: {type: String, required: true},
    city: {type: String, required: true},
    callDirection: {type: Boolean, required: true},
    callStatus: {type: Boolean, required: true},
    callDuration: {type: Number, required: true},
    callCost: {type: Number, required: true},
    callStartTime: {type: Date, required: true},
    callEndTime: {type: Date, required: true},
    id: {type: Number, required: true},
});

module.exports = mongoose.model("Cdr", cdrSchema);
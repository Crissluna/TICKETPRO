const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const seatSchema = new Schema({
  section: String,
  row: String,
  number: Number,
  price: Number,
  status: {
    type: String,
    enum: ["available", "reserved", "sold"],
    default: "available",
  },
});

const eventSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  date: Date,
  image: String,
  seats: [seatSchema],
});

const Event = mongoose.model("Events", eventSchema, "events");

module.exports = Event;

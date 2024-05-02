const express = require("express");
const buyTickets = express.Router();
const getTickets = express.Router();
const jwt = require("jsonwebtoken");
const Ticket = require("../models/modelsTicket");
const Events = require("../models/modelsEvents");
const Users = require("../models/modelsUsers");

buyTickets.post("/buy", async (req, res) => {
  const { eventId, seats } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  try {
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    const userEmail = decoded.email;
    const event = await Events.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const user = await Users.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.boughtTickets) {
      user.boughtTickets = [];
    }

    const seatsToReserve = seats.map((seat) => {
      // Buscar el asiento por sección, fila y número
      const eventSeat = event.seats.find(
        (s) =>
          s.section === seat.section &&
          s.row === seat.row &&
          s.number === seat.number
      );

      console.log(
        `Checking seat: ${seat.section} Row ${seat.row} Number ${
          seat.number
        } - Found status: ${eventSeat ? eventSeat.status : "not found"}`
      );

      if (!eventSeat || eventSeat.status !== "available") {
        throw new Error(
          `Seat in section ${seat.section}, row ${seat.row}, number ${seat.number} is not available`
        );
      }
      eventSeat.status = "reserved";
      return eventSeat;
    });

    await event.save();

    const newTicket = new Ticket({
      user: user._id,
      event: event._id,
      seats: seatsToReserve.map((s) => ({
        section: s.section,
        row: s.row,
        number: s.number,
      })),
    });
    await newTicket.save();

    user.boughtTickets.push(newTicket._id);
    await user.save();

    res.status(201).json({
      message: "Tickets successfully purchased",
      ticketId: newTicket._id,
    });
  } catch (error) {
    console.error("Error purchasing tickets:", error);
    res.status(500).json({ message: error.message });
  }
});

getTickets.get("/user", async (req, res) => {
  try {
    // Extraer el token del encabezado de autorización
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);

    // Extraer el correo electrónico del payload del token
    const userEmail = decoded.email;

    // Buscar al usuario por correo electrónico en lugar de por ID
    const user = await Users.findOne({ email: userEmail })
      .populate({
        path: "boughtTickets",
        populate: {
          path: "event",
          model: "Events",
          select: "name description date image seats",
        },
      })
      .exec();

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Filtrar los asientos para cada ticket según los asientos específicos asociados a ese ticket
    const ticketsWithFilteredSeats = user.boughtTickets.map((ticket) => {
      const filteredSeats = ticket.event.seats.filter((seat) =>
        ticket.seats.includes(seat._id.toString())
      );

      return {
        ...ticket._doc,
        event: {
          ...ticket.event._doc,
          seats: filteredSeats,
        },
      };
    });

    res.json(ticketsWithFilteredSeats);
  } catch (error) {
    // Manejar errores específicos de JWT y otros errores generales
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid Token");
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).send("Token Expired");
    }
    res.status(500).send("Server Error: " + error.message);
  }
});

module.exports = { buyTickets, getTickets };

const express = require("express");
const cartEvents = express.Router();
const { Event } = require("../models/modelsEvents"); // Uso correcto de desestructuración

cartEvents.get("/:eventId", async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const event = await Event.findById(eventId).populate('defaultValues');
    if (!event) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }
    res.json(event);
  } catch (error) {
    console.error("Error al obtener el evento:", error);
    res.status(500).send("Error al obtener el evento");
  }
});

module.exports = cartEvents;

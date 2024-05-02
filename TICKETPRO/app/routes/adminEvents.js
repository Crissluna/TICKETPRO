const express = require("express");
const createEventRouter = express.Router();
const getEventsRouter = express.Router();
const getAllEvents = express.Router();
const Event = require("../models/modelsEvents");

// Ruta para crear un nuevo evento
createEventRouter.post("/createEvent", async (req, res) => {
  const { name, description, date, image } = req.body;

  try {
    // Crear nuevo evento con asientos vacíos inicialmente
    const newEvent = new Event({
      name,
      description,
      date,
      image,
      seats: [], // Inicialmente sin asientos
    });

    // Configurar asientos para el evento
    for (let section = 1; section <= 3; section++) {
      for (let row = 1; row <= 4; row++) {
        for (let number = 1; number <= 10; number++) {
          // Suponiendo 10 asientos por fila
          newEvent.seats.push({
            section: `Section ${section}`,
            row: `Row ${row}`,
            number,
            price: 100, // Precio fijo por asiento, se podría variar según la sección
            status: "available",
          });
        }
      }
    }

    // Guardar el nuevo evento
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error al crear el evento:", error);
    res.status(500).send("Error al crear el evento");
  }
});

// Ruta para obtener todos los eventos
getEventsRouter.get("/events/:eventId?", async (req, res) => {
  try {
    const { eventId } = req.params;
    if (eventId) {
      const event = await Event.findById(eventId).populate("seats");
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } else {
      const events = await Event.find().populate("seats");
      res.json(events);
    }
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: err.message });
  }
});

// Ruta para obtener todos los eventos para el administrador
getAllEvents.get("/admin/events", async (req, res) => {
  try {
    const events = await Event.find().populate("seats");
    res.json(events);
  } catch (err) {
    console.error("Error fetching admin events:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = { createEventRouter, getEventsRouter, getAllEvents };

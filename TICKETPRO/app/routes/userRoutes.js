const bcrypt = require("bcrypt");
const userRoutes = require("express").Router();
const UserModel = require("../models/modelsUsers");

userRoutes.post("/register", async (req, res) => {
  const { body } = req;
  const { firstName, lastName, email, password, boughtTickets } = body;

  try {
    if (!password) {
      return res.status(400).json({ message: "La contraseña es requerida." });
    }

    const saltRounds = 10;

    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      passwordHash,
      boughtTickets: [], // Define boughtTickets como un array vacío
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res
      .status(500)
      .json({ message: "Se produjo un error al registrar el usuario." });
  }
});



module.exports = userRoutes


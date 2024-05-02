const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const userModel = require("../models/modelsUsers");
const Session = require("../models/modelsSessions"); // Importa el modelo de sesión

loginRouter.post("/login", async (req, res) => {
  const { body } = req;
  const { email, password } = body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(401).json({
      error: "Usuario no encontrado",
    });
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!passwordCorrect) {
    return res.status(401).json({
      error: "Contraseña incorrecta",
    });
  }

  const userForToken = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  // Guarda el token en la tabla de sesiones
  try {
    await Session.create({ email: user.email, token });

    console.log("Token guardado en la tabla de sesiones.");
  } catch (error) {
    console.error("Error al guardar el token en la tabla de sesiones:", error);
    // Maneja el error adecuadamente
  }

  res.send({
    email: user.email,
    token,
  });
});

module.exports = loginRouter;

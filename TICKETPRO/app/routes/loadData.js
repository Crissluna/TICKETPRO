const loadDataRouter = require("express").Router();
const jwt_decode = require("jwt-decode");
const Session = require("../models/modelsSessions");
loadDataRouter.get("/loadData", async (req, res) => {
  const user = req.user;

  try {
    const sessionData = await Session.findOne({ email: user.email });
    if (!sessionData) {
      return res.status(404).json({ error: "Datos de sesión no encontrados" });
    }
    res.json({
      email: sessionData.email,
      // Otros datos de sesión si es necesario
    });
  } catch (error) {
    console.error("Error al cargar los datos de sesión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = loadDataRouter;

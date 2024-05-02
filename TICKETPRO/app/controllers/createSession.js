const modelSession = require("../models/modelsSessions");

const session = async (req, res, next) => {
  try {
    // Crea un nuevo documento de sesión usando el modelo de Mongoose
    await modelSession.create({ expira: new Date() });

    console.log("Base de datos configurada correctamente.");
  } catch (error) {
    console.error("Error al configurar la base de datos:", error);
  }
  next();
};

module.exports = session;

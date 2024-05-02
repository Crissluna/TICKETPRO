// Middleware para verificar el token y extraer la información del usuario
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Asumiendo el formato "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Failed to authenticate token" });
    }

    req.user = decoded; // Almacena la información del usuario decodificado en req.user
    next();
  });
};

module.exports = verifyToken;

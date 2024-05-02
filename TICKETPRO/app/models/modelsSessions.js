const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  expira: {
    type: Date,
    expires: 0, // Se configurará automáticamente con el valor 0 para que expire inmediatamente
  },
  email: String,
  token: String, // Nota: Token debería estar en minúsculas ("token")
});

module.exports = mongoose.model("Session", sessionSchema);

document.addEventListener("DOMContentLoaded", () => {
  const sections = ["A", "B", "C"];
  const selectedEventId = localStorage.getItem("selectedEventId"); // Obtener el eventId desde el localStorage

  sections.forEach((section) => {
    const grid = document.getElementById(`section${section}`);
    for (let i = 1; i <= 18; i++) {
      const seat = document.createElement("div");
      seat.classList.add("seat");
      seat.dataset.section = section;
      seat.dataset.quantity = 1; // Cambiar seatNumber por quantity y establecer el valor predeterminado en 1
      seat.textContent = i;
      grid.appendChild(seat);
    }
  });

  const seats = document.querySelectorAll(".seat");

  seats.forEach((seat) => {
    seat.addEventListener("click", () => {
      seat.classList.toggle("selected");
    });
  });

  const buyButton = document.getElementById("buyButton");
  buyButton.addEventListener("click", async () => {
    const selectedSeats = document.querySelectorAll(".seat.selected");

    const selectedSeatInfo = [];
    selectedSeats.forEach((seat) => {
      selectedSeatInfo.push({
        section: seat.dataset.section,
        quantity: parseInt(seat.dataset.quantity), // Convertir a entero
      });
    });

    // Aquí envía la información de los asientos seleccionados al backend
    const data = {
      eventId: selectedEventId,
      seats: selectedSeatInfo,
    };

    console.log(data); // Muestra los datos que se enviarán al backend
    // Realiza la solicitud fetch al backend con los datos
  });
});

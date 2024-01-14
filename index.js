const express = require('express');
const app = express();

const PORT = 8000

app.use(express.json());
 
// Create an array to store room data
let rooms = [{
    roomId:"R1",
    seats:"10",
    amenities:"TV,Ac",
    price:"100"
}];
// Create an array to store booking data
let bookings = [{
    customerName: "Vishwa",
    bookingDate:"03/01/2024",
    startTime: "12:00pm",
    endTime: "11:59am",
    roomId: "R1",
        
}
];
// Endpoint to create a room
app.post('/rooms', (req, res) => {
  const { seats, amenities, price } = req.body;

  // Generate a unique room ID
  const roomId = generateRoomId();

  // Create a new room object
  const room = {
         
  }

  // Add the room to the rooms array
  rooms.push(room);

  res.status(201).json({ message: 'Room created successfully', room });
});

// Endpoint to book a room
app.post('/bookings', (req, res) => {
  const {  customerName, date, startTime, endTime, roomId } = req.body;

  // Check if the room is available for the given date and time
  const isRoomAvailable = checkRoomAvailability( customerName,date, startTime, endTime, roomId);

  if (!isRoomAvailable) {
    return res.status(400).json({ message: 'Room is already booked for the given date and time' });
  }

  // Generate a unique booking ID
  const bookingId = generateBookingId();

  // Create a new booking object
  const booking = {
  
  };

  // Add the booking to the bookings array
  bookings.push(booking);

  res.status(201).json({ message: 'Room booked successfully', booking });
});

// Endpoint to list all rooms with booking details
app.get('/', (req, res) => {
  const roomBookings = [];

  // Iterate over each room
  for (const room of rooms) {
    const roomBooking = {
      roomName: room.name,
      bookings: []
    };

    // Iterate over each booking
    for (const booking of bookings) {
      if (booking.roomId === room.id) {
        roomBooking.bookings.push({
          bookingStatus: booking.status,
          customerName: booking.customerName,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime
        });
      }
    }

    roomBookings.push(roomBooking);
  }

  res.status(200).json(roomBookings);
});

// Endpoint to list all customers with their booked data
app.get('/customers/bookings', (req, res) => {
  const customerBookings = [];

  // Iterate over each booking
  for (const booking of bookings) {
    const customerBooking = {
      customerName: booking.customerName,
      bookings: []
    };

    // Iterate over each room
    for (const room of rooms) {
      if (booking.roomId === room.id) {
        customerBooking.bookings.push({
          roomName: room.name,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime
        });
      }
    }

    customerBookings.push(customerBooking);
  }

  res.status(200).json(customerBookings);
});

// Endpoint to list the number of times a customer has booked a room
app.get('/customers/:customerId/bookings', (req, res) => {
  const customerId = req.params.customerId;
  const customerBookings = [];

  // Iterate over each booking
  for (const booking of bookings) {
    if (booking.customerId === customerId) {
      const room = rooms.find(room => room.id === booking.roomId);

      customerBookings.push({
        customerName: booking.customerName,
        roomName: room.name,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        bookingId: booking.id,
        bookingDate: booking.bookingDate,
        bookingStatus: booking.status
      });
    }
  }

  res.status(200).json(customerBookings);
});

// Helper function to generate a unique room ID
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8);
}

// Helper function to generate a unique booking ID
function generateBookingId() {
  return Math.random().toString(36).substring(2, 8);
}

// Helper function to check if a room is available for booking
function checkRoomAvailability(date, startTime, endTime, roomId) {
  for (const booking of bookings) {
    if (booking.roomId === roomId && booking.date === date) {
      if (
        (startTime >= booking.startTime && startTime < booking.endTime) ||
        (endTime > booking.startTime && endTime <= booking.endTime) ||
        (startTime <= booking.startTime && endTime >= booking.endTime)
      ) {
        return false;
      }
    }
  }

  return true;
}
app.listen(PORT,()=>console.log(`App Listening ${PORT}`))

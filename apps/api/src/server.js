import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const buildings = [
  {
    id: 1,
    name: "بناية سما صلالة",
    location: "صلالة - عوقد الشمالية",
    units: 4,
  },
];

const units = [
  {
    id: 1,
    buildingId: 1,
    title: "شقة فاخرة - غرفة وصالة",
    description: "شقة جديدة ومناسبة للعائلات، قريبة من الخدمات.",
    dailyPrice: 25,
    monthlyPrice: 350,
    yearlyPrice: 3600,
    status: "available",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  },
  {
    id: 2,
    buildingId: 1,
    title: "شقة فاخرة - غرفتين وصالة",
    description: "مناسبة للعائلات، مكيفات مركزية، ومواقف سيارات.",
    dailyPrice: 35,
    monthlyPrice: 450,
    yearlyPrice: 4800,
    status: "available",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
  {
    id: 3,
    buildingId: 1,
    title: "غرفة فندقية فاخرة",
    description: "غرفة جديدة ونظيفة مع تلفزيون سمارت وخدمات تحت المبنى.",
    dailyPrice: 18,
    monthlyPrice: 280,
    yearlyPrice: 3000,
    status: "booked",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  },
];

function calculateNights(checkIn, checkOut) {
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  const millisecondsPerNight = 1000 * 60 * 60 * 24;
  const nights = Math.ceil((endDate - startDate) / millisecondsPerNight);

  return nights;
}

app.get("/", (req, res) => {
  res.json({
    app: "Sama Salalah API",
    status: "running",
    message: "Welcome to Sama_Salalah backend",
    url: "http://localhost:4000",
  });
});

app.get("/buildings", (req, res) => {
  res.json(buildings);
});

app.get("/units", (req, res) => {
  res.json(units);
});

app.get("/units/:id", (req, res) => {
  const unitId = Number(req.params.id);
  const unit = units.find((item) => item.id === unitId);

  if (!unit) {
    return res.status(404).json({
      message: "Unit not found",
    });
  }

  res.json(unit);
});

app.post("/bookings", (req, res) => {
  const { unitId, customerName, phone, checkIn, checkOut } = req.body;

  if (!unitId || !customerName || !phone || !checkIn || !checkOut) {
    return res.status(400).json({
      message: "Missing booking information",
    });
  }

  const unit = units.find((item) => item.id === Number(unitId));

  if (!unit) {
    return res.status(404).json({
      message: "Unit not found",
    });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
    return res.status(400).json({
      message: "Invalid check-in or check-out date",
    });
  }

  const nights = calculateNights(checkIn, checkOut);

  if (nights <= 0) {
    return res.status(400).json({
      message: "Check-out date must be after check-in date",
    });
  }

  const month = checkInDate.getMonth() + 1;
  const isKhareefRestricted = month === 7 || month === 8;
  const pricePerNight = unit.dailyPrice;
  const totalPrice = nights * pricePerNight;

  res.status(201).json({
    message: "Booking created successfully",
    booking: {
      id: Date.now(),
      unitId: unit.id,
      unitTitle: unit.title,
      customerName,
      phone,
      checkIn,
      checkOut,
      nights,
      pricePerNight,
      totalPrice,
      currency: "OMR",
      canCustomerCancel: !isKhareefRestricted,
      canCustomerExtend: !isKhareefRestricted,
      whatsappMessage: `مرحباً ${customerName}، تم استلام حجزك في سما صلالة من ${checkIn} إلى ${checkOut}. عدد الليالي: ${nights}. الإجمالي: ${totalPrice} ريال عماني.`,
    },
  });
});

const port = 4000;

app.listen(port, () => {
  console.log(`Sama Salalah API running on http://localhost:${port}`);
});
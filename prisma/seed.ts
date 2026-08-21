import { PrismaClient } from "@prisma/client"
import type { CarCondition, CarStatus, FuelType, TransmissionType, CarBodyType } from "@prisma/client"

const prisma = new PrismaClient()

// Real Unsplash car images and short video sources
const media = {
  supras: {
    cover: "https://images.unsplash.com/photo-1625231334401-ff1542dc7e74?w=800",
    images: [
      "https://images.unsplash.com/photo-1625231334401-ff1542dc7e74?w=1200",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1200",
      "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=1200",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
    ],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1625231334401-ff1542dc7e74?w=400",
  },
  bmw: {
    cover: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200",
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=1200",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200",
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=1200",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200",
    ],
    video: "https://www.w3schools.com/html/movie.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400",
  },
  tesla: {
    cover: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
    images: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200",
      "https://images.unsplash.com/photo-1619317588810-42e1e1be4f32?w=1200",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200",
      "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=1200",
      "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=1200",
      "https://images.unsplash.com/photo-1562618817-6674a7e0a7a0?w=1200",
    ],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400",
  },
  mercedes: {
    cover: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200",
    ],
    video: "https://www.w3schools.com/html/movie.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400",
  },
  civic: {
    cover: "https://images.unsplash.com/photo-1606611013016-969c19ba27c9?w=800",
    images: [
      "https://images.unsplash.com/photo-1606611013016-969c19ba27c9?w=1200",
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=1200",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200",
    ],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1606611013016-969c19ba27c9?w=400",
  },
  innova: {
    cover: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800",
    images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=1200",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200",
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=1200",
    ],
    video: "https://www.w3schools.com/html/movie.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=400",
  },
  fortuner: {
    cover: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
    images: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200",
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=1200",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200",
    ],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400",
  },
  jimny: {
    cover: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800",
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=1200",
    ],
    video: "https://www.w3schools.com/html/movie.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400",
  },
  ioniq: {
    cover: "https://images.unsplash.com/photo-1619317588810-42e1e1be4f32?w=800",
    images: [
      "https://images.unsplash.com/photo-1619317588810-42e1e1be4f32?w=1200",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200",
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200",
      "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=1200",
      "https://images.unsplash.com/photo-1562618817-6674a7e0a7a0?w=1200",
      "https://images.unsplash.com/photo-1562618817-6674a7e0a7a0?w=1200",
    ],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1619317588810-42e1e1be4f32?w=400",
  },
  xenia: {
    cover: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=1200",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=1200",
    ],
    video: "https://www.w3schools.com/html/movie.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400",
  },
  livina: {
    cover: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800",
    images: [
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=1200",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=1200",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
    ],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=400",
  },
  xpander: {
    cover: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=1200",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200",
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=1200",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
    ],
    video: "https://www.w3schools.com/html/movie.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400",
  },
}

const carCategories = [
  { name: "Sedan", slug: "sedan", description: "Comfortable 4-door cars", icon: "car", sortOrder: 1 },
  { name: "SUV", slug: "suv", description: "Spacious family vehicles", icon: "car", sortOrder: 2 },
  { name: "Coupe", slug: "coupe", description: "Sporty 2-door cars", icon: "car", sortOrder: 3 },
  { name: "Hatchback", slug: "hatchback", description: "Compact city cars", icon: "car", sortOrder: 4 },
  { name: "Electric", slug: "electric", description: "Zero-emission EVs", icon: "zap", sortOrder: 5 },
  { name: "Hybrid", slug: "hybrid", description: "Fuel-efficient hybrids", icon: "fuel", sortOrder: 6 },
  { name: "MINIVAN", slug: "mpv", description: "Multi-purpose vehicles", icon: "car", sortOrder: 8 },
]

const sampleCars = [
  {
    title: "2024 Toyota GR Supra 3.0", slug: "2024-toyota-gr-supra-30",
    description: "The legendary Toyota GR Supra returns with stunning design and thrilling performance. BMW-sourced 3.0L turbocharged inline-6, 382 HP, 8-speed automatic. Premium features: head-up display, JBL audio, Toyota Safety Sense.",
    make: "Toyota", model: "GR Supra", year: 2024, condition: "NEW" as CarCondition,
    bodyType: "COUPE" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "3.0L Turbocharged Inline-6", horsepower: 382, torque: "500 Nm", drivetrain: "RWD",
    numDoors: 2, numSeats: 2, topSpeed: 250, acceleration: "0-100 km/h in 4.1s",
    price: 1250000000, negotiable: true, installmentFrom: 25000000, downPayment: 250000000,
    exteriorColor: "Prominence Red", interiorColor: "Black Leather", colorCode: "#DC2626",
    features: ["Head-Up Display", "JBL Premium Audio", "Toyota Safety Sense", "Adaptive Cruise Control", "Blind Spot Monitor", "Apple CarPlay", "Wireless Charging", "Heated Seats"],
    city: "Jakarta", province: "DKI Jakarta", sellerType: "dealer", dealerName: "AutoCar Premium",
    dealerWhatsapp: "6281234567890", dealerPhone: "+62 812-3456-7890", dealerEmail: "sales@autocar-premium.com",
    views: 1247, isFeatured: true, media: media.supras,
  },
  {
    title: "2024 BMW M4 Competition", slug: "2024-bmw-m4-competition",
    description: "The BMW M4 Competition delivers breathtaking performance with twin-turbo inline-6 producing 503 HP. M xDrive AWD, adaptive M suspension, carbon fiber trim.",
    make: "BMW", model: "M4 Competition", year: 2024, condition: "NEW" as CarCondition,
    bodyType: "COUPE" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "3.0L Twin-Turbo Inline-6", horsepower: 503, torque: "650 Nm", drivetrain: "AWD",
    numDoors: 2, numSeats: 4, topSpeed: 290, acceleration: "0-100 km/h in 3.4s",
    price: 2100000000, negotiable: false, installmentFrom: 42000000, downPayment: 420000000,
    exteriorColor: "Isle of Man Green", interiorColor: "Black Merino Leather", colorCode: "#166534",
    features: ["M Sport", "Carbon Fiber Trim", "Adaptive Suspension", "Harman Kardon", "Head-Up Display", "Gesture Control"],
    city: "Surabaya", province: "Jawa Timur", sellerType: "dealer", dealerName: "BMW AutoCenter",
    dealerWhatsapp: "6281234567891", dealerPhone: "+62 812-3456-7891", dealerEmail: "info@bmw-surabaya.com",
    views: 892, isFeatured: true, media: media.bmw,
  },
  {
    title: "2023 Tesla Model 3 Long Range", slug: "2023-tesla-model-3-long-range",
    description: "Tesla Model 3 Long Range with Autopilot, 358-mile range, premium interior with 15\" touchscreen, glass roof, and over-the-air updates.",
    make: "Tesla", model: "Model 3", year: 2023, condition: "USED" as CarCondition,
    bodyType: "SEDAN" as CarBodyType, fuelType: "ELECTRIC" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "Dual Motor Electric", horsepower: 450, torque: "527 Nm", drivetrain: "AWD",
    numDoors: 4, numSeats: 5, topSpeed: 261, acceleration: "0-100 km/h in 4.4s",
    mileage: 15000, previousOwners: 1,
    price: 650000000, negotiable: true, installmentFrom: 13000000, downPayment: 130000000,
    exteriorColor: "Pearl White", interiorColor: "Black", colorCode: "#FFFFFF",
    features: ["Autopilot", "Full Self-Driving", "Premium Interior", "Glass Roof", "15\" Touchscreen", "Premium Audio"],
    city: "Bandung", province: "Jawa Barat", sellerType: "dealer", dealerName: "EV Indonesia",
    dealerWhatsapp: "6281234567892", dealerPhone: "+62 812-3456-7892", dealerEmail: "hello@ev-indonesia.com",
    views: 2341, isFeatured: true, media: media.tesla,
  },
  {
    title: "2024 Mercedes-AMG GT 63", slug: "2024-mercedes-amg-gt-63",
    description: "The ultimate grand tourer with handcrafted 4.0L V8 biturbo, 577 HP. AMG Performance 4MATIC+, Burmester 3D sound, AIR BODY CONTROL.",
    make: "Mercedes-Benz", model: "AMG GT 63", year: 2024, condition: "NEW" as CarCondition,
    bodyType: "COUPE" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "4.0L V8 Biturbo", horsepower: 577, torque: "800 Nm", drivetrain: "AWD",
    numDoors: 2, numSeats: 4, topSpeed: 315, acceleration: "0-100 km/h in 3.2s",
    price: 3500000000, negotiable: false,
    exteriorColor: "Obsidian Black", interiorColor: "Nappa Leather", colorCode: "#000000",
    features: ["AMG Performance", "Burmester 3D Sound", "AIR BODY CONTROL", "Head-Up Display", "Ambient Lighting", "Massage Seats"],
    city: "Jakarta", province: "DKI Jakarta", sellerType: "dealer", dealerName: "Mercedes-Benz Jakarta",
    dealerWhatsapp: "6281234567893", dealerPhone: "+62 812-3456-7893", dealerEmail: "sales@mercedes-jakarta.com",
    views: 2103, isFeatured: true, media: media.mercedes,
  },
  {
    title: "2023 Honda Civic RS", slug: "2023-honda-civic-rs",
    description: "Sporty Honda Civic RS with Honda Sensing suite, 1.5L turbo engine, sunroof, and premium Bose audio system.",
    make: "Honda", model: "Civic RS", year: 2023, condition: "USED" as CarCondition,
    bodyType: "SEDAN" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "CVT" as TransmissionType,
    engine: "1.5L Turbocharged", horsepower: 178, torque: "240 Nm", drivetrain: "FWD",
    numDoors: 4, numSeats: 5, topSpeed: 200, acceleration: "0-100 km/h in 8.5s",
    mileage: 25000, previousOwners: 1,
    price: 380000000, negotiable: true, installmentFrom: 8000000, downPayment: 80000000,
    exteriorColor: "Rallye Red", interiorColor: "Black Fabric", colorCode: "#DC2626",
    features: ["Honda Sensing", "Sunroof", "Bose Audio", "Wireless Charging", "LED Headlights", "Rear Camera"],
    city: "Yogyakarta", province: "DI Yogyakarta", sellerType: "dealer", dealerName: "Honda Istana",
    dealerWhatsapp: "6281234567894", dealerPhone: "+62 812-3456-7894", dealerEmail: "sales@honda-istana.com",
    views: 1567, isFeatured: false, media: media.civic,
  },
  {
    title: "2024 Toyota Innova Zenix Hybrid", slug: "2024-toyota-innova-zenix",
    description: "The all-new Innova Zenix Hybrid with Toyota Safety Sense, hybrid powertrain for excellent fuel economy, and premium interior.",
    make: "Toyota", model: "Innova Zenix", year: 2024, condition: "NEW" as CarCondition,
    bodyType: "MINIVAN" as CarBodyType, fuelType: "HYBRID" as FuelType, transmission: "CVT" as TransmissionType,
    engine: "2.0L Hybrid", horsepower: 186, torque: "202 Nm", drivetrain: "FWD",
    numDoors: 5, numSeats: 7, topSpeed: 180, acceleration: "0-100 km/h in 9.5s",
    price: 520000000, negotiable: true, installmentFrom: 10000000, downPayment: 100000000,
    exteriorColor: "Platinum White Pearl", interiorColor: "Black Leather", colorCode: "#F5F5F5",
    features: ["Hybrid", "Toyota Safety Sense", "Panoramic Roof", "Power Tailgate", "9\" Touchscreen", "JBL Audio"],
    city: "Semarang", province: "Jawa Tengah", sellerType: "dealer", dealerName: "Auto2000",
    dealerWhatsapp: "6281234567895", dealerPhone: "+62 812-3456-7895", dealerEmail: "info@auto2000.com",
    views: 980, isFeatured: true, media: media.innova,
  },
  {
    title: "2022 Toyota Fortuner VRZ", slug: "2022-toyota-fortuner-vrz",
    description: "Toyota Fortuner VRZ with 2.8L diesel engine, 4WD, Toyota Safety Sense, and premium JBL audio system.",
    make: "Toyota", model: "Fortuner VRZ", year: 2022, condition: "USED" as CarCondition,
    bodyType: "SUV" as CarBodyType, fuelType: "DIESEL" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "2.8L Diesel Turbo", horsepower: 204, torque: "500 Nm", drivetrain: "4WD",
    numDoors: 5, numSeats: 7, topSpeed: 190, acceleration: "0-100 km/h in 10.2s",
    mileage: 35000, previousOwners: 1,
    price: 520000000, negotiable: true, installmentFrom: 10000000, downPayment: 100000000,
    exteriorColor: "Attitude Black", interiorColor: "Black Leather", colorCode: "#1A1A1A",
    features: ["4WD", "Toyota Safety Sense", "JBL Audio", "Power Tailgate", "Cruise Control", "Rear Camera"],
    city: "Jakarta", province: "DKI Jakarta", sellerType: "individual", dealerName: "Budi Santoso",
    dealerWhatsapp: "6281234567896", dealerPhone: "+62 812-3456-7896",
    views: 1823, isFeatured: false, media: media.fortuner,
  },
  {
    title: "2023 Suzuki Jimny Sierra", slug: "2023-suzuki-jimny-sierra",
    description: "The iconic Suzuki Jimny Sierra with real 4WD capability, compact size, and rugged design perfect for adventure.",
    make: "Suzuki", model: "Jimny Sierra", year: 2023, condition: "USED" as CarCondition,
    bodyType: "SUV" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "1.5L K15B", horsepower: 102, torque: "130 Nm", drivetrain: "4WD",
    numDoors: 3, numSeats: 4, topSpeed: 145, acceleration: "0-100 km/h in 14.5s",
    mileage: 12000, previousOwners: 1,
    price: 350000000, negotiable: false,
    exteriorColor: "Kinetic Yellow", interiorColor: "Black Fabric", colorCode: "#FFD700",
    features: ["4WD", "AllGrip Pro", "Hill Hold", "Rear Camera", "Bluetooth", "Cruise Control"],
    city: "Bandung", province: "Jawa Barat", sellerType: "dealer", dealerName: "Suzuki Dipo",
    dealerWhatsapp: "6281234567897", dealerPhone: "+62 812-3456-7897", dealerEmail: "sales@suzuki-dipo.com",
    views: 2890, isFeatured: true, media: media.jimny,
  },
  {
    title: "2024 Hyundai Ioniq 5", slug: "2024-hyundai-ioniq-5",
    description: "Revolutionary Hyundai Ioniq 5 with ultra-fast charging, 481km range, V2L capability, and futuristic design.",
    make: "Hyundai", model: "Ioniq 5", year: 2024, condition: "NEW" as CarCondition,
    bodyType: "SUV" as CarBodyType, fuelType: "ELECTRIC" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "Electric Motor", horsepower: 325, torque: "605 Nm", drivetrain: "AWD",
    numDoors: 5, numSeats: 5, topSpeed: 185, acceleration: "0-100 km/h in 5.2s",
    price: 750000000, negotiable: false, installmentFrom: 15000000, downPayment: 150000000,
    exteriorColor: "Titan Gray", interiorColor: "Dark Green", colorCode: "#808080",
    features: ["Fast Charging", "V2L", "Range 481km", "Highway Driving Assist", "Blind Spot View", "Remote Parking"],
    city: "Jakarta", province: "DKI Jakarta", sellerType: "dealer", dealerName: "Hyundai Motors Indonesia",
    dealerWhatsapp: "6281234567898", dealerPhone: "+62 812-3456-7898", dealerEmail: "info@hyundai-motor.co.id",
    views: 3210, isFeatured: true, media: media.ioniq,
  },
  {
    title: "2022 Daihatsu Xenia", slug: "2022-daihatsu-xenia",
    description: "Affordable and reliable Daihatsu Xenia, perfect family MPV with excellent fuel economy.",
    make: "Daihatsu", model: "Xenia", year: 2022, condition: "USED" as CarCondition,
    bodyType: "MINIVAN" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "MANUAL" as TransmissionType,
    engine: "1.5L Dual VVT-i", horsepower: 106, torque: "137 Nm", drivetrain: "FWD",
    numDoors: 5, numSeats: 7, topSpeed: 170, acceleration: "0-100 km/h in 13.5s",
    mileage: 20000, previousOwners: 1,
    price: 180000000, negotiable: true,
    exteriorColor: "Silver Metallic", interiorColor: "Black Fabric", colorCode: "#C0C0C0",
    features: ["Rear Camera", "Bluetooth", "USB Charging", "Power Windows", "Central Locking"],
    city: "Surabaya", province: "Jawa Timur", sellerType: "individual", dealerName: "Ahmad Fauzi",
    dealerWhatsapp: "6281234567899", dealerPhone: "+62 812-3456-7899",
    views: 567, isFeatured: false, media: media.xenia,
  },
  {
    title: "2023 Nissan Livina", slug: "2023-nissan-livina",
    description: "Nissan Livina with advanced safety features, comfortable ride, and modern design for the whole family.",
    make: "Nissan", model: "Livina", year: 2023, condition: "USED" as CarCondition,
    bodyType: "MINIVAN" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "1.5L HR15DE", horsepower: 104, torque: "141 Nm", drivetrain: "FWD",
    numDoors: 5, numSeats: 7, topSpeed: 175, acceleration: "0-100 km/h in 12.8s",
    mileage: 15000, previousOwners: 1,
    price: 220000000, negotiable: true,
    exteriorColor: "Bronze", interiorColor: "Black Fabric", colorCode: "#CD7F32",
    features: ["Around View Monitor", "Intelligent Cruise Control", "Bluetooth", "Rear Camera", "Keyless Entry"],
    city: "Jakarta", province: "DKI Jakarta", sellerType: "dealer", dealerName: "Nissan Jakarta",
    dealerWhatsapp: "6281234567800", dealerPhone: "+62 812-3456-7800", dealerEmail: "sales@nissan-jakarta.com",
    views: 890, isFeatured: false, media: media.livina,
  },
  {
    title: "2024 Mitsubishi Xpander", slug: "2024-mitsubishi-xpander",
    description: "Updated Mitsubishi Xpander with Dynamic Shield design, improved ride comfort, and advanced safety features.",
    make: "Mitsubishi", model: "Xpander", year: 2024, condition: "NEW" as CarCondition,
    bodyType: "MINIVAN" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "CVT" as TransmissionType,
    engine: "1.5L MIVEC", horsepower: 105, torque: "141 Nm", drivetrain: "FWD",
    numDoors: 5, numSeats: 7, topSpeed: 175,
    price: 280000000, negotiable: true, installmentFrom: 6000000, downPayment: 60000000,
    exteriorColor: "Quartz White Pearl", interiorColor: "Black Fabric", colorCode: "#FFFFFF",
    features: ["CVT", "Rear Camera", "Hill Start Assist", "Bluetooth", "USB Charging", "Keyless Entry"],
    city: "Semarang", province: "Jawa Tengah", sellerType: "dealer", dealerName: "Mitsubishi Semarang",
    dealerWhatsapp: "6281234567801", dealerPhone: "+62 812-3456-7801", dealerEmail: "info@mitsubishi-semarang.com",
    views: 756, isFeatured: false, media: media.xpander,
  },
]

async function main() {
  console.log("🚗 Seeding AutoCar database...\n")

  // Create categories
  console.log("📁 Creating categories...")
  for (const cat of carCategories) {
    await prisma.carCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    })
  }
  console.log(`   ✅ ${carCategories.length} categories created`)

  // Create cars with images and videos
  console.log("\n🚙 Creating car listings with images and videos...")
  for (const car of sampleCars) {
    const { media: carMedia, ...carData } = car

    const existing = await prisma.car.findUnique({ where: { slug: car.slug } })
    if (existing) {
      console.log(`   ⏭️  ${car.title} already exists, skipping...`)
      continue
    }

    const created = await prisma.car.create({
      data: {
        ...carData,
        status: "AVAILABLE",
        currency: "IDR",
        coverImage: carMedia.cover,
        videoUrl: carMedia.video,
        videoThumbnail: carMedia.videoThumbnail,
        images: {
          create: carMedia.images.map((url, i) => ({
            url,
            alt: `${car.title} photo ${i + 1}`,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        },
        videos: {
          create: {
            url: carMedia.video,
            thumbnailUrl: carMedia.videoThumbnail,
            title: `${car.title} video tour`,
            isPrimary: true,
          },
        },
      },
      include: { images: true, videos: true },
    })

    console.log(`   ✅ ${created.title} (${created.images.length} images, ${created.videos.length} videos)`)
  }

  // Count totals
  const totalCars = await prisma.car.count()
  const totalImages = await prisma.carImage.count()
  const totalVideos = await prisma.carVideo.count()

  console.log("\n📊 Seed Summary:")
  console.log(`   Cars: ${totalCars}`)
  console.log(`   Images: ${totalImages}`)
  console.log(`   Videos: ${totalVideos}`)
  console.log("\n✅ Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

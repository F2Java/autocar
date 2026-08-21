import { PrismaClient } from "@prisma/client"
import type { CarCondition, CarStatus, FuelType, TransmissionType, CarBodyType } from "@prisma/client"

const prisma = new PrismaClient()

// ─── Sample Data ─────────────────────────────────────────────────────────────

const carCategories = [
  { name: "Sedan", slug: "sedan", description: "Comfortable 4-door cars for everyday driving", icon: "car", sortOrder: 1 },
  { name: "SUV", slug: "suv", description: "Spacious vehicles for family and adventure", icon: "car", sortOrder: 2 },
  { name: "Coupe", slug: "coupe", description: "Sporty 2-door performance cars", icon: "car", sortOrder: 3 },
  { name: "Hatchback", slug: "hatchback", description: "Compact and fuel-efficient city cars", icon: "car", sortOrder: 4 },
  { name: "Electric", slug: "electric", description: "Zero-emission electric vehicles", icon: "zap", sortOrder: 5 },
  { name: "Hybrid", slug: "hybrid", description: "Fuel-efficient hybrid powertrains", icon: "fuel", sortOrder: 6 },
  { name: "Pickup Truck", slug: "pickup-truck", description: "Rugged trucks for work and play", icon: "truck", sortOrder: 7 },
  { name: "MPV", slug: "mpv", description: "Multi-purpose vehicles for families", icon: "car", sortOrder: 8 },
]

const sampleCars = [
  // ─── NEW CARS ─────────────────────────────────────────────────────────────
  {
    title: "2024 Toyota GR Supra 3.0",
    description: "The legendary Toyota GR Supra returns with a stunning design and thrilling performance. This brand-new 2024 model features a BMW-sourced 3.0L turbocharged inline-6 engine producing 382 horsepower, paired with an 8-speed automatic transmission. The car comes fully loaded with premium features including a head-up display, JBL premium audio, and Toyota Safety Sense suite.",
    make: "Toyota", model: "GR Supra", year: 2024, condition: "NEW" as CarCondition,
    bodyType: "COUPE" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "3.0L Turbocharged Inline-6", horsepower: 382, torque: "500 Nm", drivetrain: "RWD",
    numDoors: 2, numSeats: 2, topSpeed: 250, acceleration: "0-100 km/h in 4.1s", fuelConsumption: "8.4 L/100km",
    price: 1250000000, negotiable: true, installmentFrom: 25000000, downPayment: 250000000,
    exteriorColor: "Prominence Red", interiorColor: "Black Leather", colorCode: "#DC2626",
    features: ["Head-Up Display", "JBL Premium Audio", "Toyota Safety Sense", "Adaptive Cruise Control", "Blind Spot Monitor", "Apple CarPlay", "Android Auto", "Wireless Charging", "Heated Seats"],
    safetyFeatures: ["8 Airbags", "ABS + EBD", "Vehicle Stability Control", "Pre-Collision System"],
    city: "Jakarta", province: "DKI Jakarta", sellerType: "dealer", dealerName: "AutoCar Premium Showroom",
    dealerWhatsapp: "6281234567890", dealerPhone: "+62 812-3456-7890", dealerEmail: "sales@autocar-premium.com",
    coverImage: "https://images.unsplash.com/photo-1625231334401-ff1542dc7e74?w=800",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    views: 1247, isFeatured: true, slug: "2024-toyota-gr-supra-30",
  },
  {
    title: "2024 BMW M4 Competition",
    description: "The BMW M4 Competition delivers breathtaking performance with its twin-turbocharged inline-6 engine producing 503 horsepower. Features M xDrive all-wheel drive, adaptive M suspension, and a luxurious cabin with carbon fiber trim.",
    make: "BMW", model: "M4 Competition", year: 2024, condition: "NEW" as CarCondition,
    bodyType: "COUPE" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "3.0L Twin-Turbo Inline-6", horsepower: 503, torque: "650 Nm", drivetrain: "AWD",
    numDoors: 2, numSeats: 4, topSpeed: 290, acceleration: "0-100 km/h in 3.4s", fuelConsumption: "9.1 L/100km",
    price: 2100000000, negotiable: false, installmentFrom: 42000000, downPayment: 420000000,
    exteriorColor: "Isle of Man Green", interiorColor: "Black Merino Leather", colorCode: "#166534",
    features: ["M Sport", "Carbon Fiber Trim", "Adaptive Suspension", "Harman Kardon", "Head-Up Display", "Gesture Control"],
    city: "Surabaya", province: "Jawa Timur", sellerType: "dealer", dealerName: "BMW AutoCenter Surabaya",
    dealerWhatsapp: "6281234567891", dealerPhone: "+62 812-3456-7891", dealerEmail: "info@bmw-surabaya.com",
    coverImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
    views: 892, isFeatured: true, slug: "2024-bmw-m4-competition",
  },
  {
    title: "2024 Mercedes-AMG GT 63",
    description: "The Mercedes-AMG GT 63 is the ultimate grand tourer with a handcrafted 4.0L V8 biturbo engine producing 577 horsepower. Features AMG Performance 4MATIC+, Burmester 3D surround sound, and AIR BODY CONTROL air suspension.",
    make: "Mercedes-Benz", model: "AMG GT 63", year: 2024, condition: "NEW" as CarCondition,
    bodyType: "COUPE" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "4.0L V8 Biturbo", horsepower: 577, torque: "800 Nm", drivetrain: "AWD",
    numDoors: 2, numSeats: 4, topSpeed: 315, acceleration: "0-100 km/h in 3.2s", fuelConsumption: "11.4 L/100km",
    price: 3500000000, negotiable: false,
    exteriorColor: "Obsidian Black", interiorColor: "Nappa Leather", colorCode: "#0F172A",
    features: ["AMG Performance", "Burmester 3D Sound", "AIR BODY CONTROL", "AMG Track Pace", "Head-Up Display", "Night Vision"],
    city: "Jakarta", province: "DKI Jakarta", sellerType: "dealer", dealerName: "Mercedes-Benz Indonesia",
    dealerWhatsapp: "6281234567893", dealerPhone: "+62 812-3456-7893", dealerEmail: "sales@mercedes-benz.co.id",
    coverImage: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
    views: 2103, isFeatured: true, slug: "2024-mercedes-amg-gt-63",
  },
  {
    title: "2024 Toyota Kijang Innova Zenix Hybrid",
    description: "The all-new Toyota Kijang Innova Zenix brings a revolutionary crossover design with hybrid powertrain technology. Features Toyota Safety Sense, captain seats, and a premium interior for the whole family.",
    make: "Toyota", model: "Innova Zenix", year: 2024, condition: "NEW" as CarCondition,
    bodyType: "MPV" as CarBodyType, fuelType: "HYBRID" as FuelType, transmission: "CVT" as TransmissionType,
    engine: "2.0L Hybrid", horsepower: 186, torque: "206 Nm", drivetrain: "FWD",
    numDoors: 5, numSeats: 7, fuelConsumption: "5.2 L/100km",
    price: 520000000, negotiable: true, installmentFrom: 10400000, downPayment: 104000000,
    exteriorColor: "Attitude Black", interiorColor: "Black", colorCode: "#1E293B",
    features: ["Hybrid", "Toyota Safety Sense", "Captain Seat", "Panoramic Roof", "Digital Rear Mirror", "Wireless Charging"],
    city: "Semarang", province: "Jawa Tengah", sellerType: "dealer", dealerName: "Auto2000 Semarang",
    dealerWhatsapp: "6281234567895", dealerPhone: "+62 812-3456-7895", dealerEmail: "info@auto2000.co.id",
    coverImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800",
    views: 1890, slug: "2024-toyota-innova-zenix-hybrid",
  },
  {
    title: "2024 Honda Civic RS",
    description: "The 2024 Honda Civic RS combines sporty design with practical efficiency. Features Honda Sensing suite, turbocharged engine, and a refined interior with premium materials.",
    make: "Honda", model: "Civic RS", year: 2024, condition: "NEW" as CarCondition,
    bodyType: "SEDAN" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "CVT" as TransmissionType,
    engine: "1.5L Turbocharged", horsepower: 178, torque: "240 Nm", drivetrain: "FWD",
    numDoors: 4, numSeats: 5, fuelConsumption: "5.8 L/100km",
    price: 580000000, negotiable: true, installmentFrom: 11600000, downPayment: 116000000,
    exteriorColor: "Rallye Red", interiorColor: "Black Red Stitch", colorCode: "#DC2626",
    features: ["Honda Sensing", "Bose Premium Audio", "Wireless Charging", "Sunroof", "LED Headlights", "Paddle Shifters"],
    city: "Yogyakarta", province: "DI Yogyakarta", sellerType: "dealer", dealerName: "Honda Istana Yogya",
    dealerWhatsapp: "6281234567894", dealerPhone: "+62 812-3456-7894", dealerEmail: "sales@honda-istana.com",
    coverImage: "https://images.unsplash.com/photo-1606611013016-969c19ba27c9?w=800",
    views: 1567, slug: "2024-honda-civic-rs",
  },

  // ─── USED CARS ────────────────────────────────────────────────────────────
  {
    title: "2023 Tesla Model 3 Long Range",
    description: "A pristine 2023 Tesla Model 3 Long Range with Autopilot and Full Self-Driving capability. Low mileage, one owner, garage-kept. Features premium interior, 15-inch touchscreen, and over-the-air updates.",
    make: "Tesla", model: "Model 3", year: 2023, condition: "USED" as CarCondition,
    bodyType: "SEDAN" as CarBodyType, fuelType: "ELECTRIC" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "Dual Motor Electric", horsepower: 450, drivetrain: "AWD",
    numDoors: 4, numSeats: 5, range: 567, acceleration: "0-100 km/h in 4.4s",
    mileage: 15000, previousOwners: 1,
    price: 650000000, negotiable: true, installmentFrom: 13000000, downPayment: 130000000,
    exteriorColor: "Pearl White", interiorColor: "Black", colorCode: "#FFFFFF",
    features: ["Autopilot", "Full Self-Driving", "Premium Interior", "15-inch Touchscreen", "Glass Roof", "Over-the-Air Updates"],
    city: "Bandung", province: "Jawa Barat", sellerType: "dealer", dealerName: "EV Indonesia Bandung",
    dealerWhatsapp: "6281234567892", dealerPhone: "+62 812-3456-7892", dealerEmail: "info@ev-indonesia.com",
    coverImage: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    views: 2341, isFeatured: true, slug: "2023-tesla-model-3-long-range",
  },
  {
    title: "2022 Toyota Fortuner VRZ",
    description: "A well-maintained 2022 Toyota Fortuner VRZ with low mileage. One owner, full service history at authorized dealer. Perfect family SUV with powerful diesel engine.",
    make: "Toyota", model: "Fortuner VRZ", year: 2022, condition: "USED" as CarCondition,
    bodyType: "SUV" as CarBodyType, fuelType: "DIESEL" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "2.4L Turbocharged Diesel", horsepower: 204, torque: "500 Nm", drivetrain: "4WD",
    numDoors: 5, numSeats: 7, fuelConsumption: "7.8 L/100km",
    mileage: 25000, previousOwners: 1, serviceHistory: "Full service at Toyota dealer",
    price: 520000000, negotiable: true, installmentFrom: 10400000,
    exteriorColor: "Phantom Brown", interiorColor: "Black", colorCode: "#92400E",
    features: ["Toyota Safety Sense", "JBL Audio", "Power Tailgate", "360 Camera", "Cruise Control", "Paddle Shifters"],
    city: "Jakarta", province: "DKI Jakarta", sellerType: "individual",
    dealerWhatsapp: "6281234567896", dealerPhone: "+62 812-3456-7896", dealerEmail: "seller@email.com",
    coverImage: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
    views: 1823, slug: "2022-toyota-fortuner-vrz",
  },
  {
    title: "2021 Honda HR-V RS",
    description: "Sporty 2021 Honda HR-V RS with Honda Sensing technology. Well-maintained with complete service records. Perfect for city driving with excellent fuel economy.",
    make: "Honda", model: "HR-V RS", year: 2021, condition: "USED" as CarCondition,
    bodyType: "SUV" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "CVT" as TransmissionType,
    engine: "1.5L Turbocharged", horsepower: 178, torque: "240 Nm", drivetrain: "FWD",
    numDoors: 5, numSeats: 5, fuelConsumption: "6.1 L/100km",
    mileage: 30000, previousOwners: 1, serviceHistory: "Regular service at Honda dealer",
    price: 380000000, negotiable: true,
    exteriorColor: "Ignite Red", interiorColor: "Black", colorCode: "#DC2626",
    features: ["Honda Sensing", "Bose Audio", "Sunroof", "Remote Engine Start", "Lane Watch", "6 Airbags"],
    city: "Surabaya", province: "Jawa Timur", sellerType: "individual",
    dealerWhatsapp: "6281234567897", dealerPhone: "+62 812-3456-7897",
    coverImage: "https://images.unsplash.com/photo-1568844293986-8d0400f4745b?w=800",
    views: 1245, slug: "2021-honda-hrv-rs",
  },
  {
    title: "2023 Suzuki Jimny Sierra",
    description: "The iconic Suzuki Jimny Sierra in excellent condition. Manual transmission for the true off-road enthusiast. Low mileage, garage-kept, never off-roaded.",
    make: "Suzuki", model: "Jimny Sierra", year: 2023, condition: "USED" as CarCondition,
    bodyType: "SUV" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "MANUAL" as TransmissionType,
    engine: "1.5L K15B", horsepower: 102, torque: "130 Nm", drivetrain: "4WD",
    numDoors: 3, numSeats: 4, fuelConsumption: "6.2 L/100km",
    mileage: 8000, previousOwners: 1,
    price: 350000000, negotiable: false,
    exteriorColor: "Kinetic Yellow", interiorColor: "Black", colorCode: "#EAB308",
    features: ["4WD", "Hill Descent Control", "AllGrip Pro", "LED Headlights", "Cruise Control"],
    city: "Bandung", province: "Jawa Barat", sellerType: "individual",
    dealerWhatsapp: "6281234567898", dealerPhone: "+62 812-3456-7898",
    coverImage: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800",
    views: 2890, slug: "2023-suzuki-jimny-sierra",
  },
  {
    title: "2020 Mitsubishi Pajero Sport Dakar",
    description: "A powerful 2020 Mitsubishi Pajero Sport Dakar with full options. Well-maintained with complete service history. Perfect for family and adventure.",
    make: "Mitsubishi", model: "Pajero Sport Dakar", year: 2020, condition: "USED" as CarCondition,
    bodyType: "SUV" as CarBodyType, fuelType: "DIESEL" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "2.4L MIVEC Turbo Diesel", horsepower: 181, torque: "430 Nm", drivetrain: "4WD",
    numDoors: 5, numSeats: 7, fuelConsumption: "8.5 L/100km",
    mileage: 45000, previousOwners: 1, serviceHistory: "Full service at Mitsubishi dealer",
    price: 420000000, negotiable: true, installmentFrom: 8400000,
    exteriorColor: "White Pearl", interiorColor: "Black", colorCode: "#FFFFFF",
    features: ["Super Select 4WD II", "Forward Collision Mitigation", "Blind Spot Warning", "360 Camera", "Power Tailgate", "Rockford Sound System"],
    city: "Medan", province: "Sumatera Utara", sellerType: "dealer", dealerName: "Mitsubishi Medan",
    dealerWhatsapp: "6281234567899", dealerPhone: "+62 812-3456-7899",
    coverImage: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
    views: 1567, slug: "2020-mitsubishi-pajero-sport-dakar",
  },

  // ─── CERTIFIED PRE-OWNED ──────────────────────────────────────────────────
  {
    title: "2023 Toyota Camry Hybrid",
    description: "Certified Pre-Owned 2023 Toyota Camry Hybrid with full manufacturer warranty. Excellent condition, one owner, garage-kept. Perfect blend of luxury and efficiency.",
    make: "Toyota", model: "Camry Hybrid", year: 2023, condition: "CERTIFIED_PRE_OWNED" as CarCondition,
    bodyType: "SEDAN" as CarBodyType, fuelType: "HYBRID" as FuelType, transmission: "CVT" as TransmissionType,
    engine: "2.5L Hybrid", horsepower: 218, drivetrain: "FWD",
    numDoors: 4, numSeats: 5, fuelConsumption: "4.2 L/100km",
    mileage: 12000, previousOwners: 1, serviceHistory: "Full CPO inspection completed",
    price: 680000000, negotiable: true, installmentFrom: 13600000,
    exteriorColor: "Platinum White Pearl", interiorColor: "Black Leather", colorCode: "#F8FAFC",
    features: ["Toyota Safety Sense 3.0", "JBL Audio", "Panoramic Roof", "Ventilated Seats", "Wireless Charging", "Head-Up Display"],
    city: "Jakarta", province: "DKI Jakarta", sellerType: "dealer", dealerName: "Toyota Astra Motor",
    dealerWhatsapp: "6281234567800", dealerPhone: "+62 812-3456-7800", dealerEmail: "cpo@toyota-astra.co.id",
    coverImage: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
    views: 1123, slug: "2023-toyota-camry-hybrid-cpo",
  },

  // ─── MORE DIVERSE LISTINGS ────────────────────────────────────────────────
  {
    title: "2024 Hyundai Ioniq 5",
    description: "The award-winning Hyundai Ioniq 5 brings retro-futuristic design with cutting-edge EV technology. Ultra-fast charging, spacious interior, and impressive range.",
    make: "Hyundai", model: "Ioniq 5", year: 2024, condition: "NEW" as CarCondition,
    bodyType: "SUV" as CarBodyType, fuelType: "ELECTRIC" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "Dual Motor Electric", horsepower: 325, drivetrain: "AWD",
    numDoors: 5, numSeats: 5, range: 481, acceleration: "0-100 km/h in 5.2s",
    price: 750000000, negotiable: false,
    exteriorColor: "Digital Teal", interiorColor: "Dark Green", colorCode: "#0891B2",
    features: ["800V Ultra-Fast Charging", "Vehicle-to-Load", "AR Head-Up Display", "Highway Driving Assist 2", "Relaxation Seats"],
    city: "Jakarta", province: "DKI Jakarta", sellerType: "dealer", dealerName: "Hyundai Motor Indonesia",
    dealerWhatsapp: "6281234567801", dealerPhone: "+62 812-3456-7801",
    coverImage: "https://images.unsplash.com/photo-1619317588810-42e1e1be4f32?w=800",
    views: 3210, isFeatured: true, slug: "2024-hyundai-ioniq-5",
  },
  {
    title: "2023 Kia EV6 GT-Line",
    description: "The Kia EV6 GT-Line combines stunning design with impressive performance. Ultra-fast charging capability, spacious interior, and advanced tech features.",
    make: "Kia", model: "EV6 GT-Line", year: 2023, condition: "NEW" as CarCondition,
    bodyType: "SUV" as CarBodyType, fuelType: "ELECTRIC" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "Dual Motor Electric", horsepower: 325, drivetrain: "AWD",
    numDoors: 5, numSeats: 5, range: 528, acceleration: "0-100 km/h in 5.2s",
    price: 780000000, negotiable: false,
    exteriorColor: "Snow White Pearl", interiorColor: "Black", colorCode: "#FFFFFF",
    features: ["800V Charging", "Vehicle-to-Load", "Highway Driving Assist", "Meridian Sound", "Augmented Reality Navigation"],
    city: "Surabaya", province: "Jawa Timur", sellerType: "dealer", dealerName: "Kia Surabaya",
    dealerWhatsapp: "6281234567802", dealerPhone: "+62 812-3456-7802",
    coverImage: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800",
    views: 1890, slug: "2023-kia-ev6-gt-line",
  },
  {
    title: "2022 Nissan Livina VL",
    description: "Spacious and practical 2022 Nissan Livina VL. Perfect family MPV with modern features and excellent fuel economy. Well-maintained with complete service records.",
    make: "Nissan", model: "Livina VL", year: 2022, condition: "USED" as CarCondition,
    bodyType: "MPV" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "CVT" as TransmissionType,
    engine: "1.5L HR15DE", horsepower: 104, torque: "141 Nm", drivetrain: "FWD",
    numDoors: 5, numSeats: 7, fuelConsumption: "6.3 L/100km",
    mileage: 20000, previousOwners: 1,
    price: 250000000, negotiable: true, installmentFrom: 5000000,
    exteriorColor: "Bronze Gray", interiorColor: "Black", colorCode: "#78716C",
    features: ["360 Camera", "Cruise Control", "7-inch Touchscreen", "Rear Parking Sensors", "LED Headlights"],
    city: "Malang", province: "Jawa Timur", sellerType: "individual",
    dealerWhatsapp: "6281234567803", dealerPhone: "+62 812-3456-7803",
    coverImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
    views: 890, slug: "2022-nissan-livina-vl",
  },
  {
    title: "2024 Mazda CX-5 Touring",
    description: "The Mazda CX-5 Touring offers a premium driving experience with its KODO design philosophy. Skyactiv technology delivers both performance and efficiency.",
    make: "Mazda", model: "CX-5 Touring", year: 2024, condition: "NEW" as CarCondition,
    bodyType: "SUV" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "2.5L Skyactiv-G", horsepower: 190, torque: "252 Nm", drivetrain: "AWD",
    numDoors: 5, numSeats: 5, fuelConsumption: "7.5 L/100km",
    price: 620000000, negotiable: true, installmentFrom: 12400000,
    exteriorColor: "Soul Red Crystal", interiorColor: "Black Nappa Leather", colorCode: "#B91C1C",
    features: ["i-Activsense", "Bose Audio", "Head-Up Display", "Heated Seats", "Power Liftgate", "Wireless Charging"],
    city: "Bandung", province: "Jawa Barat", sellerType: "dealer", dealerName: "Mazda Bandung",
    dealerWhatsapp: "6281234567804", dealerPhone: "+62 812-3456-7804",
    coverImage: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
    views: 1456, slug: "2024-mazda-cx5-touring",
  },
  {
    title: "2021 Toyota Hilux Revo",
    description: "A robust 2021 Toyota Hilux Revo for work and adventure. Well-maintained, never used for heavy hauling. Perfect for those who need a reliable pickup.",
    make: "Toyota", model: "Hilux Revo", year: 2021, condition: "USED" as CarCondition,
    bodyType: "PICKUP_TRUCK" as CarBodyType, fuelType: "DIESEL" as FuelType, transmission: "MANUAL" as TransmissionType,
    engine: "2.4L Turbo Diesel", horsepower: 150, torque: "400 Nm", drivetrain: "4WD",
    numDoors: 4, numSeats: 5, fuelConsumption: "7.2 L/100km",
    mileage: 35000, previousOwners: 1, serviceHistory: "Full service at Toyota dealer",
    price: 380000000, negotiable: true,
    exteriorColor: "Silver Metallic", interiorColor: "Black", colorCode: "#9CA3AF",
    features: ["4WD", "Diff Lock", "Hill Start Assist", "Rear Parking Camera", "Bluetooth Audio"],
    city: "Palembang", province: "Sumatera Selatan", sellerType: "individual",
    dealerWhatsapp: "6281234567805", dealerPhone: "+62 812-3456-7805",
    coverImage: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800",
    views: 1234, slug: "2021-toyota-hilux-revo",
  },
  {
    title: "2023 Daihatsu Xenia R CVT",
    description: "Practical and affordable 2023 Daihatsu Xenia R CVT. Perfect first car or family runabout. Low mileage, like-new condition.",
    make: "Daihatsu", model: "Xenia R CVT", year: 2023, condition: "USED" as CarCondition,
    bodyType: "MPV" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "CVT" as TransmissionType,
    engine: "1.5L Dual VVT-i", horsepower: 105, torque: "136 Nm", drivetrain: "FWD",
    numDoors: 5, numSeats: 7, fuelConsumption: "6.5 L/100km",
    mileage: 10000, previousOwners: 1,
    price: 210000000, negotiable: true,
    exteriorColor: "Silver Metallic", interiorColor: "Black", colorCode: "#9CA3AF",
    features: ["CVT", "Touchscreen", "Rear Parking Camera", "USB Charging", "ABS"],
    city: "Solo", province: "Jawa Tengah", sellerType: "individual",
    dealerWhatsapp: "6281234567806", dealerPhone: "+62 812-3456-7806",
    coverImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800",
    views: 678, slug: "2023-daihatsu-xenia-r-cvt",
  },
  {
    title: "2024 Ford Ranger Wildtrak",
    description: "The 2024 Ford Ranger Wildtrak combines rugged capability with modern technology. Perfect for work and adventure with its powerful bi-turbo diesel engine.",
    make: "Ford", model: "Ranger Wildtrak", year: 2024, condition: "NEW" as CarCondition,
    bodyType: "PICKUP_TRUCK" as CarBodyType, fuelType: "DIESEL" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    engine: "2.0L Bi-Turbo Diesel", horsepower: 213, torque: "500 Nm", drivetrain: "4WD",
    numDoors: 4, numSeats: 5, fuelConsumption: "8.0 L/100km",
    price: 620000000, negotiable: true, installmentFrom: 12400000,
    exteriorColor: "Aluminum Metallic", interiorColor: "Black", colorCode: "#D1D5DB",
    features: ["SYNC 4A", "B&O Sound", "360 Camera", "Adaptive Cruise Control", "Zone Lighting", "Drive Modes"],
    city: "Jakarta", province: "DKI Jakarta", sellerType: "dealer", dealerName: "Ford Indonesia",
    dealerWhatsapp: "6281234567807", dealerPhone: "+62 812-3456-7807",
    coverImage: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800",
    views: 2345, slug: "2024-ford-ranger-wildtrak",
  },
  {
    title: "2022 Mitsubishi Xpander Cross",
    description: "A versatile 2022 Mitsubishi Xpander Cross with crossover styling. Perfect for urban and light off-road use. Well-maintained with full service history.",
    make: "Mitsubishi", model: "Xpander Cross", year: 2022, condition: "USED" as CarCondition,
    bodyType: "MPV" as CarBodyType, fuelType: "GASOLINE" as FuelType, transmission: "CVT" as TransmissionType,
    engine: "1.5L MIVEC", horsepower: 105, torque: "141 Nm", drivetrain: "FWD",
    numDoors: 5, numSeats: 7, fuelConsumption: "6.8 L/100km",
    mileage: 18000, previousOwners: 1,
    price: 270000000, negotiable: true,
    exteriorColor: "Quartz White Pearl", interiorColor: "Black", colorCode: "#F8FAFC",
    features: ["CVT", "360 Camera", "Cruise Control", "8-inch Touchscreen", "Rear Parking Sensors"],
    city: "Semarang", province: "Jawa Tengah", sellerType: "individual",
    dealerWhatsapp: "6281234567808", dealerPhone: "+62 812-3456-7808",
    coverImage: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
    views: 1023, slug: "2022-mitsubishi-xpander-cross",
  },
]

// ─── Seed Function ───────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database...\n")

  // Clean existing data
  console.log("Cleaning existing data...")
  await prisma.carVideo.deleteMany()
  await prisma.carImage.deleteMany()
  await prisma.carInquiry.deleteMany()
  await prisma.carFavorite.deleteMany()
  await prisma.carPromotion.deleteMany()
  await prisma.car.deleteMany()
  await prisma.carCategory.deleteMany()
  console.log("✓ Cleaned\n")

  // Create categories
  console.log("Creating categories...")
  const categories = await Promise.all(
    carCategories.map((cat) =>
      prisma.carCategory.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          sortOrder: cat.sortOrder,
        },
      })
    )
  )
  console.log(`✓ Created ${categories.length} categories\n`)

  // Map car titles to category slugs
  const categoryMap: Record<string, string> = {
    Sedan: "sedan",
    SUV: "suv",
    Coupe: "coupe",
    Hatchback: "hatchback",
    Electric: "electric",
    Hybrid: "hybrid",
    "Pickup Truck": "pickup-truck",
    MPV: "mpv",
  }

  // Create cars
  console.log("Creating car listings...")
  let created = 0
  for (const carData of sampleCars) {
    const bodyTypeStr = carData.bodyType as string
    const categorySlug = categoryMap[bodyTypeStr] || "sedan"
    const category = categories.find((c) => c.slug === categorySlug)

    // Extract features and safety from car data
    const { features: carFeatures, safetyFeatures, ...rest } = carData as any

    // Map bodyType string to enum value
    const bodyTypeMap: Record<string, CarBodyType> = {
      SEDAN: "SEDAN",
      SUV: "SUV",
      HATCHBACK: "HATCHBACK",
      COUPE: "COUPE",
      CONVERTIBLE: "CONVERTIBLE",
      WAGON: "WAGON",
      PICKUP_TRUCK: "PICKUP_TRUCK",
      VAN: "VAN",
      MINIVAN: "MINIVAN",
      ROADSTER: "ROADSTER",
      MPV: "MINIVAN",
      OTHER: "OTHER",
    }

    const conditionMap: Record<string, CarCondition> = {
      NEW: "NEW",
      USED: "USED",
      CERTIFIED_PRE_OWNED: "CERTIFIED_PRE_OWNED",
    }

    const fuelTypeMap: Record<string, FuelType> = {
      GASOLINE: "GASOLINE",
      DIESEL: "DIESEL",
      ELECTRIC: "ELECTRIC",
      HYBRID: "HYBRID",
      PLUGIN_HYBRID: "PLUGIN_HYBRID",
      CNG: "CNG",
      LPG: "LPG",
    }

    const transmissionMap: Record<string, TransmissionType> = {
      AUTOMATIC: "AUTOMATIC",
      MANUAL: "MANUAL",
      CVT: "CVT",
      AUTOMATED_MANUAL: "AUTOMATED_MANUAL",
      DCT: "DCT",
    }

    await prisma.car.create({
      data: {
        ...rest,
        condition: conditionMap[rest.condition] || "USED",
        bodyType: bodyTypeMap[rest.bodyType] || "SEDAN",
        fuelType: fuelTypeMap[rest.fuelType] || "GASOLINE",
        transmission: transmissionMap[rest.transmission] || "AUTOMATIC",
        status: "AVAILABLE",
        currency: "IDR",
        categoryId: category?.id,
        publishedAt: new Date(),
        features: carFeatures || [],
      },
    })
    created++
    process.stdout.write(`  Created: ${carData.title}\r`)
  }
  console.log(`\n✓ Created ${created} car listings\n`)

  // Summary
  const totalCars = await prisma.car.count()
  const totalCategories = await prisma.carCategory.count()
  console.log("📊 Seed Summary:")
  console.log(`   Categories: ${totalCategories}`)
  console.log(`   Cars: ${totalCars}`)
  console.log("\n✨ Seeding complete!")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

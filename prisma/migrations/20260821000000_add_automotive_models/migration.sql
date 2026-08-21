-- CreateEnum
CREATE TYPE "CarCondition" AS ENUM ('NEW', 'USED', 'CERTIFIED_PRE_OWNED');

-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('AVAILABLE', 'SOLD', 'RESERVED', 'PENDING', 'DRAFT');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID', 'PLUGIN_HYBRID', 'CNG', 'LPG');

-- CreateEnum
CREATE TYPE "TransmissionType" AS ENUM ('AUTOMATIC', 'MANUAL', 'CVT', 'AUTOMATED_MANUAL', 'DCT');

-- CreateEnum
CREATE TYPE "CarBodyType" AS ENUM ('SEDAN', 'SUV', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'WAGON', 'PICKUP_TRUCK', 'VAN', 'MINIVAN', 'ROADSTER', 'OTHER');

-- CreateEnum
CREATE TYPE "PromotionChannel" AS ENUM ('WHATSAPP', 'EMAIL', 'BOTH');

-- CreateEnum
CREATE TYPE "PromotionStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "car_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "car_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cars" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "condition" "CarCondition" NOT NULL DEFAULT 'USED',
    "status" "CarStatus" NOT NULL DEFAULT 'AVAILABLE',
    "bodyType" "CarBodyType" NOT NULL DEFAULT 'SEDAN',
    "fuelType" "FuelType" NOT NULL DEFAULT 'GASOLINE',
    "transmission" "TransmissionType" NOT NULL DEFAULT 'AUTOMATIC',
    "engine" TEXT,
    "horsepower" INTEGER,
    "torque" TEXT,
    "engineDisplacement" TEXT,
    "numCylinders" INTEGER,
    "drivetrain" TEXT,
    "numDoors" INTEGER,
    "numSeats" INTEGER,
    "numGears" INTEGER,
    "length" DECIMAL(8,2),
    "width" DECIMAL(8,2),
    "height" DECIMAL(8,2),
    "wheelbase" DECIMAL(8,2),
    "curbWeight" DECIMAL(8,2),
    "groundClearance" DECIMAL(8,2),
    "topSpeed" INTEGER,
    "acceleration" TEXT,
    "fuelConsumption" TEXT,
    "co2Emission" TEXT,
    "range" INTEGER,
    "mileage" INTEGER,
    "previousOwners" INTEGER DEFAULT 0,
    "accidentHistory" BOOLEAN DEFAULT false,
    "serviceHistory" TEXT,
    "vin" TEXT,
    "licensePlate" TEXT,
    "price" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "priceOnRequest" BOOLEAN NOT NULL DEFAULT false,
    "originalPrice" DECIMAL(15,2),
    "negotiable" BOOLEAN NOT NULL DEFAULT true,
    "installmentAvail" BOOLEAN NOT NULL DEFAULT true,
    "installmentFrom" DECIMAL(15,2),
    "downPayment" DECIMAL(15,2),
    "exteriorColor" TEXT,
    "interiorColor" TEXT,
    "colorCode" TEXT,
    "features" TEXT[],
    "safetyRating" TEXT,
    "airbagCount" INTEGER,
    "coverImage" TEXT,
    "thumbnailUrl" TEXT,
    "videoUrl" TEXT,
    "videoThumbnail" TEXT,
    "virtualTourUrl" TEXT,
    "city" TEXT,
    "province" TEXT,
    "address" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "sellerId" TEXT,
    "sellerType" TEXT NOT NULL DEFAULT 'individual',
    "dealerName" TEXT,
    "dealerLicense" TEXT,
    "dealerPhone" TEXT,
    "dealerEmail" TEXT,
    "dealerWhatsapp" TEXT,
    "dealerWebsite" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "favorites" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPromoted" BOOLEAN NOT NULL DEFAULT false,
    "promotedUntil" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_images" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "alt" TEXT,
    "caption" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_videos" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "title" TEXT,
    "description" TEXT,
    "duration" INTEGER,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_inquiries" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "inquiryType" TEXT NOT NULL DEFAULT 'general',
    "preferredContact" TEXT NOT NULL DEFAULT 'whatsapp',
    "status" TEXT NOT NULL DEFAULT 'new',
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_favorites" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_promotions" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "promotionType" TEXT NOT NULL DEFAULT 'featured',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "discountPercent" INTEGER,
    "specialPrice" DECIMAL(15,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "channel" "PromotionChannel" NOT NULL DEFAULT 'BOTH',
    "status" "PromotionStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "subject" TEXT,
    "messageTemplate" TEXT,
    "imageUrl" TEXT,
    "targetUrl" TEXT,
    "totalSent" INTEGER NOT NULL DEFAULT 0,
    "totalOpened" INTEGER NOT NULL DEFAULT 0,
    "totalClicked" INTEGER NOT NULL DEFAULT 0,
    "totalFailed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotion_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_recipients" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "carId" TEXT,
    "customData" JSONB,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "opened" BOOLEAN NOT NULL DEFAULT false,
    "clicked" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotion_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_logs" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT,
    "toNumber" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "errorMessage" TEXT,
    "twilioSid" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "whatsapp_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT,
    "toEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "errorMessage" TEXT,
    "providerId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "source" TEXT NOT NULL DEFAULT 'website',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "car_categories_slug_key" ON "car_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cars_slug_key" ON "cars"("slug");

-- CreateIndex
CREATE INDEX "cars_make_model_year_idx" ON "cars"("make", "model", "year");

-- CreateIndex
CREATE INDEX "cars_condition_status_idx" ON "cars"("condition", "status");

-- CreateIndex
CREATE INDEX "cars_price_idx" ON "cars"("price");

-- CreateIndex
CREATE INDEX "cars_city_province_idx" ON "cars"("city", "province");

-- CreateIndex
CREATE INDEX "cars_isFeatured_isPromoted_idx" ON "cars"("isFeatured", "isPromoted");

-- CreateIndex
CREATE INDEX "cars_createdAt_idx" ON "cars"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "car_favorites_carId_userId_key" ON "car_favorites"("carId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "car_favorites_carId_sessionId_key" ON "car_favorites"("carId", "sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "contact_subscribers_email_key" ON "contact_subscribers"("email");

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "car_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_images" ADD CONSTRAINT "car_images_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_videos" ADD CONSTRAINT "car_videos_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_inquiries" ADD CONSTRAINT "car_inquiries_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_favorites" ADD CONSTRAINT "car_favorites_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_promotions" ADD CONSTRAINT "car_promotions_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_recipients" ADD CONSTRAINT "promotion_recipients_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "promotion_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_logs" ADD CONSTRAINT "whatsapp_logs_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "promotion_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "promotion_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

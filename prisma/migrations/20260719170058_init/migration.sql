-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'ANALYZED', 'ALERTED', 'RESOLVED');

-- CreateTable
CREATE TABLE "PollutionReport" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "userCategory" TEXT,
    "userSeverity" TEXT,
    "pollutionType" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "severity" TEXT NOT NULL,
    "likelySource" TEXT NOT NULL,
    "predictedAQI" INTEGER NOT NULL,
    "healthRisk" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "municipalAlertSent" BOOLEAN NOT NULL DEFAULT false,
    "hotspotDetected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PollutionReport_pkey" PRIMARY KEY ("id")
);

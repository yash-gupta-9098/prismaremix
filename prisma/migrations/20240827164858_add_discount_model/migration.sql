-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "startsAt" DATETIME,
    "endsAt" DATETIME,
    "minimumRequirementSubtotal" REAL,
    "discountAmount" REAL
);

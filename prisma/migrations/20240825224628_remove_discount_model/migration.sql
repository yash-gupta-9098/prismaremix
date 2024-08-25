/*
  Warnings:

  - You are about to alter the column `discountAmount` on the `Discount` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `endsAt` on the `Discount` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `minimumRequirementSubtotal` on the `Discount` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `startsAt` on the `Discount` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Discount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "startsAt" DATETIME,
    "endsAt" DATETIME,
    "minimumRequirementSubtotal" REAL,
    "discountAmount" REAL
);
INSERT INTO "new_Discount" ("discountAmount", "endsAt", "id", "minimumRequirementSubtotal", "startsAt", "title") SELECT "discountAmount", "endsAt", "id", "minimumRequirementSubtotal", "startsAt", "title" FROM "Discount";
DROP TABLE "Discount";
ALTER TABLE "new_Discount" RENAME TO "Discount";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 18, 2024 at 07:49 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eastRidge`
--

-- --------------------------------------------------------

--
-- Table structure for table `Accounts`
--

CREATE TABLE `Accounts` (
  `id` int(11) NOT NULL,
  `bankName` varchar(255) NOT NULL,
  `accountTitle` varchar(255) NOT NULL,
  `accountNumber` varchar(255) NOT NULL,
  `routingNumber` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isActive` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Activities`
--

CREATE TABLE `Activities` (
  `id` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `bidCount` int(11) NOT NULL DEFAULT 0,
  `type` enum('BID','BUY') NOT NULL DEFAULT 'BID',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `CarId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Cars`
--

CREATE TABLE `Cars` (
  `id` int(11) NOT NULL,
  `images` longtext DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `make` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `vin` varchar(255) DEFAULT NULL,
  `lot` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `engine` varchar(255) DEFAULT NULL,
  `doors` int(11) DEFAULT NULL,
  `seats` int(11) DEFAULT NULL,
  `mileage` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `transmission` varchar(255) DEFAULT NULL,
  `bidPrice` int(11) DEFAULT NULL,
  `bidDeadline` datetime DEFAULT NULL,
  `bidCount` int(11) NOT NULL DEFAULT 0,
  `invoiceSent` datetime DEFAULT NULL,
  `referal` varchar(255) DEFAULT NULL,
  `specs` text DEFAULT NULL,
  `status` enum('NEW','LIVE','ENDED','PAID') NOT NULL DEFAULT 'NEW',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `bidderId` int(11) DEFAULT NULL,
  `pdf` varchar(255) DEFAULT NULL,
  `bought` varchar(255) DEFAULT NULL,
  `purchaseSteps` int(11) DEFAULT 0,
  `isTrash` tinyint(1) DEFAULT 0,
  `initialBidPrice` int(11) DEFAULT NULL,
  `winBox` tinyint(1) DEFAULT 0,
  `slug` varchar(255) NOT NULL,
  `companyName` varchar(255) DEFAULT NULL,
  `bodyStyle` varchar(255) DEFAULT NULL,
  `fuelType` varchar(255) DEFAULT NULL,
  `driveType` varchar(255) DEFAULT NULL,
  `cylinders` varchar(255) DEFAULT NULL,
  `companyImage` longtext NOT NULL DEFAULT '',
  `location` varchar(255) DEFAULT NULL,
  `autoBid` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`autoBid`)),
  `isPending` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Supports`
--

CREATE TABLE `Supports` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `dateOfBirth` datetime DEFAULT NULL,
  `address` text DEFAULT NULL,
  `zipCode` varchar(255) DEFAULT NULL,
  `spent` int(11) NOT NULL DEFAULT 0,
  `buyCount` int(11) NOT NULL DEFAULT 0,
  `bidCount` int(11) NOT NULL DEFAULT 0,
  `packageMode` enum('TRIAL','BASIC','PLUS','ADVANCED') NOT NULL DEFAULT 'TRIAL',
  `image1` varchar(255) DEFAULT NULL,
  `image2` varchar(255) DEFAULT NULL,
  `referal` varchar(255) DEFAULT NULL,
  `role` enum('USER','ADMIN','SUBADMIN') NOT NULL DEFAULT 'USER',
  `status` enum('PENDING','DENIED','APPROVED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `inPurchase` tinyint(1) DEFAULT 0,
  `isTrash` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Verifications`
--

CREATE TABLE `Verifications` (
  `id` int(11) NOT NULL,
  `verifyWith` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `status` enum('SENDED','VERIFIED') NOT NULL DEFAULT 'SENDED',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Accounts`
--
ALTER TABLE `Accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Activities`
--
ALTER TABLE `Activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`),
  ADD KEY `CarId` (`CarId`);

--
-- Indexes for table `Cars`
--
ALTER TABLE `Cars`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`),
  ADD KEY `bidderId` (`bidderId`);

--
-- Indexes for table `Supports`
--
ALTER TABLE `Supports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Verifications`
--
ALTER TABLE `Verifications`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Accounts`
--
ALTER TABLE `Accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Activities`
--
ALTER TABLE `Activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Cars`
--
ALTER TABLE `Cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Supports`
--
ALTER TABLE `Supports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Verifications`
--
ALTER TABLE `Verifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Activities`
--
ALTER TABLE `Activities`
  ADD CONSTRAINT `Activities_ibfk_345` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Activities_ibfk_346` FOREIGN KEY (`CarId`) REFERENCES `Cars` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Cars`
--
ALTER TABLE `Cars`
  ADD CONSTRAINT `Cars_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Cars_ibfk_2` FOREIGN KEY (`bidderId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- --------------------------------------------------------

--
-- Table structure for table `Identity Information`
--

CREATE TABLE Identities (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `frontImage` varchar(255) DEFAULT NULL,
  `backImage` varchar(255) DEFAULT NULL,
  `identityType` enum('IDCARD','LICENSE') NOT NULL,
  `approve` int(1) NOT NULL DEFAULT 0,
    `UserId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

-- Table structure for table `Cars`

ALTER TABLE `Cars`
  ADD COLUMN `Fake_name` VARCHAR(255) AFTER `model`;


  ALTER TABLE `Users` MODIFY COLUMN `hash` varchar(255) NULL;

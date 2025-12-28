-- Database Schema for Exam Management Platform

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `exam_platform`
--
CREATE DATABASE IF NOT EXISTS `exam_platform` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `exam_platform`;

-- --------------------------------------------------------

--
-- Table structure for table `users` (Admins and School Accounts)
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','school') NOT NULL DEFAULT 'school',
  `status` enum('pending','active','rejected') NOT NULL DEFAULT 'pending',
  `school_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `director_name` varchar(100) DEFAULT NULL,
  `decree_number` varchar(100) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Default Admin User (password: admin123)
--
INSERT INTO `users` (`username`, `password`, `role`, `school_name`) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Super Admin');

-- --------------------------------------------------------

--
-- Table structure for table `exam_sessions` (Exam Sections)
--

CREATE TABLE `exam_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL, -- e.g., "BAC 2024"
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('open','closed','deliberation','published') NOT NULL DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `series` (e.g., Science, Arts)
--

CREATE TABLE `series` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `code` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `subjects` (Matières)
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `program_coefficients` (Coefficients per Series)
--

CREATE TABLE `program_coefficients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `series_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `coefficient` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`series_id`) REFERENCES `series` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_user_id` int(11) NOT NULL, -- The school that registered the candidate
  `exam_session_id` int(11) NOT NULL,
  `series_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `dob` date NOT NULL,
  `pob` varchar(100) NOT NULL, -- Place of Birth
  `gender` enum('M','F') NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `matricule` varchar(20) DEFAULT NULL, -- Generated later
  `table_number` int(11) DEFAULT NULL, -- Generated later
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`school_user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`exam_session_id`) REFERENCES `exam_sessions` (`id`),
  FOREIGN KEY (`series_id`) REFERENCES `series` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

CREATE TABLE `grades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `candidate_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `score` decimal(5,2) NOT NULL, -- e.g., 15.50
  PRIMARY KEY (`id`),
  UNIQUE KEY `candidate_subject` (`candidate_id`, `subject_id`),
  FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;

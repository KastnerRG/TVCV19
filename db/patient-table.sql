CREATE DATABASE medecc;

  CREATE TABLE `medecc`.`patient` (
  `id` varchar(36) NOT NULL,
  `name` varchar(145) NOT NULL,
  `caregiver_id` varchar(36) DEFAULT NULL,
  `location` varchar(45) NOT NULL,
  `admission_status` enum('Admitted','Discharged') NOT NULL,
  `age` int DEFAULT NULL,
  `escalation_level` int DEFAULT NULL,
  `date_of_birth` date NOT NULL,
  `token` varchar(500) DEFAULT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `height` varchar(145) NOT NULL,
  PRIMARY KEY (`id`)
)
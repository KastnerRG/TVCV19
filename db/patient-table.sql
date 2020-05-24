CREATE DATABASE medecc

  CREATE TABLE `medecc`.`patient` (
  `id` varchar(36) NOT NULL,
  `name` varchar(145) NOT NULL,
  `caregiver_id` varchar(36) NOT NULL,
  `location` varchar(45) NOT NULL,
  `admission_status` enum('Admitted','Discharged') NOT NULL,
  `age` int DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `token` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
)

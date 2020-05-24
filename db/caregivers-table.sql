CREATE TABLE `medecc`.`caregiver` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `location` varchar(250) NOT NULL,
  `hierarchy` enum('FirstLine','SecondLine','Commander') NOT NULL,
  `supervisor_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) 
CREATE TABLE `medecc`.`notification` (
  `id` varchar(36) NOT NULL,
  `sender_id` varchar(36) NOT NULL,
  `reciever_id` varchar(36) NOT NULL,
  `patient_id` varchar(36) NOT NULL,
  `link` text,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) 

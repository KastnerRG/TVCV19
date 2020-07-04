CREATE TABLE `medecc`.`application-login` (
  `id` varchar(36) NOT NULL,
  `user_name` varchar(256) NOT NULL,
  `normalized_user_name` varchar (256) NOT NULL,
  `password_hash` varchar(MAX) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
)
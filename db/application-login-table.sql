CREATE TABLE `medecc`.`application-login` (
  `id` varchar(36) NOT NULL,
  `user_name` varchar(256) NOT NULL,
  `normalized_user_name` varchar (256) NOT NULL,
  `password_hash` varchar(256) NOT NULL,
  `enabled` bit NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
)
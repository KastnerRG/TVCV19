CREATE TABLE `medecc`.`users` (
  `id` varchar(128) NOT NULL,
  `user_name` varchar(256) NOT NULL,
  `normalized_user_name` varchar (256) NOT NULL,
  `password_hash` varchar(256),
  `enabled` bit NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
);

CREATE TABLE `medecc`.`userclaims` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` varchar(128) NOT NULL,
  `ClaimType` longtext,
  `ClaimValue` longtext,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id` (`Id`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `ApplicationUser_Claims` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE ON UPDATE NO ACTION
);
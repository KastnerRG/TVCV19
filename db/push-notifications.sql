CREATE TABLE `medecc`.`chromepush` (
  `id` VARCHAR(36) NOT NULL,
  `endpoint` VARCHAR(356) NOT NULL,
  `auth` VARCHAR(400) NOT NULL,
  `p256dh` VARCHAR(400) NOT NULL,
  PRIMARY KEY (`id`));
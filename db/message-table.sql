  CREATE TABLE `medecc`.`message` (
  `id` varchar(36) NOT NULL,
  `group_id` varchar(36) NOT NULL,
  `body` mediumtext NOT NULL,
  `sender` varchar(36) NOT NULL,
  `date` datetime NOT NULL,
  `is_care_instruction` tinyint(1) DEFAULT NULL,
  `is_audio` tinyint(1) DEFAULT NULL,
  `is_image` tinyint(1) DEFAULT NULL,
  `stats_id` varchar(36) DEFAULT NULL,
  `is_escalation` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `medecc`.`stats` (
  `id` varchar(36) NOT NULL,
  `PR` varchar(45) NOT NULL,
  `TV` varchar(45) NOT NULL,
  `PP` varchar(45) NOT NULL,
  `IE` varchar(45) NOT NULL,
  `MP` varchar(45) NOT NULL,
  `O2` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
)

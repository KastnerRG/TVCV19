  CREATE TABLE `medecc`.`media` (
  `id` varchar(36) NOT NULL,
  `file_name` varchar(245) NOT NULL,
  `file` longblob NOT NULL,
  `mime_type` varchar(245) NOT NULL,
  PRIMARY KEY (`id`)) 
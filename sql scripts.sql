INSERT INTO `mintixdb`.`users` (`username`, `nickname`, `email`, `password`) VALUES ('ofs', 'ofs', 'ofs@gmail.com', 'sha1$63f2b94b$1$64317779c1d4b92e4092110809c2a848b5fbfcee');


CREATE TABLE `mintixdb`.`user_token` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL,
  `refresh_token` LONGTEXT NULL,
  `isActive` BIT(1) NULL,
  `created_on` DATE NULL,
  `updated_on` DATE NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id_idx` (`user_id` ASC),
  CONSTRAINT `user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `mintixdb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


INSERT INTO ``.`user_details` (`user_id`, `user_name`, `email`, `mobile_no`, `apartment_id`, `block_id`, `site_id`) VALUES ('5', 'ofs', 'ofs@gmail.com', '99', '1278', '64', '20');


ALTER TABLE `mintixdb`.`w2_inv_history` 
ADD COLUMN `rental_component_charges` FLOAT NULL AFTER `createdon`,
ADD COLUMN `service_fees` FLOAT NULL AFTER `rental_component_charges`,
ADD COLUMN `mintix_amc` FLOAT NULL AFTER `service_fees`;

ALTER TABLE `mintixdb`.`user_token` 
ADD COLUMN `push_token` LONGTEXT NULL AFTER `updated_on`;

ALTER TABLE `mintixdb`.`user_token` 
ADD COLUMN `device_id` LONGTEXT NULL AFTER `push_token`;

UPDATE `mintixdb`.`min_pushnotification_templates` SET `content`='Identified possible Leakage in your |param|. Kindly take action immediately.' WHERE `id`='2';

UPDATE `mintixdb`.`min_pushnotification_templates` SET `content`='Great!. The Leakage in |param| is fixed.' WHERE `id`='4';

CREATE TABLE `faq_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(255) DEFAULT NULL,
  `isActive` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

CREATE TABLE `faq` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) DEFAULT NULL,
  `question` mediumtext,
  `answer` mediumtext,
  `createdOn` datetime DEFAULT NULL,
  `updatedOn` datetime DEFAULT NULL,
  `isActive` tinyint(4) DEFAULT NULL,
  `createdBy` varchar(45) DEFAULT NULL,
 `updatedBy` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id_idx` (`category_id`),
  CONSTRAINT `category_id` FOREIGN KEY (`category_id`) REFERENCES `faq_category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=latin1;

ALTER TABLE `mintixdb`.`faq` 
ADD COLUMN `site_id` INT NULL AFTER `updatedBy`,
ADD INDEX `site_id_idx` (`site_id` ASC);
ALTER TABLE `mintixdb`.`faq` 
ADD CONSTRAINT `site_id`
  FOREIGN KEY (`site_id`)
  REFERENCES `mintixdb`.`min_site_qa1` (`site_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


INSERT INTO `mintixdb`.`faq_category` (`category`, `isActive`) VALUES ('DATA', '1');
INSERT INTO `mintixdb`.`faq_category` (`category`, `isActive`) VALUES ('BILLING', '1');
INSERT INTO `mintixdb`.`faq_category` (`category`, `isActive`) VALUES ('SENSOR', '1');
INSERT INTO `mintixdb`.`faq_category` (`category`, `isActive`) VALUES ('APP', '1');
INSERT INTO `mintixdb`.`faq_category` (`category`, `isActive`) VALUES ('ALARMS', '1');

ALTER TABLE `mintixdb`.`min_block` 
ADD COLUMN `is_under_maintenance` TINYINT NOT NULL AFTER `ref_avg`,
ADD COLUMN `maintenance_msg` TEXT NULL AFTER `is_under_maintenance`;


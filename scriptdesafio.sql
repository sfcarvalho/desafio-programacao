DROP TABLE IF EXISTS `sales_transactions`;

CREATE TABLE `sales_transactions` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`type` INT(11) NOT NULL,
	`datetime` VARCHAR(255),
	`product` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
	`value` DECIMAL(10.2),
	`seller` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci,
	PRIMARY KEY (`id`)
);
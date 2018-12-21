-- Adminer 4.6.3 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `account`;
CREATE TABLE `account` (
  `handle` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(24) NOT NULL DEFAULT '',
  `password` varchar(28) NOT NULL DEFAULT '',
  PRIMARY KEY (`handle`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `authentication`;
CREATE TABLE `authentication` (
  `account` int(10) unsigned NOT NULL,
  `token` varchar(40) NOT NULL DEFAULT '',
  `time` datetime NOT NULL DEFAULT '1970-01-01 00:00:00',
  UNIQUE KEY `token` (`token`),
  UNIQUE KEY `account_u` (`account`),
  KEY `account_i` (`account`),
  CONSTRAINT `authentication_ibfk_2` FOREIGN KEY (`account`) REFERENCES `account` (`handle`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `profile`;
CREATE TABLE `profile` (
  `account` int(10) unsigned NOT NULL,
  `country` varchar(2) NOT NULL DEFAULT '' COMMENT 'ISO 3166-1 alpha-2',
  `state` varchar(128) NOT NULL DEFAULT '',
  `location` varchar(128) NOT NULL DEFAULT '',
  `organization` varchar(128) NOT NULL DEFAULT '',
  `unit` varchar(128) NOT NULL DEFAULT '',
  `common` varchar(128) NOT NULL DEFAULT '',
  `email` varchar(128) NOT NULL DEFAULT '',
  KEY `account` (`account`),
  CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`account`) REFERENCES `account` (`handle`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `seal`;
CREATE TABLE `seal` (
  `account` int(10) unsigned NOT NULL,
  `code` varchar(20) NOT NULL DEFAULT '',
  `mime` varchar(256) NOT NULL DEFAULT '',
  `extension` varchar(3) NOT NULL DEFAULT '',
  `identify` varchar(40) NOT NULL DEFAULT '',
  `time` datetime NOT NULL DEFAULT '1970-01-01 00:00:00',
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `identify` (`identify`),
  KEY `account` (`account`),
  CONSTRAINT `seal_ibfk_1` FOREIGN KEY (`account`) REFERENCES `account` (`handle`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP VIEW IF EXISTS `_authentication`;
CREATE TABLE `_authentication` (`account` int(10) unsigned, `username` varchar(24), `password` varchar(28), `token` varchar(40), `time` varchar(19));


DROP VIEW IF EXISTS `_seal`;
CREATE TABLE `_seal` (`identify` varchar(40), `mime` varchar(256), `url` varchar(31), `replica_url` varchar(38), `replica_path` varchar(37), `watermark_url` varchar(40), `watermark_path` varchar(39), `time` datetime);


DROP VIEW IF EXISTS `_trustseal`;
CREATE TABLE `_trustseal` (`code` varchar(20), `fullname` varchar(128), `organization` varchar(128), `unit` varchar(128), `email` varchar(128), `country` varchar(2), `state` varchar(128), `location` varchar(128), `mime` varchar(256), `replica_url` varchar(38), `replica_path` varchar(37), `watermark_url` varchar(40), `watermark_path` varchar(39), `time` datetime);


DROP TABLE IF EXISTS `_authentication`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `_authentication` AS select `account`.`handle` AS `account`,`account`.`username` AS `username`,`account`.`password` AS `password`,ifnull(`authentication`.`token`,'') AS `token`,ifnull(`authentication`.`time`,'1970-01-01 00:00:00') AS `time` from (`account` left join `authentication` on(((`authentication`.`account` = `account`.`handle`) and (`authentication`.`time` > now()))));

DROP TABLE IF EXISTS `_seal`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `_seal` AS select `seal`.`identify` AS `identify`,`seal`.`mime` AS `mime`,concat('/trustseal/',`seal`.`code`) AS `url`,concat('/file/',`seal`.`code`,'-replica.',`seal`.`extension`) AS `replica_url`,concat('file/',`seal`.`code`,'-replica.',`seal`.`extension`) AS `replica_path`,concat('/file/',`seal`.`code`,'-watermark.',`seal`.`extension`) AS `watermark_url`,concat('file/',`seal`.`code`,'-watermark.',`seal`.`extension`) AS `watermark_path`,`seal`.`time` AS `time` from `seal`;

DROP TABLE IF EXISTS `_trustseal`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `_trustseal` AS select `seal`.`code` AS `code`,`profile`.`common` AS `fullname`,`profile`.`organization` AS `organization`,`profile`.`unit` AS `unit`,`profile`.`email` AS `email`,`profile`.`country` AS `country`,`profile`.`state` AS `state`,`profile`.`location` AS `location`,`seal`.`mime` AS `mime`,concat('/file/',`seal`.`code`,'-replica.',`seal`.`extension`) AS `replica_url`,concat('file/',`seal`.`code`,'-replica.',`seal`.`extension`) AS `replica_path`,concat('/file/',`seal`.`code`,'-watermark.',`seal`.`extension`) AS `watermark_url`,concat('file/',`seal`.`code`,'-watermark.',`seal`.`extension`) AS `watermark_path`,`seal`.`time` AS `time` from (`seal` join `profile` on((`profile`.`account` = `seal`.`account`)));

-- 2018-12-21 10:03:45
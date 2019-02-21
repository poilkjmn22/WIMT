DROP SCHEMA IF EXISTS wimt;
CREATE SCHEMA wimt;
USE wimt;
SET AUTOCOMMIT=0;

--
-- Table structure for table `Country`
--

DROP TABLE IF EXISTS `ActivityRound`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ActivityRound` (
  `Date` DATE NOT NULL DEFAULT '1000-01-01',
  PRIMARY KEY (`Date`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Country`
--
-- ORDER BY:  `Code`

INSERT INTO `ActivityRound` VALUES ('2019-02-19');
INSERT INTO `ActivityRound` VALUES ('2019-02-20');
COMMIT;

--
-- Table structure for table `City`
--

DROP TABLE IF EXISTS `Activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Activity` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` char(35) NOT NULL DEFAULT '',
  `LocalName` char(35) NOT NULL DEFAULT '',
  `ActivityRoundDate` DATE NOT NULL DEFAULT '1000-01-01',
  `Duration` char(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `ActivityRoundDate` (`ActivityRoundDate`),
  CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`ActivityRoundDate`) REFERENCES `ActivityRound` (`Date`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `City`
--
-- ORDER BY:  `ID`
INSERT INTO `Activity` VALUES (1,'Work','工作','2019-02-19','8h');
INSERT INTO `Activity` VALUES (2,'Meaningless','无意义','2019-02-19','3h');
INSERT INTO `Activity` VALUES (3,'Entertainment','娱乐','2019-02-19','2h');
INSERT INTO `Activity` VALUES (4,'Knowledge','知识','2019-02-19','2h');
INSERT INTO `Activity` VALUES (5,'ProfessionalSkill','专业技能','2019-02-19','0');
INSERT INTO `Activity` VALUES (6,'Physical','体能','2019-02-19','0');
INSERT INTO `Activity` VALUES (7,'Sleep','睡眠','2019-02-19','9h');

INSERT INTO `Activity` VALUES (8,'Work','工作','2019-02-20','8h');
INSERT INTO `Activity` VALUES (9,'Meaningless','无意义','2019-02-20','4h');
INSERT INTO `Activity` VALUES (10,'Entertainment','娱乐','2019-02-20','1h');
INSERT INTO `Activity` VALUES (11,'Knowledge','知识','2019-02-20','1h');
INSERT INTO `Activity` VALUES (12,'ProfessionalSkill','专业技能','2019-02-20','0');
INSERT INTO `Activity` VALUES (13,'Physical','体能','2019-02-20','0');
INSERT INTO `Activity` VALUES (14,'Sleep','睡眠','2019-02-20','10h');
COMMIT;

SET AUTOCOMMIT=1;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2010-09-30 11:01:37

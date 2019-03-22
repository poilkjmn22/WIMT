/*
 Navicat Premium Data Transfer

 Source Server         : wimt
 Source Server Type    : MySQL
 Source Server Version : 80015
 Source Host           : localhost:3306
 Source Schema         : wimt

 Target Server Type    : MySQL
 Target Server Version : 80015
 File Encoding         : 65001

 Date: 22/03/2019 18:38:08
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for activity
-- ----------------------------
DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity`  (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ActivityClassID` int(11) NOT NULL DEFAULT 1,
  `ActivityRoundDate` date NOT NULL DEFAULT '1000-01-01',
  `Duration` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  `Disable` tinyint(1) UNSIGNED ZEROFILL NOT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `ActivityRoundDate`(`ActivityRoundDate`) USING BTREE,
  INDEX `ActivityClassID`(`ActivityClassID`) USING BTREE,
  CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`ActivityRoundDate`) REFERENCES `activityround` (`Date`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `activity_ibfk_2` FOREIGN KEY (`ActivityClassID`) REFERENCES `activityclass` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 258 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of activity
-- ----------------------------
INSERT INTO `activity` VALUES (1, 1, '2019-02-19', '8h', 0);
INSERT INTO `activity` VALUES (2, 2, '2019-02-19', '3h', 0);
INSERT INTO `activity` VALUES (3, 3, '2019-02-19', '2h', 0);
INSERT INTO `activity` VALUES (4, 4, '2019-02-19', '2h', 0);
INSERT INTO `activity` VALUES (5, 5, '2019-02-19', '0', 0);
INSERT INTO `activity` VALUES (6, 6, '2019-02-19', '0', 0);
INSERT INTO `activity` VALUES (7, 7, '2019-02-19', '9h', 0);
INSERT INTO `activity` VALUES (8, 8, '2019-02-19', '0', 0);
INSERT INTO `activity` VALUES (9, 1, '2019-02-20', '8h', 0);
INSERT INTO `activity` VALUES (10, 2, '2019-02-20', '4h', 0);
INSERT INTO `activity` VALUES (11, 3, '2019-02-20', '1h', 0);
INSERT INTO `activity` VALUES (12, 4, '2019-02-20', '1h', 0);
INSERT INTO `activity` VALUES (13, 5, '2019-02-20', '0', 0);
INSERT INTO `activity` VALUES (14, 6, '2019-02-20', '0', 0);
INSERT INTO `activity` VALUES (15, 7, '2019-02-20', '10h', 0);
INSERT INTO `activity` VALUES (16, 8, '2019-02-20', '0', 0);
INSERT INTO `activity` VALUES (17, 1, '2019-02-21', '8h', 0);
INSERT INTO `activity` VALUES (18, 2, '2019-02-21', '7h', 0);
INSERT INTO `activity` VALUES (19, 3, '2019-02-21', '5.5h', 0);
INSERT INTO `activity` VALUES (20, 4, '2019-02-21', '0.5h', 0);
INSERT INTO `activity` VALUES (21, 5, '2019-02-21', '0', 0);
INSERT INTO `activity` VALUES (22, 6, '2019-02-21', '0', 0);
INSERT INTO `activity` VALUES (23, 7, '2019-02-21', '3h', 0);
INSERT INTO `activity` VALUES (24, 8, '2019-02-21', '0', 0);
INSERT INTO `activity` VALUES (25, 1, '2019-02-22', '8h', 0);
INSERT INTO `activity` VALUES (26, 2, '2019-02-22', '6.5h', 0);
INSERT INTO `activity` VALUES (27, 3, '2019-02-22', '0.5h', 0);
INSERT INTO `activity` VALUES (28, 4, '2019-02-22', '1h', 0);
INSERT INTO `activity` VALUES (29, 5, '2019-02-22', '0', 0);
INSERT INTO `activity` VALUES (30, 6, '2019-02-22', '0', 0);
INSERT INTO `activity` VALUES (31, 7, '2019-02-22', '8h', 0);
INSERT INTO `activity` VALUES (32, 8, '2019-02-22', '0', 0);
INSERT INTO `activity` VALUES (33, 1, '2019-02-23', '0h', 0);
INSERT INTO `activity` VALUES (34, 2, '2019-02-23', '4h', 0);
INSERT INTO `activity` VALUES (35, 3, '2019-02-23', '3h', 0);
INSERT INTO `activity` VALUES (36, 4, '2019-02-23', '3h', 0);
INSERT INTO `activity` VALUES (37, 5, '2019-02-23', '0', 0);
INSERT INTO `activity` VALUES (38, 6, '2019-02-23', '6h', 0);
INSERT INTO `activity` VALUES (39, 7, '2019-02-23', '8h', 0);
INSERT INTO `activity` VALUES (40, 8, '2019-02-23', '0', 0);
INSERT INTO `activity` VALUES (41, 1, '2019-02-24', '0h', 0);
INSERT INTO `activity` VALUES (42, 2, '2019-02-24', '4h', 0);
INSERT INTO `activity` VALUES (43, 3, '2019-02-24', '3h', 0);
INSERT INTO `activity` VALUES (44, 4, '2019-02-24', '3h', 0);
INSERT INTO `activity` VALUES (45, 5, '2019-02-24', '0', 0);
INSERT INTO `activity` VALUES (46, 6, '2019-02-24', '6h', 0);
INSERT INTO `activity` VALUES (47, 7, '2019-02-24', '8h', 0);
INSERT INTO `activity` VALUES (48, 8, '2019-02-24', '0', 0);
INSERT INTO `activity` VALUES (58, 1, '2019-02-25', '8', 0);
INSERT INTO `activity` VALUES (59, 2, '2019-02-25', '4', 0);
INSERT INTO `activity` VALUES (60, 3, '2019-02-25', '0.5', 0);
INSERT INTO `activity` VALUES (61, 4, '2019-02-25', '1', 0);
INSERT INTO `activity` VALUES (62, 5, '2019-02-25', '0', 0);
INSERT INTO `activity` VALUES (63, 6, '2019-02-25', '0.5', 0);
INSERT INTO `activity` VALUES (64, 7, '2019-02-25', '10', 0);
INSERT INTO `activity` VALUES (65, 8, '2019-02-25', '0', 0);
INSERT INTO `activity` VALUES (66, 1, '2019-02-26', '8', 0);
INSERT INTO `activity` VALUES (67, 2, '2019-02-26', '3.5', 0);
INSERT INTO `activity` VALUES (68, 3, '2019-02-26', '0.5', 0);
INSERT INTO `activity` VALUES (69, 4, '2019-02-26', '1.5', 0);
INSERT INTO `activity` VALUES (70, 5, '2019-02-26', '0.5', 0);
INSERT INTO `activity` VALUES (71, 6, '2019-02-26', '1', 0);
INSERT INTO `activity` VALUES (72, 7, '2019-02-26', '9', 0);
INSERT INTO `activity` VALUES (73, 8, '2019-02-26', '0', 0);
INSERT INTO `activity` VALUES (74, 1, '2019-02-27', '8', 0);
INSERT INTO `activity` VALUES (75, 2, '2019-02-27', '5.5', 0);
INSERT INTO `activity` VALUES (76, 3, '2019-02-27', '0.5', 0);
INSERT INTO `activity` VALUES (77, 4, '2019-02-27', '1', 0);
INSERT INTO `activity` VALUES (78, 5, '2019-02-27', '0.5', 0);
INSERT INTO `activity` VALUES (79, 6, '2019-02-27', '0.5', 0);
INSERT INTO `activity` VALUES (80, 7, '2019-02-27', '8', 0);
INSERT INTO `activity` VALUES (81, 8, '2019-02-27', '0', 0);
INSERT INTO `activity` VALUES (82, 1, '2019-02-28', '8', 0);
INSERT INTO `activity` VALUES (83, 2, '2019-02-28', '4.5', 0);
INSERT INTO `activity` VALUES (84, 3, '2019-02-28', '1', 0);
INSERT INTO `activity` VALUES (85, 4, '2019-02-28', '1', 0);
INSERT INTO `activity` VALUES (86, 5, '2019-02-28', '0', 0);
INSERT INTO `activity` VALUES (87, 6, '2019-02-28', '1', 0);
INSERT INTO `activity` VALUES (88, 7, '2019-02-28', '8', 0);
INSERT INTO `activity` VALUES (89, 8, '2019-02-28', '0.5', 0);
INSERT INTO `activity` VALUES (98, 1, '2019-03-01', '8', 0);
INSERT INTO `activity` VALUES (99, 2, '2019-03-01', '5', 0);
INSERT INTO `activity` VALUES (100, 3, '2019-03-01', '2', 0);
INSERT INTO `activity` VALUES (101, 4, '2019-03-01', '0', 0);
INSERT INTO `activity` VALUES (102, 5, '2019-03-01', '0', 0);
INSERT INTO `activity` VALUES (103, 6, '2019-03-01', '1', 0);
INSERT INTO `activity` VALUES (104, 7, '2019-03-01', '8', 0);
INSERT INTO `activity` VALUES (105, 8, '2019-03-01', '0', 0);
INSERT INTO `activity` VALUES (106, 1, '2019-03-02', '0', 0);
INSERT INTO `activity` VALUES (107, 2, '2019-03-02', '2.5', 0);
INSERT INTO `activity` VALUES (108, 3, '2019-03-02', '6', 0);
INSERT INTO `activity` VALUES (109, 4, '2019-03-02', '1', 0);
INSERT INTO `activity` VALUES (110, 5, '2019-03-02', '2', 0);
INSERT INTO `activity` VALUES (111, 6, '2019-03-02', '4', 0);
INSERT INTO `activity` VALUES (112, 7, '2019-03-02', '8', 0);
INSERT INTO `activity` VALUES (113, 8, '2019-03-02', '0.5', 0);
INSERT INTO `activity` VALUES (114, 1, '2019-03-03', '0', 0);
INSERT INTO `activity` VALUES (115, 2, '2019-03-03', '7', 0);
INSERT INTO `activity` VALUES (116, 3, '2019-03-03', '5.5', 0);
INSERT INTO `activity` VALUES (117, 4, '2019-03-03', '1', 0);
INSERT INTO `activity` VALUES (118, 5, '2019-03-03', '3', 0);
INSERT INTO `activity` VALUES (119, 6, '2019-03-03', '2', 0);
INSERT INTO `activity` VALUES (120, 7, '2019-03-03', '5.5', 0);
INSERT INTO `activity` VALUES (121, 8, '2019-03-03', '0', 0);
INSERT INTO `activity` VALUES (122, 1, '2019-03-04', '8', 0);
INSERT INTO `activity` VALUES (123, 2, '2019-03-04', '4.9', 0);
INSERT INTO `activity` VALUES (124, 3, '2019-03-04', '0.5', 0);
INSERT INTO `activity` VALUES (125, 4, '2019-03-04', '2', 0);
INSERT INTO `activity` VALUES (126, 5, '2019-03-04', '0', 0);
INSERT INTO `activity` VALUES (127, 6, '2019-03-04', '0.6', 0);
INSERT INTO `activity` VALUES (128, 7, '2019-03-04', '8', 0);
INSERT INTO `activity` VALUES (129, 8, '2019-03-04', '0', 0);
INSERT INTO `activity` VALUES (130, 1, '2019-03-05', '3', 0);
INSERT INTO `activity` VALUES (131, 2, '2019-03-05', '3', 0);
INSERT INTO `activity` VALUES (132, 3, '2019-03-05', '6', 0);
INSERT INTO `activity` VALUES (133, 4, '2019-03-05', '1.5', 0);
INSERT INTO `activity` VALUES (134, 5, '2019-03-05', '0', 0);
INSERT INTO `activity` VALUES (135, 6, '2019-03-05', '2.5', 0);
INSERT INTO `activity` VALUES (136, 7, '2019-03-05', '8', 0);
INSERT INTO `activity` VALUES (137, 8, '2019-03-05', '0', 0);
INSERT INTO `activity` VALUES (138, 1, '2019-03-06', '8', 0);
INSERT INTO `activity` VALUES (139, 2, '2019-03-06', '4.5', 0);
INSERT INTO `activity` VALUES (140, 3, '2019-03-06', '1.5', 0);
INSERT INTO `activity` VALUES (141, 4, '2019-03-06', '0.5', 0);
INSERT INTO `activity` VALUES (142, 5, '2019-03-06', '0', 0);
INSERT INTO `activity` VALUES (143, 6, '2019-03-06', '0', 0);
INSERT INTO `activity` VALUES (144, 7, '2019-03-06', '9.5', 0);
INSERT INTO `activity` VALUES (145, 8, '2019-03-06', '0', 0);
INSERT INTO `activity` VALUES (146, 1, '2019-03-07', '6', 0);
INSERT INTO `activity` VALUES (147, 2, '2019-03-07', '9', 0);
INSERT INTO `activity` VALUES (148, 3, '2019-03-07', '2', 0);
INSERT INTO `activity` VALUES (149, 4, '2019-03-07', '0.5', 0);
INSERT INTO `activity` VALUES (150, 5, '2019-03-07', '0', 0);
INSERT INTO `activity` VALUES (151, 6, '2019-03-07', '1', 0);
INSERT INTO `activity` VALUES (152, 7, '2019-03-07', '5.5', 0);
INSERT INTO `activity` VALUES (153, 8, '2019-03-07', '0', 0);
INSERT INTO `activity` VALUES (154, 1, '2019-03-08', '8', 0);
INSERT INTO `activity` VALUES (155, 2, '2019-03-08', '4.5', 0);
INSERT INTO `activity` VALUES (156, 3, '2019-03-08', '2', 0);
INSERT INTO `activity` VALUES (157, 4, '2019-03-08', '1.5', 0);
INSERT INTO `activity` VALUES (158, 5, '2019-03-08', '0', 0);
INSERT INTO `activity` VALUES (159, 6, '2019-03-08', '0', 0);
INSERT INTO `activity` VALUES (160, 7, '2019-03-08', '8', 0);
INSERT INTO `activity` VALUES (161, 8, '2019-03-08', '0', 0);
INSERT INTO `activity` VALUES (162, 1, '2019-03-09', '0', 0);
INSERT INTO `activity` VALUES (163, 2, '2019-03-09', '3.5', 0);
INSERT INTO `activity` VALUES (164, 3, '2019-03-09', '7.5', 0);
INSERT INTO `activity` VALUES (165, 4, '2019-03-09', '3.5', 0);
INSERT INTO `activity` VALUES (166, 5, '2019-03-09', '0', 0);
INSERT INTO `activity` VALUES (167, 6, '2019-03-09', '2.5', 0);
INSERT INTO `activity` VALUES (168, 7, '2019-03-09', '7', 0);
INSERT INTO `activity` VALUES (169, 8, '2019-03-09', '0', 0);
INSERT INTO `activity` VALUES (170, 1, '2019-03-10', '0', 0);
INSERT INTO `activity` VALUES (171, 2, '2019-03-10', '4.3', 0);
INSERT INTO `activity` VALUES (172, 3, '2019-03-10', '7', 0);
INSERT INTO `activity` VALUES (173, 4, '2019-03-10', '1.7', 0);
INSERT INTO `activity` VALUES (174, 5, '2019-03-10', '0', 0);
INSERT INTO `activity` VALUES (175, 6, '2019-03-10', '2', 0);
INSERT INTO `activity` VALUES (176, 7, '2019-03-10', '9', 0);
INSERT INTO `activity` VALUES (177, 8, '2019-03-10', '0', 0);
INSERT INTO `activity` VALUES (178, 1, '2019-03-11', '8', 0);
INSERT INTO `activity` VALUES (179, 2, '2019-03-11', '5', 0);
INSERT INTO `activity` VALUES (180, 3, '2019-03-11', '3.5', 0);
INSERT INTO `activity` VALUES (181, 4, '2019-03-11', '0.4', 0);
INSERT INTO `activity` VALUES (182, 5, '2019-03-11', '0', 0);
INSERT INTO `activity` VALUES (183, 6, '2019-03-11', '0.6', 0);
INSERT INTO `activity` VALUES (184, 7, '2019-03-11', '6.5', 0);
INSERT INTO `activity` VALUES (185, 8, '2019-03-11', '0', 0);
INSERT INTO `activity` VALUES (186, 1, '2019-03-12', '8', 0);
INSERT INTO `activity` VALUES (187, 2, '2019-03-12', '4', 0);
INSERT INTO `activity` VALUES (188, 3, '2019-03-12', '1.5', 0);
INSERT INTO `activity` VALUES (189, 4, '2019-03-12', '2', 0);
INSERT INTO `activity` VALUES (190, 5, '2019-03-12', '0', 0);
INSERT INTO `activity` VALUES (191, 6, '2019-03-12', '1', 0);
INSERT INTO `activity` VALUES (192, 7, '2019-03-12', '7.5', 0);
INSERT INTO `activity` VALUES (193, 8, '2019-03-12', '0', 0);
INSERT INTO `activity` VALUES (194, 1, '2019-03-13', '8', 0);
INSERT INTO `activity` VALUES (195, 2, '2019-03-13', '4.8', 0);
INSERT INTO `activity` VALUES (196, 3, '2019-03-13', '1', 0);
INSERT INTO `activity` VALUES (197, 4, '2019-03-13', '2', 0);
INSERT INTO `activity` VALUES (198, 5, '2019-03-13', '0', 0);
INSERT INTO `activity` VALUES (199, 6, '2019-03-13', '0.2', 0);
INSERT INTO `activity` VALUES (200, 7, '2019-03-13', '8', 0);
INSERT INTO `activity` VALUES (201, 8, '2019-03-13', '0', 0);
INSERT INTO `activity` VALUES (202, 1, '2019-03-14', '8', 0);
INSERT INTO `activity` VALUES (203, 2, '2019-03-14', '3', 0);
INSERT INTO `activity` VALUES (204, 3, '2019-03-14', '2', 0);
INSERT INTO `activity` VALUES (205, 4, '2019-03-14', '2.5', 0);
INSERT INTO `activity` VALUES (206, 5, '2019-03-14', '0', 0);
INSERT INTO `activity` VALUES (207, 6, '2019-03-14', '0.5', 0);
INSERT INTO `activity` VALUES (208, 7, '2019-03-14', '8', 0);
INSERT INTO `activity` VALUES (209, 8, '2019-03-14', '0', 0);
INSERT INTO `activity` VALUES (210, 1, '2019-03-15', '0', 0);
INSERT INTO `activity` VALUES (211, 2, '2019-03-15', '2.5', 0);
INSERT INTO `activity` VALUES (212, 3, '2019-03-15', '12.5', 0);
INSERT INTO `activity` VALUES (213, 4, '2019-03-15', '2', 0);
INSERT INTO `activity` VALUES (214, 5, '2019-03-15', '0', 0);
INSERT INTO `activity` VALUES (215, 6, '2019-03-15', '2', 0);
INSERT INTO `activity` VALUES (216, 7, '2019-03-15', '5', 0);
INSERT INTO `activity` VALUES (217, 8, '2019-03-15', '0', 0);
INSERT INTO `activity` VALUES (218, 1, '2019-03-16', '0', 0);
INSERT INTO `activity` VALUES (219, 2, '2019-03-16', '4', 0);
INSERT INTO `activity` VALUES (220, 3, '2019-03-16', '7.5', 0);
INSERT INTO `activity` VALUES (221, 4, '2019-03-16', '1', 0);
INSERT INTO `activity` VALUES (222, 5, '2019-03-16', '0', 0);
INSERT INTO `activity` VALUES (223, 6, '2019-03-16', '2.5', 0);
INSERT INTO `activity` VALUES (224, 7, '2019-03-16', '9', 0);
INSERT INTO `activity` VALUES (225, 8, '2019-03-16', '0', 0);
INSERT INTO `activity` VALUES (226, 1, '2019-03-17', '0', 0);
INSERT INTO `activity` VALUES (227, 2, '2019-03-17', '6', 0);
INSERT INTO `activity` VALUES (228, 3, '2019-03-17', '4', 0);
INSERT INTO `activity` VALUES (229, 4, '2019-03-17', '4', 0);
INSERT INTO `activity` VALUES (230, 5, '2019-03-17', '0', 0);
INSERT INTO `activity` VALUES (231, 6, '2019-03-17', '2', 0);
INSERT INTO `activity` VALUES (232, 7, '2019-03-17', '8', 0);
INSERT INTO `activity` VALUES (233, 8, '2019-03-17', '0', 0);
INSERT INTO `activity` VALUES (234, 1, '2019-03-18', '8', 0);
INSERT INTO `activity` VALUES (235, 2, '2019-03-18', '4', 0);
INSERT INTO `activity` VALUES (236, 3, '2019-03-18', '1', 0);
INSERT INTO `activity` VALUES (237, 4, '2019-03-18', '1', 0);
INSERT INTO `activity` VALUES (238, 5, '2019-03-18', '0', 0);
INSERT INTO `activity` VALUES (239, 6, '2019-03-18', '0', 0);
INSERT INTO `activity` VALUES (240, 7, '2019-03-18', '10', 0);
INSERT INTO `activity` VALUES (241, 8, '2019-03-18', '0', 0);
INSERT INTO `activity` VALUES (242, 1, '2019-03-19', '8', 0);
INSERT INTO `activity` VALUES (243, 2, '2019-03-19', '3.5', 0);
INSERT INTO `activity` VALUES (244, 3, '2019-03-19', '0.5', 0);
INSERT INTO `activity` VALUES (245, 4, '2019-03-19', '2', 0);
INSERT INTO `activity` VALUES (246, 5, '2019-03-19', '0', 0);
INSERT INTO `activity` VALUES (247, 6, '2019-03-19', '0', 0);
INSERT INTO `activity` VALUES (248, 7, '2019-03-19', '10', 0);
INSERT INTO `activity` VALUES (249, 8, '2019-03-19', '0', 0);
INSERT INTO `activity` VALUES (250, 1, '2019-03-20', '8', 0);
INSERT INTO `activity` VALUES (251, 2, '2019-03-20', '4.5', 0);
INSERT INTO `activity` VALUES (252, 3, '2019-03-20', '1', 0);
INSERT INTO `activity` VALUES (253, 4, '2019-03-20', '1.5', 0);
INSERT INTO `activity` VALUES (254, 5, '2019-03-20', '0', 0);
INSERT INTO `activity` VALUES (255, 6, '2019-03-20', '0.5', 0);
INSERT INTO `activity` VALUES (256, 7, '2019-03-20', '8', 0);
INSERT INTO `activity` VALUES (257, 8, '2019-03-20', '0.5', 0);
INSERT INTO `activity` VALUES (258, 1, '2019-03-21', '8', 0);
INSERT INTO `activity` VALUES (259, 2, '2019-03-21', '4.5', 0);
INSERT INTO `activity` VALUES (260, 3, '2019-03-21', '3', 0);
INSERT INTO `activity` VALUES (261, 4, '2019-03-21', '1.5', 0);
INSERT INTO `activity` VALUES (262, 5, '2019-03-21', '0', 0);
INSERT INTO `activity` VALUES (263, 6, '2019-03-21', '0', 0);
INSERT INTO `activity` VALUES (264, 7, '2019-03-21', '7', 0);
INSERT INTO `activity` VALUES (265, 8, '2019-03-21', '0', 0);

-- ----------------------------
-- Table structure for activityclass
-- ----------------------------
DROP TABLE IF EXISTS `activityclass`;
CREATE TABLE `activityclass`  (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` char(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `LocalName` char(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of activityclass
-- ----------------------------
INSERT INTO `activityclass` VALUES (1, 'Work', '工作');
INSERT INTO `activityclass` VALUES (2, 'Meaningless', '无意义');
INSERT INTO `activityclass` VALUES (3, 'Entertainment', '娱乐');
INSERT INTO `activityclass` VALUES (4, 'Knowledge', '知识');
INSERT INTO `activityclass` VALUES (5, 'ProfessionalSkill', '专业技能');
INSERT INTO `activityclass` VALUES (6, 'Physical', '体能');
INSERT INTO `activityclass` VALUES (7, 'Sleep', '睡眠');
INSERT INTO `activityclass` VALUES (8, 'Thinking', '反思');

-- ----------------------------
-- Table structure for activityclassinfo
-- ----------------------------
DROP TABLE IF EXISTS `activityclassinfo`;
CREATE TABLE `activityclassinfo`  (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ActivityClassID` int(11) NOT NULL DEFAULT 1,
  `Color` char(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `ActivityClassID`(`ActivityClassID`) USING BTREE,
  CONSTRAINT `activity_ibfk_3` FOREIGN KEY (`ActivityClassID`) REFERENCES `activityclass` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of activityclassinfo
-- ----------------------------
INSERT INTO `activityclassinfo` VALUES (1, 1, '#35495e');
INSERT INTO `activityclassinfo` VALUES (2, 2, '#909399');
INSERT INTO `activityclassinfo` VALUES (3, 3, '#f56c6c');
INSERT INTO `activityclassinfo` VALUES (4, 4, '#67c23a');
INSERT INTO `activityclassinfo` VALUES (5, 5, '#ffd04b');
INSERT INTO `activityclassinfo` VALUES (6, 6, '#e6a23c');
INSERT INTO `activityclassinfo` VALUES (7, 7, '#000');
INSERT INTO `activityclassinfo` VALUES (8, 8, '#888');

-- ----------------------------
-- Table structure for activityround
-- ----------------------------
DROP TABLE IF EXISTS `activityround`;
CREATE TABLE `activityround`  (
  `Date` date NOT NULL DEFAULT '1000-01-01',
  PRIMARY KEY (`Date`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of activityround
-- ----------------------------
INSERT INTO `activityround` VALUES ('2019-02-19');
INSERT INTO `activityround` VALUES ('2019-02-20');
INSERT INTO `activityround` VALUES ('2019-02-21');
INSERT INTO `activityround` VALUES ('2019-02-22');
INSERT INTO `activityround` VALUES ('2019-02-23');
INSERT INTO `activityround` VALUES ('2019-02-24');
INSERT INTO `activityround` VALUES ('2019-02-25');
INSERT INTO `activityround` VALUES ('2019-02-26');
INSERT INTO `activityround` VALUES ('2019-02-27');
INSERT INTO `activityround` VALUES ('2019-02-28');
INSERT INTO `activityround` VALUES ('2019-03-01');
INSERT INTO `activityround` VALUES ('2019-03-02');
INSERT INTO `activityround` VALUES ('2019-03-03');
INSERT INTO `activityround` VALUES ('2019-03-04');
INSERT INTO `activityround` VALUES ('2019-03-05');
INSERT INTO `activityround` VALUES ('2019-03-06');
INSERT INTO `activityround` VALUES ('2019-03-07');
INSERT INTO `activityround` VALUES ('2019-03-08');
INSERT INTO `activityround` VALUES ('2019-03-09');
INSERT INTO `activityround` VALUES ('2019-03-10');
INSERT INTO `activityround` VALUES ('2019-03-11');
INSERT INTO `activityround` VALUES ('2019-03-12');
INSERT INTO `activityround` VALUES ('2019-03-13');
INSERT INTO `activityround` VALUES ('2019-03-14');
INSERT INTO `activityround` VALUES ('2019-03-15');
INSERT INTO `activityround` VALUES ('2019-03-16');
INSERT INTO `activityround` VALUES ('2019-03-17');
INSERT INTO `activityround` VALUES ('2019-03-18');
INSERT INTO `activityround` VALUES ('2019-03-19');
INSERT INTO `activityround` VALUES ('2019-03-20');
INSERT INTO `activityround` VALUES ('2019-03-21');

SET FOREIGN_KEY_CHECKS = 1;

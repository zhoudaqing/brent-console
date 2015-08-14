/*
Navicat MySQL Data Transfer

Source Server         : covito
Source Server Version : 50515
Source Host           : localhost:3306
Source Database       : brent_console

Target Server Type    : MYSQL
Target Server Version : 50515
File Encoding         : 65001

Date: 2015-04-13 18:20:30
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `sys_branch`
-- ----------------------------
DROP TABLE IF EXISTS `sys_branch`;
CREATE TABLE `sys_branch` (
  `BranchInnerCode` varchar(100) NOT NULL,
  `BranchCode` varchar(100) DEFAULT NULL,
  `ParentInnerCode` varchar(100) NOT NULL,
  `Type` varchar(1) NOT NULL,
  `OrderFlag` bigint(20) NOT NULL,
  `Name` varchar(2000) NOT NULL,
  `TreeLevel` bigint(20) NOT NULL,
  `IsLeaf` varchar(2) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Fax` varchar(20) DEFAULT NULL,
  `Manager` varchar(100) DEFAULT NULL,
  `Leader1` varchar(100) DEFAULT NULL,
  `Leader2` varchar(100) DEFAULT NULL,
  `Prop1` varchar(50) DEFAULT NULL,
  `Prop2` varchar(50) DEFAULT NULL,
  `Prop3` varchar(50) DEFAULT NULL,
  `Prop4` varchar(50) DEFAULT NULL,
  `Memo` varchar(100) DEFAULT NULL,
  `AddTime` datetime NOT NULL,
  `AddUser` varchar(200) NOT NULL,
  `ModifyTime` datetime DEFAULT NULL,
  `ModifyUser` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`BranchInnerCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_branch
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_code`
-- ----------------------------
DROP TABLE IF EXISTS `sys_code`;
CREATE TABLE `sys_code` (
  `CodeType` varchar(40) NOT NULL,
  `ParentCode` varchar(40) NOT NULL,
  `CodeValue` varchar(40) NOT NULL,
  `CodeName` varchar(2000) NOT NULL,
  `CodeOrder` bigint(20) NOT NULL,
  `Prop1` varchar(40) DEFAULT NULL,
  `Prop2` varchar(40) DEFAULT NULL,
  `Prop3` varchar(40) DEFAULT NULL,
  `Prop4` varchar(40) DEFAULT NULL,
  `Memo` varchar(400) DEFAULT NULL,
  `AddTime` datetime NOT NULL,
  `AddUser` varchar(200) NOT NULL,
  `ModifyTime` datetime DEFAULT NULL,
  `ModifyUser` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`CodeType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_code
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_config`
-- ----------------------------
DROP TABLE IF EXISTS `sys_config`;
CREATE TABLE `sys_config` (
  `Code` varchar(100) NOT NULL,
  `Name` varchar(400) NOT NULL,
  `Value` varchar(4000) NOT NULL,
  `Prop1` varchar(50) DEFAULT NULL,
  `Prop2` varchar(50) DEFAULT NULL,
  `Prop3` varchar(50) DEFAULT NULL,
  `Prop4` varchar(50) DEFAULT NULL,
  `Memo` varchar(40) DEFAULT NULL,
  `AddTime` datetime NOT NULL,
  `AddUser` varchar(200) NOT NULL,
  `ModifyTime` datetime DEFAULT NULL,
  `ModifyUser` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`Code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_config
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_district`
-- ----------------------------
DROP TABLE IF EXISTS `sys_district`;
CREATE TABLE `sys_district` (
  `Code` varchar(6) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `CodeOrder` varchar(20) DEFAULT NULL,
  `TreeLevel` int(11) DEFAULT NULL,
  `Type` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`Code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_district
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_maxno`
-- ----------------------------
DROP TABLE IF EXISTS `sys_maxno`;
CREATE TABLE `sys_maxno` (
  `NoType` varchar(20) NOT NULL,
  `NoSubType` varchar(255) NOT NULL,
  `NoMaxValue` bigint(20) NOT NULL,
  `Length` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`NoType`,`NoSubType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_maxno
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_menu`
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
  `MenuCode` varchar(100) NOT NULL,
  `ParentCode` varchar(100) DEFAULT NULL,
  `MenuName` varchar(2000) NOT NULL,
  `MenuType` varchar(20) DEFAULT NULL COMMENT '菜单|功能',
  `Icon` varchar(100) DEFAULT NULL,
  `Prop1` varchar(50) DEFAULT NULL,
  `Prop2` varchar(50) DEFAULT NULL,
  `Memo` varchar(1000) DEFAULT NULL,
  `AddTime` datetime NOT NULL,
  `AddUser` varchar(200) NOT NULL,
  `ModifyTime` datetime DEFAULT NULL,
  `ModifyUser` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`MenuCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_message`
-- ----------------------------
DROP TABLE IF EXISTS `sys_message`;
CREATE TABLE `sys_message` (
  `ID` bigint(20) NOT NULL,
  `FromUser` varchar(50) DEFAULT NULL,
  `ToUser` varchar(50) DEFAULT NULL,
  `Box` varchar(10) DEFAULT NULL,
  `ReadFlag` bigint(20) DEFAULT NULL,
  `PopFlag` bigint(20) DEFAULT NULL,
  `DelByFromUser` bigint(20) DEFAULT NULL,
  `DelByToUser` bigint(20) DEFAULT NULL,
  `Subject` varchar(500) DEFAULT NULL,
  `Content` mediumtext,
  `AddTime` datetime DEFAULT NULL,
  `RedirectURL` varchar(500) DEFAULT NULL,
  `Prop1` varchar(100) DEFAULT NULL,
  `Prop2` varchar(100) DEFAULT NULL,
  `Prop3` varchar(100) DEFAULT NULL,
  `Prop4` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_message
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_privilege`
-- ----------------------------
DROP TABLE IF EXISTS `sys_privilege`;
CREATE TABLE `sys_privilege` (
  `OwnerType` varchar(3) NOT NULL,
  `Owner` varchar(100) NOT NULL,
  `Privs` mediumtext,
  `AddTime` datetime NOT NULL,
  `AddUser` varchar(50) NOT NULL,
  `ModifyTime` datetime DEFAULT NULL,
  `ModifyUser` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`OwnerType`,`Owner`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_privilege
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_role`
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `RoleCode` varchar(200) NOT NULL,
  `RoleName` varchar(2000) NOT NULL,
  `BranchInnerCode` varchar(100) NOT NULL,
  `Prop1` varchar(50) DEFAULT NULL,
  `Prop2` varchar(50) DEFAULT NULL,
  `Memo` varchar(1000) DEFAULT NULL,
  `AddTime` datetime NOT NULL,
  `AddUser` varchar(200) NOT NULL,
  `ModifyTime` datetime DEFAULT NULL,
  `ModifyUser` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`RoleCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_role
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_site`
-- ----------------------------
DROP TABLE IF EXISTS `sys_site`;
CREATE TABLE `sys_site` (
  `ID` bigint(20) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Info` varchar(200) DEFAULT NULL,
  `BranchInnerCode` varchar(100) NOT NULL,
  `URL` varchar(100) NOT NULL,
  `OrderFlag` bigint(20) DEFAULT NULL,
  `LogoFile` varchar(100) DEFAULT NULL,
  `Prop1` varchar(100) DEFAULT NULL,
  `Prop2` varchar(100) DEFAULT NULL,
  `Prop3` varchar(100) DEFAULT NULL,
  `Prop4` varchar(100) DEFAULT NULL,
  `AddUser` varchar(50) NOT NULL,
  `AddTime` datetime NOT NULL,
  `ModifyUser` varchar(50) DEFAULT NULL,
  `ModifyTime` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_site
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_uid`
-- ----------------------------
DROP TABLE IF EXISTS `sys_uid`;
CREATE TABLE `sys_uid` (
  `UID` varchar(50) NOT NULL DEFAULT '',
  `CreateSYS` varchar(10) DEFAULT NULL,
  `AddTime` datetime DEFAULT NULL,
  PRIMARY KEY (`UID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_uid
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_uid_sysid`
-- ----------------------------
DROP TABLE IF EXISTS `sys_uid_sysid`;
CREATE TABLE `sys_uid_sysid` (
  `UID` varchar(50) DEFAULT NULL,
  `SYS` varchar(10) DEFAULT NULL,
  `SysID` varchar(50) DEFAULT NULL,
  `AddTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_uid_sysid
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_user`
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `UserName` varchar(200) NOT NULL,
  `RealName` varchar(1000) DEFAULT NULL,
  `Password` varchar(100) NOT NULL,
  `BranchInnerCode` varchar(100) NOT NULL,
  `IsBranchAdmin` varchar(2) NOT NULL,
  `Status` varchar(50) NOT NULL,
  `Type` varchar(2) DEFAULT NULL,
  `Maxim` varchar(400) DEFAULT NULL,
  `Portrait` varchar(200) DEFAULT NULL,
  `Sex` varchar(2) DEFAULT NULL,
  `Email` varchar(100) NOT NULL,
  `Tel` varchar(20) DEFAULT NULL,
  `Mobile` varchar(50) DEFAULT NULL,
  `LastLoginTime` datetime DEFAULT NULL,
  `LastLoginIP` varchar(50) DEFAULT NULL,
  `Prop1` varchar(50) DEFAULT NULL,
  `Prop2` varchar(50) DEFAULT NULL,
  `Prop6` varchar(50) DEFAULT NULL,
  `Prop5` varchar(50) DEFAULT NULL,
  `Prop4` varchar(100) DEFAULT NULL,
  `Prop3` varchar(100) DEFAULT NULL,
  `Memo` varchar(100) DEFAULT NULL,
  `AddTime` datetime NOT NULL,
  `AddUser` varchar(200) NOT NULL,
  `ModifyTime` datetime DEFAULT NULL,
  `ModifyUser` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`UserName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_user
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_user_log`
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_log`;
CREATE TABLE `sys_user_log` (
  `UserName` varchar(200) NOT NULL,
  `LogID` bigint(20) NOT NULL,
  `IP` varchar(40) DEFAULT NULL,
  `LogType` varchar(50) NOT NULL,
  `SubType` varchar(50) DEFAULT NULL,
  `LogMessage` varchar(3000) DEFAULT NULL,
  `Memo` varchar(40) DEFAULT NULL,
  `AddTime` datetime NOT NULL,
  PRIMARY KEY (`UserName`,`LogID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_user_log
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_user_role`
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
  `UserName` varchar(50) NOT NULL,
  `RoleCode` varchar(200) NOT NULL,
  `Prop1` varchar(50) DEFAULT NULL,
  `Prop2` varchar(50) DEFAULT NULL,
  `Memo` varchar(100) DEFAULT NULL,
  `AddTime` datetime NOT NULL,
  `AddUser` varchar(200) NOT NULL,
  `ModifyTime` datetime DEFAULT NULL,
  `ModifyUser` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`UserName`,`RoleCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------

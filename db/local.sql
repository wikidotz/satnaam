-- MySQL dump 10.13  Distrib 5.5.9, for Win32 (x86)
--
-- Host: localhost    Database: chatnaka_hoteldb
-- ------------------------------------------------------
-- Server version	5.5.9

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `cat_id` int(3) NOT NULL AUTO_INCREMENT,
  `cat_name` varchar(50) NOT NULL,
  `cat_desc` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`cat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Chaat','description'),(2,'Sandwitches','description'),(3,'Grill Sandwitches','description'),(4,'Pizza','description'),(5,'Panini','dsecription'),(6,'Garlic Breads','description goes here');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer` (
  `cust_id` int(10) NOT NULL AUTO_INCREMENT,
  `cust_first_name` varchar(100) NOT NULL,
  `cust_last_name` varchar(100) NOT NULL,
  `cust_nick_name` varchar(100) DEFAULT NULL,
  `cust_mobile` int(10) NOT NULL,
  `cust_email` varchar(100) DEFAULT NULL,
  `cust_desc` varchar(300) DEFAULT NULL,
  `cust_address1` varchar(500) NOT NULL,
  `cust_city1` varchar(30) NOT NULL,
  `cust_state1` varchar(30) NOT NULL,
  `cust_address2` varchar(500) DEFAULT NULL,
  `cust_city2` varchar(30) DEFAULT NULL,
  `cust_state2` varchar(30) DEFAULT NULL,
  `cust_created_by` varchar(100) DEFAULT NULL,
  `cust_created_date` datetime DEFAULT NULL,
  `cust_modified_by` varchar(100) DEFAULT NULL,
  `cust_modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`cust_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_product`
--

DROP TABLE IF EXISTS `order_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_product` (
  `OP_ORDER_ID` int(10) NOT NULL,
  `OP_PROD_ID` int(10) NOT NULL,
  `OP_CATEGORY_ID` int(10) NOT NULL,
  `OP_QUANTITY` int(3) DEFAULT NULL,
  `OP_RATE` double DEFAULT NULL,
  `OP_AMOUNT` double DEFAULT NULL,
  `OP_WEIGHT` varchar(10) DEFAULT NULL,
  `OP_SIZE` varchar(10) DEFAULT NULL,
  `OP_PARCEL` int(1) NOT NULL COMMENT '1=YES 0=NO',
  `OP_DESC` varchar(300) DEFAULT NULL,
  `OP_STATUS` int(1) DEFAULT NULL,
  KEY `ORDER_PRODUCT_FK_1` (`OP_ORDER_ID`),
  KEY `ORDER_PRODUCT_FK_2` (`OP_PROD_ID`),
  KEY `ORDER_PRODUCT_FK_3` (`OP_CATEGORY_ID`),
  CONSTRAINT `ORDER_PRODUCT_FK_1` FOREIGN KEY (`OP_ORDER_ID`) REFERENCES `orders` (`ORDER_ID`),
  CONSTRAINT `ORDER_PRODUCT_FK_2` FOREIGN KEY (`OP_PROD_ID`) REFERENCES `product` (`PROD_ID`),
  CONSTRAINT `ORDER_PRODUCT_FK_3` FOREIGN KEY (`OP_CATEGORY_ID`) REFERENCES `category` (`cat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_product`
--

LOCK TABLES `order_product` WRITE;
/*!40000 ALTER TABLE `order_product` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `order_id` int(10) NOT NULL AUTO_INCREMENT,
  `cust_id` int(10) NOT NULL,
  `order_token_no` varchar(50) DEFAULT NULL,
  `order_table_no` int(2) DEFAULT NULL,
  `order_total_amt` double DEFAULT NULL,
  `order_total_qty` int(3) DEFAULT NULL,
  `order_expct_time` int(3) NOT NULL,
  `order_date` datetime DEFAULT NULL,
  `order_status` int(1) NOT NULL COMMENT '1=orderd 0=not ordered',
  `order_pay_status` varchar(20) DEFAULT 'none' COMMENT 'full, partial, none',
  `order_mng_emp_id` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `orders_fk_1` (`cust_id`),
  CONSTRAINT `orders_fk_1` FOREIGN KEY (`cust_id`) REFERENCES `customer` (`cust_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `prod_id` int(10) NOT NULL AUTO_INCREMENT,
  `prod_category_id` int(10) NOT NULL,
  `prod_name` varchar(200) NOT NULL,
  `prod_dispname` varchar(50) NOT NULL,
  `prod_desc` varchar(500) NOT NULL,
  `prod_ingredients` varchar(500) NOT NULL,
  `prod_rate` double NOT NULL,
  `prod_available` int(1) DEFAULT NULL COMMENT '1=available 0=notavailable',
  `prod_size` varchar(10) DEFAULT NULL,
  `prod_weight` varchar(10) DEFAULT NULL,
  `prod_veg_nonveg` int(1) NOT NULL COMMENT '1=veg 0=nonveg',
  `prod_pre_time` int(3) NOT NULL,
  `prod_created_by` varchar(100) DEFAULT NULL,
  `prod_created_date` datetime DEFAULT NULL,
  `prod_modified_by` varchar(100) DEFAULT NULL,
  `prod_modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`prod_id`),
  KEY `product_fk_1` (`prod_category_id`),
  CONSTRAINT `product_fk_1` FOREIGN KEY (`prod_category_id`) REFERENCES `category` (`cat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,1,'SEVPURI','SP','description goes here','null',30,1,'null','null',1,120,'ADMIN',NULL,'ADMIN',NULL),(2,1,'BHELPURI','BHEL','null','null',30,1,'null','null',1,120,'ADMIN',NULL,'ADMIN',NULL),(3,2,'VEG SANDWITCH','SADA','descrioption goes here','null',30,1,NULL,NULL,1,180,'ADMIN',NULL,'ADMIN',NULL),(4,2,'VEG MASALA TOAST','TOAST','DESCRIPTION GOES HERE','null',35,1,'null','null',1,600,'ADMIN',NULL,'ADMIN',NULL),(5,3,'SP.VEG CHESS GRILL','CHEESE GRILL','DESC','null',90,1,'null','',1,900,'ADMIN',NULL,'ADMIN',NULL),(6,3,'SP.CHILLY CHEESE GRILL','CHILLY GRILL','DESC','null',100,1,NULL,NULL,1,110,'ADMIN',NULL,'ADMIN',NULL),(7,3,'MINI VEG CHEESE GRILL','MINI CHEESE GRILL','DESC','null',70,1,NULL,NULL,1,900,'ADMIN',NULL,'ADMIN',NULL),(8,4,'VEG CHEESE PIZZA','PIZZA','DESC','null',110,1,NULL,NULL,1,900,'ADMIN',NULL,'ADMIN',NULL),(9,4,'VEG PANEER CHEESE PIZZA ','PANEER PIZZA','DESC','null',130,1,NULL,NULL,1,900,'ADMIN',NULL,'ADMIN',NULL);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-07-28 16:40:21

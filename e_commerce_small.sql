-- MySQL dump 10.13  Distrib 5.7.18, for osx10.12 (x86_64)
--
-- Host: localhost    Database: e_commerce
-- ------------------------------------------------------
-- Server version	5.7.18

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
-- Current Database: `e_commerce`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `e_commerce` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `e_commerce`;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'customer',
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_status`
--

CREATE TABLE IF NOT EXISTS `user_status` (
  `username` varchar(255) NOT NULL,
  `user_status` TEXT NOT NULL,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `username` (`username` ASC),
  CONSTRAINT `user_status_ibfk_1`
    FOREIGN KEY (`username`)
    REFERENCES `users` (`username`)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `asin` varchar(50) NOT NULL,
  `productName` varchar(2040) DEFAULT NULL,
  `productDescription` varchar(5050) DEFAULT NULL,
  `pgroup` varchar(5050) DEFAULT NULL,
  PRIMARY KEY (`asin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('Jenny','Admin','','','','','','jadmin','admin', 'admin');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO products (productName, pgroup, productDescription, asin) VALUES ('Everyday Italian (with Giada de Laurentiis), Volume 1 (3 Pack): Italian Classics, Parties, Holidays', 'Movies & TV,Movies', '3Pack DVD set - Italian Classics, Parties and Holidays.', '0000143561'), ('Purple Sequin Tiny Dancer Tutu Ballet Dance Fairy Princess Costume Accessory', 'Clothing, Shoes & Jewelry,Girls', '', '0000037214'), ('Adult Ballet Tutu Cheetah Pink', 'Sports & Outdoors,Other Sports,Dance,Clothing,Girls,Skirts', '', '0000032069'), ('Girls Ballet Tutu Neon Pink', 'Sports & Outdoors,Other Sports,Dance', 'High quality 3 layer ballet tutu. 12 inches in length', '0000031909'), ('Adult Ballet Tutu Yellow', 'Sports & Outdoors,Other Sports,Dance,Clothing,Girls,Skirts', '', '0000032034'), ('Girls Ballet Tutu Zebra Hot Pink', 'Sports & Outdoors,Other Sports,Dance', 'TUtu', '0000031852'), ('The Way Things Work: An Illustrated Encyclopedia of Technology', 'Books', '', '0000913154'), ('Adult Ballet Tutu Purple', 'Sports & Outdoors,Other Sports,Dance,Clothing,Girls,Skirts', '', '0000032050'), ('Celebremos Su Gloria', 'Books', '', '0001064487'), ('Who on Earth is Tom Baker?', 'Books', '', '0001053655'), ('Double-Speak: From Revenue Enhancement to Terminal Living--How Government, Business, Advertisers and Others Use Language to Deceive You', 'Books', '', '0000038504'), ('My Fair Pastry (Good Eats Vol. 9)', 'Movies & TV,Movies', 'Disc 1: Flour Power (Scones; Shortcakes; Southern Biscuits; Salmon Turnovers; Fruit Tart; Funnel Cake; Sweet or Savory; Pte  Choux) Disc 2: Super Sweets 4 (Banana Spitsville; Burned Peach Ice Cream; Chocolate Taffy; Acid Jellies; Peanut Brittle; Chocolate Fudge; Peanut Butter Fudge) Disc 3: Super Sweets 5 (Lemon Meringue Pie; Pie Crust; Yeast Doughnuts; Doughnut Glaze; Chocolate Doughnut Glaze; Sugar Cookies; Royal Icing; Chocolate Peppermint Pinwheel Cookies)', '0000143529'), ('MKSAP 15 Audio Companion', 'Books', '', '0000477141'), ('Misty of Chincoteague', 'Books', '', '0001381245'), ('Ballet Dress-Up Fairy Tutu', 'Clothing, Shoes & Jewelry,Girls,Clothing,Active,Active Skirts', 'This adorable basic ballerina tutu is perfect for dance recitals. Fairy Princes Dress up, costume, play and much. Comes individually packaged. Use for a Tinkerbell dress up accessory and watch her flutter excitedly for hours in her tutu. Very soft elastic waist that is trimmed in satin and stretches to fit from an average size 3 to a size 8.', '0000031887'), ('The Greatest Book on &quot;Dispensational Truth&quot; in the World', 'Books', '', '0001473727'), ('Chess for Young Beginners', 'Books', '', '0001061127'), ('The Little Engine That Could: Pop-up Book', 'Books', '', '0001384198'), ('The Simple Truths of Service: Inspired by Johnny the Bagger', 'Books', '', '0000230022'), ('Girls Ballet Tutu Neon Blue', 'Sports & Outdoors,Other Sports,Dance', 'Dance tutu for girls ages 2-8 years. Perfect for dance practice, recitals and performances, costumes or just for fun!', '0000031895'), ('Evaluating Research in Academic Journals - A Practical Guide to Realistic Evaluation (5th Fifth Edition) - By Fred Pyrczak', 'Books', '', '0000174076'), ('Georgina Goodman Nelson Womens Size 8.5 Purple Regular Suede Platforms Shoes', 'Books', '', '0000000116'), ('Heavenly Highway Hymns: Shaped-Note Hymnal', 'Books', '', '0000013714'), ('Praise Aerobics [VHS]', 'Movies & TV,Movies', 'Praise Aerobics - A low-intensity/high-intesity low impact aerobic workout.', '0001517791'), ('Polished Communion Tray', 'Books', '', '0001436163'), ('Dr. Seuss ABC (Dr.Seuss Classic Collection) (Spanish Edition)', 'Books', '', '0001713086'), ('Noddy Story Book Treasury', 'Books', '', '0001361155'), ('The Book of Daniel', 'Books', '', '0001472933'), ('The Travels of Doctor Dolittle (Beginner Series)', 'Books', 'Illus. in full color. The adventures of Dr. Dolittle, the veterinarian who can talk to his patients, have been charming children the world over since 1920. This edition offers the only text especially adapted for beginning readers.&#160;&#160;--This text refers to an out of print or unavailable edition of this title.', '000171130X'), ('My Anastasia Storybook (Anastasia)', 'Books', '', '0001361139'), ('star wars a pop-up book', 'Books', '', '0001062395'), ('Rightly Dividing the Word', 'Books', '--This text refers to thePaperbackedition.', '0001473905'), ('Mksap 16 Audio Companion: Medical Knowledge Self-Assessment Program', 'Books', '', '000047715X'), ('The Things in Mouldy Manor (Spooky Pop Ups)', 'Books', '', '0001386301'), ('Worship with Don Moen [VHS]', 'Movies & TV,Movies', 'Worship with Don Moen [VHS]', '0001516035'), ('Lift Him Up With Ron Kenoly [VHS]', 'CDs & Vinyl,Christian,Pop & Contemporary', 'Lenny LeBlanc, Alex Acuna, Justo Almario, Tom Brooks, Abraham Laboriel, Chester Thompson', '0001501348'), ('Mog and Me (Mog the Cat Board Books)', 'Books', '&#8220;Soft pastel illustrations lend a friendly, calm feeling to the adventures.&#8221; --Publisher Weekly', '0001384163'), ('You Are Special Today Red Plate [With Red Pen]', 'Books', '', '0001487795'), ('The Berenstain Bears on the Moon (Bright and Early Books)', 'Books', 'PreSchool-Grade 2 A delightful tale told in rhyme and supported by captivating color illustrations. In an adventure to the moon and back, the bears and their pooch cope with weightlessness, meteor showers and moon dust. They explore, plant a flag, take notes and collect moon rocks. The Berenstains have once again produced a winner for beginning readers. Anne Wirkkala, Springfield Center Central Sch . , N.Y.Copyright 2002 Reed Business Information, Inc.--This text refers to an out of print or unavailable edition of this title.', '0001714538'), ('Medieval Castle: A Carousel Pop-up Book (Pop Up)', 'Books', '', '0001360779'), ('Heidi Grows Up', 'Books', '', '000161102X'), ('Songs for the Shepherd', 'CDs & Vinyl,Christian', 'Audio CD', '0001393774'), ('The Very Bad Bunny (Beginner Series)', 'Books', 'By Marilyn Sadler, Illustrated by Roger Bollen', '0001714384'), ('Thirteen for Luck', 'Books', '', '0001848062'), ('The Bayeux Tapestry: The Norman Conquest 1066', 'Books', '', '0001950584'), ('Malta Convoy', 'Books', '', '0001922408'), ('Hanging Out with Cici', 'Books', '', '0001955837'), ('The Adventures of Mog', 'Books', '', '0001937782'), ('The Treasure Hunt (Percy the Park Keeper)', 'Books', 'The Rescue Party:&#x2018;&#x2026;it&#x2019;s good for reading aloud to under-fives, and later the six-pluses will still want to read it themselves.&#x2019; The Independent on SundayAfter the Storm:&#x2018;&#x2026;look no further for the best present for any child from two to six.&#x2019; Susan Hill, The Sunday TimesPercy&#x2019;s Bumpy Ride:&#x2018;Imaginatively detailed illustrations and just the right amount of suspense.&#x2019; Practical ParentingOne Snowy Night&#x2018;A heartwarming bedtime tale&#x2026;&#x2019; Susan Hill, The Independent--This text refers to thePaperbackedition.', '0001981315'), ('The Laughing Dragon', 'Books', '', '0001954563'), ('Noddy Gets Into Trouble', 'Books', '', '0001982559'), ('Tales from Brambly Hedge', 'Books', '', '0001982796'), ('Special Days: Pop-up Book (Mini-Nister Pop-ups)', 'Books', '', '0001959735'), ('Noddy and Tessie Bear', 'Books', '', '0001982419'), ('Princess and the Goblin (Abridged Classics)', 'Books', '', '0001846590'), ('The Lion, the Witch and the Wardrobe (The Chronicles of Narnia)', 'Books', 'Born to a coal-mining family in 1945, Robin Lawrie emigrated to Canada in 1953 and lived in Vancouver till 1968. Returning then to Britain, his freelance career as an illustrator and occasional author has continued until the present day.  He now lives in the Shorpshire hills with his wife and two children and tries to divide his time between the demands of freelance work, a young family, and restoring an ancient timber-framed farmhouse.', '0001939777'), ('The Rainbow Serpent', 'Books', '', '0001850164'), ('Little Grey Rabbit Goes to the Sea (Little Grey Rabbit Classic Series)', 'Books', 'Alison Uttley was born and brought up on a farm in Derbyshire at the end of the 19th century. Her Little Grey Rabbit series has delighted generations of children. Her love of country life -- gathering spring flowers, picnicking in summer meadows and skating on frozen ponds -- comes through vividly in her stories.', '0001983938'), ('The Big M: The Frank Mahovlich Story', 'Books', '', '0002000105'), ('Meet My Cats', 'Books', '', '0001837664'), ('Black Berry, Sweet Juice: On Being Black and White in Canada', 'Books', '', '0002000202'), ('Arithmetic 2 A Beka Abeka 1994 Student Book (Traditional Arithmentic Series)', 'Books', '', '0000041696'), ('Go, Dog. Go! (Beginner Series)', 'Books', 'By P. D. Eastman, Illustrated by P. D. Eastman', '0001713256'), ('Hells Angels at War: Hells Angels and Their Violent Conspiracy to Supply Illegal Drugs to the World', 'Books', '', '0002000245'), ('River City', 'Books', '', '0002005808'), ('Crash of Hennington', 'Books', '', '0002005298'), ('Deafening', 'Books', '', '0002005395'), ('Always Fresh', 'Books', '', '0002007576'), ('Curl to Win', 'Books', 'The essential guide for all curlers - from novice to elite.Whether you&#8217;re stepping into the hack for the first time, looking to improve your delivery or better understand strategy,Curl to Winwill help take your game to the next level. Renowned for his ability to blend the mental and physical aspects of curling as well as his innovative and effective strategies, Russ Howard has written a practical handbook that no curler should be without.Olympic gold-medallist and Russ Howard has won a record 107 Brier wins, multiple World Championships, and helped invent the Free Guard Zone that has been adopted worldwide Canada&#8217;s &#8220;curler of century&#8221;, Russ coaches curling teams around the world.--This text refers to an alternateHardcoveredition.', '0002008483'), ('De Gaulle: A biography', 'Books', '', '0002111616'), ('Do Look Out, Noddy! (Noddy Classic Library)', 'Books', '', '0001982443'), ('Fights of Our Lives: Elections, Leadership and the Making of Canada', 'Books', '', '000200089X'), ('An Artist in Africa', 'Books', '', '0002110326'), ('The Radiant City', 'Books', '', '000200576X'), ('Frederick Barbarossa;', 'Books', 'Text: English, French (translation)', '000211268X'), ('Bad Bridesmaid : Bachelorette Brawls and Taffeta Tantrums - What We Go Through for Her Big Day', 'Books', '', '0002008475'), ('Bedside Manners', 'Books', '', '0002006774'), ('Matter of Taste', 'Books', '', '0002006723'), ('The Life of Sister Faustina: The Apostle of Divine Mercy [VHS]', 'Movies & TV,Movies', 'Award winning British film director J. Paddy Nolan', '0001485423'), ('Beasts in My Bed', 'Books', '', '0002110725'), ('For Whom the Bell Tolls', 'Books', '', '0002051850'), ('Fire and Water: Life of Peter the Great', 'Books', '', '0002116448'), ('Apple A Day: The Myths, Misconceptions and Truths About the Foods We Eat', 'Books', 'Widely known in Canada from hisMontreal Gazettecolumn, and work with the Discovery Channel, Schwarcz (Let Them Eat Flax) is an entertaining guide through the tangle of conflicting research studies, advertising claims, special interest groups, age-old myths and popular opinion that make diet a cloudy subject. In short chapters he aims his microscope at such highly touted foods as tomatoes, acai berries, curry and soy; additives like nitrites, artificial sweeteners, vitamins and fluoride; contaminants including pesticides, hormones, trans fats and dioxins; and what, for him, are suspect fads. Schwarcz contends that while there are no magical foods, a diet of mostly vegetables, fruits, whole grains and low-fat dairy products and moderation are key to good health. To help readers make informed choices, he ably cuts through many controversies and will likely stir up a few (he challenges those who condemn milk consumption, espouse detoxification and promote kosher foods, for example). Schwarcz makes learning fun by peppering his text with fascinating facts (coffee contains naturally occurring carcinogens, and apples have formaldehyde). More importantly, he leaves readers with a rational framework for evaluating the complex nature of foods and how they affect health.(Jan.)Copyright &copy; Reed Business Information, a division of Reed Elsevier Inc. All rights reserved.--This text refers to an alternateHardcoveredition.', '0002007649'), ('Lion and Blue', 'Books', '', '000211495X'), ('Who Killed the Canadian Military?', 'Books', '', '0002006758'), ('GOLD DIGGERS~STRIKING IT RICH IN THE KLONDIKE', 'Books', '', '0002008572'), ('Beyond Habitat', 'Books', '', '0002115808'), ('The Horse God Built: Secretariat, His Groom, Their Legacy', 'Books', '', '0002007932'), ('Vanishing Africa', 'Books', '', '0002118769'), ('Noddy at the Seaside (Noddy Classic Library)', 'Books', '', '0001982370'), ('The Jews in America', 'Books', 'A glossy, predictable paean to American Jewry by the producers of the Day in the Life series, this oversize collection of photographs traverses the country, capturing cowboys and Soviet Jewry activists, magicians and roving rabbis. The belabored point here is that Jews have special customs--circumcision, bar mitzvah, Passover seder--that set them apart, but Jews are also as American as apple pie. Hence, many of the 197 pictures, most of them color, reiterate that Jews are just regular folk: there are cozy multigenerational shots and photos of Jewish doctors, astronauts, hikers, soldiers, prisoners, casket-makers, emotionally disturbed youth. Cohen, co-editor of Christmas in America , plays up a familiar ethnic focus on food and stardom (a photograph of Steven Spielberg and his mom, Leah Adler, who owns a kosher L.A. restaurant, combines the two themes). A picture of the Jewish attorneys of a Century City law firm smacks of ghettoization and one of a woman immersing herself in a Brooklyn ritual bath is intrusive.Copyright 1989 Reed Business Information, Inc.', '0002153238'), ('Noddy and the Bumpy-dog (Noddy Classic Library)', 'Books', '', '0001982435'), ('Exodus to a Hidden Valley', 'Books', '', '0002112388'), ('Pierre Loti: Portrait of an Escapist', 'Books', '', '0002116499'), ('Paris: City of Light 1919-1939', 'Books', '', '000215191X'), ('The companion guide to Rome', 'Books', 'Can rightly be called a classic... the definitive historical and cultural account of the city... it inspires complete faith  SUNDAY TELEGRAPH (4/00)  The best guide to Rome  SEAN SWALLOW, TRAVEL BOOKSHOP  (7/98) The best guide to Rome published for many a long year  SUNDAY TIMES  Masson writes elegantly and with warmth, and knows her subject inside out  SUNDAY TELEGRAPH--This text refers to an out of print or unavailable edition of this title.', '0002111306'), ('In the Sewers of Lvov', 'Books', '', '0002153971'), ('Eternal Life?: Life After Death as a Medical, Philosophical and Theological Problem', 'Books', '', '0002152134'), ('One Hundred Days: The Memoirs of the Falklands Battle Group Commander', 'Books', '', '0002157233'), ('Little Black Goes to the Circus', 'Books', '', '0001711237');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `asin` varchar(50) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `recommendations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recommendations` (
  `bought` varchar(50) NOT NULL,
  `alsobought` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-06-04 20:55:25

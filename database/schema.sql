DROP DATABASE IF EXISTS amul_db;
CREATE DATABASE amul_db;
USE amul_db;

CREATE TABLE DISTRIBUTOR (
    Distributor_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Contact VARCHAR(15),
    Address TEXT,
    Food_License_Validity DATE,
    Opening_Time TIME,
    Closing_Time TIME,
    Type_of_Shop VARCHAR(50),
    GST_No VARCHAR(20),
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL
);

CREATE TABLE RETAILER (
    Retailer_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Contact VARCHAR(15),
    Address TEXT,
    Shop_Type VARCHAR(50),
    GST_No VARCHAR(20),
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL
);

CREATE TABLE PRODUCT (
    Product_ID INT PRIMARY KEY AUTO_INCREMENT,
    Distributor_ID INT,
    Name VARCHAR(100) NOT NULL,
    Cost_Price DECIMAL(10,2),
    Selling_Price DECIMAL(10,2),
    Category VARCHAR(50),
    Unit VARCHAR(20),
    FOREIGN KEY (Distributor_ID)
        REFERENCES DISTRIBUTOR(Distributor_ID)
        ON DELETE CASCADE
);

CREATE TABLE STOCK (
    Stock_ID INT PRIMARY KEY AUTO_INCREMENT,
    Distributor_ID INT,
    Product_ID INT,
    Input_Quantity INT,
    Output_Quantity INT,
    Remaining_Quantity INT,
    Date DATE,
    Expiry DATE,
    FOREIGN KEY (Distributor_ID)
        REFERENCES DISTRIBUTOR(Distributor_ID)
        ON DELETE CASCADE,
    FOREIGN KEY (Product_ID)
        REFERENCES PRODUCT(Product_ID)
        ON DELETE CASCADE
);

CREATE TABLE ORDERS (
    Order_ID INT PRIMARY KEY AUTO_INCREMENT,
    Retailer_ID INT,
    Distributor_ID INT,
    Order_Date DATE,
    Total_Bill DECIMAL(10,2),
    Order_Status VARCHAR(30) DEFAULT 'Pending',
    FOREIGN KEY (Retailer_ID)
        REFERENCES RETAILER(Retailer_ID)
        ON DELETE CASCADE,
    FOREIGN KEY (Distributor_ID)
        REFERENCES DISTRIBUTOR(Distributor_ID)
        ON DELETE CASCADE
);

CREATE TABLE ORDER_ITEM (
    Order_Item_ID INT PRIMARY KEY AUTO_INCREMENT,
    Order_ID INT,
    Product_ID INT,
    Quantity INT,
    Cost_Price DECIMAL(10,2),
    Selling_Price DECIMAL(10,2),
    Subtotal DECIMAL(10,2),
    FOREIGN KEY (Order_ID)
        REFERENCES ORDERS(Order_ID)
        ON DELETE CASCADE,
    FOREIGN KEY (Product_ID)
        REFERENCES PRODUCT(Product_ID)
        ON DELETE CASCADE
);

CREATE TABLE PAYMENT (
    Payment_ID INT PRIMARY KEY AUTO_INCREMENT,
    Order_ID INT,
    Payment_Date DATE,
    Total_Amount DECIMAL(10,2),
    Amount_Paid DECIMAL(10,2),
    Payment_Mode VARCHAR(30),
    Payment_Status VARCHAR(30),
    FOREIGN KEY (Order_ID)
        REFERENCES ORDERS(Order_ID)
        ON DELETE CASCADE
);

CREATE TABLE PROFIT_LOSS (
    PL_ID INT PRIMARY KEY AUTO_INCREMENT,
    Order_ID INT,
    Date DATE,
    Total_Cost_Price DECIMAL(10,2),
    Total_Selling_Price DECIMAL(10,2),
    Profit_or_Loss VARCHAR(20),
    Percentage DECIMAL(5,2),
    FOREIGN KEY (Order_ID)
        REFERENCES ORDERS(Order_ID)
        ON DELETE CASCADE
);

CREATE TABLE EXPENSES (
    Expense_ID INT PRIMARY KEY AUTO_INCREMENT,
    Distributor_ID INT NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Date DATE NOT NULL,
    Description TEXT,
    FOREIGN KEY (Distributor_ID)
        REFERENCES DISTRIBUTOR(Distributor_ID)
        ON DELETE CASCADE
);

INSERT INTO DISTRIBUTOR
(Name, Contact, Address, Food_License_Validity, Opening_Time, Closing_Time, Type_of_Shop, GST_No, Email, Password)
VALUES
('Shree Krishna Dairy Distributors', '9822014587', 'Market Yard, Gultekdi, Pune, Maharashtra', '2027-03-15', '08:00:00', '20:00:00', 'Dairy Distributor', '27AABFK1234K1Z5', 'shreekrishnadairydis1@gmail.com', 'Amul@123'),
('Maharashtra Amul Distributors', '9765432189', 'Bhosari MIDC, Pune, Maharashtra', '2027-06-22', '08:30:00', '20:00:00', 'Dairy Distributor', '27AACFM4587P1Z2', 'maharashtraamuldistr2@gmail.com', 'Amul@123'),
('Sai Krupa Dairy Agency', '9890123456', 'Hadapsar, Pune, Maharashtra', '2027-01-18', '07:30:00', '21:00:00', 'Amul Distributor', '27AAMFS6723D1Z8', 'saikrupadairyagency3@gmail.com', 'Amul@123'),
('Omkar Milk Products Agency', '9823456712', 'Kothrud, Pune, Maharashtra', '2026-12-30', '08:00:00', '20:30:00', 'Dairy Distributor', '27AAEFO3456M1Z7', 'omkarmilkproductsage4@gmail.com', 'Amul@123'),
('Shivneri Dairy Distributors', '9767890123', 'Wakad, Pune, Maharashtra', '2027-04-12', '08:00:00', '20:00:00', 'Amul Distributor', '27AAQFS7812R1Z4', 'shivneridairydistrib5@gmail.com', 'Amul@123'),
('Balaji Dairy Agency', '9850123476', 'Pimpri, Pune, Maharashtra', '2027-08-10', '07:30:00', '21:00:00', 'Dairy Distributor', '27AABTB2345L1Z9', 'balajidairyagency6@gmail.com', 'Amul@123'),
('Annapurna Milk Distributors', '9923456781', 'Kondhwa, Pune, Maharashtra', '2027-02-25', '08:00:00', '20:00:00', 'Dairy Distributor', '27AAGFA5678C1Z3', 'annapurnamilkdistrib7@gmail.com', 'Amul@123'),
('Krishna Dairy Products', '9812345670', 'Vishrantwadi, Pune, Maharashtra', '2027-05-19', '08:30:00', '21:00:00', 'Amul Distributor', '27AAKFK8912H1Z6', 'krishnadairyproducts8@gmail.com', 'Amul@123'),
('Mahalaxmi Dairy Agency', '9876543210', 'Swargate, Pune, Maharashtra', '2027-09-14', '07:00:00', '20:00:00', 'Dairy Distributor', '27AALWM4321N1Z8', 'mahalaxmidairyagency9@gmail.com', 'Amul@123'),
('Sai Enterprises Dairy', '9867452310', 'Akurdi, Pimpri-Chinchwad, Maharashtra', '2027-03-28', '08:00:00', '19:30:00', 'Amul Distributor', '27AAISE7654Q1Z1', 'saienterprisesdairy10@gmail.com', 'Amul@123'),
('Fresh Dairy Suppliers', '9834567120', 'Baner, Pune, Maharashtra', '2027-07-16', '08:00:00', '21:00:00', 'Dairy Distributor', '27AAFBS1289T1Z5', 'freshdairysuppliers11@gmail.com', 'Amul@123'),
('Shree Balaji Milk Agency', '9988776655', 'Camp, Pune, Maharashtra', '2027-01-30', '07:30:00', '20:00:00', 'Amul Distributor', '27AASBF9876V1Z2', 'shreebalajimilkagenc12@gmail.com', 'Amul@123'),
('Morya Dairy Traders', '9811223344', 'Chinchwad, Pune, Maharashtra', '2027-10-05', '08:00:00', '20:30:00', 'Dairy Distributor', '27AAMTR3456B1Z7', 'moryadairytraders13@gmail.com', 'Amul@123'),
('Rajesh Dairy Supplies', '9822113344', 'Karve Nagar, Pune, Maharashtra', '2027-06-08', '08:00:00', '20:00:00', 'Amul Distributor', '27AARFS6789G1Z4', 'rajeshdairysupplies14@gmail.com', 'Amul@123'),
('Sahyadri Dairy Wholesale', '9755312468', 'Kharadi, Pune, Maharashtra', '2027-02-11', '07:30:00', '20:30:00', 'Dairy Distributor', '27AASWM5432J1Z9', 'sahyadridairywholesa15@gmail.com', 'Amul@123'),
('Pioneer Dairy Distributors', '9845012376', 'Yerawada, Pune, Maharashtra', '2027-04-20', '08:00:00', '20:00:00', 'Amul Distributor', '27AAPFD7654E1Z3', 'pioneerdairydistribu16@gmail.com', 'Amul@123'),
('Vijay Dairy Trading Company', '9898981212', 'Shivajinagar, Pune, Maharashtra', '2027-08-27', '08:00:00', '19:00:00', 'Dairy Distributor', '27AAVTC3210K1Z6', 'vijaydairytradingcom17@gmail.com', 'Amul@123'),
('Shree Datta Dairy Agency', '9765432109', 'Warje, Pune, Maharashtra', '2027-03-06', '07:30:00', '20:30:00', 'Amul Distributor', '27AASDF6543P1Z8', 'shreedattadairyagenc18@gmail.com', 'Amul@123'),
('Nandini Dairy Suppliers', '9819876543', 'Sinhagad Road, Pune, Maharashtra', '2027-11-12', '08:00:00', '20:00:00', 'Dairy Distributor', '27AANSU8765R1Z2', 'nandinidairysupplier19@gmail.com', 'Amul@123'),
('Sai Samarth Dairy Agency', '9822678901', 'Dhayari, Pune, Maharashtra', '2027-05-30', '07:30:00', '21:00:00', 'Amul Distributor', '27AASSE2345M1Z5', 'saisamarthdairyagenc20@gmail.com', 'Amul@123'),
('Shree Krishna Dairy Traders', '9876123450', 'Pashan, Pune, Maharashtra', '2027-09-02', '08:00:00', '20:00:00', 'Dairy Distributor', '27AASKT5432D1Z7', 'shreekrishnadairytra21@gmail.com', 'Amul@123'),
('Arihant Dairy Services', '9766123456', 'Viman Nagar, Pune, Maharashtra', '2027-04-17', '08:00:00', '21:00:00', 'Amul Distributor', '27AAFSA7890F1Z4', 'arihantdairyservices22@gmail.com', 'Amul@123'),
('Golden Dairy Foods', '9856781234', 'Lohegaon, Pune, Maharashtra', '2027-07-23', '07:30:00', '20:30:00', 'Dairy Distributor', '27AAGHF4567S1Z8', 'goldendairyfoods23@gmail.com', 'Amul@123'),
('Pragati Dairy Traders', '9890011223', 'Camp, Pune, Maharashtra', '2027-01-21', '08:00:00', '19:30:00', 'Amul Distributor', '27AAPGT8901A1Z3', 'pragatidairytraders24@gmail.com', 'Amul@123'),
('Siddhivinayak Dairy Agency', '9823567890', 'Aundh, Pune, Maharashtra', '2027-10-18', '08:00:00', '20:00:00', 'Dairy Distributor', '27AASVD3456C1Z6', 'siddhivinayakdairyag25@gmail.com', 'Amul@123'),
('Sai Dairy Mart', '9765438901', 'Pimple Saudagar, Pune, Maharashtra', '2027-06-14', '07:30:00', '21:00:00', 'Dairy Distributor', '27AASFM6789E1Z9', 'saidairymart26@gmail.com', 'Amul@123'),
('Shivam Dairy Enterprises', '9850012345', 'Pimple Gurav, Pune, Maharashtra', '2027-03-11', '08:00:00', '20:00:00', 'Amul Distributor', '27AASEP2345G1Z2', 'shivamdairyenterpris27@gmail.com', 'Amul@123'),
('Madhav Dairy Products', '9812340987', 'Katraj, Pune, Maharashtra', '2027-08-05', '08:00:00', '20:30:00', 'Dairy Distributor', '27AAMFD5678H1Z5', 'madhavdairyproducts28@gmail.com', 'Amul@123'),
('Royal Dairy Distributors', '9922114455', 'Magarpatta, Pune, Maharashtra', '2027-02-16', '07:30:00', '21:00:00', 'Amul Distributor', '27AARFD8901J1Z8', 'royaldairydistributo29@gmail.com', 'Amul@123'),
('Green Valley Dairy Foods', '9832114567', 'Keshav Nagar, Pune, Maharashtra', '2027-09-25', '08:00:00', '20:00:00', 'Dairy Distributor', '27AAGVF4321L1Z1', 'greenvalleydairyfood30@gmail.com', 'Amul@123'),
('Shree Sai Dairy Agencies', '9877456123', 'Fatima Nagar, Pune, Maharashtra', '2027-05-07', '08:00:00', '20:30:00', 'Amul Distributor', '27AASSA7654N1Z4', 'shreesaidairyagencie31@gmail.com', 'Amul@123'),
('Vardhman Dairy Traders', '9822789456', 'Dapodi, Pune, Maharashtra', '2027-11-03', '08:00:00', '20:00:00', 'Dairy Distributor', '27AAVDT1234Q1Z7', 'vardhmandairytraders32@gmail.com', 'Amul@123'),
('Navjeevan Dairy Supply', '9767789456', 'Bavdhan, Pune, Maharashtra', '2027-04-29', '07:30:00', '21:00:00', 'Amul Distributor', '27AANFS5678S1Z9', 'navjeevandairysupply33@gmail.com', 'Amul@123'),
('Suryoday Dairy Enterprises', '9856123478', 'Mundhwa, Pune, Maharashtra', '2027-07-11', '08:00:00', '20:30:00', 'Dairy Distributor', '27AASEY8901U1Z2', 'suryodaydairyenterpr34@gmail.com', 'Amul@123'),
('Rudra Dairy Traders', '9811122233', 'Narhe, Pune, Maharashtra', '2027-01-27', '08:00:00', '20:00:00', 'Amul Distributor', '27AARTD2345W1Z5', 'rudradairytraders35@gmail.com', 'Amul@123'),
('Aastha Dairy Foods', '9899456123', 'Koregaon Park, Pune, Maharashtra', '2027-06-30', '08:00:00', '21:00:00', 'Dairy Distributor', '27AAASF6789Y1Z8', 'aasthadairyfoods36@gmail.com', 'Amul@123'),
('Shree Ganraj Dairy Agency', '9766123987', 'Bopodi, Pune, Maharashtra', '2027-03-19', '07:30:00', '20:00:00', 'Amul Distributor', '27AASGA3456B1Z1', 'shreeganrajdairyagen37@gmail.com', 'Amul@123'),
('Maharashtra Dairy Traders', '9823450987', 'Ravet, Pimpri-Chinchwad, Maharashtra', '2027-10-09', '08:00:00', '20:30:00', 'Dairy Distributor', '27AAMTQ7890D1Z4', 'maharashtradairytrad38@gmail.com', 'Amul@123'),
('Sankalp Dairy Foods', '9876541098', 'Talegaon Road, Pune, Maharashtra', '2027-05-21', '08:00:00', '20:00:00', 'Amul Distributor', '27AASFK4567F1Z7', 'sankalpdairyfoods39@gmail.com', 'Amul@123'),
('Shree Ram Dairy Products', '9812347654', 'Pune-Solapur Road, Pune, Maharashtra', '2027-08-16', '07:30:00', '21:00:00', 'Dairy Distributor', '27AASRF8901H1Z9', 'shreeramdairyproduct40@gmail.com', 'Amul@123'),
('Mahavir Dairy Distributors', '9922334455', 'Dhanori, Pune, Maharashtra', '2027-02-08', '08:00:00', '20:30:00', 'Amul Distributor', '27AAMDQ1234J1Z2', 'mahavirdairydistribu41@gmail.com', 'Amul@123'),
('Unity Dairy Supply', '9834567891', 'Wadgaon Sheri, Pune, Maharashtra', '2027-09-18', '08:00:00', '20:00:00', 'Dairy Distributor', '27AAUFS5678L1Z5', 'unitydairysupply42@gmail.com', 'Amul@123'),
('Shree Swami Samarth Dairy', '9856789012', 'Ambegaon, Pune, Maharashtra', '2027-04-05', '07:30:00', '21:00:00', 'Amul Distributor', '27AASSX8901N1Z8', 'shreeswamisamarthdai43@gmail.com', 'Amul@123'),
('Reliable Dairy Agencies', '9767894512', 'Deccan Gymkhana, Pune, Maharashtra', '2027-07-29', '08:00:00', '20:00:00', 'Dairy Distributor', '27AARFA2345P1Z1', 'reliabledairyagencie44@gmail.com', 'Amul@123'),
('Shubham Dairy Traders', '9812678945', 'Kondhwa, Pune, Maharashtra', '2027-01-14', '08:00:00', '20:30:00', 'Amul Distributor', '27AASTQ6789R1Z4', 'shubhamdairytraders45@gmail.com', 'Amul@123'),
('Classic Dairy Distributors', '9890126789', 'Bibwewadi, Pune, Maharashtra', '2027-06-19', '07:30:00', '21:00:00', 'Dairy Distributor', '27AACFD3456T1Z7', 'classicdairydistribu46@gmail.com', 'Amul@123'),
('Sahyadri Dairy Agencies', '9822673456', 'Kothrud, Pune, Maharashtra', '2027-10-27', '08:00:00', '20:00:00', 'Amul Distributor', '27AASFA7890V1Z9', 'sahyadridairyagencie47@gmail.com', 'Amul@123'),
('Shree Laxmi Dairy Traders', '9765123489', 'Pimpri Market, Maharashtra', '2027-03-24', '07:30:00', '20:30:00', 'Dairy Distributor', '27AASLT4567X1Z2', 'shreelaxmidairytrade48@gmail.com', 'Amul@123'),
('Urban Dairy Supply', '9856231478', 'Balewadi, Pune, Maharashtra', '2027-08-31', '08:00:00', '21:00:00', 'Amul Distributor', '27AAUFS8901Z1Z5', 'urbandairysupply49@gmail.com', 'Amul@123'),
('Matoshree Dairy Foods', '9812345123', 'Shukrawar Peth, Pune, Maharashtra', '2027-05-13', '07:30:00', '20:00:00', 'Dairy Distributor', '27AAMTF2345A1Z8', 'matoshreedairyfoods50@gmail.com', 'Amul@123');
INSERT INTO PRODUCT
(Distributor_ID, Name, Cost_Price, Selling_Price, Category, Unit)
VALUES
(1, 'Amul Taaza Homogenised Toned Milk 1L', 54.00, 58.00, 'Milk', 'Packet'),
(2, 'Amul Gold Full Cream Milk 1L', 66.00, 70.00, 'Milk', 'Packet'),
(3, 'Amul Shakti Toned Milk 1L', 58.00, 62.00, 'Milk', 'Packet'),
(4, 'Amul Slim n Trim Milk 1L', 52.00, 56.00, 'Milk', 'Packet'),
(5, 'Amul Masti Dahi 400g', 35.00, 42.00, 'Curd', 'Cup'),
(6, 'Amul Masti Dahi 1kg', 72.00, 82.00, 'Curd', 'Pack'),
(7, 'Amul Butter 100g', 54.00, 60.00, 'Butter', 'Pack'),
(8, 'Amul Butter 500g', 245.00, 270.00, 'Butter', 'Pack'),
(9, 'Amul Pasteurised Butter 1kg', 470.00, 510.00, 'Butter', 'Pack'),
(10, 'Amul Cheese Slices 200g', 125.00, 145.00, 'Cheese', 'Pack'),
(11, 'Amul Processed Cheese 200g', 115.00, 135.00, 'Cheese', 'Pack'),
(12, 'Amul Cheese Block 1kg', 510.00, 570.00, 'Cheese', 'Pack'),
(13, 'Amul Paneer 200g', 72.00, 85.00, 'Paneer', 'Pack'),
(14, 'Amul Paneer 1kg', 340.00, 390.00, 'Paneer', 'Pack'),
(15, 'Amul Fresh Cream 250ml', 62.00, 72.00, 'Cream', 'Pack'),
(16, 'Amul Fresh Cream 1L', 220.00, 250.00, 'Cream', 'Pack'),
(17, 'Amul Lassi 200ml', 18.00, 25.00, 'Lassi', 'Bottle'),
(18, 'Amul Lassi 1L', 55.00, 70.00, 'Lassi', 'Bottle'),
(19, 'Amul Kool Badam 200ml', 28.00, 35.00, 'Milk Beverage', 'Bottle'),
(20, 'Amul Kool Kesar 200ml', 28.00, 35.00, 'Milk Beverage', 'Bottle'),
(21, 'Amul Kool Rose 200ml', 27.00, 35.00, 'Milk Beverage', 'Bottle'),
(22, 'Amul Buttermilk 200ml', 12.00, 15.00, 'Buttermilk', 'Bottle'),
(23, 'Amul Buttermilk 1L', 42.00, 52.00, 'Buttermilk', 'Bottle'),
(24, 'Amul Dark Chocolate 150g', 95.00, 115.00, 'Chocolate', 'Pack'),
(25, 'Amul Milk Chocolate 150g', 90.00, 110.00, 'Chocolate', 'Pack'),
(26, 'Amul Fruit n Nut Chocolate 150g', 110.00, 130.00, 'Chocolate', 'Pack'),
(27, 'Amul Rajbhog Ice Cream 1L', 190.00, 230.00, 'Ice Cream', 'Tub'),
(28, 'Amul Kesar Pista Ice Cream 1L', 210.00, 250.00, 'Ice Cream', 'Tub'),
(29, 'Amul Chocolate Ice Cream 1L', 180.00, 220.00, 'Ice Cream', 'Tub'),
(30, 'Amul Vanilla Ice Cream 1L', 165.00, 200.00, 'Ice Cream', 'Tub'),
(31, 'Amul Strawberry Ice Cream 1L', 175.00, 210.00, 'Ice Cream', 'Tub'),
(32, 'Amul Choco Chips Ice Cream 1L', 200.00, 240.00, 'Ice Cream', 'Tub'),
(33, 'Amul Shrikhand 500g', 95.00, 115.00, 'Shrikhand', 'Pack'),
(34, 'Amul Mango Shrikhand 500g', 105.00, 125.00, 'Shrikhand', 'Pack'),
(35, 'Amul Kesar Shrikhand 500g', 115.00, 135.00, 'Shrikhand', 'Pack'),
(36, 'Amul Mitha Dahi 400g', 38.00, 45.00, 'Curd', 'Cup'),
(37, 'Amul Probiotic Dahi 400g', 42.00, 50.00, 'Curd', 'Cup'),
(38, 'Amul High Protein Lassi 200ml', 30.00, 40.00, 'Lassi', 'Bottle'),
(39, 'Amul High Protein Buttermilk 200ml', 25.00, 35.00, 'Buttermilk', 'Bottle'),
(40, 'Amul Gold Milk 500ml', 34.00, 38.00, 'Milk', 'Packet'),
(41, 'Amul Taaza Milk 500ml', 27.00, 30.00, 'Milk', 'Packet'),
(42, 'Amul Shakti Milk 500ml', 29.00, 32.00, 'Milk', 'Packet'),
(43, 'Amul A2 Cow Milk 1L', 75.00, 82.00, 'Milk', 'Bottle'),
(44, 'Amul Cow Ghee 500ml', 295.00, 335.00, 'Ghee', 'Bottle'),
(45, 'Amul Cow Ghee 1L', 565.00, 635.00, 'Ghee', 'Bottle'),
(46, 'Amul Pure Ghee 500ml', 285.00, 325.00, 'Ghee', 'Bottle'),
(47, 'Amul Mithai Mate 400g', 115.00, 135.00, 'Condensed Milk', 'Can'),
(48, 'Amul Condensed Milk 200g', 72.00, 85.00, 'Condensed Milk', 'Can'),
(49, 'Amul Milk Powder 500g', 225.00, 260.00, 'Milk Powder', 'Pack'),
(50, 'Amul Skimmed Milk Powder 500g', 245.00, 285.00, 'Milk Powder', 'Pack');

INSERT INTO RETAILER
(Name, Contact, Address, Shop_Type, GST_No, Email, Password)
VALUES
('Shree Ganesh General Store', '9822011111', 'Kothrud, Pune, Maharashtra', 'Grocery Store', '27AABCG1001A1Z5', 'ganeshstore@gmail.com', 'Amul@123'),
('Sai Krupa Supermarket', '9765211111', 'Karve Nagar, Pune, Maharashtra', 'Supermarket', '27AASCS1002B1Z6', 'saikrupa@gmail.com', 'Amul@123'),
('Om Dairy and General Store', '9890111111', 'Hadapsar, Pune, Maharashtra', 'Dairy Shop', '27AAODS1003C1Z7', 'omdairy@gmail.com', 'Amul@123'),
('Mahalaxmi Provision Store', '9823411111', 'Baner, Pune, Maharashtra', 'Grocery Store', '27AAMPS1004D1Z8', 'mahalaxmistore@gmail.com', 'Amul@123'),
('Krishna Super Market', '9767811111', 'Wakad, Pune, Maharashtra', 'Supermarket', '27AAKSM1005E1Z9', 'krishnasupermarket@gmail.com', 'Amul@123'),
('Shivneri Dairy Shop', '9850111111', 'Pimpri, Pune, Maharashtra', 'Dairy Shop', '27AASDS1006F1Z1', 'shivneridairy@gmail.com', 'Amul@123'),
('Annapurna Grocery', '9923411111', 'Kondhwa, Pune, Maharashtra', 'Grocery Store', '27AAAGS1007G1Z2', 'annapurna@gmail.com', 'Amul@123'),
('Fresh Mart', '9812311111', 'Aundh, Pune, Maharashtra', 'Supermarket', '27AAFMR1008H1Z3', 'freshmart@gmail.com', 'Amul@123'),
('Balaji Dairy Point', '9876511111', 'Vishrantwadi, Pune, Maharashtra', 'Dairy Shop', '27AABDP1009J1Z4', 'balajidairy@gmail.com', 'Amul@123'),
('Sai Baba General Store', '9867411111', 'Yerawada, Pune, Maharashtra', 'Grocery Store', '27AASBG1010K1Z5', 'saibaba@gmail.com', 'Amul@123'),
('Pune Fresh Foods', '9834511111', 'Shivajinagar, Pune, Maharashtra', 'Supermarket', '27AAPFF1011L1Z6', 'punefresh@gmail.com', 'Amul@123'),
('Shree Datta Dairy', '9988711111', 'Warje, Pune, Maharashtra', 'Dairy Shop', '27AASDD1012M1Z7', 'shreedatta@gmail.com', 'Amul@123'),
('Morya General Store', '9811211111', 'Chinchwad, Pune, Maharashtra', 'Grocery Store', '27AAMGS1013N1Z8', 'moryastore@gmail.com', 'Amul@123'),
('Raj Supermarket', '9822111111', 'Kharadi, Pune, Maharashtra', 'Supermarket', '27AARSM1014P1Z9', 'rajsupermarket@gmail.com', 'Amul@123'),
('Sahyadri Dairy Mart', '9755311111', 'Magarpatta, Pune, Maharashtra', 'Dairy Shop', '27AASDM1015Q1Z1', 'sahyadridairy@gmail.com', 'Amul@123'),
('Pioneer Grocery', '9845011111', 'Camp, Pune, Maharashtra', 'Grocery Store', '27AAPGR1016R1Z2', 'pioneergrocery@gmail.com', 'Amul@123'),
('Vijay Dairy House', '9898911111', 'Deccan, Pune, Maharashtra', 'Dairy Shop', '27AAVDH1017S1Z3', 'vijaydairy@gmail.com', 'Amul@123'),
('Shree Swami General Store', '9765411111', 'Dhayari, Pune, Maharashtra', 'Grocery Store', '27AASGS1018T1Z4', 'swamigeneral@gmail.com', 'Amul@123'),
('Nandini Supermarket', '9819811111', 'Sinhagad Road, Pune, Maharashtra', 'Supermarket', '27AANSU1019U1Z5', 'nandinisupermarket@gmail.com', 'Amul@123'),
('Sai Samarth Dairy', '9822611111', 'Narhe, Pune, Maharashtra', 'Dairy Shop', '27AASSD1020V1Z6', 'saisamarth@gmail.com', 'Amul@123'),
('Krishna Provision Store', '9876111111', 'Pashan, Pune, Maharashtra', 'Grocery Store', '27AAKPS1021W1Z7', 'krishnaprovision@gmail.com', 'Amul@123'),
('Arihant Supermart', '9766111111', 'Viman Nagar, Pune, Maharashtra', 'Supermarket', '27AAASM1022X1Z8', 'arihantsupermart@gmail.com', 'Amul@123'),
('Golden Dairy Shop', '9856711111', 'Lohegaon, Pune, Maharashtra', 'Dairy Shop', '27AAGDS1023Y1Z9', 'goldendairy@gmail.com', 'Amul@123'),
('Pragati General Store', '9890011111', 'Camp, Pune, Maharashtra', 'Grocery Store', '27AAPGS1024A1Z1', 'pragati@gmail.com', 'Amul@123'),
('Siddhivinayak Dairy', '9823511111', 'Aundh, Pune, Maharashtra', 'Dairy Shop', '27AASVD1025B1Z2', 'siddhivinayak@gmail.com', 'Amul@123'),
('Sai Dairy Mart', '9765412222', 'Pimple Saudagar, Pune, Maharashtra', 'Dairy Shop', '27AASDM1026C1Z3', 'saidairymart@gmail.com', 'Amul@123'),
('Shivam Supermarket', '9850012222', 'Pimple Gurav, Pune, Maharashtra', 'Supermarket', '27AASSM1027D1Z4', 'shivamsupermarket@gmail.com', 'Amul@123'),
('Madhav Grocery Store', '9812312222', 'Katraj, Pune, Maharashtra', 'Grocery Store', '27AAMGS1028E1Z5', 'madhavgrocery@gmail.com', 'Amul@123'),
('Royal Dairy Point', '9922112222', 'Koregaon Park, Pune, Maharashtra', 'Dairy Shop', '27AARDP1029F1Z6', 'royaldairy@gmail.com', 'Amul@123'),
('Green Valley Supermart', '9832112222', 'Keshav Nagar, Pune, Maharashtra', 'Supermarket', '27AAGVS1030G1Z7', 'greenvalley@gmail.com', 'Amul@123'),
('Shree Sai Provision Store', '9877412222', 'Fatima Nagar, Pune, Maharashtra', 'Grocery Store', '27AASPS1031H1Z8', 'shreesai@gmail.com', 'Amul@123'),
('Vardhman Dairy Shop', '9822712222', 'Dapodi, Pune, Maharashtra', 'Dairy Shop', '27AAVDS1032J1Z9', 'vardhmandairy@gmail.com', 'Amul@123'),
('Navjeevan Grocery', '9767712222', 'Bavdhan, Pune, Maharashtra', 'Grocery Store', '27AANGS1033K1Z1', 'navjeevan@gmail.com', 'Amul@123'),
('Suryoday Supermarket', '9856112222', 'Mundhwa, Pune, Maharashtra', 'Supermarket', '27AASSM1034L1Z2', 'suryoday@gmail.com', 'Amul@123'),
('Rudra Dairy Point', '9811112222', 'Narhe, Pune, Maharashtra', 'Dairy Shop', '27AARDP1035M1Z3', 'rudradairy@gmail.com', 'Amul@123'),
('Aastha Grocery Store', '9899412222', 'Koregaon Park, Pune, Maharashtra', 'Grocery Store', '27AAGS1036N1Z4', 'aasthagrocery@gmail.com', 'Amul@123'),
('Shree Ganraj Dairy', '9766112222', 'Bopodi, Pune, Maharashtra', 'Dairy Shop', '27AASGD1037P1Z5', 'ganrajdairy@gmail.com', 'Amul@123'),
('Maharashtra Supermart', '9823412222', 'Ravet, Pune, Maharashtra', 'Supermarket', '27AAMSM1038Q1Z6', 'maharashtrasupermart@gmail.com', 'Amul@123'),
('Sankalp Grocery Store', '9876512222', 'Talegaon Road, Pune, Maharashtra', 'Grocery Store', '27AASGS1039R1Z7', 'sankalpgrocery@gmail.com', 'Amul@123'),
('Shree Ram Dairy', '9812313333', 'Pune-Solapur Road, Pune, Maharashtra', 'Dairy Shop', '27AASRD1040S1Z8', 'shreeramdairy@gmail.com', 'Amul@123'),
('Mahavir Grocery', '9922313333', 'Dhanori, Pune, Maharashtra', 'Grocery Store', '27AAMG1041T1Z9', 'mahavirgrocery@gmail.com', 'Amul@123'),
('Unity Dairy Point', '9834513333', 'Wadgaon Sheri, Pune, Maharashtra', 'Dairy Shop', '27AAUDP1042U1Z1', 'unitydairy@gmail.com', 'Amul@123'),
('Swami Samarth Supermarket', '9856713333', 'Ambegaon, Pune, Maharashtra', 'Supermarket', '27AASSM1043V1Z2', 'swamisamarth@gmail.com', 'Amul@123'),
('Reliable Grocery Store', '9767813333', 'Deccan Gymkhana, Pune, Maharashtra', 'Grocery Store', '27AARGS1044W1Z3', 'reliablegrocery@gmail.com', 'Amul@123'),
('Shubham Dairy Shop', '9812613333', 'Kondhwa, Pune, Maharashtra', 'Dairy Shop', '27AASDS1045X1Z4', 'shubhamdairy@gmail.com', 'Amul@123'),
('Classic Supermarket', '9890113333', 'Bibwewadi, Pune, Maharashtra', 'Supermarket', '27AACSM1046Y1Z5', 'classicsupermarket@gmail.com', 'Amul@123'),
('Sahyadri Grocery', '9822613333', 'Kothrud, Pune, Maharashtra', 'Grocery Store', '27AASG1047Z1Z6', 'sahyadrigrocery@gmail.com', 'Amul@123'),
('Shree Laxmi Dairy', '9765113333', 'Pimpri Market, Maharashtra', 'Dairy Shop', '27AASLD1048A1Z7', 'shreelaxmi@gmail.com', 'Amul@123'),
('Urban Dairy Store', '9856213333', 'Balewadi, Pune, Maharashtra', 'Dairy Shop', '27AAUDS1049B1Z8', 'urbandairy@gmail.com', 'Amul@123'),
('Matoshree Grocery', '9812314444', 'Shukrawar Peth, Pune, Maharashtra', 'Grocery Store', '27AAMG1050C1Z9', 'matoshree@gmail.com', 'Amul@123');
INSERT INTO STOCK
(Distributor_ID, Product_ID, Input_Quantity, Output_Quantity, Remaining_Quantity, Date, Expiry)
VALUES
(1,1,500,180,320,'2026-08-01','2026-08-05'),
(2,2,450,160,290,'2026-08-01','2026-08-05'),
(3,3,400,140,260,'2026-08-02','2026-08-06'),
(4,4,350,120,230,'2026-08-02','2026-08-06'),
(5,5,300,100,200,'2026-08-03','2026-08-15'),
(6,6,250,80,170,'2026-08-03','2026-08-16'),
(7,7,200,70,130,'2026-08-04','2027-01-15'),
(8,8,150,50,100,'2026-08-04','2027-01-20'),
(9,9,100,35,65,'2026-08-05','2027-02-10'),
(10,10,180,60,120,'2026-08-05','2027-03-15'),
(11,11,160,55,105,'2026-08-06','2027-03-20'),
(12,12,100,30,70,'2026-08-06','2027-04-10'),
(13,13,200,75,125,'2026-08-07','2026-08-20'),
(14,14,100,25,75,'2026-08-07','2026-08-22'),
(15,15,150,50,100,'2026-08-08','2026-09-15'),
(16,16,80,20,60,'2026-08-08','2026-09-20'),
(17,17,300,110,190,'2026-08-09','2026-08-25'),
(18,18,150,50,100,'2026-08-09','2026-08-28'),
(19,19,250,90,160,'2026-08-10','2026-11-15'),
(20,20,250,85,165,'2026-08-10','2026-11-15'),
(21,21,250,90,160,'2026-08-11','2026-11-10'),
(22,22,400,150,250,'2026-08-11','2026-08-25'),
(23,23,200,70,130,'2026-08-12','2026-08-30'),
(24,24,120,40,80,'2026-08-12','2027-05-15'),
(25,25,120,35,85,'2026-08-13','2027-05-20'),
(26,26,100,30,70,'2026-08-13','2027-06-10'),
(27,27,80,25,55,'2026-08-14','2027-01-15'),
(28,28,80,30,50,'2026-08-14','2027-02-15'),
(29,29,80,25,55,'2026-08-15','2027-02-20'),
(30,30,80,30,50,'2026-08-15','2027-03-01'),
(31,31,80,20,60,'2026-08-16','2027-03-05'),
(32,32,70,20,50,'2026-08-16','2027-03-10'),
(33,33,120,40,80,'2026-08-17','2026-09-20'),
(34,34,100,35,65,'2026-08-17','2026-09-25'),
(35,35,100,30,70,'2026-08-18','2026-09-25'),
(36,36,200,75,125,'2026-08-18','2026-08-30'),
(37,37,180,60,120,'2026-08-19','2026-09-05'),
(38,38,250,90,160,'2026-08-19','2026-09-15'),
(39,39,250,85,165,'2026-08-20','2026-09-15'),
(40,40,350,120,230,'2026-08-20','2026-08-25'),
(41,41,400,150,250,'2026-08-21','2026-08-26'),
(42,42,350,130,220,'2026-08-21','2026-08-27'),
(43,43,200,60,140,'2026-08-22','2026-08-28'),
(44,44,100,25,75,'2026-08-22','2028-01-15'),
(45,45,80,20,60,'2026-08-23','2028-01-20'),
(46,46,100,30,70,'2026-08-23','2028-02-10'),
(47,47,100,35,65,'2026-08-24','2027-04-15'),
(48,48,120,40,80,'2026-08-24','2027-05-15'),
(49,49,100,30,70,'2026-08-25','2027-08-15'),
(50,50,100,25,75,'2026-08-25','2027-08-20');

INSERT INTO ORDERS
(Retailer_ID, Distributor_ID, Order_Date, Total_Bill, Order_Status)
VALUES
(1,1,'2026-08-01',580.00,'Delivered'),
(2,2,'2026-08-01',700.00,'Delivered'),
(3,3,'2026-08-02',620.00,'Delivered'),
(4,4,'2026-08-02',560.00,'Delivered'),
(5,5,'2026-08-03',420.00,'Paid'),
(6,6,'2026-08-03',820.00,'Delivered'),
(7,7,'2026-08-04',600.00,'Delivered'),
(8,8,'2026-08-04',540.00,'Shipped'),
(9,9,'2026-08-05',510.00,'Delivered'),
(10,10,'2026-08-05',725.00,'Delivered'),
(11,11,'2026-08-06',675.00,'Paid'),
(12,12,'2026-08-06',570.00,'Delivered'),
(13,13,'2026-08-07',425.00,'Delivered'),
(14,14,'2026-08-07',780.00,'Shipped'),
(15,15,'2026-08-08',360.00,'Delivered'),
(16,16,'2026-08-08',500.00,'Delivered'),
(17,17,'2026-08-09',500.00,'Paid'),
(18,18,'2026-08-09',560.00,'Delivered'),
(19,19,'2026-08-10',700.00,'Delivered'),
(20,20,'2026-08-10',700.00,'Confirmed'),
(21,21,'2026-08-11',700.00,'Delivered'),
(22,22,'2026-08-11',750.00,'Delivered'),
(23,23,'2026-08-12',520.00,'Paid'),
(24,24,'2026-08-12',575.00,'Delivered'),
(25,25,'2026-08-13',550.00,'Delivered'),
(26,26,'2026-08-13',650.00,'Shipped'),
(27,27,'2026-08-14',690.00,'Delivered'),
(28,28,'2026-08-14',750.00,'Delivered'),
(29,29,'2026-08-15',660.00,'Paid'),
(30,30,'2026-08-15',600.00,'Delivered'),
(31,31,'2026-08-16',630.00,'Delivered'),
(32,32,'2026-08-16',720.00,'Confirmed'),
(33,33,'2026-08-17',575.00,'Delivered'),
(34,34,'2026-08-17',625.00,'Delivered'),
(35,35,'2026-08-18',675.00,'Paid'),
(36,36,'2026-08-18',450.00,'Delivered'),
(37,37,'2026-08-19',500.00,'Delivered'),
(38,38,'2026-08-19',560.00,'Shipped'),
(39,39,'2026-08-20',700.00,'Delivered'),
(40,40,'2026-08-20',570.00,'Paid'),
(41,41,'2026-08-21',600.00,'Delivered'),
(42,42,'2026-08-21',640.00,'Delivered'),
(43,43,'2026-08-22',574.00,'Confirmed'),
(44,44,'2026-08-22',670.00,'Delivered'),
(45,45,'2026-08-23',635.00,'Delivered'),
(46,46,'2026-08-23',650.00,'Paid'),
(47,47,'2026-08-24',540.00,'Delivered'),
(48,48,'2026-08-24',425.00,'Shipped'),
(49,49,'2026-08-25',520.00,'Delivered'),
(50,50,'2026-08-25',570.00,'Confirmed');
INSERT INTO ORDER_ITEM
(Order_ID, Product_ID, Quantity, Cost_Price, Selling_Price, Subtotal)
VALUES
(1,1,10,54.00,58.00,580.00),
(2,2,10,66.00,70.00,700.00),
(3,3,10,58.00,62.00,620.00),
(4,4,10,52.00,56.00,560.00),
(5,5,10,35.00,42.00,420.00),
(6,6,10,72.00,82.00,820.00),
(7,7,10,54.00,60.00,600.00),
(8,8,2,245.00,270.00,540.00),
(9,9,1,470.00,510.00,510.00),
(10,10,5,125.00,145.00,725.00),
(11,11,5,115.00,135.00,675.00),
(12,12,1,510.00,570.00,570.00),
(13,13,5,72.00,85.00,425.00),
(14,14,2,340.00,390.00,780.00),
(15,15,5,62.00,72.00,360.00),
(16,16,2,220.00,250.00,500.00),
(17,17,20,18.00,25.00,500.00),
(18,18,8,55.00,70.00,560.00),
(19,19,20,28.00,35.00,700.00),
(20,20,20,28.00,35.00,700.00),
(21,21,20,27.00,35.00,700.00),
(22,22,50,12.00,15.00,750.00),
(23,23,10,42.00,52.00,520.00),
(24,24,5,95.00,115.00,575.00),
(25,25,5,90.00,110.00,550.00),
(26,26,5,110.00,130.00,650.00),
(27,27,3,190.00,230.00,690.00),
(28,28,3,210.00,250.00,750.00),
(29,29,3,180.00,220.00,660.00),
(30,30,3,165.00,200.00,600.00),
(31,31,3,175.00,210.00,630.00),
(32,32,3,200.00,240.00,720.00),
(33,33,5,95.00,115.00,575.00),
(34,34,5,105.00,125.00,625.00),
(35,35,5,115.00,135.00,675.00),
(36,36,10,38.00,45.00,450.00),
(37,37,10,42.00,50.00,500.00),
(38,38,14,30.00,40.00,560.00),
(39,39,16,25.00,35.00,560.00),
(40,40,15,38.00,38.00,570.00),
(41,41,20,27.00,30.00,600.00),
(42,42,20,29.00,32.00,640.00),
(43,43,7,75.00,82.00,574.00),
(44,44,2,295.00,335.00,670.00),
(45,45,1,565.00,635.00,635.00),
(46,46,2,285.00,325.00,650.00),
(47,47,4,115.00,135.00,540.00),
(48,48,5,72.00,85.00,425.00),
(49,49,2,225.00,260.00,520.00),
(50,50,2,245.00,285.00,570.00);

INSERT INTO PAYMENT
(Order_ID, Payment_Date, Total_Amount, Amount_Paid, Payment_Mode, Payment_Status)
VALUES
(1,'2026-08-01',580.00,580.00,'UPI','Paid'),
(2,'2026-08-01',700.00,700.00,'Cash','Paid'),
(3,'2026-08-02',620.00,620.00,'Bank Transfer','Paid'),
(4,'2026-08-02',560.00,560.00,'UPI','Paid'),
(5,'2026-08-03',420.00,420.00,'Cash','Paid'),
(6,'2026-08-03',820.00,820.00,'Debit Card','Paid'),
(7,'2026-08-04',600.00,600.00,'UPI','Paid'),
(8,'2026-08-04',540.00,300.00,'Bank Transfer','Partial'),
(9,'2026-08-05',510.00,510.00,'Cash','Paid'),
(10,'2026-08-05',725.00,725.00,'UPI','Paid'),
(11,'2026-08-06',675.00,675.00,'Credit Card','Paid'),
(12,'2026-08-06',570.00,570.00,'UPI','Paid'),
(13,'2026-08-07',425.00,425.00,'Cash','Paid'),
(14,'2026-08-07',780.00,500.00,'Bank Transfer','Partial'),
(15,'2026-08-08',360.00,360.00,'UPI','Paid'),
(16,'2026-08-08',500.00,500.00,'Debit Card','Paid'),
(17,'2026-08-09',500.00,500.00,'Cash','Paid'),
(18,'2026-08-09',560.00,560.00,'UPI','Paid'),
(19,'2026-08-10',700.00,700.00,'Bank Transfer','Paid'),
(20,'2026-08-10',700.00,700.00,'UPI','Paid'),
(21,'2026-08-11',700.00,400.00,'Cash','Partial'),
(22,'2026-08-11',750.00,750.00,'UPI','Paid'),
(23,'2026-08-12',520.00,520.00,'Debit Card','Paid'),
(24,'2026-08-12',575.00,575.00,'UPI','Paid'),
(25,'2026-08-13',550.00,550.00,'Cash','Paid'),
(26,'2026-08-13',650.00,400.00,'Bank Transfer','Partial'),
(27,'2026-08-14',690.00,690.00,'UPI','Paid'),
(28,'2026-08-14',750.00,750.00,'Credit Card','Paid'),
(29,'2026-08-15',660.00,660.00,'Cash','Paid'),
(30,'2026-08-15',600.00,600.00,'UPI','Paid'),
(31,'2026-08-16',630.00,630.00,'Bank Transfer','Paid'),
(32,'2026-08-16',720.00,720.00,'UPI','Paid'),
(33,'2026-08-17',575.00,575.00,'Cash','Paid'),
(34,'2026-08-17',625.00,625.00,'UPI','Paid'),
(35,'2026-08-18',675.00,400.00,'Bank Transfer','Partial'),
(36,'2026-08-18',450.00,450.00,'Cash','Paid'),
(37,'2026-08-19',500.00,500.00,'UPI','Paid'),
(38,'2026-08-19',560.00,560.00,'Debit Card','Paid'),
(39,'2026-08-20',560.00,560.00,'UPI','Paid'),
(40,'2026-08-20',570.00,570.00,'Bank Transfer','Paid'),
(41,'2026-08-21',600.00,600.00,'Cash','Paid'),
(42,'2026-08-21',640.00,640.00,'UPI','Paid'),
(43,'2026-08-22',574.00,574.00,'Debit Card','Paid'),
(44,'2026-08-22',670.00,670.00,'UPI','Paid'),
(45,'2026-08-23',635.00,635.00,'Bank Transfer','Paid'),
(46,'2026-08-23',650.00,650.00,'UPI','Paid'),
(47,'2026-08-24',540.00,300.00,'Cash','Partial'),
(48,'2026-08-24',425.00,425.00,'UPI','Paid'),
(49,'2026-08-25',520.00,520.00,'Debit Card','Paid'),
(50,'2026-08-25',570.00,570.00,'UPI','Paid');

INSERT INTO PROFIT_LOSS
(Order_ID, Date, Total_Cost_Price, Total_Selling_Price, Profit_or_Loss, Percentage)
VALUES
(1,'2026-08-01',540.00,580.00,'PROFIT',7.41),
(2,'2026-08-01',660.00,700.00,'PROFIT',6.06),
(3,'2026-08-02',580.00,620.00,'PROFIT',6.90),
(4,'2026-08-02',520.00,560.00,'PROFIT',7.69),
(5,'2026-08-03',350.00,420.00,'PROFIT',20.00),
(6,'2026-08-03',720.00,820.00,'PROFIT',13.89),
(7,'2026-08-04',540.00,600.00,'PROFIT',11.11),
(8,'2026-08-04',490.00,540.00,'PROFIT',10.20),
(9,'2026-08-05',470.00,510.00,'PROFIT',8.51),
(10,'2026-08-05',625.00,725.00,'PROFIT',16.00),
(11,'2026-08-06',575.00,675.00,'PROFIT',17.39),
(12,'2026-08-06',510.00,570.00,'PROFIT',11.76),
(13,'2026-08-07',360.00,425.00,'PROFIT',18.06),
(14,'2026-08-07',680.00,780.00,'PROFIT',14.71),
(15,'2026-08-08',310.00,360.00,'PROFIT',16.13),
(16,'2026-08-08',440.00,500.00,'PROFIT',13.64),
(17,'2026-08-09',360.00,500.00,'PROFIT',38.89),
(18,'2026-08-09',440.00,560.00,'PROFIT',27.27),
(19,'2026-08-10',560.00,700.00,'PROFIT',25.00),
(20,'2026-08-10',560.00,700.00,'PROFIT',25.00),
(21,'2026-08-11',540.00,700.00,'PROFIT',29.63),
(22,'2026-08-11',600.00,750.00,'PROFIT',25.00),
(23,'2026-08-12',420.00,520.00,'PROFIT',23.81),
(24,'2026-08-12',475.00,575.00,'PROFIT',21.05),
(25,'2026-08-13',450.00,550.00,'PROFIT',22.22),
(26,'2026-08-13',550.00,650.00,'PROFIT',18.18),
(27,'2026-08-14',570.00,690.00,'PROFIT',21.05),
(28,'2026-08-14',630.00,750.00,'PROFIT',19.05),
(29,'2026-08-15',540.00,660.00,'PROFIT',22.22),
(30,'2026-08-15',495.00,600.00,'PROFIT',21.21),
(31,'2026-08-16',525.00,630.00,'PROFIT',20.00),
(32,'2026-08-16',600.00,720.00,'PROFIT',20.00),
(33,'2026-08-17',475.00,575.00,'PROFIT',21.05),
(34,'2026-08-17',525.00,625.00,'PROFIT',19.05),
(35,'2026-08-18',575.00,675.00,'PROFIT',17.39),
(36,'2026-08-18',380.00,450.00,'PROFIT',18.42),
(37,'2026-08-19',420.00,500.00,'PROFIT',19.05),
(38,'2026-08-19',420.00,560.00,'PROFIT',33.33),
(39,'2026-08-20',400.00,560.00,'PROFIT',40.00),
(40,'2026-08-20',570.00,570.00,'NO PROFIT/LOSS',0.00),
(41,'2026-08-21',540.00,600.00,'PROFIT',11.11),
(42,'2026-08-21',580.00,640.00,'PROFIT',10.34),
(43,'2026-08-22',525.00,574.00,'PROFIT',9.33),
(44,'2026-08-22',590.00,670.00,'PROFIT',13.56),
(45,'2026-08-23',565.00,635.00,'PROFIT',12.39),
(46,'2026-08-23',570.00,650.00,'PROFIT',14.04),
(47,'2026-08-24',460.00,540.00,'PROFIT',17.39),
(48,'2026-08-24',360.00,425.00,'PROFIT',18.06),
(49,'2026-08-25',450.00,520.00,'PROFIT',15.56),
(50,'2026-08-25',490.00,570.00,'PROFIT',16.33);

ALTER TABLE RETAILER
  ADD COLUMN Email_Notifications BOOLEAN DEFAULT TRUE,
  ADD COLUMN Order_Notifications BOOLEAN DEFAULT TRUE,
  ADD COLUMN Promo_Notifications BOOLEAN DEFAULT FALSE;

ALTER TABLE DISTRIBUTOR
  ADD COLUMN Email_Notifications BOOLEAN DEFAULT TRUE,
  ADD COLUMN Order_Notifications BOOLEAN DEFAULT TRUE,
  ADD COLUMN Promo_Notifications BOOLEAN DEFAULT FALSE;

ALTER TABLE RETAILER
  ADD COLUMN Alternate_Contact VARCHAR(15);

ALTER TABLE DISTRIBUTOR
  ADD COLUMN Alternate_Contact VARCHAR(15);

/*
-- 1. DISPLAY ALL DISTRIBUTORS
SELECT * FROM DISTRIBUTOR;


-- 2. DISPLAY ALL RETAILERS
SELECT * FROM RETAILER;


-- 3. DISPLAY ALL PRODUCTS
SELECT * FROM PRODUCT;


-- 4. DISPLAY ALL STOCK RECORDS
SELECT * FROM STOCK;


-- 5. DISPLAY ALL ORDERS
SELECT * FROM ORDERS;


-- 6. DISPLAY ALL ORDER ITEMS
SELECT * FROM ORDER_ITEM;


-- 7. DISPLAY ALL PAYMENT RECORDS
SELECT * FROM PAYMENT;


-- 8. DISPLAY ALL PROFIT AND LOSS RECORDS
SELECT * FROM PROFIT_LOSS;


-- 9. DISPLAY ALL EXPENSE RECORDS
SELECT * FROM EXPENSES;
*/
CREATE TABLE distributor (
  distributor_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact VARCHAR(15),
  address VARCHAR(255),
  food_license_validity DATE,
  opening_time TIME,
  closing_time TIME,
  type_of_shop VARCHAR(50),
  gst_no VARCHAR(20),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE retailer (
  retailer_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact VARCHAR(15),
  address VARCHAR(255),
  shop_type VARCHAR(50),
  gst_no VARCHAR(20),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
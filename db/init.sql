CREATE TABLE User (
    user_id INT(10) PRIMARY KEY,
    user_name VARCHAR(40),
    user_phone INT(10),
    cutomer_email VARCHAR(40),
    created_date DATE, 
    username VARCHAR(40),
    security_pass VARCHAR(40)
);


CREATE TABLE Accounts (
    account_id INT(10) PRIMARY KEY,
    account_name VARCHAR(10),
    created_date DATE,
    other_details VARCHAR(40),
    account_type VARCHAR(10),
    verification ENUM('SUCCESS', 'PENDING'),
    user_id INT(10) FOREIGN KEY REFERENCES USER(user_id)
);
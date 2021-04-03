DROP IF EXISTS Users;
DROP IF EXISTS Accounts;
CREATE TABLE Users (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    user_name VARCHAR(40),
    user_phone VARCHAR (20),
    customer_email VARCHAR(40),
    created_date DATE, 
    username VARCHAR(40),
    security_pass VARCHAR(60),
    PRIMARY KEY(user_id)
);

CREATE TYPE STATUS AS ENUM ('SUCCESS', 'PENDING');

CREATE TABLE Accounts (
    account_id INT GENERATED ALWAYS AS IDENTITY,
    account_name VARCHAR(40),
    created_date DATE,
    other_details VARCHAR(40),
    account_type VARCHAR(10),
    balance INT NOT NULL DEFAULT 0,
    verification STATUS,
    user_id INT REFERENCES users(user_id),
    PRIMARY KEY (account_id)
);

CREATE TABLE Transactions (
    transaction_id INT GENERATED ALWAYS AS IDENTITY,
    amount INT NOT NULL,
    fromAccount INT REFERENCES Accounts(account_id),
    toAccount INT REFERENCES Accounts(account_id),
    createdTime TIMESTAMP 
);
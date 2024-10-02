CREATE DATABASE directiveDB;

USE directiveDB;

DELIMITER $$

CREATE FUNCTION UUID_TO_BIN(uuid CHAR(36))
RETURNS BINARY(16)
DETERMINISTIC
BEGIN
    RETURN UNHEX(REPLACE(uuid, '-', ''));
END $$

DELIMITER ;

CREATE TABLE Directive (
    CUIL VARCHAR(11) PRIMARY KEY NOT NULL
);

CREATE TABLE Personal_Information (
    DNI VARCHAR(8) PRIMARY KEY,
    CUIL VARCHAR(11) NOT NULL,
    birth_date DATE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    second_name VARCHAR(255),
    last_name1 VARCHAR(255) NOT NULL,
    last_name2 VARCHAR(255),
    phone_number VARCHAR(255) NOT NULL,
    landline_phone_number VARCHAR(255),
    direction VARCHAR(255) NOT NULL
);

CREATE TABLE Account (
    accountID BINARY(16) PRIMARY KEY,
    CUIL VARCHAR(11) NOT NULL
);

CREATE TABLE Admin (
    adminID BINARY(16) PRIMARY KEY,
    CUIL VARCHAR(11) NOT NULL
);

INSERT INTO Directive (CUIL)
VALUES ('20902561562');
INSERT INTO Account (accountID, CUIL)
VALUES (UUID_TO_BIN('acd92ee2-a617-44b4-8761-54ba52687474'), '20902561562');
INSERT INTO Personal_Information (DNI, CUIL, birth_date, first_name, last_name1, phone_number, direction)
VALUES ('90256156', '20902561562', '1960-11-01', 'leandro', 'paredes', '223985126', 'los labios');
INSERT INTO Admin (adminID, CUIL)
VALUES (UUID_TO_BIN('7d43d090-41fb-493a-939a-60645275edfc'), '20902561562');
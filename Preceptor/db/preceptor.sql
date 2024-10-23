CREATE DATABASE preceptorDB;

USE preceptorDB;

DELIMITER $$

CREATE FUNCTION UUID_TO_BIN(uuid CHAR(36))
RETURNS BINARY(16)
DETERMINISTIC
BEGIN
    RETURN UNHEX(REPLACE(uuid, '-', ''));
END $$

DELIMITER ;

CREATE TABLE Preceptor (
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

CREATE TABLE Impartition (
    impartitionID BINARY(16) PRIMARY KEY,
    CUIL VARCHAR(11) NOT NULL,
    courseID BINARY(16) NOT NULL
);

INSERT INTO Preceptor (CUIL)
VALUES ('20602561562');
INSERT INTO Account (accountID, CUIL)
VALUES (UUID_TO_BIN('d5e81cc0-267c-4fed-ae21-ba10466647e3'), '20602561562');
INSERT INTO Personal_Information (DNI, CUIL, birth_date, first_name, last_name1, phone_number, direction)
VALUES ('60256156', '20602561562', '1980-02-15', 'luis', 'suarez', '22347848527', 'los pelos');
INSERT INTO Impartition (impartitionID, CUIL, courseID)
VALUES (UUID_TO_BIN('c42bc7b8-3f6b-43cc-aed3-564d0f67d044'), '20602561562', UUID_TO_BIN('42312ccf-949a-4396-b858-d41bdf235736'));
INSERT INTO Impartition (impartitionID, CUIL, courseID)
VALUES (UUID_TO_BIN('00c66032-2206-4cfc-a1cc-2abd7621363c'), '20602561562', UUID_TO_BIN('c42bc7b8-3f6b-43cc-aed3-564d0f67d044'));


INSERT INTO Preceptor (CUIL)
VALUES ('20612561562');
INSERT INTO Account (accountID, CUIL)
VALUES (UUID_TO_BIN('612e3774-059d-411d-8efe-70221d81fab7'), '20612561562');
INSERT INTO Personal_Information (DNI, CUIL, birth_date, first_name, last_name1, phone_number, direction)
VALUES ('61256156', '20612561562', '1981-02-15', 'neymar', 'jr', '2235874968', 'los nudillos');
INSERT INTO Impartition (impartitionID, CUIL, courseID)
VALUES (UUID_TO_BIN('1eaf7690-635a-4a2a-9007-e4c88b3df6a5'), '20612561562', UUID_TO_BIN('d72cfe65-d715-47a3-b9ce-f3c45cf7f915'));

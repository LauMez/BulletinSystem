CREATE DATABASE responsibleDB;

USE responsibleDB;

DELIMITER $$

CREATE FUNCTION UUID_TO_BIN(uuid CHAR(36))
RETURNS BINARY(16)
DETERMINISTIC
BEGIN
    RETURN UNHEX(REPLACE(uuid, '-', ''));
END $$

DELIMITER ;

CREATE TABLE Responsible (
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

CREATE TABLE ResponsibleOf (
    responsibleID BINARY(16) PRIMARY KEY,
    CUIL VARCHAR(11) NOT NULL,
    studentCUIL VARCHAR(11) NOT NULL,
    responsability VARCHAR(50) NOT NULL
);

INSERT INTO Responsible (CUIL)
VALUES ('20302561562');
INSERT INTO Account (accountID, CUIL)
VALUES (UUID_TO_BIN('33fb79f0-f674-4153-9ec3-dec9bb65e60f'), '20302561562');
INSERT INTO Personal_Information (DNI, CUIL, birth_date, first_name, last_name1, phone_number, direction)
VALUES ('30256156', '20302561562', '1980-06-20', 'carlos', 'tevez', '2233587495', 'los dedos');
INSERT INTO ResponsibleOf (responsibleID, CUIL, studentCUIL, responsability)
VALUES (UUID_TO_BIN('27179a2f-f50f-4df6-a4a0-c11f9d067308'), '20302561562', '20472561562', 'Padre');
INSERT INTO ResponsibleOf (responsibleID, CUIL, studentCUIL, responsability)
VALUES (UUID_TO_BIN('209286a7-8bee-4670-be2e-c0b12c7fa75d'), '20302561562', '20482561562', 'Tutor');

INSERT INTO Responsible (CUIL)
VALUES ('20312561562');
INSERT INTO Account (accountID, CUIL)
VALUES (UUID_TO_BIN('4a2e0d2f-1b9f-4925-90e9-28a5c2d2bc64'), '20312561562');
INSERT INTO Personal_Information (DNI, CUIL, birth_date, first_name, last_name1, phone_number, direction)
VALUES ('31256156', '20312561562', '1980-02-26', 'cristian', 'pavon', '2233587795', 'los pulgares');
INSERT INTO ResponsibleOf (responsibleID, CUIL, studentCUIL, responsability)
VALUES (UUID_TO_BIN('3dbf2549-8442-43c4-b045-e480e8cec52e'), '20312561562', '20482561562', 'Padre');

INSERT INTO Responsible (CUIL)
VALUES ('20322561562');
INSERT INTO Account (accountID, CUIL)
VALUES (UUID_TO_BIN('6d9e9725-47b0-4746-a228-f2eac05a1218'), '20322561562');
INSERT INTO Personal_Information (DNI, CUIL, birth_date, first_name, last_name1, phone_number, direction)
VALUES ('32256156', '20322561562', '1980-02-26', 'julian', 'alvarez', '2234987745', 'los tobillos');
INSERT INTO ResponsibleOf (responsibleID, CUIL, studentCUIL, responsability)
VALUES (UUID_TO_BIN('47400d7a-3ac9-4844-9aae-aa5167c4452d'), '20322561562', '20492561562', 'Padre');

INSERT INTO Responsible (CUIL)
VALUES ('20332561562');
INSERT INTO Account (accountID, CUIL)
VALUES (UUID_TO_BIN('71f1d0c5-4751-4094-b758-da7c4ad0e2d2'), '20332561562');
INSERT INTO Personal_Information (DNI, CUIL, birth_date, first_name, last_name1, phone_number, direction)
VALUES ('33256156', '20332561562', '1980-02-26', 'emiliano', 'martinez', '2235887795', 'las muñecas');
INSERT INTO ResponsibleOf (responsibleID, CUIL, studentCUIL, responsability)
VALUES (UUID_TO_BIN('3c6579e7-0870-4ac7-946b-c698c2d5d287'), '20332561562', '20502561562', 'Padre');
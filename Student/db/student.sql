CREATE DATABASE studentDB;

USE studentDB;

DELIMITER $$

CREATE FUNCTION UUID_TO_BIN(uuid CHAR(36))
RETURNS BINARY(16)
DETERMINISTIC
BEGIN
    RETURN UNHEX(REPLACE(uuid, '-', ''));
END $$

DELIMITER ;

CREATE TABLE Student (
    CUIL VARCHAR(11) PRIMARY KEY NOT NULL
);

CREATE TABLE Student_Information (
    studentID BINARY(16) PRIMARY KEY,
    CUIL VARCHAR(11) NOT NULL,
    blood_type VARCHAR(2) NOT NULL,
    social_work VARCHAR(20) NOT NULL
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

CREATE TABLE Student_Card (
    studentCardID BINARY(16) PRIMARY KEY NOT NULL,
    CUIL VARCHAR(11) NOT NULL,
    cardID VARCHAR(50) NOT NULL
);

INSERT INTO Student (CUIL)
VALUES ('20472561562');
INSERT INTO Account (accountID, CUIL)
VALUES (UUID_TO_BIN('bcfd01fb-f1cd-4c48-abed-654acf1accc9'), '20472561562');
INSERT INTO Personal_Information (DNI, CUIL, birth_date, first_name, second_name, last_name1, phone_number, direction)
VALUES ('47256156', '20472561562', '2006-03-13', 'juan', 'carlos', 'roldon', '2233453014', 'las manos');
INSERT INTO Student_Information (studentID, CUIL, blood_type, social_work)
VALUES (UUID_TO_BIN('8ade05f0-4f52-4abd-9bf6-bf736e7218fa'), '20472561562', 'B', 'Galeno');

INSERT INTO Student (CUIL)
VALUES ('20482561562');
INSERT INTO Account (accountID, CUIL)
VALUES (UUID_TO_BIN('e2052014-00d2-46b8-859d-7321e2fa08fb'), '20482561562');
INSERT INTO Personal_Information (DNI, CUIL, birth_date, first_name, last_name1, phone_number, direction)
VALUES ('48256156', '20482561562', '2005-04-01', 'dario', 'benedetto', '2233448014', 'los pies');
INSERT INTO Student_Information (studentID, CUIL, blood_type, social_work)
VALUES (UUID_TO_BIN('ca392e77-c0cb-4ba6-a22a-a68aeb8e8297'), '20482561562', 'A+', 'Galeno');

INSERT INTO Student (CUIL)
VALUES ('20492561562');
INSERT INTO Account (accountID, CUIL)
VALUES (UUID_TO_BIN('0b47ce87-d43b-4a53-a149-42b207e7ca86'), '20492561562');
INSERT INTO Personal_Information (DNI, CUIL, birth_date, first_name, last_name1, phone_number, direction)
VALUES ('49256156', '20492561562', '2006-12-30', 'lionel', 'scaloni', '2233454294', 'las orejas');
INSERT INTO Student_Information (studentID, CUIL, blood_type, social_work)
VALUES (UUID_TO_BIN('3886d5e1-41ac-4b05-a4d3-e35c738fb416'), '20492561562', 'B+', 'Galeno');

INSERT INTO Student (CUIL)
VALUES ('20502561562');
INSERT INTO Account (accountID, CUIL)
VALUES (UUID_TO_BIN('c31f00cb-0ef6-4bd3-99c5-c417405d7142'), '20502561562');
INSERT INTO Personal_Information (DNI, CUIL, birth_date, first_name, last_name1, phone_number, direction)
VALUES ('50256156', '20502561562', '2005-08-09', 'paulo', 'dybala', '2233406714', 'las uñas');
INSERT INTO Student_Information (studentID, CUIL, blood_type, social_work)
VALUES (UUID_TO_BIN('8a33d15c-164e-4f9c-90c6-2516f8fd6feb'), '20502561562', 'AB+', 'Galeno');
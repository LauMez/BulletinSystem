CREATE DATABASE professorDB;

USE professorDB;

DELIMITER $$

CREATE FUNCTION UUID_TO_BIN(uuid CHAR(36))
RETURNS BINARY(16)
DETERMINISTIC
BEGIN
    RETURN UNHEX(REPLACE(uuid, '-', ''));
END $$

DELIMITER ;

CREATE TABLE Professor (
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
    subjectID BINARY(16) NOT NULL
);

INSERT INTO Professor (CUIL)
VALUES ('20702561562');
INSERT INTO Account (accountID, CUIL)
VALUES (UUID_TO_BIN('226cf1ef-b920-46ca-bbe2-0cd978c4dfdd'), '20702561562');
INSERT INTO Personal_Information (DNI, CUIL, birth_date, first_name, last_name1, phone_number, direction)
VALUES ('70256156', '20702561562', '1993-11-10', 'lionel', 'messi', '2234781231', 'los codos');
INSERT INTO Impartition (impartitionID, CUIL, subjectID)
VALUES (UUID_TO_BIN('c7922a9d-24cd-4b8c-85c8-8b96fdb8e80d'), '20702561562', UUID_TO_BIN('332d4136-09be-4eaf-81d4-e073a9ca53f7'));
INSERT INTO Impartition (impartitionID, CUIL, subjectID)
VALUES (UUID_TO_BIN('aacb838f-2bd0-4212-b4b7-4e2c49669c2d'), '20702561562', UUID_TO_BIN('59fcb262-9420-4c72-ae98-813ac056daea'));

INSERT INTO Professor (CUIL)
VALUES ('20712561562');
INSERT INTO Account (accountID, CUIL)
VALUES (UUID_TO_BIN('1126cbff-33d7-4485-a51b-dd658e69c8b1'), '20712561562');
INSERT INTO Personal_Information (DNI, CUIL, birth_date, first_name, last_name1, phone_number, direction)
VALUES ('71256156', '20712561562', '1997-07-24', 'cristiano', 'ronaldo', '2234582231', 'las espinillass');
INSERT INTO Impartition (impartitionID, CUIL, subjectID)
VALUES (UUID_TO_BIN('3f64b110-15e1-4cea-85c0-21b70ee19d5e'), '20712561562', UUID_TO_BIN('ef8ee06e-5ef0-479f-98de-d1705bf4063d'));

INSERT INTO Professor (CUIL)
VALUES ('20722561562');
INSERT INTO Account (accountID, CUIL)
VALUES (UUID_TO_BIN('4e3efef0-7316-4020-b2f3-6d040e3357d6'), '20722561562');
INSERT INTO Personal_Information (DNI, CUIL, birth_date, first_name, last_name1, phone_number, direction)
VALUES ('72256156', '20722561562', '1995-05-01', 'rodrigo', 'de paul', '2234781753', 'los antebrazos');
INSERT INTO Impartition (impartitionID, CUIL, subjectID)
VALUES (UUID_TO_BIN('703bff3b-34d8-4876-b13f-1ddabd771056'), '20722561562', UUID_TO_BIN('75cb862f-12d2-455e-91db-03e37856f3f8'));

INSERT INTO Professor (CUIL)
VALUES ('20732561562');
INSERT INTO Account (accountID, CUIL)
VALUES (UUID_TO_BIN('e0a8ffbd-e2c1-442f-b280-fafe89a41bc1'), '20732561562');
INSERT INTO Personal_Information (DNI, CUIL, birth_date, first_name, last_name1, phone_number, direction)
VALUES ('73256156', '20732561562', '2000-12-03', 'angel', 'di maria', '2234198231', 'la espalda');
INSERT INTO Impartition (impartitionID, CUIL, subjectID)
VALUES (UUID_TO_BIN('351af02b-bdfc-412a-9af1-1bd22088c77b'), '20732561562', UUID_TO_BIN('fccd15d8-e921-4604-af85-b1b2cb299938'));
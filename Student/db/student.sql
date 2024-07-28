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
    CUIL VARCHAR(11) PRIMARY KEY NOT NULL,
    blood_type VARCHAR(2) NOT NULL,
    social_work VARCHAR(20) NOT NULL
);

CREATE TABLE Personal_Information (
    CUIL VARCHAR(11) PRIMARY KEY NOT NULL,
    DNI VARCHAR(8) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    second_name VARCHAR(255),
    last_name1 VARCHAR(255) NOT NULL,
    last_name2 VARCHAR(255),
    phone_number VARCHAR(255) NOT NULL,
    landline_phone_number VARCHAR(255),
    direction VARCHAR(255) NOT NULL
);

CREATE TABLE Account (
    CUIL VARCHAR(11) PRIMARY KEY NOT NULL,
    DNI VARCHAR(8) NOT NULL,
    password VARCHAR(20) NOT NULL
);

CREATE TABLE Student_Card (
    CUIL VARCHAR(11) PRIMARY KEY NOT NULL,
    cardID VARCHAR(50) NOT NULL
);

CREATE TABLE Impartition (
    impartitionID BINARY(16) PRIMARY KEY NOT NULL,
    CUIL VARCHAR(11) NOT NULL,
    courseID BINARY(16) NOT NULL,
    FOREIGN KEY(CUIL) REFERENCES Student(CUIL)
);

INSERT INTO Student (CUIL)
VALUES ('20472561562');
INSERT INTO Account (CUIL, DNI, password)
VALUES ('20472561562', '47256156', 'juan.carlos123');
INSERT INTO Personal_Information (CUIL, DNI, first_name, second_name, last_name1, phone_number, direction)
VALUES ('20472561562', '47256156', 'juan', 'carlos', 'roldon', '223-345-3014', 'las manos');
INSERT INTO Student_Information (CUIL, blood_type, social_work)
VALUES ('20472561562', 'B', 'Galeno');
INSERT INTO Student_Card (studentCardID, CUIL, cardID)
VALUES (UUID_TO_BIN('d0ff036c-1497-4bc1-995f-bfd848086fcf'), '20472561562', 'SUBE1');
INSERT INTO Impartition (impartitionID, CUIL, courseID)
VALUES (UUID_TO_BIN('b4c70f10-1ac9-490f-8747-1a7e964ff7b4'), '20472561562', UUID_TO_BIN('326efd0b358c11efb07bd03957a8a7aa'));

INSERT INTO Student (CUIL)
VALUES ('20482561562');
INSERT INTO Account (CUIL, DNI, password)
VALUES ('20482561562', '48256156', 'ian.avellaneda123');
INSERT INTO Personal_Information (CUIL, DNI, first_name, last_name1, phone_number, direction)
VALUES ('20482561562', '48256156', 'ian', 'avellaneda', '223-345-3015', 'las orejas');
INSERT INTO Student_Information (CUIL, blood_type, social_work)
VALUES ('20482561562', 'A', 'SAMI');
INSERT INTO Student_Card (studentCardID, CUIL, cardID)
VALUES (UUID_TO_BIN('e131a19f-9274-425e-9302-10d6c911994e'), '20482561562', 'SUBE2');
INSERT INTO Impartition (impartitionID, CUIL, courseID)
VALUES (UUID_TO_BIN('ed184bc9-8340-494b-ad69-b67b2a44d4a0'), '20482561562', UUID_TO_BIN('e5ec422a358c11efb07bd03957a8a7aa'));

INSERT INTO Student (CUIL)
VALUES ('20492561562');
INSERT INTO Account (CUIL, DNI, password)
VALUES ('20492561562', '49256156', 'maria.jose123');
INSERT INTO Personal_Information (CUIL, DNI, first_name, second_name, last_name1, last_name2, phone_number, direction)
VALUES ('20492561562', '49256156', 'maria', 'jose', 'acevedo', 'gonzales', '223-345-3016', 'las palmas');
INSERT INTO Student_Information (CUIL, blood_type, social_work)
VALUES ('20492561562', 'B', 'Osde');
INSERT INTO Student_Card (studentCardID, CUIL, cardID)
VALUES (UUID_TO_BIN('00fa28fe-13db-448d-9cd2-9013ef024dd7'), '20492561562', 'SUBE3');
INSERT INTO Impartition (impartitionID, CUIL, courseID)
VALUES (UUID_TO_BIN('93cdab8d-0c85-48ee-9761-8f629cf1ff52'), '20492561562', UUID_TO_BIN('326efd0b358c11efb07bd03957a8a7aa'));

INSERT INTO Student (CUIL)
VALUES ('20502561562');
INSERT INTO Account (CUIL, DNI, password)
VALUES ('20502561562', '50256156', 'branco.samien123');
INSERT INTO Personal_Information (CUIL, DNI, first_name, second_name, last_name1, phone_number, direction)
VALUES ('20502561562', '50256156', 'branco', 'samien', 'aguirre', '223-345-3017', 'los dedos');
INSERT INTO Student_Information (CUIL, blood_type, social_work)
VALUES ('20502561562', 'AB', 'Osde');
INSERT INTO Student_Card (studentCardID, CUIL, cardID)
VALUES (UUID_TO_BIN('1305ab3b-497e-4344-9e5f-96482995296c'), '20502561562', 'SUBE4');
INSERT INTO Impartition (impartitionID, CUIL, courseID)
VALUES (UUID_TO_BIN('ec6d4cf6-83aa-43b6-bc8b-6cde73a756e8'), '20502561562', UUID_TO_BIN('d72cfe65d71547a3b9cef3c45cf7f915'));

INSERT INTO Student (CUIL)
VALUES ('20512561562');
INSERT INTO Account (CUIL, DNI, password)
VALUES ('20512561562', '50256156', 'nahuel.cludio123');
INSERT INTO Personal_Information (CUIL, DNI, first_name, second_name, last_name1, last_name2, phone_number, direction)
VALUES ('20512561562', '50256156', 'nahuel', 'cludio', 'palacios', 'navarro', '223-345-3018', 'las piernas');
INSERT INTO Student_Information (CUIL, blood_type, social_work)
VALUES ('20512561562', 'O', 'Medicum');
INSERT INTO Student_Card (studentCardID, CUIL, cardID)
VALUES (UUID_TO_BIN('5c181d34-a74d-42ac-b78e-2d19d2779de2'), '20512561562', 'SUBE5');
INSERT INTO Impartition (impartitionID, CUIL, courseID)
VALUES (UUID_TO_BIN('fdc5be90-4d9a-443d-9e45-ae487fe4bc5b'), '20512561562', UUID_TO_BIN('e5ec422a358c11efb07bd03957a8a7aa'));
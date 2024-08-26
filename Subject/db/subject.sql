CREATE DATABASE subjectDB;

USE subjectDB;

DELIMITER $$

CREATE FUNCTION UUID_TO_BIN(uuid CHAR(36))
RETURNS BINARY(16)
DETERMINISTIC
BEGIN
    RETURN UNHEX(REPLACE(uuid, '-', ''));
END $$

DELIMITER ;

CREATE TABLE Subject (
    subjectID BINARY(16) PRIMARY KEY NOT NULL,
    courseID BINARY(16) NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE Subject_Schedule (
    scheduleID BINARY(16) PRIMARY KEY NOT NULL,
    subjectID BINARY(16) NOT NULL,
    day VARCHAR(20) NOT NULL,
    schedule VARCHAR(20) NOT NULL
);

INSERT INTO Subject (subjectID, courseID, name)
VALUES (UUID_TO_BIN("332d4136-09be-4eaf-81d4-e073a9ca53f7"), UUID_TO_BIN("42312ccf-949a-4396-b858-d41bdf235736"), 'matematica');
INSERT INTO Subject_Schedule (scheduleID, subjectID, day, schedule)
VALUES (UUID_TO_BIN("289958e7-1d43-419a-9066-01b2ec2948b3"), UUID_TO_BIN("332d4136-09be-4eaf-81d4-e073a9ca53f7"), 'martes', '13:10');
INSERT INTO Subject_Schedule (scheduleID, subjectID, day, schedule)
VALUES (UUID_TO_BIN("20d4dfdf-45a7-4f3a-ae8e-6384fd809d59"), UUID_TO_BIN("332d4136-09be-4eaf-81d4-e073a9ca53f7"), 'juves', '15:30');

INSERT INTO Subject (subjectID, courseID, name)
VALUES (UUID_TO_BIN("ef8ee06e-5ef0-479f-98de-d1705bf4063d"), UUID_TO_BIN("42312ccf-949a-4396-b858-d41bdf235736"), 'Ingles');
INSERT INTO Subject_Schedule (scheduleID, subjectID, day, schedule)
VALUES (UUID_TO_BIN("eb116c9f-767e-4935-b844-f0463def7f45"), UUID_TO_BIN("ef8ee06e-5ef0-479f-98de-d1705bf4063d"), 'lunes', '13:10');

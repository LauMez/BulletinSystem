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
    courseGroupID BINARY(16),
    name VARCHAR(100) NOT NULL
);

CREATE TABLE Subject_Schedule (
    scheduleID BINARY(16) PRIMARY KEY NOT NULL,
    subjectID BINARY(16) NOT NULL,
    day VARCHAR(20) NOT NULL,
    entry_schedule VARCHAR(20) NOT NULL,
    finish_schedule VARCHAR(20) NOT NULL
);

INSERT INTO Subject (subjectID, courseID, name)
VALUES (UUID_TO_BIN("332d4136-09be-4eaf-81d4-e073a9ca53f7"), UUID_TO_BIN('42312ccf-949a-4396-b858-d41bdf235736'), 'matematica');
INSERT INTO Subject_Schedule (scheduleID, subjectID, day, entry_schedule, finish_schedule)
VALUES (UUID_TO_BIN("289958e7-1d43-419a-9066-01b2ec2948b3"), UUID_TO_BIN("332d4136-09be-4eaf-81d4-e073a9ca53f7"), 'martes', '13:10', '15:30');

INSERT INTO Subject (subjectID, courseID, name)
VALUES (UUID_TO_BIN("ef8ee06e-5ef0-479f-98de-d1705bf4063d"), UUID_TO_BIN('42312ccf-949a-4396-b858-d41bdf235736'), 'Ingles');
INSERT INTO Subject_Schedule (scheduleID, subjectID, day, entry_schedule, finish_schedule)
VALUES (UUID_TO_BIN("eb116c9f-767e-4935-b844-f0463def7f45"), UUID_TO_BIN("ef8ee06e-5ef0-479f-98de-d1705bf4063d"), 'lunes', '13:10', '15:30');
INSERT INTO Subject_Schedule (scheduleID, subjectID, day, entry_schedule, finish_schedule)
VALUES (UUID_TO_BIN("5f35b5bd-aa7f-496d-be9e-7e3314d9563b"), UUID_TO_BIN("ef8ee06e-5ef0-479f-98de-d1705bf4063d"), 'miercoles', '15:40', '17:30');

INSERT INTO Subject (subjectID, courseID, name)
VALUES (UUID_TO_BIN("75cb862f-12d2-455e-91db-03e37856f3f8"), UUID_TO_BIN('d72cfe65-d715-47a3-b9ce-f3c45cf7f915'), 'historia');
INSERT INTO Subject_Schedule (scheduleID, subjectID, day, entry_schedule, finish_schedule)
VALUES (UUID_TO_BIN("7d48b22a-d403-4272-90c8-4560775554c9"), UUID_TO_BIN("75cb862f-12d2-455e-91db-03e37856f3f8"), 'jueves', '13:10', '15:30');

INSERT INTO Subject (subjectID, courseID, name)
VALUES (UUID_TO_BIN("59fcb262-9420-4c72-ae98-813ac056daea"), UUID_TO_BIN('c42bc7b8-3f6b-43cc-aed3-564d0f67d044'), 'biologia');
INSERT INTO Subject_Schedule (scheduleID, subjectID, day, entry_schedule, finish_schedule)
VALUES (UUID_TO_BIN("7f22c166-f12a-4cfc-901b-822eccd7efac"), UUID_TO_BIN("59fcb262-9420-4c72-ae98-813ac056daea"), 'viernes', '13:10', '15:30');

INSERT INTO Subject (subjectID, courseID, courseGroupID, name)
VALUES (UUID_TO_BIN("fccd15d8-e921-4604-af85-b1b2cb299938"), UUID_TO_BIN('c42bc7b8-3f6b-43cc-aed3-564d0f67d044'), UUID_TO_BIN('c00412d8-9d30-4358-b709-2c62e7519a44'), 'Lengua');
INSERT INTO Subject_Schedule (scheduleID, subjectID, day, entry_schedule, finish_schedule)
VALUES (UUID_TO_BIN("4e92f798-cdaf-44b7-88da-df156301885b"), UUID_TO_BIN("fccd15d8-e921-4604-af85-b1b2cb299938"), 'lunes', '13:10', '15:30');
INSERT INTO Subject_Schedule (scheduleID, subjectID, day, entry_schedule, finish_schedule)
VALUES (UUID_TO_BIN("99c7b3f5-f21c-4d13-a23a-b972812da95c"), UUID_TO_BIN("fccd15d8-e921-4604-af85-b1b2cb299938"), 'miercoles', '15:40', '17:30');
CREATE DATABASE courseDB;

USE courseDB;

DELIMITER $$

CREATE FUNCTION UUID_TO_BIN(uuid CHAR(36))
RETURNS BINARY(16)
DETERMINISTIC
BEGIN
    RETURN UNHEX(REPLACE(uuid, '-', ''));
END $$

DELIMITER ;

CREATE TABLE Course (
    courseID BINARY(16) PRIMARY KEY NOT NULL,
    year INT NOT NULL,
    division INT NOT NULL,
    entry_time VARCHAR(50) NOT NULL,
    specialty VARCHAR(50) NOT NULL 
);

CREATE TABLE Course_Group (
    courseGroupID BINARY(16) PRIMARY KEY NOT NULL,
    courseID BINARY(16) NOT NULL,
    courseGroup VARCHAR(1) NOT NULL,
    FOREIGN KEY(courseID) REFERENCES Course(courseID)
);

CREATE TABLE Inscription (
    inscriptionID BINARY(16) PRIMARY KEY NOT NULL,
    courseID BINARY(16) NOT NULL,
    CUIL INT NOT NULL,
    FOREIGN KEY(courseID) REFERENCES Course(courseID)
);

INSERT INTO Course (courseID, year, division, entry_time, specialty)
VALUES (UUID_TO_BIN("42312ccf-949a-4396-b858-d41bdf235736"), 7, 2, "turno tarde", "programacion");
INSERT INTO Course_Group (courseGroupID, courseID, courseGroup)
VALUES (UUID_TO_BIN("c3d2443d-58da-4fce-9a32-dc6cd91f7bb4"), UUID_TO_BIN("42312ccf-949a-4396-b858-d41bdf235736"),'a');
INSERT INTO Course_Group (courseGroupID, courseID, courseGroup)
VALUES (UUID_TO_BIN("3331702f-15fb-4dc3-a3b0-12da2298e98f"), UUID_TO_BIN("42312ccf-949a-4396-b858-d41bdf235736"),'b');
INSERT INTO Inscription (inscriptionID, courseID, CUIL)
VALUES (UUID_TO_BIN("d46f6131-74f2-4778-8ab2-8485fa8a6788"), UUID_TO_BIN("42312ccf-949a-4396-b858-d41bdf235736"), 20472561562);

INSERT INTO Course (courseID, year, division, entry_time, specialty)
VALUES (UUID_TO_BIN("d72cfe65-d715-47a3-b9ce-f3c45cf7f915"), 7, 1, "turno mañana", "electronica");
INSERT INTO Course_Group (courseGroupID, courseID, courseGroup)
VALUES (UUID_TO_BIN("dfaf2267-9816-4560-a479-6bbb8316f81b"), UUID_TO_BIN("d72cfe65-d715-47a3-b9ce-f3c45cf7f915"), 'a');
INSERT INTO Course_Group (courseGroupID, courseID, courseGroup)
VALUES (UUID_TO_BIN("1de10136-35a0-48bc-a215-8fc20049f677"), UUID_TO_BIN("d72cfe65-d715-47a3-b9ce-f3c45cf7f915"), 'b');
INSERT INTO Inscription (inscriptionID, courseID, CUIL)
VALUES (UUID_TO_BIN("583b825f-e44e-4888-8ecf-3c417696db6f"), UUID_TO_BIN("d72cfe65-d715-47a3-b9ce-f3c45cf7f915"), 20482561562);
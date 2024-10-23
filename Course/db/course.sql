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

CREATE TABLE Inscription (
    inscriptionID BINARY(16) PRIMARY KEY NOT NULL,
    CUIL VARCHAR(11) NOT NULL,
    courseID BINARY(16) NOT NULL,
    courseGroupID BINARY(16) NOT NULL
);

CREATE TABLE Course_Group (
    courseGroupID BINARY(16) PRIMARY KEY NOT NULL,
    courseID BINARY(16) NOT NULL,
    courseGroup VARCHAR(1) NOT NULL,
    FOREIGN KEY(courseID) REFERENCES Course(courseID)
);

INSERT INTO Course (courseID, year, division, entry_time, specialty)
VALUES (UUID_TO_BIN("42312ccf-949a-4396-b858-d41bdf235736"), 7, 2, "tarde", "programacion");
INSERT INTO Course_Group (courseGroupID, courseID, courseGroup)
VALUES (UUID_TO_BIN("c3d2443d-58da-4fce-9a32-dc6cd91f7bb4"), UUID_TO_BIN("42312ccf-949a-4396-b858-d41bdf235736"),'a');
INSERT INTO Course_Group (courseGroupID, courseID, courseGroup)
VALUES (UUID_TO_BIN("3331702f-15fb-4dc3-a3b0-12da2298e98f"), UUID_TO_BIN("42312ccf-949a-4396-b858-d41bdf235736"),'b');
INSERT INTO Inscription (inscriptionID, CUIL, courseID, courseGroupID)
VALUES (UUID_TO_BIN('cf464ddf-8ea6-47ea-a15e-5cdcb3e3f323'), '20472561562', UUID_TO_BIN('42312ccf-949a-4396-b858-d41bdf235736'), UUID_TO_BIN('c3d2443d-58da-4fce-9a32-dc6cd91f7bb4'));
INSERT INTO Inscription (inscriptionID, CUIL, courseID, courseGroupID)
VALUES (UUID_TO_BIN('5b44154f-8cdb-439c-88d6-ce3721ae5285'), '20482561562', UUID_TO_BIN('42312ccf-949a-4396-b858-d41bdf235736'), UUID_TO_BIN('3331702f-15fb-4dc3-a3b0-12da2298e98f'));

INSERT INTO Course (courseID, year, division, entry_time, specialty)
VALUES (UUID_TO_BIN("d72cfe65-d715-47a3-b9ce-f3c45cf7f915"), 7, 1, "tarde", "electronica");
INSERT INTO Course_Group (courseGroupID, courseID, courseGroup)
VALUES (UUID_TO_BIN("dfaf2267-9816-4560-a479-6bbb8316f81b"), UUID_TO_BIN("d72cfe65-d715-47a3-b9ce-f3c45cf7f915"), 'a');
INSERT INTO Course_Group (courseGroupID, courseID, courseGroup)
VALUES (UUID_TO_BIN("1de10136-35a0-48bc-a215-8fc20049f677"), UUID_TO_BIN("d72cfe65-d715-47a3-b9ce-f3c45cf7f915"), 'b');
INSERT INTO Inscription (inscriptionID, CUIL, courseID, courseGroupID)
VALUES (UUID_TO_BIN('02e6787a-ac6f-41b7-b825-44bf46239bf2'), '20492561562', UUID_TO_BIN('d72cfe65-d715-47a3-b9ce-f3c45cf7f915'), UUID_TO_BIN('1de10136-35a0-48bc-a215-8fc20049f677'));

INSERT INTO Course (courseID, year, division, entry_time, specialty)
VALUES (UUID_TO_BIN("c42bc7b8-3f6b-43cc-aed3-564d0f67d044"), 7, 3, "tarde", "contrucciones");
INSERT INTO Course_Group (courseGroupID, courseID, courseGroup)
VALUES (UUID_TO_BIN("c00412d8-9d30-4358-b709-2c62e7519a44"), UUID_TO_BIN("c42bc7b8-3f6b-43cc-aed3-564d0f67d044"), 'a');
INSERT INTO Course_Group (courseGroupID, courseID, courseGroup)
VALUES (UUID_TO_BIN("f2651fb0-20a6-443d-8112-8c5992e96392"), UUID_TO_BIN("c42bc7b8-3f6b-43cc-aed3-564d0f67d044"), 'b');
INSERT INTO Inscription (inscriptionID, CUIL, courseID, courseGroupID)
VALUES (UUID_TO_BIN('b71395d7-6888-4a45-9717-a957f2932219'), '20502561562', UUID_TO_BIN('c42bc7b8-3f6b-43cc-aed3-564d0f67d044'), UUID_TO_BIN('c00412d8-9d30-4358-b709-2c62e7519a44'));
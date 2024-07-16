CREATE DATABASE bulletinDB;

USE bulletinDB;

DELIMITER $$

CREATE FUNCTION UUID_TO_BIN(uuid CHAR(36))
RETURNS BINARY(16)
DETERMINISTIC
BEGIN
    RETURN UNHEX(REPLACE(uuid, '-', ''));
END $$

DELIMITER ;

CREATE TABLE Bulletin (
    bulletinID BINARY(16) PRIMARY KEY NOT NULL,
    CUIL VARCHAR(10) NOT NULL
);

CREATE TABLE Period (
    periodID BINARY(16) PRIMARY KEY NOT NULL,
    subjectID BINARY(16) NOT NULL,
    bulletinID BINARY(16) NOT NULL,
    observations VARCHAR(255),
    period_type VARCHAR(100) NOT NULL,
    init_date DATE NOT NULL,
    due_date DATE NOT NULL,
    FOREIGN KEY (bulletinID) REFERENCES Bulletin (bulletinID)
);

CREATE TABLE Assessment (
    assessmentID BINARY(16) PRIMARY KEY NOT NULL,
    periodID BINARY(16) NOT NULL,
    assessment_type VARCHAR(100) NOT NULL,
    qualification VARCHAR(3) NOT NULL,
    FOREIGN KEY (periodID) REFERENCES Period (periodID)
);

INSERT INTO Bulletin(bulletinID, CUIL)
VALUES (UUID_TO_BIN("ae169cb1-d500-47e3-9c54-1a48497cc97e"), "47256156");

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("82373820-79a5-4485-81dd-79ef5bfea556"), 
    UUID_TO_BIN("332d4136-09be-4eaf-81d4-e073a9ca53f7"), 
    UUID_TO_BIN("ae169cb1-d500-47e3-9c54-1a48497cc97e"), 
    "", 
    "first advance", 
    '2024-03-01', 
    '2024-05-31'
);
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("ac299b40-7430-4f97-b798-918dbaf3e8c2"), 
    UUID_TO_BIN("82373820-79a5-4485-81dd-79ef5bfea556"), 
    "pedagogical assessment", 
    "TED"
);

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("2025a985-599e-4aca-9121-f3cb7c611083"), 
    UUID_TO_BIN("332d4136-09be-4eaf-81d4-e073a9ca53f7"), 
    UUID_TO_BIN("ae169cb1-d500-47e3-9c54-1a48497cc97e"), 
    "nashe1", 
    "first period", 
    '2024-06-01', 
    '2024-07-31'
);
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("01114a0b-bb07-4e04-85e8-93d17260fa18"), 
    UUID_TO_BIN("2025a985-599e-4aca-9121-f3cb7c611083"), 
    "pedagogical assessment", 
    "TEP"
);

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("4231838d-1cb7-4ea2-b7b7-441b4567aaae"), 
    UUID_TO_BIN("332d4136-09be-4eaf-81d4-e073a9ca53f7"), 
    UUID_TO_BIN("ae169cb1-d500-47e3-9c54-1a48497cc97e"),
    "nashe2", 
    "second advance", 
    '2024-08-01', 
    '2024-10-31'
);
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("c9490b19-52f8-46c3-b5f1-ff0efe2f42cb"), 
    UUID_TO_BIN("4231838d-1cb7-4ea2-b7b7-441b4567aaae"), 
    "pedagogical assessment", 
    "TEA"
);
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("7c13fa5c-e89d-4cf5-822e-f90182144a6a"), 
    UUID_TO_BIN("2025a985-599e-4aca-9121-f3cb7c611083"), 
    "pedagogical assessment intensification", 
    "TEA"
);

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("fec4fc0d-42a7-48e0-805e-9466253ea4da"), 
    UUID_TO_BIN("332d4136-09be-4eaf-81d4-e073a9ca53f7"), 
    UUID_TO_BIN("ae169cb1-d500-47e3-9c54-1a48497cc97e"), 
    "naseh3", 
    "second period", 
    '2024-11-01', 
    '2024-12-15'
);
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("a988a4db-4399-4ca3-bb6c-20afcc66c4aa"), 
    UUID_TO_BIN("fec4fc0d-42a7-48e0-805e-9466253ea4da"), 
    "pedagogical assessment", 
    "TEP"
);

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("b331c63e-48d2-4224-b8c3-014b04de50c7"), 
    UUID_TO_BIN("332d4136-09be-4eaf-81d4-e073a9ca53f7"), 
    UUID_TO_BIN("ae169cb1-d500-47e3-9c54-1a48497cc97e"), 
    "nashe4", 
    "anual closure", 
    '2024-12-01', 
    '2024-12-15');
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("55cac6eb-33bf-4ddb-bb59-11c06c1037f1"), 
    UUID_TO_BIN("b331c63e-48d2-4224-b8c3-014b04de50c7"), 
    "pedagogical assessment", 
    "TEP");

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("51fa147a-72f1-430c-8f54-97977a6843a3"), 
    UUID_TO_BIN("332d4136-09be-4eaf-81d4-e073a9ca53f7"), 
    UUID_TO_BIN("ae169cb1-d500-47e3-9c54-1a48497cc97e"), 
    "nashe5", 
    "december intensification",
    '2024-12-15', 
    '2024-12-31'
);
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("399dc122-7843-4d0b-9e5a-8d17ca7d1c26"), 
    UUID_TO_BIN("51fa147a-72f1-430c-8f54-97977a6843a3"), 
    "pedagogical assessment",
    "TEA"
);

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("27acfe4a-baac-40a7-8b7e-9c112c2c23a9"), 
    UUID_TO_BIN("332d4136-09be-4eaf-81d4-e073a9ca53f7"), 
    UUID_TO_BIN("ae169cb1-d500-47e3-9c54-1a48497cc97e"), 
    "nashe6", 
    "fabruary intensification", 
    '2025-02-01', 
    '2025-02-28');
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("a27753f9-55e2-4823-8d55-e8156759c5b8"), 
    UUID_TO_BIN("27acfe4a-baac-40a7-8b7e-9c112c2c23a9"), 
    "pedagogical assessment", 
    ""
);

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("1d42153e-7b75-4a76-8ab9-5e3338482048"), 
    UUID_TO_BIN("332d4136-09be-4eaf-81d4-e073a9ca53f7"), 
    UUID_TO_BIN("ae169cb1-d500-47e3-9c54-1a48497cc97e"), 
    "nashe7", 
    "march intensification", 
    '2025-03-01', 
    '2025-03-31'
);
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("06d5578c-a513-45b6-898e-3f29364f258a"), 
    UUID_TO_BIN("1d42153e-7b75-4a76-8ab9-5e3338482048"), 
    "pedagogical assessment", 
    ""
);

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("7aaa1089-a309-4c68-ace5-7af21a53669a"), 
    UUID_TO_BIN("332d4136-09be-4eaf-81d4-e073a9ca53f7"), 
    UUID_TO_BIN("ae169cb1-d500-47e3-9c54-1a48497cc97e"), 
    "nashe8", 
    "final report", 
    '2025-05-01', 
    '2025-05-31'
);
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("e336e058-eb73-40d9-985c-2954dd6bb9ea"), 
    UUID_TO_BIN("7aaa1089-a309-4c68-ace5-7af21a53669a"), 
    "pedagogical assessment", 
    "TEA"
);

/*------------------------------------------------------------------------------------------------------*/

INSERT INTO Bulletin(bulletinID, CUIL)
VALUES (UUID_TO_BIN("d06079b8-255d-4fc7-ac5d-ac2d768d081f"), "48256156");

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("5d2ade84-927f-4277-8d94-d7879b60f9ed"), 
    UUID_TO_BIN("ef8ee06e-5ef0-479f-98de-d1705bf4063d"), 
    UUID_TO_BIN("d06079b8-255d-4fc7-ac5d-ac2d768d081f"), 
    "", 
    "first advance", 
    '2024-03-01', 
    '2024-05-31'
);
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("51abd183-bfa1-40bb-ab87-0997bb6bdd07"), 
    UUID_TO_BIN("5d2ade84-927f-4277-8d94-d7879b60f9ed"), 
    "pedagogical assessment", 
    "TED"
);

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("84dd095c-c28b-427b-a3a5-e9e99ee7e8d1"), 
    UUID_TO_BIN("ef8ee06e-5ef0-479f-98de-d1705bf4063d"), 
    UUID_TO_BIN("d06079b8-255d-4fc7-ac5d-ac2d768d081f"), 
    "nashe1", 
    "first period", 
    '2024-06-01', 
    '2024-07-31'
);
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("09257956-fca4-4623-800d-c90e4811c938"), 
    UUID_TO_BIN("84dd095c-c28b-427b-a3a5-e9e99ee7e8d1"), 
    "pedagogical assessment", 
    "TEP"
);

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("c38800be-43c9-4c17-8231-13b8fca4333a"), 
    UUID_TO_BIN("ef8ee06e-5ef0-479f-98de-d1705bf4063d"), 
    UUID_TO_BIN("d06079b8-255d-4fc7-ac5d-ac2d768d081f"),
    "nashe2", 
    "second advance", 
    '2024-08-01', 
    '2024-10-31'
);
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("f47c878c-f7b9-4ee5-b5b6-44e14dc20a09"), 
    UUID_TO_BIN("c38800be-43c9-4c17-8231-13b8fca4333a"), 
    "pedagogical assessment", 
    "TEA"
);
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("bcca894c-83fa-41b1-885a-7e37bc2b87fb"), 
    UUID_TO_BIN("c38800be-43c9-4c17-8231-13b8fca4333a"), 
    "pedagogical assessment intensification", 
    "TEA"
);

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("2fd1cfb4-e83d-4b16-9767-9afac8f3df31"), 
    UUID_TO_BIN("ef8ee06e-5ef0-479f-98de-d1705bf4063d"), 
    UUID_TO_BIN("d06079b8-255d-4fc7-ac5d-ac2d768d081f"), 
    "naseh3", 
    "second period", 
    '2024-11-01', 
    '2024-12-15'
);
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("1b970602-8e5a-4313-beb0-4af94d520a3d"), 
    UUID_TO_BIN("2fd1cfb4-e83d-4b16-9767-9afac8f3df31"), 
    "pedagogical assessment", 
    "TEP"
);

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("532b62ac-ab68-405c-a4df-03dff8f63daa"), 
    UUID_TO_BIN("ef8ee06e-5ef0-479f-98de-d1705bf4063d"), 
    UUID_TO_BIN("d06079b8-255d-4fc7-ac5d-ac2d768d081f"), 
    "nashe4", 
    "anual closure", 
    '2024-12-01', 
    '2024-12-15');
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("836ea28f-ebeb-4cf8-8c81-6ec934868d54"), 
    UUID_TO_BIN("532b62ac-ab68-405c-a4df-03dff8f63daa"), 
    "pedagogical assessment", 
    "TEP");

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("68a39319-c36d-4251-9ede-147dacbc5b9c"), 
    UUID_TO_BIN("ef8ee06e-5ef0-479f-98de-d1705bf4063d"), 
    UUID_TO_BIN("d06079b8-255d-4fc7-ac5d-ac2d768d081f"), 
    "nashe5", 
    "december intensification",
    '2024-12-15', 
    '2024-12-31'
);
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("339a0c8c-0b4a-45ba-9843-8b9aeda2cc48"), 
    UUID_TO_BIN("68a39319-c36d-4251-9ede-147dacbc5b9c"), 
    "pedagogical assessment",
    "TEA"
);

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("cff550c3-a2c9-4c0c-b6c6-a1e7426938f0"), 
    UUID_TO_BIN("ef8ee06e-5ef0-479f-98de-d1705bf4063d"), 
    UUID_TO_BIN("d06079b8-255d-4fc7-ac5d-ac2d768d081f"), 
    "nashe6", 
    "fabruary intensification", 
    '2025-02-01', 
    '2025-02-28');
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("3d0e1691-d520-4ed1-b03b-7f66436d5bce"), 
    UUID_TO_BIN("cff550c3-a2c9-4c0c-b6c6-a1e7426938f0"), 
    "pedagogical assessment", 
    ""
);

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("9c67b277-7e9b-48c8-9fce-e1c69bd96de6"), 
    UUID_TO_BIN("ef8ee06e-5ef0-479f-98de-d1705bf4063d"), 
    UUID_TO_BIN("d06079b8-255d-4fc7-ac5d-ac2d768d081f"), 
    "nashe7", 
    "march intensification", 
    '2025-03-01', 
    '2025-03-31'
);
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("bde13854-0356-4dd3-95d3-e8683a3eabbd"), 
    UUID_TO_BIN("9c67b277-7e9b-48c8-9fce-e1c69bd96de6"), 
    "pedagogical assessment", 
    ""
);

INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
VALUES (
    UUID_TO_BIN("89470e77-631c-4ae5-8096-c69f7a40ff46"), 
    UUID_TO_BIN("ef8ee06e-5ef0-479f-98de-d1705bf4063d"), 
    UUID_TO_BIN("d06079b8-255d-4fc7-ac5d-ac2d768d081f"), 
    "nashe8", 
    "final report", 
    '2025-05-01', 
    '2025-05-31'
);
INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
VALUES (
    UUID_TO_BIN("1b7f293a-bef1-4c04-a36a-babab84d7847"), 
    UUID_TO_BIN("89470e77-631c-4ae5-8096-c69f7a40ff46"), 
    "pedagogical assessment", 
    "TEA"
);
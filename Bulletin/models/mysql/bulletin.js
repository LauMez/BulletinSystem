import mysql from 'mysql2';
import axios from 'axios';

const DEFAULT_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bulletinDB'
};

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;
const db = mysql.createConnection(connectionString);

db.connect(err => {
    if (err) {
        console.error('Bulletin database connection failed:', err.stack);
        return;
    }
    console.log('Connected to bulletin database.');
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
export class BulletinModel {
  static async getAll () {
      try{
        const bulletins = await new Promise((resolve, reject) => {
          db.query('SELECT * FROM Bulletin', (err, bulletins) => {
            if(err) reject(err);
            resolve(bulletins);
          });
        })

        if (bulletins.length === 0) {
          console.error('Bulletins not found');
          return [];
        };

        const bulletinPromises = bulletins.map(async (bulletin) => {
          const periods = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM Period WHERE bulletinID = ?', [bulletin.bulletinID], (err, periods) => {
              if(err) reject(err);
              resolve(periods);
            });
          });

          if (periods.length === 0) {
            console.error('Periods not found');
            return [];
          };

          const periodPromises = periods.map(async (period) => {
            const assessments = await new Promise((resolve, reject) => {
              db.query('SELECT * FROM Assessment WHERE periodID = ?', [period.periodID], (err, assessments) => {
                if(err) reject(err);
                resolve(assessments);
              });
            });

            const Assessments = assessments.map(assessment => ({
              assessmentID: assessment.assessmentID.toString('hex'),
              assessment_tpye: assessment.assessment_type,
              qualification: assessment.qualification
            }));

            return {
              periodID: period.periodID.toString('hex'),
              subjectID: period.subjectID.toString('hex'),
              observations: period.observations,
              period_type: period.period_type,
              init_date: formatDate(period.init_date),
              due_date: formatDate(period.due_date),
              assessments: Assessments
            }
          });

          const periodObjects = await Promise.all(periodPromises);
          const flattenedperiodObjects = periodObjects.flat();

          return {
            bulletinID: bulletin.bulletinID.toString('hex'),
            CUIL: bulletin.CUIL,
            periods: flattenedperiodObjects
          }
        });

        const bulletinObjects = await Promise.all(bulletinPromises);
        const flattenedBulletinObjects = bulletinObjects.flat();
        const response = { 
          responses: flattenedBulletinObjects
        };

        return response.responses;
      } catch (error) {
          console.error('Error processing subjects:', error);
          throw new Error('Internal server error');
      };
  };

  static async getByID ({ bulletinID }) {
    try {
      const [Bulletin] = await db.promise().execute(`SELECT * FROM Bulletin WHERE bulletinID = UUID_TO_BIN("${bulletinID}")`);

      const bulletin = Bulletin[0];

      if (!bulletin) {
        console.error('Bulletin not found with ID:', bulletinID);
        return [];
      };

      const periods = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM Period WHERE bulletinID = ?', [bulletin.bulletinID], (err, periods) => {
          if(err) reject(err);
          resolve(periods);
        });
      });

      if (periods.length === 0) {
        console.error('Periods not found');
        return [];
      };

      const periodPromises = periods.map(async (period) => {
        const assessments = await new Promise((resolve, reject) => {
          db.query('SELECT * FROM Assessment WHERE periodID = ?', [period.periodID], (err, assessments) => {
            if(err) reject(err);
            resolve(assessments);
          });
        });

        const Assessments = assessments.map(assessment => ({
          assessmentID: assessment.assessmentID.toString('hex'),
          assessment_tpye: assessment.assessment_type,
          qualification: assessment.qualification
        }));

        return {
          periodID: period.periodID.toString('hex'),
          subjectID: period.subjectID.toString('hex'),
          observations: period.observations,
          period_type: period.period_type,
          init_date: formatDate(period.init_date),
          due_date: formatDate(period.due_date),
          assessments: Assessments
        }
      });

      const periodObjects = await Promise.all(periodPromises);
      const flattenedperiodObjects = periodObjects.flat();

      return {
        bulletinID: bulletin.bulletinID.toString('hex'),
        CUIL: bulletin.CUIL,
        periods: flattenedperiodObjects
      }
    } catch(e) {
      console.log(e);
      throw new Error('Internal server error');
    };
  };

  static async getByCUIL ({ CUIL }) {
    try {
      const [Bulletin] = await db.promise().execute(`SELECT * FROM Bulletin WHERE CUIL = ?`, [CUIL]);

      const bulletin = Bulletin[0];

      if (!bulletin) {
        console.error('Bulletin not found with CUIL:', CUIL);
        return [];
      };

      const periods = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM Period WHERE bulletinID = ?', [bulletin.bulletinID], (err, periods) => {
          if(err) reject(err);
          resolve(periods);
        });
      });

      if (periods.length === 0) {
        console.error('Periods not found');
        return [];
      };

      const periodPromises = periods.map(async (period) => {
        const assessments = await new Promise((resolve, reject) => {
          db.query('SELECT * FROM Assessment WHERE periodID = ?', [period.periodID], (err, assessments) => {
            if(err) reject(err);
            resolve(assessments);
          });
        });

        const Assessments = assessments.map(assessment => ({
          assessmentID: assessment.assessmentID.toString('hex'),
          assessment_tpye: assessment.assessment_type,
          qualification: assessment.qualification
        }));

        return {
          periodID: period.periodID.toString('hex'),
          subjectID: period.subjectID.toString('hex'),
          observations: period.observations,
          period_type: period.period_type,
          init_date: formatDate(period.init_date),
          due_date: formatDate(period.due_date),
          assessments: Assessments
        }
      });

      const periodObjects = await Promise.all(periodPromises);
      const flattenedperiodObjects = periodObjects.flat();

      return {
        bulletinID: bulletin.bulletinID.toString('hex'),
        CUIL: bulletin.CUIL,
        periods: flattenedperiodObjects
      }
    } catch(e) {
      console.log(e);
      throw new Error('Internal server error');
    };
  };

  static async getBySubjectID ({ subjectID }) {
    try {
      const periods = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM Period WHERE subjectID = UUID_TO_BIN("${subjectID}")`, (err, periods) => {
          if(err) reject(err);
          resolve(periods);
        });
      });

      if (periods.length === 0) {
        console.error('Periods not found');
        return [];
      };

      const periodPromises = periods.map(async (period) => {
        const assessments = await new Promise((resolve, reject) => {
          db.query('SELECT * FROM Assessment WHERE periodID = ?', [period.periodID], (err, assessments) => {
            if(err) reject(err);
            resolve(assessments);
          });
        });

        const Assessments = assessments.map(assessment => ({
          assessmentID: assessment.assessmentID.toString('hex'),
          assessment_tpye: assessment.assessment_type,
          qualification: assessment.qualification
        }));

        return {
          subjectID: period.subjectID.toString('hex'),
          observations: period.observations,
          period_type: period.period_type,
          init_date: formatDate(period.init_date),
          due_date: formatDate(period.due_date),
          assessments: Assessments
        }
      });

      const periodObjects = await Promise.all(periodPromises);
      const flattenedperiodObjects = periodObjects.flat();

      const response = { 
        responses: flattenedperiodObjects
      };

      return response.responses;
    } catch(e) {
      console.log(e);
      throw new Error('Internal server error');
    };
  }

  
  static async create ({CUIL}) {
    const generateUUIDs = async (count) => {
      const uuids = [];
      for (let i = 0; i < count; i++) {
        const [result] = await db.promise().execute('SELECT UUID() AS uuid;');
        uuids.push(result[0].uuid);
      }
      return uuids;
    };

    const periods = [
      { type: 'first advance', init_date: '2024-03-01', due_date: '2024-05-31' },
      { type: 'first period', init_date: '2024-06-01', due_date: '2024-07-31' },
      { type: 'second advance', init_date: '2024-08-01', due_date: '2024-10-31' },
      { type: 'second period', init_date: '2024-11-01', due_date: '2024-12-15' },
      { type: 'anual closure', init_date: '2024-12-01', due_date: '2024-12-15' },
      { type: 'december intensification', init_date: '2024-12-15', due_date: '2024-12-31' },
      { type: 'fabruary intensification', init_date: '2025-02-01', due_date: '2025-02-28' },
      { type: 'march intensification', init_date: '2025-03-01', due_date: '2025-03-31' },
      { type: 'final report', init_date: '2025-05-01', due_date: '2025-05-31' },
    ];

    const assessments = [
      ['pedagogical assessment', 'final exam'],
      ['pedagogical assessment', 'midterm exam'],
      ['pedagogical assessment', 'project'],
      ['pedagogical assessment intensification', 'quiz'],
      ['pedagogical assessment', 'oral exam'],
      ['pedagogical assessment', 'final project'],
      ['pedagogical assessment', 'lab work'],
      ['pedagogical assessment', 'presentation'],
      ['pedagogical assessment', 'final report'],
    ];

    try {
      //TODO: call stdudent microservice to get the course data
      const courseID = 'e5ec422a358c11efb07bd03957a8a7aa';
      //TODO: Make the gRPC of subject microservice to do the call
      const response = await axios.get(`http://localhost:4321/subject/course/${courseID}`);
      const subjects = response.data;
      console.log('subjects', subjects);

      await db.promise().beginTransaction();

      for (const subject of subjects) {
        const [bulletinID] = await generateUUIDs(1);
        const periodIDs = await generateUUIDs(periods.length);
        const totalAssessments = assessments.flat().length;
        const assessmentIDs = await generateUUIDs(totalAssessments);
        console.log(assessmentIDs);

        const bulletinSQL = `
          INSERT INTO Bulletin(bulletinID, CUIL)
          VALUES (UUID_TO_BIN('${bulletinID}'), ${CUIL});
        `;
        await db.promise().query(bulletinSQL);

        let assessmentIndex = 0;
        for (let i = 0; i < periods.length; i++) {
          const periodSQL = `
            INSERT INTO Period(periodID, subjectID, bulletinID, observations, period_type, init_date, due_date)
            VALUES (UUID_TO_BIN('${periodIDs[i]}'), UUID_TO_BIN('${subject.subjectID}'), UUID_TO_BIN('${bulletinID}'), '', '${periods[i].type}', '${periods[i].init_date}', '${periods[i].due_date}');
          `;
          await db.promise().query(periodSQL);

          for (let j = 0; j < assessments[i].length; j++) {
            const assessmentSQL = `
              INSERT INTO Assessment(assessmentID, periodID, assessment_type, qualification)
              VALUES (UUID_TO_BIN('${assessmentIDs[assessmentIndex]}'), UUID_TO_BIN('${periodIDs[i]}'), '${assessments[i][j]}', '');
            `;
            await db.promise().query(assessmentSQL);
            assessmentIndex++;
          }
        }
      }

      await db.promise().commit();
      console.log('Transaction Completed Successfully.');
    } catch (error) {
      await db.promise().rollback();
      console.error('Transaction Failed:', error);
    } finally {
      await db.promise().end();
    }
  };

  static async createAssessment ({periodID, input}) {
    const {
      assessment_type,
      qualification
    } = input;

    const [assessmentUUID] = await db.promise().execute('SELECT UUID() assessmentID;');
    const [{ assessmentID }] = assessmentUUID;

    try {
      const [Assessment] = await db.promise().execute(`SELECT * FROM Assessment WHERE periodID = UUID_TO_BIN("${periodID}") AND assessment_type = ?`, [assessment_type]);

      const assessment = Assessment[0];

      if(assessment || assessment >= 1) {
        console.error('The assessment currently exist');
        return { errorMessage: 'The assessment currently exist.'};
      } else {
        try {
          await db.promise().execute(`INSERT INTO Assessment (assessmentID, periodID, assessment_type, qualification) VALUES(UUID_TO_BIN("${assessmentID}"), UUID_TO_BIN("${periodID}"), ?, ?);`, [assessment_type, qualification]);
          return { message: 'Assessment created.'};
        } catch (e) {
          console.log(e)
          throw new Error('Error creating assessment');
        }

      }
    } catch (e) {
      console.log(e);
      throw new Error('Error searching assessment');
    }
  };


  static async updatePeriod ({periodID, input}) {
    const {observations} = input;

    try {
      await db.promise().execute(`UPDATE Period SET observations = ? WHERE periodID = UUID_TO_BIN("${periodID}")`, [observations]);
    } catch(e) {
      console.log(e);
      throw new Error('Error updating period');
    };
  };

  static async updateAssessment ({assessmentID, input}) {
    const {qualification} = input;

    try {
      const a = await db.promise().execute(`UPDATE Assessment SET qualification = ? WHERE assessmentID = UUID_TO_BIN("${assessmentID}")`, [qualification]);
      return { message: 'Assessment updated' };
    } catch(e) {
      console.log(e);
      throw new Error('Error updating assessment');
    };
  }
};

import mysql from 'mysql2';
// import grpcClient from '../../protos_clients/course.js';

const DEFAULT_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'subjectDB'
};

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;
const db = mysql.createConnection(connectionString);

db.connect(err => {
    if (err) {
        console.error('Subject database connection failed:', err.stack);
        return;
    }
    console.log('Connected to subject database.');
});

// async function getCourseDetails(courseID) {
//   return new Promise((resolve, reject) => {
//     const details = [];
//     const call = grpcClient.GetByID({ courseID });

//     call.on('data', (response) => {
//       details.push(response);
//     });

//     call.on('end', () => {
//       resolve(details);
//     });

//     call.on('error', (error) => {
//       console.error('Error calling gRPC GetByID:', error);
//       reject(new Error('gRPC call failed'));
//     });
//   });
// }

export class SubjectModel {
  static async getAll () {
      try{
          const subjects = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM Subject', (err, subjects) => {
              if (err) reject(err);
              resolve(subjects);
            });
          });
    
          if (subjects.length === 0) {
            console.error('Subjects not found');
            return [];
          };

          return subjects.map(subject => ({
            subjectID: subject.subjectID.toString('hex'),
            courseID: subject.courseID.toString('hex'),
            name: subject.name
          }));
    
          // const subjectPromises = subjects.map(async (subject) => {
          //   const schedules = await new Promise((resolve, reject) => {
          //     db.query('SELECT day, schedule FROM Subject_Schedule WHERE subjectID = ?', [subject.subjectID], (err, schedules) => {
          //       if(err) reject(err);
    
          //       resolve(schedules);
          //     });
          //   });
    
          //   if (schedules.length === 0) {
          //     console.error('Schedules not found:');
          //     return [];
          //   };

          //   const courseID = subject.courseID;

          //   // const courseDetails = await getCourseDetails(courseID);
    
          //   return schedules.map(schedule => ({
          //     name: subject.name,
          //     day: schedule.day,
          //     schedule: schedule.schedule/*,
          //     courseDetails: courseDetails*/
          //   }));
          // });
    
          // const subjectObjects = await Promise.all(subjectPromises);
          // const flattenedSubjectObjects = subjectObjects.flat();
          // const response = { 
          //   responses: flattenedSubjectObjects
          // };

          // return response.responses;
      } catch (error) {
          console.error('Error processing subjects:', error);
          throw new Error('Internal server error');
      };
  };

  static async getAllSchedules () {
    try {
      const schedules = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM Subject_Schedule', (err, schedules) => {
          if(err) reject(err);

          resolve(schedules);
        })
      })

      if (!schedules) {
        console.error('Schedules not found:');
        return [];
      };
  
      return schedules.map(schedule => ({
        scheduleID: schedule.scheduleIDID.toString('hex'),
        subjectID: subject.subjectID.toString('hex'),
        day: schedule.day,
        schedule: schedule.schedule
      }));
    } catch(e) {
      console.log(e);
      throw new Error('Internal server error');
    }
  };

  static async getByID ({ subjectID }) {
    try {
      const [Subject] = await db.promise().execute(`SELECT * FROM Subject WHERE subjectID = UUID_TO_BIN("${subjectID}")`);

      const subject = Subject[0];

      if (!subject) {
        console.error('Subject not found with ID:', subjectID);
        return [];
      };

      return {
        subjectID: subject.subjectID.toString('hex'),
        courseID: subject.courseID.toString('hex'),
        name: subject.name
      };
    } catch(e) {
      console.log(e);
      throw new Error('Internal server error');
    };
  };

  static async getSchedulesByID ({subjectID}) {
    try {
      const schedules = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM Subject_Schedule WHERE subjectID = UUID_TO_BIN("${subjectID}")`, (err, groups) => {
          if (err) reject(err);
          resolve(groups);
        });
      });

      const scheduleObjects = schedules.map(schedule => {
        return {
          scheduleID: schedule.scheduleID.toString('hex'),
          subjectID: schedule.subjectID.toString('hex'),
          day: schedule.day,
          schedule: schedule.schedule
        };
      });

      return scheduleObjects;
    } catch(e) {
      console.log(e);
      throw new Error('Internal server error');
    }
  };

  static async getByScheduleID ({subjectID, scheduleID}) {
    try {
      const schedule = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM Subject_Schedule WHERE subjectID = UUID_TO_BIN("${subjectID}") AND scheduleID = UUID_TO_BIN("${scheduleID}")`, (err, groups) => {
          if (err) reject(err);
          resolve(groups);
        });
      });

      return {
        scheduleID: schedule.scheduleID.toString('hex'),
        subjectID: schedule.subjectID.toString('hex'),
        day: schedule.day,
        schedule: schedule.schedule
      };
    } catch (e) {
      console.error('Error processing schedule:', e);
      throw new Error('Internal server error');
    };
  };

  static async create ({input}) {
    const {
      name
    } = input;

    const [uuidCourse] = await db.promise().execute('SELECT UUID() subjectID;')
    const [{ subjectID }] = uuidCourse;

    //TODO - Agregar courseID del microservicio de curso
    const courseID = "827327327321";

    try {
      await db.promise().execute(`INSERT INTO Subject (subjectID, courseID, name) VALUES (UUID_TO_BIN("${subjectID}"), (UUID_TO_BIN("${courseID}"), ?);`, [name]);
    } catch (e) {
      console.log(e)
      throw new Error('Error creating course: ');
    }

    try {
      const [Subject] = await db.promise().execute(`SELECT * FROM Subject WHERE subjectID = UUID_TO_BIN("${subjectID}")`);

      const subject = Subject[0];

      if (!subject) {
        console.error('Subject not found with ID:', courseID);
        return [];
      };

      return {
        subjectID: subject.subjectID.toString('hex'),
        courseID: subject.courseID.toString('hex'),
        name: subject.name
      };
    } catch (error) {
      console.error('Error processing subject:', error);
      throw new Error('Internal server error');
    };
  };
};

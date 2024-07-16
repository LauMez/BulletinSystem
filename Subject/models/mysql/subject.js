import mysql from 'mysql2';
import axios from 'axios';
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

          // const subjectObject = subjects.map(subject => {
          //   const courseID = subject.courseID.toString('hex');

          //   const course = await axios.get(`http://localhost:1234/course/${(courseID)}`);

          //   console.log(course);

          //   return {
          //     subjectID: subject.subjectID.toString('hex'),
          //     courseID: subject.courseID.toString('hex'),
          //     name: subject.name
          //   };
          // });
          const subjectObject = [];
          for (const subject of subjects) {
            const courseID = subject.courseID.toString('hex');
            try {
              // const courseAxio = await axios.get(`http://localhost:1234/course/${courseID}`);

              // const course = courseAxio.data;

              subjectObject.push({
                subjectID: subject.subjectID.toString('hex'),
                courseID: subject.courseID.toString('hex'),
                name: subject.name,
                // course: course
              });
            } catch (courseError) {
              console.error(`Error fetching course with ID ${courseID}:`, courseError);
            }
          }

          return subjectObject;

          // return subjects.map(subject => ({

          


          //   subjectID: subject.subjectID.toString('hex'),
          //   courseID: subject.courseID.toString('hex'),
          //   name: subject.name
          // }));
    
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
        scheduleID: schedule.scheduleID.toString('hex'),
        subjectID: schedule.subjectID.toString('hex'),
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

      const courseID = subject.courseID.toString('hex');
      const courseAxio = await axios.get(`http://localhost:1234/course/${(courseID)}`);
      const course = courseAxio.data;

      //TODO - manejar errores que llegan del axios

      return {
        subjectID: subject.subjectID.toString('hex'),
        courseID: subject.courseID.toString('hex'),
        name: subject.name,
        courseYear: course.year,
        courseDivision: course.division,
        courseEntry: course.entry_time,
        courseSpecialty: course.specialty
      };
    } catch(e) {
      console.log(e);
      throw new Error('Internal server error');
    };
  };

  static async getByCourseID ({courseID}) {
    try {
      const subjects = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM Subject WHERE courseID = UUID_TO_BIN("${courseID}")`, (err, subjects) => {
          if(err) reject(err);
          resolve(subjects);
        });
      });

      if (!subjects) {
        console.error('Subject not found with course ID:', courseID);
        return [];
      };

      const subjectObjects = subjects.map(subject => {
        return {
          subjectID: subject.subjectID.toString('hex'),
          courseID: subject.courseID.toString('hex'),
          name: subject.name
        };
      });

      return subjectObjects;
    } catch(e) {
      console.log(e);
      throw new Error('Internal server error');
    };
  }

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

      console.log(schedule.day, schedule.schedule);

      const scheduleObject = schedule.map(schedule => {
        return {
          scheduleID: schedule.scheduleID.toString('hex'),
          subjectID: schedule.subjectID.toString('hex'),
          day: schedule.day,
          schedule: schedule.schedule
        };
      });

      return scheduleObject;
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
    const courseID = "d72cfe65-d715-47a3-b9ce-f3c45cf7f915";

    try {
      await db.promise().execute(`INSERT INTO Subject (subjectID, courseID, name) VALUES (UUID_TO_BIN("${subjectID}"), UUID_TO_BIN("${courseID}"), ?);`, [name]);
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

  static async createSchedule ({subjectID, input}) {
    const {
      day,
      schedule
    } = input;

    const [uuidSchedule] = await db.promise().execute('SELECT UUID() scheduleID;');
    const [{ scheduleID }] = uuidSchedule;

    try {
      await db.promise().execute(`INSERT INTO Subject_Schedule (scheduleID, subjectID, day, schedule) VALUES(UUID_TO_BIN("${scheduleID}"), UUID_TO_BIN("${subjectID}"), ?, ?);`, [day, schedule]);
    } catch (e) {
      console.log(e)
      throw new Error('Error creating subject schedule');
    }

    try {
      const schedules = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM Subject_Schedule WHERE subjectID = UUID_TO_BIN("${subjectID}")`, (err, groups) => {
          if (err) reject(err);
          resolve(groups);
        });
      });

      if (!schedules) {
        console.error('Schedules not found with ID:', subjectID);
        return [];
      };

      const scheduleObjects = schedules.map(schedule => {
        return {
          scheduleID: schedule.scheduleID.toString('hex'),
          subjectID: schedule.subjectID.toString('hex'),
          day: schedule.day,
          schedule: schedule.schedule
        };
      });

      return scheduleObjects;
    } catch (error) {
      console.error('Error processing schedules:', error);
      throw new Error('Internal server error');
    };
  };

  static async delete ({subjectID}) {
    try {
      await db.promise().execute(`DELETE FROM Subject_Schedule WHERE subjectID = UUID_TO_BIN("${subjectID}")`);
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting subject schedules');
    }

    try {
      await db.promise().execute(`DELETE FROM Impartition WHERE subjectID = UUID_TO_BIN("${subjectID}")`);
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting impartitions');
    }
    
    try {
      await db.promise().execute(`DELETE FROM Subject WHERE subjectID = UUID_TO_BIN("${subjectID}")`);
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting subject');
    }

    return;
  }

  static async deleteSchedule ({subjectID, scheduleID}) {
    try {
      await db.promise().execute(`DELETE FROM Subject_Schedule WHERE scheduleID = UUID_TO_BIN("${scheduleID}") AND subjectID = UUID_TO_BIN("${subjectID}")`);
    }  catch(e) {
      console.log(e);
      throw new Error('Error deleting schedule');
    };
  };

  static async update ({subjectID, input}) {
    const {
      name
    } = input;

    const courseID = "326efd0b358c11efb07bd03957a8a7aa";

    try {
      await db.promise().execute(`UPDATE Subject SET courseID = UUID_TO_BIN("${courseID}"), name = ? WHERE subjectID = UUID_TO_BIN("${subjectID}")`, [name]);
    } catch(e) {
      console.log(e);
      throw new Error('Error updating subject');
    };
  };

  static async updateSchedule ({subjectID, scheduleID, input}) {
    const {day, schedule} = input;

    try {
      await db.promise().execute(`UPDATE Subject_Schedule SET day = ?, schedule = ? WHERE subjectID = UUID_TO_BIN("${subjectID}") AND scheduleID = UUID_TO_BIN("${scheduleID}")`, [day, schedule]);
    } catch(e) {
      console.log(e);
      throw new Error('Error updating subject schedule');
    };
  }
};

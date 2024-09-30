import { db } from '../../config.js';

db.connect(err => {
  if (err) {
      console.error('Subject database connection failed:', err.stack);
      return;
  }
  console.log('Connected to subject database.');
});
export class SubjectModel {
  static async getAll () {
    try {
      const [subjects] = await db.promise().query('SELECT * FROM Subject');
  
      if (subjects.length === 0) {
        console.error('No subjects found');
        return [];
      }
  
      return subjects.map(subject => ({
        subjectID: subject.subjectID.toString('hex'),
        courseID: subject.courseID.toString('hex'),
        name: subject.name
      }));
    } catch (error) {
      console.error('Error processing subjects:', error);
      throw new Error('Internal server error');
    };
  };

  static async getAllSchedules () {
    try {
      const [schedules] = await db.promise().query('SELECT * FROM Subject_Schedule');
  
      if (schedules.length === 0) {
        console.error('No schedules found');
        return [];
      }
  
      return schedules.map(schedule => ({
        scheduleID: schedule.scheduleID.toString('hex'),
        subjectID: schedule.subjectID.toString('hex'),
        day: schedule.day,
        schedule: schedule.schedule
      }));
    } catch (error) {
      console.error('Error processing schedules:', error);
      throw new Error('Internal server error');
    }
  };

  static async getByID ({ subjectID }) {
    try {
      const [[subject]] = await db.promise().execute(
        'SELECT * FROM Subject WHERE subjectID = UUID_TO_BIN(?)', [subjectID]);
  
      if (!subject) {
        console.error('Subject not found with ID:', subjectID);
        return null;
      }

      const schedules = await this.getSchedulesByID({ subjectID })

      const groupID = subject.courseGroupID;
  
      return {
        subjectID: subject.subjectID.toString('hex'),
        courseID: subject.courseID.toString('hex'),
        courseGroupID: groupID ? groupID.toString('hex') : '', 
        name: subject.name,
        schedules
      };
    } catch (error) {
      console.error('Error processing subject:', error);
      throw new Error('Internal server error');
    }
  };

  static async getByCourseGroupID ({courseID, courseGroupID}) {
    try {
      console.log(courseID, courseGroupID);
      const [subjectIDs] = await db.promise().execute(
        "SELECT * FROM Subject WHERE courseID = UUID_TO_BIN(?) AND (courseGroupID = UUID_TO_BIN(?) OR courseGroupID IS NULL)", [courseID, courseGroupID]);
  
      if (subjectIDs.length === 0) {
        console.error('No subjects found for course group ID:', courseGroupID, ' or couse ID: ', courseID);
        return [];
      }

      const subjects = await Promise.all(subjectIDs.map(async (subject) => {
        return await this.getByID({ subjectID: subject.subjectID.toString('hex') });
      }));

      console.log(subjects);
  
      return subjects
    } catch (error) {
      console.error('Error processing subjects by course group ID or course ID:', error);
      throw new Error('Internal server error');
    }
  }

  static async getSchedulesByID ({subjectID}) {
    try {
      const [schedules] = await db.promise().execute(
        'SELECT * FROM Subject_Schedule WHERE subjectID = UUID_TO_BIN(?)', [subjectID]);
  
      if (schedules.length === 0) {
        console.error('No schedules found for subject ID:', subjectID);
        return [];
      }
  
      return schedules.map(schedule => ({
        scheduleID: schedule.scheduleID.toString('hex'),
        day: schedule.day,
        entry_schedule: schedule.entry_schedule,
        finish_schedule: schedule.finish_schedule
      }));
    } catch (error) {
      console.error('Error processing schedules by subject ID:', error);
      throw new Error('Internal server error');
    }
  };

  static async create ({input}) {
    const { name, course } = input;

    try {
      const [[{ subjectID }]] = await db.promise().execute('SELECT UUID() AS subjectID');

      await db.promise().execute(
        'INSERT INTO Subject (subjectID, courseID, name) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?);',
        [subjectID, course, name]
      );

      return { message: 'Subject created' };
    } catch (error) {
      console.error('Error creating subject:', error);
      throw new Error('Error creating subject');
    }
  };

  static async createSchedule ({subjectID, input}) {
    const { day, schedule } = input;

    try {
      const [[{scheduleID}]] = await db.promise().execute('SELECT UUID() AS scheduleID;');

      await db.promise().execute(
        'INSERT INTO Subject_Schedule (scheduleID, subjectID, day, schedule) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?);',
        [scheduleID, subjectID, day, schedule]
      );

      return { message: 'Schedule created' };
    } catch (error) {
      console.error('Error creating subject schedule:', error);
      throw new Error('Error creating subject schedule');
    }
  };

  static async delete ({subjectID}) {
    try {
      await db.promise().execute('DELETE FROM Subject_Schedule WHERE subjectID = UUID_TO_BIN(?);',[subjectID]);
      
      await db.promise().execute('DELETE FROM Subject WHERE subjectID = UUID_TO_BIN(?);',[subjectID]);
    } catch (error) {
      console.error('Error deleting subject or schedules:', error);
      throw new Error('Error deleting subject or associated schedules');
    }
  }

  static async deleteSchedule ({ scheduleID}) {
    try {
      await db.promise().execute('DELETE FROM Subject_Schedule WHERE scheduleID = UUID_TO_BIN(?);',[scheduleID]);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw new Error('Error deleting schedule');
    }
  };

  static async update ({subjectID, input}) {
    const { name, course } = input;

    try {
      await db.promise().execute(`UPDATE Subject SET courseID = UUID_TO_BIN(?), name = ? WHERE subjectID = UUID_TO_BIN(?);`,
        [course, name, subjectID]
      );
    } catch (error) {
      console.error('Error updating subject:', error);
      throw new Error('Error updating subject');
    }
  };

  static async updateSchedule ({ scheduleID, input}) {
    const { day, schedule } = input;

    try {
      await db.promise().execute(`UPDATE Subject_Schedule SET day = ?, schedule = ? WHERE scheduleID = UUID_TO_BIN(?);`,
        [day, schedule, scheduleID]
      );
    } catch (error) {
      console.error('Error updating subject schedule:', error);
      throw new Error('Error updating subject schedule');
    }
  }
};

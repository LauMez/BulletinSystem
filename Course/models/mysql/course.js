import mysql from 'mysql2';

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'courseDB'
};

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

const db = mysql.createConnection(connectionString);

db.connect(err => {
  if (err) {
    console.error('Course database connection failed:', err.stack);
    return;
  };

  console.log('Connected to course database.');
});

export class CourseModel {
  static async getAll () {
    try {
        const courses = await new Promise((resolve, reject) => {
          db.query('SELECT * FROM Course', (err, courses) => {
            if (err) reject(err);
            resolve(courses);
          });
        });
  
        if (!courses) {
          console.error('Courses not found');
          return [];
        };
    
        return courses.map(course => ({
          courseID: course.courseID.toString('hex'),
          year: course.year,
          division: course.division,
          entry_time: course.entry_time,
          specialty: course.specialty
        }));
    } catch (error) {
        console.error('Error processing courses:', error);
        throw new Error('Internal server error');
    };
  };

  static async getAllGroups () {
    try {
      const groups = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM Course_Group', (err, groups) => {
          if (err) reject(err);
  
          resolve(groups);
        });
      });
  
      if (!groups) {
        console.error('Groups not found:');
        return [];
      };
  
      return groups.map(group => ({
        courseGroupID: group.courseGroupID.toString('hex'),
        courseID: group.courseID.toString('hex'),
        group: group.courseGroup,
      }));
    } catch(e) {
      console.log(e);
      throw new Error('Internal server error');
    }
  };

  static async getByID ({ courseID }) {
    try {
      const [Course] = await db.promise().execute(`SELECT * FROM Course WHERE courseID = UUID_TO_BIN("${courseID}")`);
      const course = Course[0];

      if (!course) {
        console.error('Course not found with ID:', courseID);
        return [];
      };

      return {
        courseID: course.courseID.toString('hex'),
        year: course.year,
        division: course.division,
        entry_time: course.entry_time,
        specialty: course.specialty
      }
    } catch (error) {
      console.error('Error processing course:', error);
      throw new Error('Internal server error');
    };
  };

  static async getByCourseGroupID ({courseGroupID}) {
    try {
      const [Group] = await db.promise().execute(`SELECT * FROM Course_Group WHERE courseGroupID = UUID_TO_BIN("${courseGroupID}")`);
      const group = Group[0];

      if (!group) {
        console.error('Group not found with ID:', courseGroupID);
        return [];
      };

      const courseID = group.courseID.toString('hex');

      const [Course] = await db.promise().execute(`SELECT * FROM Course WHERE courseID = UUID_TO_BIN('${courseID}')`);
      const course = Course[0];

      if (!group) {
        console.error('Course not found with ID:', courseID);
        return [];
      };

      return {
        courseID: courseID,
        year: course.year,
        division: course.division,
        entry_time: course.entry_time,
        specialty: course.specialty
      }

    } catch(error) {
      console.error('Error processing course:', error);
      throw new Error('Internal server error');
    }
  }

  static async getGroupsByID ({courseID}) {
    console.log(courseID);
    try {
      const groups = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM Course_Group WHERE courseID = UUID_TO_BIN("${courseID}")`, (err, groups) => {
          if (err) reject(err);
          resolve(groups);
        });
      });

      console.log(groups);

      const groupsObjects = groups.map(group => {
        return {
          courseGroupID: group.courseGroupID.toString('hex'),
          courseID: group.courseID.toString('hex'),
          group: group.courseGroup
        };
      });

      console.log(groupsObjects);

      return groupsObjects;
    } catch(e) {
      console.error('Error processing groups:', e);
      throw new Error('Internal server error');
    }
  }

  static async getByGroupID ({courseID, courseGroupID}) {
    try {
      const groups = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM Course_Group WHERE courseID = UUID_TO_BIN("${courseID}") AND courseGroupID = UUID_TO_BIN("${courseGroupID}")`, (err, groups) => {
          if (err) reject(err);
          resolve(groups);
        });
      });

      const groupsObjects = groups.map(group => {
        return {
          courseGroupID: group.courseGroupID.toString('hex'),
          courseID: group.courseID.toString('hex'),
          group: group.courseGroup
        };
      });

      return groupsObjects;
    } catch (e) {
      console.error('Error processing groups:', e);
      throw new Error('Internal server error');
    }
  };

  static async create ({input}) {
    const {
      year,
      division,
      entry_time,
      specialty
    } = input;

    const [uuidCourse] = await db.promise().execute('SELECT UUID() courseID;')
    const [{ courseID }] = uuidCourse;

    console.log(courseID, year, division, entry_time, specialty);

    try {
      await db.promise().execute(`INSERT INTO Course (courseID, year, division, entry_time, specialty) VALUES (UUID_TO_BIN("${courseID}"), ?, ?, ?, ?);`, [year, division, entry_time, specialty]);
    } catch (e) {
      console.log(e)
      throw new Error('Error creating course: ');
    }

    try {
      const [Course] = await db.promise().execute(`SELECT * FROM Course WHERE courseID = UUID_TO_BIN("${courseID}")`);

      const course = Course[0];

      if (!course) {
        console.error('Course not found with ID:', courseID);
        return [];
      };

      return {
        courseID: course.courseID.toString('hex'),
        year: course.year,
        division: course.division,
        entry_time: course.entry_time,
        specialty: course.specialty
      };
    } catch (error) {
      console.error('Error processing course:', error);
      throw new Error('Internal server error');
    };
  };

  static async createGroup ({courseID, input}) {
    const {
      group
    } = input;

    const [uuidGroup] = await db.promise().execute('SELECT UUID() courseGroupID;');
    const [{ courseGroupID }] = uuidGroup;

    try {
      await db.promise().execute(`INSERT INTO Course_Group (courseGroupID, courseID, courseGroup) VALUES(UUID_TO_BIN("${courseGroupID}"), UUID_TO_BIN("${courseID}"), ?);`, [group]);
    } catch (e) {
      console.log(e)
      throw new Error('Error creating course group');
    }

    try {
      const groups = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM Course_Group WHERE courseGroupID = UUID_TO_BIN("${courseGroupID}")`, (err, groups) => {
          if (err) reject(err);
          resolve(groups);
        });
      });

      if (!groups) {
        console.error('Groups not found with ID:', courseID);
        return [];
      };

      const groupsObjects = groups.map(group => {
        return {
          courseGroupID: group.courseGroupID.toString('hex'),
          courseID: group.courseID.toString('hex'),
          group: group.courseGroup
        };
      });

      return groupsObjects;
    } catch (error) {
      console.error('Error processing course:', error);
      throw new Error('Internal server error');
    };
  };

  static async delete ({courseID}) {
    try {
      await db.promise().execute(`DELETE FROM Course_Group WHERE courseID = UUID_TO_BIN("${courseID}")`);
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting course groups');
    }

    try {
      await db.promise().execute(`DELETE FROM Inscription WHERE courseID = UUID_TO_BIN("${courseID}")`);
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting inscriptions');
    }
    
    try {
      await db.promise().execute(`DELETE FROM Course WHERE courseID = UUID_TO_BIN("${courseID}")`);
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting course');
    }

    return;
  };

  static async deleteGroup ({courseID, courseGroupID}) {
    try {
      await db.promise().execute(`DELETE FROM Course_Group WHERE courseID = UUID_TO_BIN("${courseID}") AND courseGroupID = UUID_TO_BIN("${courseGroupID}")`);
    }  catch(e) {
      console.log(e);
      throw new Error('Error deleting group');
    }
  };

  static async update ({courseID, input}) {
    const {
      year,
      division,
      entry_time,
      specialty
    } = input;

    try {
      await db.promise().execute(`UPDATE Course SET year = ?, division = ?, entry_time = ?, specialty = ? WHERE courseID = UUID_TO_BIN("${courseID}")`, [year, division, entry_time, specialty]);
    } catch(e) {
      console.log(e);
      throw new Error('Error updating course');
    }
  };

  static async updateGroup ({courseID, courseGroupID, input}) {
    const {group} = input;

    try {
      await db.promise().execute(`UPDATE Course_Group SET courseGroup = ? WHERE courseID = UUID_TO_BIN("${courseID}") AND courseGroupID = UUID_TO_BIN("${courseGroupID}")`, [group]);
    } catch(e) {
      console.log(e);
      throw new Error('Error updating course group');
    };
  };
};

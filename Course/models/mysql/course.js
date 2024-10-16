import { db } from '../../config.js';

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
      const [courses] = await db.promise().execute('SELECT * FROM Course');
  
      if (!courses || courses.length === 0) {
        console.error('Courses not found');
        return [];
      }


      const courseResponse = await Promise.all(
        courses.map(async (course) => {
          const courseID = course.courseID.toString('hex');
          const groups = await this.getGroupsByID({ courseID }); 

          const impartitionResponse = await fetch(`http://localhost:6534/preceptor/impartition/${courseID}`);
        
          let impartition = null;
          if(impartitionResponse.ok) impartition = await impartitionResponse.json();
    
          return {
            courseID,
            year: course.year,
            division: course.division,
            entry_time: course.entry_time,
            specialty: course.specialty,
            groups,
            impartition
          };
        })
      );
    
      return courseResponse
    } catch (error) {
      console.error('Error processing courses:', error);
      throw new Error('Internal server error');
    }
  };

  static async getAllGroups () {
    try {
      const [groups] = await db.promise().execute('SELECT * FROM Course_Group');
  
      if (groups.length === 0) {
        console.error('Groups not found');
        return [];
      }
  
      return groups.map(group => ({
        courseGroupID: group.courseGroupID.toString('hex'),
        courseID: group.courseID.toString('hex'),
        group: group.courseGroup,
      }));
    } catch (error) {
      console.error('Error processing groups:', error);
      throw new Error('Internal server error');
    }
  };

  static async getByID ({ courseID }) {
    try {
      const [[course]] = await db.promise().execute(
        'SELECT * FROM Course WHERE courseID = UUID_TO_BIN(?)',
        [courseID]
      );
  
      if (!course) {
        console.error('Course not found with ID:', courseID);
        return { message: "Course dosent exist" };
      }

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
        courseGroupID,
        group: group.courseGroup
      }

    } catch(error) {
      console.error('Error processing course:', error);
      throw new Error('Internal server error');
    }
  };

  static async getGroupsByID ({courseID}) {
    try {
      const [groups] = await db.promise().execute(
        'SELECT * FROM Course_Group WHERE courseID = UUID_TO_BIN(?)',
        [courseID]
      );
  
      return groups.map(group => ({
        courseGroupID: group.courseGroupID.toString('hex'),
        courseID: group.courseID.toString('hex'),
        group: group.courseGroup
      }));
    } catch (error) {
      console.error('Error processing groups:', error);
      throw new Error('Internal server error');
    }
  }

  static async getByStudent({ CUIL }) {
    try {
      const [[inscription]] = await db.promise().execute('SELECT * FROM Inscription WHERE CUIL = ?', [CUIL])

      if(!inscription) return null

      const courseID = inscription.courseID.toString('hex')
      const courseGroupID = inscription.courseGroupID.toString('hex')

      const course = await this.getByID({courseID});
      const group = await this.getByCourseGroupID({courseGroupID})

      return {
        course,
        group,
        inscriptionID: inscription.inscriptionID.toString('hex')
      };
    } catch (error) {
      console.error('Error processing course:', error);
      throw new Error('Internal server error');
    }
  };

  static async getStudents({ courseID }) {
    try {
      const [inscriptions] = await db.promise().execute('SELECT * FROM Inscription WHERE courseID = UUID_TO_BIN(?)', [courseID]);

      if(!inscriptions || inscriptions.length === 0) return null;

      const students = await Promise.all(inscriptions.map(async (inscription) => {
        const studentResponse = await fetch(`http://localhost:4567/student/${inscription.CUIL}`);
        const student = await studentResponse.json();

        return student;
      }));

      return students;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw new Error('Internal server error');
    }
  };

  static async getStudentsByGroup({ courseGroupID }) {
    try {
      const [inscriptions] = await db.promise().execute('SELECT * FROM Inscription WHERE courseGroupID = UUID_TO_BIN(?)', [courseGroupID]);

      if(!inscriptions || inscriptions.length === 0) return null;

      const students = await Promise.all(inscriptions.map(async (inscription) => {
        const studentResponse = await fetch(`http://localhost:4567/student/${inscription.CUIL}`);
        const student = await studentResponse.json();

        return student;
      }));

      return students;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw new Error('Internal server error');
    }
  };

  static async create ({input}) {
    const { year, division, entry_time, specialty } = input;

    try {
      const [[{ courseID }]] = await db.promise().execute('SELECT UUID() AS courseID');

      await db.promise().execute(
        `INSERT INTO Course (courseID, year, division, entry_time, specialty) 
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)`,
        [courseID, year, division, entry_time, specialty]
      );

      return { message: "Course created" };
    } catch (error) {
      console.error('Error creating course:', error);
      throw new Error('Error creating course');
    }
  };

  static async createGroup ({courseID, input}) {
    const { group } = input;

    try {
      const [[{ courseGroupID }]] = await db.promise().execute('SELECT UUID() AS courseGroupID');
  
      await db.promise().execute(
        `INSERT INTO Course_Group (courseGroupID, courseID, courseGroup) 
         VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?)`,
        [courseGroupID, courseID, group]
      );
  
      return { message: 'Group created' };
    } catch (e) {
      console.error('Error creating course group:', e);
      throw new Error('Error creating course group');
    }
  };

  static async delete ({courseID}) {
    try {
      await db.promise().execute(
        `DELETE FROM Course_Group WHERE courseID = UUID_TO_BIN(?)`, 
        [courseID]
      );
  
      await db.promise().execute(
        `DELETE FROM Course WHERE courseID = UUID_TO_BIN(?)`, 
        [courseID]
      );
  
      return { message: 'Course and related data deleted successfully' };
    } catch (e) {
      console.error('Error deleting course and related data:', e);
      throw new Error('Error deleting course and related data');
    }
  };

  static async deleteGroup ({courseGroupID}) {
    try {
      await db.promise().execute(
        `DELETE FROM Course_Group WHERE courseGroupID = UUID_TO_BIN(?)`,
        [courseGroupID]
      );
  
      return { message: 'Group deleted successfully' };
    } catch (e) {
      console.error('Error deleting group:', e);
      throw new Error('Error deleting group');
    }
  };

  static async update ({courseID, input}) {
    const { year, division, entry_time, specialty } = input;

    try {
      await db.promise().execute(
        `UPDATE Course SET year = ?, division = ?, entry_time = ?, specialty = ? WHERE courseID = UUID_TO_BIN(?)`,
        [year, division, entry_time, specialty, courseID]
      );

      return { message: 'Course updated successfully' };
    } catch (e) {
      console.error('Error updating course:', e);
      throw new Error('Error updating course');
    }
  };

  static async updateGroup ({ courseGroupID, input}) {
    const { group } = input;

    try {
      await db.promise().execute(
        `UPDATE Course_Group SET courseGroup = ? WHERE courseGroupID = UUID_TO_BIN(?)`,
        [group, courseGroupID]
      );

      return { message: 'Course group updated successfully' };
    } catch (e) {
      console.error('Error updating course group:', e);
      throw new Error('Error updating course group');
    }
  };

  static async getInscriptions({ courseID }) {
    try {
      const [inscriptions] = await db.promise().execute('SELECT * FROM Inscription WHERE courseID = UUID_TO_BIN(?)', [courseID]);

      if(!inscriptions || inscriptions.length === 0) return null;

      const students = await Promise.all(inscriptions.map(async (inscription) => {
        const studentResponse = await fetch(`http://localhost:4567/student/${inscription.CUIL}`);
        const student = await studentResponse.json();

        return student;
      }));

      return students;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw new Error('Internal server error');
    }
  }

  static async createInscription({ courseID, CUIL }) {
    try {
      const [[{inscriptionID}]] = await db.promise().execute('SELECT UUID() AS inscriptionID')

      await db.promise().execute('INSERT INTO Inscription (inscriptionID, courseID, CUIL) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?)', [inscriptionID, courseID, CUIL]
      )

      return { message: "Course inscription created successfully" }
    } catch(e) {
      console.log('Error fetching course inscriptions', e)
      throw new Error('Error geting course inscriptions')
    }
  }

  static async editInscription({ CUIL, courseID, courseGroupID }) {
    try {
      console.log('model data: ', CUIL, courseID, courseGroupID);
      const request = await db.promise().execute('UPDATE Inscription SET courseID = UUID_TO_BIN(?), courseGroupID = UUID_TO_BIN(?) WHERE CUIL = ?', [courseID, courseGroupID, CUIL]);
      
      if(!request) return null;

      return true;
    } catch(error) {
      console.log('Error editing course inscription', error)
      throw new Error('Error editing course inscriptions')
    };
  };

  static async deleteInscription({ inscriptionID }) {
    try {

      await db.promise().execute('DELETE FROM Inscription WHERE inscriptionID = UUID_TO_BIN(?)',
        [inscriptionID]
      )

      return { message: "Course inscription deleted successfully" }
    } catch(e) {
      console.log('Error fetching course inscriptions', e)
      throw new Error('Error geting course inscriptions')
    }
  }
};

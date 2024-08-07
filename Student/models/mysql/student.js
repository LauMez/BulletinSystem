import mysql from 'mysql2';
import courseClient from '../../../Course/clients/course.js';

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'studentDB'
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

async function getCourseByCourseGroupID(courseGroupID) {
  return new Promise((resolve, reject) => {
    courseClient.GetByCourseGroupID({courseGroupID}, (err, course) => {
      if (err) {
        console.error('Failed to fetch course:', err);
        reject(err);
      } else {
        resolve(course);
      }
    })
  });
};

export class StudentModel {
  static async getAll () {
    try {
        const students = await new Promise((resolve, reject) => {
          db.query('SELECT * FROM Student', (err, students) => {
            if (err) reject(err);
            resolve(students);
          });
        });
  
        if (!students) {
          console.error('Students not found');
          return [];
        };

        const studentsGroup = await Promise.all(students.map(async (student) => {
          const [Account] = await db.promise().execute('SELECT * FROM Account WHERE CUIL = ?', [student.CUIL]);

          const account = Account[0];

          if(!account) return { errorMessage: `The student with CUIL ${student.CUIL} have not an account.` };

          const [Card] = await db.promise().execute('SELECT * FROM Student_Card WHERE CUIL = ?', [student.CUIL]);

          const card = Card[0];

          if(!card) return { errorMessage: `The student with CUIL ${student.CUIL} have not a card.` };

          const [Personal_Information] = await db.promise().execute('SELECT * FROM Personal_Information WHERE CUIL = ?', [student.CUIL]);

          const personalInformation = Personal_Information[0];

          if(!personalInformation) return { errorMessage: `The student with CUIL ${student.CUIL} have not personal information.` };

          const [Student_Information] = await db.promise().execute('SELECT * FROM Student_Information WHERE CUIL = ?', [student.CUIL]);

          const studentInformation = Student_Information[0];

          if(!studentInformation) return { errorMessage: `The student with CUIL ${student.CUIL} have not student information.` };

          const [Impartition] = await db.promise().execute('SELECT * FROM Impartition WHERE CUIL = ?', [student.CUIL]);

          const impartition = Impartition[0];

          if(!impartition) return { errorMessage: `The student with CUIL ${student.CUIL} have not an impartition` };

          return {
            CUIL: student.CUIL,
            account: {
              username: account.DNI,
              password: account.password
            },
            card: card.cardID,
            personalInformation: {
              DNI: personalInformation.DNI,
              first_name: personalInformation.first_name,
              second_name: personalInformation.second_name,
              last_name1: personalInformation.last_name1,
              last_name2: personalInformation.last_name2,
              phone_number: personalInformation.phone_number,
              landline_phone_number: personalInformation.landline_phone_number,
              direction: personalInformation.direction
            },
            studentInformation: {
              blood_type: studentInformation.blood_type,
              social_work: studentInformation.social_work
            },
            impartition: impartition.courseID.toString('hex')
          }
        }));

        return studentsGroup;
    } catch (error) {
        console.error('Error processing students:', error);
        throw new Error('Internal server error');
    };
  };

  static async getByCUIL({ CUIL }) {
    try {
      const [Account] = await db.promise().execute('SELECT * FROM Account WHERE CUIL = ?', [CUIL]);

      const account = Account[0];

      if(!account) return { errorMessage: 'This student have not an account.' };

      const [Card] = await db.promise().execute('SELECT * FROM Student_Card WHERE CUIL = ?', [CUIL]);

      const card = Card[0];

      if(!card) return { errorMessage: 'This student have not a card.' };

      const [Personal_Information] = await db.promise().execute('SELECT * FROM Personal_Information WHERE CUIL = ?', [CUIL]);

      const personalInformation = Personal_Information[0];

      if(!personalInformation) return { errorMessage: 'This student have not personal information' };

      const [Student_Information] = await db.promise().execute('SELECT * FROM Student_Information WHERE CUIL = ?', [CUIL]);

      const studentInformation = Student_Information[0];

      if(!studentInformation) return { errorMessage: 'This student have not student information.' };

      const [Impartition] = await db.promise().execute('SELECT * FROM Impartition WHERE CUIL = ?', [CUIL]);

      const impartition = Impartition[0];

      if(!impartition) return { errorMessage: 'This student have not an impartition' };

      return {
        CUIL: CUIL,
        account: {
          username: account.DNI,
          password: account.password
        },
        card: card.cardID,
        personalInformation: {
          DNI: personalInformation.DNI,
          first_name: personalInformation.first_name,
          second_name: personalInformation.second_name,
          last_name1: personalInformation.last_name1,
          last_name2: personalInformation.last_name2,
          phone_number: personalInformation.phone_number,
          landline_phone_number: personalInformation.landline_phone_number,
          direction: personalInformation.direction
        },
        studentInformation: {
          blood_type: studentInformation.blood_type,
          social_work: studentInformation.social_work
        },
        impartition: impartition.courseID.toString('hex')
      }
    } catch(error) {
      console.error('Error processing student:', error);
      throw new Error('Internal server error');
    };
  };

  static async getByCourseID({ courseID }) {
    try {
      const students = await new Promise((resolve, reject) => {
        db.query(`SELECT CUIL FROM Impartition WHERE courseID = UUID_TO_BIN("${courseID}")`, (err, students) => {
          if (err) reject(err);
          resolve(students);
        });
      });

      if (!students) {
        console.error('Students not found');
        return [];
      };

      const studentsGroup = await Promise.all(students.map(async (student) => {
        const [Account] = await db.promise().execute('SELECT * FROM Account WHERE CUIL = ?', [student.CUIL]);

        const account = Account[0];

        if(!account) return { errorMessage: `The student with CUIL ${student.CUIL} have not an account.` };

        const [Card] = await db.promise().execute('SELECT * FROM Student_Card WHERE CUIL = ?', [student.CUIL]);

        const card = Card[0];

        if(!card) return { errorMessage: `The student with CUIL ${student.CUIL} have not a card.` };

        const [Personal_Information] = await db.promise().execute('SELECT * FROM Personal_Information WHERE CUIL = ?', [student.CUIL]);

        const personalInformation = Personal_Information[0];

        if(!personalInformation) return { errorMessage: `The student with CUIL ${student.CUIL} have not personal information.` };

        const [Student_Information] = await db.promise().execute('SELECT * FROM Student_Information WHERE CUIL = ?', [student.CUIL]);

        const studentInformation = Student_Information[0];

        if(!studentInformation) return { errorMessage: `The student with CUIL ${student.CUIL} have not student information.` };

        return {
          CUIL: student.CUIL,
          account: {
            username: account.DNI,
            password: account.password
          },
          card: card.cardID,
          personalInformation: {
            DNI: personalInformation.DNI,
            first_name: personalInformation.first_name,
            second_name: personalInformation.second_name,
            last_name1: personalInformation.last_name1,
            last_name2: personalInformation.last_name2,
            phone_number: personalInformation.phone_number,
            landline_phone_number: personalInformation.landline_phone_number,
            direction: personalInformation.direction
          },
          studentInformation: {
            blood_type: studentInformation.blood_type,
            social_work: studentInformation.social_work
          },
          impartition: courseID
        }
      }));

      return studentsGroup;
    } catch (error) {
        console.error('Error processing students:', error);
        throw new Error('Internal server error');
    };
  };

  static async getByCourseGroupID({ courseGroupID }) {
    try {
      const course = await getCourseByCourseGroupID(courseGroupID);
      console.log('course', course);

      const students = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM Impartition WHERE courseID = UUID_TO_BIN('${course.courseID}') `, (err, students) => {
          if (err) reject(err);
          resolve(students);
        });
      });

      if (!students) {
        console.error('Students not found');
        return [];
      };

      const studentsGroup = await Promise.all(students.map(async (student) => {
        const [Account] = await db.promise().execute('SELECT * FROM Account WHERE CUIL = ?', [student.CUIL]);

        const account = Account[0];

        if(!account) return { errorMessage: `The student with CUIL ${student.CUIL} have not an account.` };

        const [Card] = await db.promise().execute('SELECT * FROM Student_Card WHERE CUIL = ?', [student.CUIL]);

        const card = Card[0];

        if(!card) return { errorMessage: `The student with CUIL ${student.CUIL} have not a card.` };

        const [Personal_Information] = await db.promise().execute('SELECT * FROM Personal_Information WHERE CUIL = ?', [student.CUIL]);

        const personalInformation = Personal_Information[0];

        if(!personalInformation) return { errorMessage: `The student with CUIL ${student.CUIL} have not personal information.` };

        const [Student_Information] = await db.promise().execute('SELECT * FROM Student_Information WHERE CUIL = ?', [student.CUIL]);

        const studentInformation = Student_Information[0];

        if(!studentInformation) return { errorMessage: `The student with CUIL ${student.CUIL} have not student information.` };

        return {
          CUIL: student.CUIL,
          account: {
            username: account.DNI,
            password: account.password
          },
          card: card.cardID,
          personalInformation: {
            DNI: personalInformation.DNI,
            first_name: personalInformation.first_name,
            second_name: personalInformation.second_name,
            last_name1: personalInformation.last_name1,
            last_name2: personalInformation.last_name2,
            phone_number: personalInformation.phone_number,
            landline_phone_number: personalInformation.landline_phone_number,
            direction: personalInformation.direction
          },
          studentInformation: {
            blood_type: studentInformation.blood_type,
            social_work: studentInformation.social_work
          },
          impartition: student.courseID.toString('hex')
        }
      }));

      return studentsGroup;
    } catch(error) {
      console.error('Error processing students:', error);
      throw new Error('Internal server error');
    };
    //TODO: communication with course
  };

  static async getBySubjectID({ subjectID }) {
    //TODO: communication with course
  };

  static async getAccount({ CUIL }) {
    try {
      const [Account] = await db.promise().execute('SELECT * FROM Account WHERE CUIL = ?', [CUIL]);

      const account = Account[0];

      if(!account) return { errorMessage: 'This student have not an account.' };

      const [Personal_Information] = await db.promise().execute('SELECT * FROM Personal_Information WHERE CUIL = ?', [CUIL]);

      const personalInformation = Personal_Information[0];

      if(!personalInformation) return { errorMessage: 'This student have not personal information' };

      const [Student_Information] = await db.promise().execute('SELECT * FROM Student_Information WHERE CUIL = ?', [CUIL]);

      const studentInformation = Student_Information[0];

      if(!studentInformation) return { errorMessage: 'This student have not student information.' };

      return {
        CUIL: CUIL,
        account: {
          username: account.DNI,
          password: account.password
        },
        personalInformation: {
          DNI: personalInformation.DNI,
          first_name: personalInformation.first_name,
          second_name: personalInformation.second_name,
          last_name1: personalInformation.last_name1,
          last_name2: personalInformation.last_name2,
          phone_number: personalInformation.phone_number,
          landline_phone_number: personalInformation.landline_phone_number,
          direction: personalInformation.direction
        },
        studentInformation: {
          blood_type: studentInformation.blood_type,
          social_work: studentInformation.social_work
        }
      }
    } catch(error) {
      console.error('Error processing student:', error);
      throw new Error('Internal server error');
    };
  };

  static async getCard({ CUIL }) {
    try {
      const [Card] = await db.promise().execute('SELECT * FROM Student_Card WHERE CUIL = ?', [CUIL]);

      const card = Card[0];

      if(!card) return { errorMessage: 'This student have not a card.' };

      const [Personal_Information] = await db.promise().execute('SELECT * FROM Personal_Information WHERE CUIL = ?', [CUIL]);

      const personalInformation = Personal_Information[0];

      if(!personalInformation) return { errorMessage: 'This student have not personal information' };

      return {
        CUIL: CUIL,
        card: card.cardID,
        personalInformation: {
          DNI: personalInformation.DNI,
          first_name: personalInformation.first_name,
          second_name: personalInformation.second_name,
          last_name1: personalInformation.last_name1,
          last_name2: personalInformation.last_name2,
        }
      }
    } catch(error) {
      console.error('Error processing student:', error);
      throw new Error('Internal server error');
    };
  };

  static async create ({input}) {
    const {
      CUIL,
      blood_type,
      social_work,
      first_name,
      second_name,
      last_name1,
      last_name2,
      phone_number,
      landline_phone_number,
      direction
    } = input;

    const DNI = CUIL.slice(2, -1);

    try {
      await db.promise().execute(`INSERT INTO Student (CUIL) VALUES (?);`, [CUIL]);
    } catch (e) {
      console.log(e)
      throw new Error('Error creating student');
    }

    try {
      await db.promise().execute(`INSERT INTO Student_Information (CUIL, blood_type, social_work) VALUES (?, ?, ?);`, [CUIL, blood_type, social_work]);
    } catch (e) {
      console.log(e)
      throw new Error('Error creating student information');
    }

    try {
      await db.promise().execute(`INSERT INTO Personal_Information (CUIL, DNI, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number, direction) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`, [CUIL, DNI, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number, direction]);
    } catch (e) {
      console.log(e)
      throw new Error('Error creating personal_information');
    }

    try {
      await db.promise().execute(`INSERT INTO Account (CUIL, DNI) VALUES (?, ?);`, [CUIL, DNI]);
    } catch (e) {
      console.log(e)
      throw new Error('Error creating account');
    }

    return { message: 'Student created' };
  };

  static async createCard({ CUIL, cardID }) {
    try {
      await db.promise().execute(`INSERT INTO Student_Card (CUIL, cardID) VALUES (?, ?);`, [CUIL, cardID]);

      return { message: 'Card created' };
    } catch (e) {
      console.log(e)
      throw new Error('Error creating card');
    }
  };

  static async createImpartition({ CUIL, courseID }) {
    const [uuidImpartition] = await db.promise().execute('SELECT UUID() impartitionID;');
    const [{ impartitionID }] = uuidImpartition;
    
    try {
      await db.promise().execute(`INSERT INTO Impartition (impartitionID, CUIL, courseID) VALUES (UUID_TO_BIN("${impartitionID}"), ?, UUID_TO_BIN("${courseID}"));`, [CUIL]); 

      return { message: 'Student imparted' };
    } catch (e) {
      console.log(e)
      throw new Error('Error creating impartition');
    }
  };

  static async delete ({ CUIL }) {
    try {
      await db.promise().execute(`DELETE FROM Account WHERE CUIL = ?`, [CUIL]);
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting account');
    }

    try {
      await db.promise().execute(`DELETE FROM Impartition WHERE CUIL = ?`, [CUIL]);
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting impartition');
    }
    
    try {
      await db.promise().execute(`DELETE FROM Student_Card WHERE CUIL = ?`, [CUIL]);
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting card');
    }

    try {
      await db.promise().execute(`DELETE FROM Student_Information WHERE CUIL = ?`, [CUIL]);
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting student information');
    }

    try {
      await db.promise().execute(`DELETE FROM Personal_Information WHERE CUIL = ?`, [CUIL]);
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting personal information');
    }

    try {
      await db.promise().execute(`DELETE FROM Student WHERE CUIL = ?`, [CUIL]);
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting student');
    }

    return;
  };

  static async update({ CUIL, input }) {
    const { social_work, phone_number, landline_phone_number, direction } = input;
    try {
      await db.promise().execute(`UPDATE Personal_Information SET phone_number = ?, landline_phone_number = ?, direction = ? WHERE CUIL = ?`, [phone_number, landline_phone_number, direction, CUIL]);

      await db.promise().execute(`UPDATE Student_Information SET social_work = ? WHERE CUIL = ?`, [social_work, CUIL]);

      return;
    } catch(e) {
      console.log(e);
      throw new Error('Error updating impartition');
    }
  };

  static async updateAccount({ CUIL, input }) {
    const { DNI, password } = input;
    try {
      await db.promise().execute(`UPDATE Account SET DNI = ?, password = ? WHERE CUIL = ?`, [DNI, password, CUIL]);

      return;
    } catch(e) {
      console.log(e);
      throw new Error('Error updating impartition');
    }
  };

  static async updateCard({ CUIL, cardID }) {
    try {
      await db.promise().execute(`UPDATE Student_Card SET cardID = ? WHERE CUIL = ?`, [cardID, CUIL]);

      return;
    } catch(e) {
      console.log(e);
      throw new Error('Error updating card');
    }
  };

  static async updateImpartition({ CUIL, courseID }) {
    try {
      await db.promise().execute(`UPDATE Impartition SET courseID = UUID_TO_BIN("${courseID}") WHERE CUIL = ?`, [CUIL]);

      return;
    } catch(e) {
      console.log(e);
      throw new Error('Error updating impartition');
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
};

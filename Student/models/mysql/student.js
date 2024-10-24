import { db } from "../../config.js"

db.connect(err => {
  if (err) {
    console.error('Student database connection failed:', err.stack);
    return;
  };

  console.log('Connected to student database.');
});

async function deleteFromTable(table, CUIL) {
  try {
    await db.promise().execute(`DELETE FROM ${table} WHERE CUIL = ?`, [CUIL]);
  } catch (e) {
    console.log(`Error deleting from ${table}:`, e);
    throw new Error(`Error deleting from ${table}`);
  }
}
export class StudentModel {
  static async findOne({ CUIL }) {
    const [student] = await db.promise().execute('SELECT * FROM Student WHERE CUIL = ?', [CUIL])

    if(student.length === 0) return false
    
    return {student}
  }

  static async getAll () {
    try {
      const [students] = await db.promise().execute('SELECT * FROM Student');
      if (students.length === 0) {
        console.error('No students found');
        return [];
      }
  
      const studentsGroup = await Promise.all(students.map(async (student) => {
        const CUIL = student.CUIL;
  
        const account = await this.fetchSingleRecord('Account', CUIL);
        if (!account) return { errorMessage: `The student with CUIL ${CUIL} does not have an account.` };
  
        const card = (await this.fetchSingleRecord('Student_Card', CUIL)) || { cardID: '' };
        const personalInformation = await this.fetchSingleRecord('Personal_Information', CUIL);
        if (!personalInformation) return { errorMessage: `The student with CUIL ${CUIL} does not have personal information.` };
  
        const studentInformation = await this.fetchSingleRecord('Student_Information', CUIL);
        if (!studentInformation) return { errorMessage: `The student with CUIL ${CUIL} does not have student information.` };
  
        return {
          CUIL,
          accountID: account.accountID.toString('hex'),
          card: card.cardID,
          personalInformation: {
            DNI: personalInformation.DNI,
            birth_date: personalInformation.birth_date,
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
        };
      }));
  
      return studentsGroup;
    } catch (error) {
      console.error('Error processing students:', error);
      throw new Error('Internal server error');
    }
  };

  static async getByCUIL({ CUIL }) {
    try {
      const account = await this.fetchSingleRecord('Account', CUIL);
      if (!account) return { errorMessage: 'This student does not have an account.' };
  
      const card = await this.fetchSingleRecord('Student_Card', CUIL) || [{ cardID: '' }];
      const personalInformation = await this.fetchSingleRecord('Personal_Information', CUIL);
      if (!personalInformation) return { errorMessage: 'This student does not have personal information.' };
  
      const studentInformation = await this.fetchSingleRecord('Student_Information', CUIL);
      if (!studentInformation) return { errorMessage: 'This student does not have student information.' };
  
      return {
        CUIL,
        accountID: account.accountID.toString('hex'),
        card: card.cardID,
        personalInformation: {
          DNI: personalInformation.DNI,
          birth_date: personalInformation.birth_date,
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
      };
    } catch (error) {
      console.error('Error processing student:', error);
      throw new Error('Internal server error');
    }
  };

  static async fetchSingleRecord(table, CUIL) {
    const [result] = await db.promise().execute(`SELECT * FROM ${table} WHERE CUIL = ?`, [CUIL]);
    return result[0];
  }

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
            birth_date: personalInformation.birth_date,
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

  static async getByDNI({ DNI }) {
    try {
      const [[student]] = await db.promise().execute('SELECT * FROM Personal_Information WHERE DNI = ?', [DNI])

      if(!student) return { errorMessage: 'This student have not an account.' }

      return {
        CUIL: student.CUIL,
        DNI: student.DNI
      }
    } catch(error) {
      console.error('Error processing student:', error);
      throw new Error('Internal server error');
    }
  }
  
  static async getAccount({ CUIL }) {
    try {
      const [[account]] = await db.promise().execute('SELECT * FROM Account WHERE CUIL = ?', [CUIL]);

      if(!account) return { errorMessage: 'This student have not an account.' };

      const accountID = account.accountID.toString('hex');
      const response = await fetch(`http://localhost:7654/account/${accountID}`);
      const user = await response.json();

      console.log(user);
      if (!user) return { errorMessage: 'Account details not found.' };

      return {
        accountID:  Buffer.from(user.accountID).toString('hex'),
        DNI: user.DNI,
        password: user.password
      }
    } catch(error) {
      console.error('Error processing student:', error);
      throw new Error('Internal server error');
    };
  };

  static async create ({ input }) {
    const {
      CUIL, blood_type, social_work, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number,direction, course, group
    } = input;

    const DNI = CUIL.slice(2, -1);

    let accountID;
    try {
      const response = await fetch('http://localhost:7654/register/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ DNI }),
      });
      const userResponse = await response.json();
  
      const userArray = userResponse.user;
      const firstObject = userArray[0][0];
      accountID = Buffer.from(firstObject.accountID).toString('hex');
    } catch {
      throw new Error('Error creating user');
    }

    const executeQuery = async (query, params) => {
      try {
        await db.promise().query(query, params);
      } catch (error) {
        throw new Error('Database operation failed');
      }
    };

    try {
      await executeQuery(`INSERT INTO Student (CUIL) VALUES (?);`, [CUIL]);

      const [[{ studentID }]] = await db.promise().execute('SELECT UUID() AS studentID');

      await executeQuery(
        `INSERT INTO Student_Information (studentID, CUIL, blood_type, social_work) VALUES (UUID_TO_BIN("${studentID}"), ?, ?, ?);`,
        [CUIL, blood_type, social_work]
      );

      await executeQuery(
        `INSERT INTO Personal_Information (CUIL, DNI, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number, direction) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [CUIL, DNI, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number, direction]
      );

      await executeQuery(`INSERT INTO Account (CUIL, accountID) VALUES (?, UUID_TO_BIN("${accountID}"));`, [CUIL]);

      try {
        await fetch(`http://localhost:1234/course/${course}/inscription/${group}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ CUIL }),
        });
      } catch {
        throw new Error('Error creating inscription');
      }
    } catch (error) {
      throw error;
    }

    return { message: 'Student created' };
  };

  static async delete({ CUIL }) {
    try {
      const [[account]] = await db.promise().execute(`SELECT accountID FROM Account WHERE CUIL = ?`, [CUIL]);

      const accountID = account.accountID.toString('hex');

      const courseResponse = await fetch(`http://localhost:1234/course/student/${CUIL}`);
      const course = await courseResponse.json();

      await fetch(`http://localhost:7654/account/${accountID}`, { method: 'DELETE' });

      await fetch(`http://localhost:6348/responsible/student/${CUIL}`, { method: 'DELETE' });

      await fetch(`http://localhost:1234/course/inscription/${course.inscriptionID}`, { method: 'DELETE' });  

      await db.promise().execute(`DELETE FROM Account WHERE CUIL = ?`, [CUIL]);
      
      const tables = [
        'Student_Card',
        'Student_Information',
        'Personal_Information',
        'Student'
      ];
  
      for (const table of tables) {
        await deleteFromTable(table, CUIL);
      }

      const message = 'ok';
      return message;
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting account');
    }
  }

  static async update({ CUIL, input }) {
    const { social_work, phone_number, landline_phone_number, direction } = input;
    try {
      await db.promise().execute(`UPDATE Personal_Information SET phone_number = ?, landline_phone_number = ?, direction = ? WHERE CUIL = ?`, [phone_number, landline_phone_number, direction, CUIL]);

      await db.promise().execute(`UPDATE Student_Information SET social_work = ? WHERE CUIL = ?`, [social_work, CUIL]);

      return;
    } catch(e) {
      console.log(e);
      throw new Error('Error updating student');
    }
  };

  static async updateAccount({ CUIL, password }) {
    try {
      const [[account]] = await db.promise().execute(`SELECT accountID FROM Account WHERE CUIL = ?`, [CUIL])

      if (!account) return false

      const accountID = account.accountID.toString('hex')

      const response = await fetch(`http://localhost:7654/account/${accountID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const updatedAccount = await response.json();
  
      return updatedAccount
    } catch {
      throw new Error('Error updating account')
    }
  };
};

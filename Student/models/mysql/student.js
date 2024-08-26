import { db } from "../../config.js"
import axios from "axios"

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

  static async getAccount({ CUIL }) {
    try {
      const [[account]] = await db.promise().execute('SELECT * FROM Account WHERE CUIL = ?', [CUIL])

      if(!account) return { errorMessage: 'This student have not an account.' }

      const accountID = account.accountID.toString('hex')
      const { data: userAxios } = await axios.get(`http://localhost:7654/account/${accountID}`)

      const user = userAxios.account?.[0]?.[0];
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
      CUIL, blood_type, social_work, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number,direction, course
    } = input;

    const DNI = CUIL.slice(2, -1);

    let accountID;
    try {
      const userResponse = await axios.post('http://localhost:7654/register/account', { DNI });
  
      const userArray = userResponse.data.user;
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
        await axios.post(`http://localhost:1234/course/${course}/inscription`, { CUIL });
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
  
      try {
        await axios.delete(`http://localhost:7654/account/${accountID}`);
      } catch {
        throw new Error('Error during deletion');
      }
  
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

      const updatedAccount = await axios.patch(`http://localhost:7654/account/${accountID}`, { password })

      return updatedAccount
    } catch {
      throw new Error('Error updating account')
    }
  };
};

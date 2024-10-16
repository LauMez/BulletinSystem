import { application } from "express";
import { db } from "../../config.js"

db.connect(err => {
  if (err) {
    console.error('Professor database connection failed:', err.stack);
    return;
  };

  console.log('Connected to professor database.');
});

async function deleteFromTable(table, CUIL) {
  try {
    await db.promise().execute(`DELETE FROM ${table} WHERE CUIL = ?`, [CUIL]);
  } catch (e) {
    console.log(`Error deleting from ${table}:`, e);
    throw new Error(`Error deleting from ${table}`);
  }
}
export class ProfessorModel {
  static async findOne({ CUIL }) {
    const [professor] = await db.promise().execute('SELECT * FROM Professor WHERE CUIL = ?', [CUIL])

    if(professor.length === 0) return false
    
    return {professor}
  }

  static async getAll () {
    try {
      const [professors] = await db.promise().execute('SELECT * FROM Professor');
      if (professors.length === 0) {
        console.error('No professor found');
        return [];
      }
  
      const professorsGroup = await Promise.all(professors.map(async (professor) => {
        const CUIL = professor.CUIL;
  
        const account = await this.fetchSingleRecord('Account', CUIL);
        if (!account) return { errorMessage: `The professor with CUIL ${CUIL} does not have an account.` };
  
        const personalInformation = await this.fetchSingleRecord('Personal_Information', CUIL);
        if (!personalInformation) return { errorMessage: `The professor with CUIL ${CUIL} does not have personal information.` };

        const [impartitions] = await db.promise().execute('SELECT * FROM Impartition WHERE CUIL = ?', [CUIL]);
        if (impartitions.length === 0) return { errorMessage: `The professor with CUIL ${CUIL} does not have impartitions.` };

        const impartitionsGroup = await Promise.all(impartitions.map(async (impartition) => {
          return {
            impartitionID: impartition.impartitionID.toString('hex'),
            CUIL: impartition.CUIL,
            subjectID: impartition.subjectID.toString('hex')
          }
        }))
  
        return {
          CUIL,
          accountID: account.accountID.toString('hex'),
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
          impartitions: impartitionsGroup
        };
      }));
  
      return professorsGroup;
    } catch (error) {
      console.error('Error processing professors:', error);
      throw new Error('Internal server error');
    }
  };

  static async getByCUIL({ CUIL }) {
    try {
      const account = await this.fetchSingleRecord('Account', CUIL);
      if (!account) return { errorMessage: 'This professor does not have an account.' };

      const personalInformation = await this.fetchSingleRecord('Personal_Information', CUIL);
      if (!personalInformation) return { errorMessage: 'This professor does not have personal information.' };

      const [impartitions] = await db.promise().execute('SELECT * FROM Impartition WHERE CUIL = ?', [CUIL]);
      if (impartitions.length === 0) return { errorMessage: `The professor with CUIL ${CUIL} does not have impartitions.` };

      const impartitionsGroup = await Promise.all(impartitions.map(async (impartition) => {
        return {
          impartitionID: impartition.impartitionID.toString('hex'),
          CUIL: impartition.CUIL,
          subjectID: impartition.subjectID.toString('hex')
        }
      }))
  
      return {
        CUIL,
        accountID: account.accountID.toString('hex'),
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
        impartitions: impartitionsGroup
      };
    } catch (error) {
      console.error('Error processing professor:', error);
      throw new Error('Internal server error');
    }
  };

  static async fetchSingleRecord(table, CUIL) {
    const [result] = await db.promise().execute(`SELECT * FROM ${table} WHERE CUIL = ?`, [CUIL]);
    return result[0];
  }

  static async getByDNI({ DNI }) {
    try {
      const [[professor]] = await db.promise().execute('SELECT * FROM Personal_Information WHERE DNI = ?', [DNI])

      if(!professor) return { errorMessage: 'This professor have not an account.' }

      return {
        CUIL: professor.CUIL,
        DNI: professor.DNI
      }
    } catch(error) {
      console.error('Error processing professor:', error);
      throw new Error('Internal server error');
    }
  }

  static async getBySubject({ subjectID }) {
    try {
      const [[impartition]] = await db.promise().execute('SELECT * FROM Impartition WHERE subjectID = UUID_TO_BIN(?)', [subjectID]);
      if (!impartition) return { 
        errorMessage: `The professor with subject ID ${subjectID} does not have impartitions.` 
      };

      const CUIL = impartition.CUIL;

      const personalInformation = await this.fetchSingleRecord('Personal_Information', CUIL);
      if (!personalInformation) return { errorMessage: 'This professor does not have personal information.' };
  
      return {
        CUIL,
        personalInformation: {
          first_name: personalInformation.first_name,
          second_name: personalInformation.second_name,
          last_name1: personalInformation.last_name1,
          last_name2: personalInformation.last_name2,
        }
      };
    } catch (error) {
      console.error('Error processing professor:', error);
      throw new Error('Internal server error');
    }
  };

  static async getSubjects({ CUIL }) {
    try {
      const [impartitions] = await db.promise().execute('SELECT * FROM Impartition WHERE CUIL = ?', [CUIL])

      if(!impartitions) return { errorMessage: 'This professor have not an impartition.' }

      const subjects = await Promise.all(impartitions.map(async (impartition) => {
        const subjectID = Buffer.from(impartition.subjectID).toString('hex');

        const subjectResponse = await fetch(`http://localhost:4321/subject/${subjectID}`);
        const subject = await subjectResponse.json();

        const courseResponse = await fetch(`http://localhost:1234/course/${subject.courseID}`);
        const course = await courseResponse.json();

        const preceptorResponse = await fetch(`http://localhost:6534/preceptor/course/${subject.courseID}`);

        let preceptor = null;
        if(preceptorResponse.ok) preceptor = await preceptorResponse.json();

        if(preceptorResponse.ok) {
          return {
            subject: {
              subjectID: subject.subjectID,
              courseID: subject.courseID,
              name: subject.name,
              schedules: subject.schedules
            },
            course: {
              courseID: course.courseID,
              year: course.year,
              division: course.division
            },
            preceptor: {
              CUIL: preceptor.CUIL,
              first_name: preceptor.personalInformation.first_name,
              second_name: preceptor.personalInformation.second_name,
              last_name1: preceptor.personalInformation.last_name1,
              last_name2: preceptor.personalInformation.last_name2
            }
          };
        } else {
          return {
            subject: {
              subjectID: subject.subjectID,
              courseID: subject.courseID,
              name: subject.name,
              schedules: subject.schedules
            },
            course: {
              courseID: course.courseID,
              year: course.year,
              division: course.division
            },
            preceptor
          };
        }
      }));

      return subjects;
    } catch(error) {
      console.error('Error processing professor:', error);
      throw new Error('Internal server error');
    };
  };

  static async getAccount({ CUIL }) {
    try {
      const [[account]] = await db.promise().execute('SELECT * FROM Account WHERE CUIL = ?', [CUIL]);

      if(!account) return { errorMessage: 'This professor have not an account.' };

      const accountID = account.accountID.toString('hex');
      const response = await fetch(`http://localhost:7654/account/${accountID}`);
      const user = await response.json();

      // const user = userAxios.account?.[0]?.[0];
      if (!user) return { errorMessage: 'Account details not found.' };

      return {
        accountID:  Buffer.from(user.accountID).toString('hex'),
        DNI: user.DNI,
        password: user.password
      }
    } catch(error) {
      console.error('Error processing professor:', error);
      throw new Error('Internal server error');
    };
  };

  static async create ({ input }) {
    const {
      CUIL, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number,direction, subject
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
      const user = await response.json();
  
      // const userArray = userResponse.data.user;
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
      await executeQuery(`INSERT INTO Professor (CUIL) VALUES (?);`, [CUIL]);

      await executeQuery(
        `INSERT INTO Personal_Information (CUIL, DNI, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number, direction) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [CUIL, DNI, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number, direction]
      );

      await executeQuery(`INSERT INTO Account (CUIL, accountID) VALUES (?, UUID_TO_BIN("${accountID}"));`, [CUIL]);

      const [[{impartitionID}]] = await db.promise().execute('SELECT UUID() AS impartitionID')
      await executeQuery(`INSERT INTO Impartition (impartitionID, CUIL, subjectID) VALUES (UUID_TO_BIN(?), ?, UUID_TO_BIN(?));`, 
        [impartitionID, CUIL, subject]
      );
    } catch (error) {
      throw error;
    }

    return { message: 'Professor created' };
  };

  static async delete({ CUIL }) {
    try {
      const [[account]] = await db.promise().execute(`SELECT accountID FROM Account WHERE CUIL = ?`, [CUIL]);

      const accountID = account.accountID.toString('hex');
  
      await fetch(`http://localhost:7654/account/${accountID}`, { method: 'DELETE' });
  
      await db.promise().execute(`DELETE FROM Account WHERE CUIL = ?`, [CUIL]);
  
      const tables = [
        'Personal_Information',
        'Impartition',
        'Professor'
      ];
  
      for (const table of tables) {
        await deleteFromTable(table, CUIL);
      }
  
      const message = 'ok';
      return message;
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting professor');
    }
  }

  static async getImpartitionBySubject({ subjectID }) {
    try {
      const [[impartition]] = await db.promise().execute('SELECT * FROM Impartition WHERE subjectID = UUID_TO_BIN(?)', [subjectID]);

      if(!impartition) return null;

      return {
        CUIL: impartition.CUIL
      }
    } catch(e) {
      console.log(e);
      throw new Error('Error updating professor impartition');
    }
  };

  static async editImpartition({ CUIL, subjectID }) {
    try {
      const [impartition] = await db.promise().execute('SELECT * FROM Impartition WHERE subjectID = UUID_TO_BIN(?)', [subjectID]);

      await db.promise().execute(`DELETE FROM Impartition WHERE CUIL = ?`, [CUIL]);

      if(impartition.length > 0) {
        await db.promise().execute(`UPDATE Impartition SET CUIL = ? WHERE subjectID = UUID_TO_BIN(?)`, [CUIL, subjectID]);
      } else {
        const [[{impartitionID}]] = await db.promise().execute('SELECT UUID() AS impartitionID');
        await db.promise().execute(`INSERT INTO Impartition (impartitionID, CUIL, subjectID) VALUES (UUID_TO_BIN(?), ?, UUID_TO_BIN(?));`, 
        [impartitionID, CUIL, subjectID]);
      }

      return true;
    } catch(e) {
      console.log(e);
      throw new Error('Error updating professor impartition');
    }
  };

  static async update({ CUIL, input }) {
    const { phone_number, landline_phone_number, direction } = input;
    try {
      await db.promise().execute(`UPDATE Personal_Information SET phone_number = ?, landline_phone_number = ?, direction = ? WHERE CUIL = ?`, [phone_number, landline_phone_number, direction, CUIL]);

      return;
    } catch(e) {
      console.log(e);
      throw new Error('Error updating professor');
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

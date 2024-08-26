import { db } from "../../config.js"
import axios from "axios"

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

  static async getAccount({ CUIL }) {
    try {
      const [[account]] = await db.promise().execute('SELECT * FROM Account WHERE CUIL = ?', [CUIL])

      if(!account) return { errorMessage: 'This professor have not an account.' }

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
  
      try {
        await axios.delete(`http://localhost:7654/account/${accountID}`);
      } catch {
        throw new Error('Error during deletion');
      }
  
      await db.promise().execute(`DELETE FROM Account WHERE CUIL = ?`, [CUIL]);
  
      const tables = [
        'Personal_Information',
        'Impartition',
        'Professor'
      ];
  
      for (const table of tables) {
        await deleteFromTable(table, CUIL);
      }
  
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting professor');
    }
  }

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
      console.log('numero: ', accountID)

      const a = await axios.patch(`http://localhost:7654/account/${accountID}`, { password })
      console.log(a.data)

      return a.data
    } catch {
      throw new Error('Error updating account')
    }
  };
};

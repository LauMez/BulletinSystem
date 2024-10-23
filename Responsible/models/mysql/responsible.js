import { db } from "../../config.js"
import axios from "axios"

db.connect(err => {
  if (err) {
    console.error('Responsible database connection failed:', err.stack);
    return;
  };

  console.log('Connected to responsible database.');
});

async function deleteFromTable(table, CUIL) {
  try {
    await db.promise().execute(`DELETE FROM ${table} WHERE CUIL = ?`, [CUIL]);
  } catch (e) {
    console.log(`Error deleting from ${table}:`, e);
    throw new Error(`Error deleting from ${table}`);
  }
}
export class ResponsibleModel {
  static async findOne({ CUIL }) {
    const [responsible] = await db.promise().execute('SELECT * FROM Responsible WHERE CUIL = ?', [CUIL])

    if(responsible.length === 0) return false
    
    return {responsible}
  }

  static async getAll () {
    try {
      const [responsibles] = await db.promise().execute('SELECT * FROM Responsible');
      if (responsibles.length === 0) {
        console.error('No responsible found');
        return [];
      }
  
      const responsiblesGroup = await Promise.all(responsibles.map(async (responsible) => {
        const CUIL = responsible.CUIL;
  
        const account = await this.fetchSingleRecord('Account', CUIL);
        if (!account) return { errorMessage: `The responsible with CUIL ${CUIL} does not have an account.` };
  
        const personalInformation = await this.fetchSingleRecord('Personal_Information', CUIL);
        if (!personalInformation) return { errorMessage: `The responsible with CUIL ${CUIL} does not have personal information.` };

        const [responsiblesOf] = await db.promise().execute('SELECT * FROM ResponsibleOf WHERE CUIL = ?', [CUIL]) 

        if(responsiblesOf.length === 0) return { errorMessage: `The responsible with CUIL ${CUIL} is not responsable of anyone.` };

        const responsibleOfGroup = await Promise.all(responsiblesOf.map(async (responsibleOf) => {
          return {
            CUIL: responsibleOf.studentCUIL,
            responsability: responsibleOf.responsability
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
          responsibleOf: responsibleOfGroup
        };
      }));
  
      return responsiblesGroup;
    } catch (error) {
      console.error('Error processing responsibles:', error);
      throw new Error('Internal server error');
    }
  };

  static async getByCUIL({ CUIL }) {
    try {
      const account = await this.fetchSingleRecord('Account', CUIL);
      if (!account) return { errorMessage: 'This responsible does not have an account.' };

      const personalInformation = await this.fetchSingleRecord('Personal_Information', CUIL);
      if (!personalInformation) return { errorMessage: 'This responsible does not have personal information.' };

      const [responsiblesOf] = await db.promise().execute('SELECT * FROM ResponsibleOf WHERE CUIL = ?', [CUIL]) 

      if(responsiblesOf.length === 0) return { errorMessage: `The responsible with CUIL ${CUIL} is not responsable of anyone.` };

      const responsibleOfGroup = await Promise.all(responsiblesOf.map(async (responsibleOf) => {
        const [studentResponse] = await Promise.all([
          fetch(`http://localhost:4567/student/${responsibleOf.studentCUIL}`)
        ]);
        
        if (!studentResponse.ok) {
            throw new Error('Error fetching student');
        }
        const student = await studentResponse.json();

        return {
          CUIL: responsibleOf.studentCUIL,
          first_name: student.personalInformation.first_name,
          second_name: student.personalInformation.second_name,
          last_name1: student.personalInformation.last_name1,
          last_name2: student.personalInformation.last_name2,
          responsability: responsibleOf.responsability
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
        responsibleOf: responsibleOfGroup
      };
    } catch (error) {
      console.error('Error processing responsible:', error);
      throw new Error('Internal server error');
    }
  };

  static async fetchSingleRecord(table, CUIL) {
    const [result] = await db.promise().execute(`SELECT * FROM ${table} WHERE CUIL = ?`, [CUIL]);
    return result[0];
  }

  static async getByDNI({ DNI }) {
    try {
      const [[responsible]] = await db.promise().execute('SELECT * FROM Personal_Information WHERE DNI = ?', [DNI])

      if(!responsible) return { errorMessage: 'This responsible have not an account.' }

      return {
        CUIL: responsible.CUIL,
        DNI: responsible.DNI
      }
    } catch(error) {
      console.error('Error processing responsible:', error);
      throw new Error('Internal server error');
    }
  }

  static async getByStudentCUIL({studentCUIL}) {
    try {
      const [responsibleOf] = await db.promise().execute('SELECT * FROM ResponsibleOf WHERE studentCUIL = ?', [studentCUIL])

      if(responsibleOf.length === 0) return { errorMessage: `The responsibles with student CUIL ${studentCUIL} not exist.` };
  
      const responsibles = await Promise.all(responsibleOf.map(async (responsible) => {
        const studentResponsible = await this.getByCUIL({ CUIL: responsible.CUIL });
        return {
          responsible: studentResponsible,
          responsability: responsible.responsability
        }
      }));
  
      return responsibles;
    } catch (error) {
      console.error('Error processing responsibles:', error);
      throw new Error('Internal server error');
    }

  }

  static async getAccount({ CUIL }) {
    try {
      const [[account]] = await db.promise().execute('SELECT * FROM Account WHERE CUIL = ?', [CUIL])

      if(!account) return { errorMessage: 'This responsible have not an account.' }

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
      console.error('Error processing responsible:', error);
      throw new Error('Internal server error');
    };
  };

  static async create ({ input }) {
    const {
      CUIL, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number,direction, student
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
      await executeQuery(`INSERT INTO Responsible (CUIL) VALUES (?);`, [CUIL]);

      await executeQuery(
        `INSERT INTO Personal_Information (CUIL, DNI, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number, direction) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [CUIL, DNI, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number, direction]
      );

      await executeQuery(`INSERT INTO Account (CUIL, accountID) VALUES (?, UUID_TO_BIN("${accountID}"));`, [CUIL]);

      const [[{responsibleID}]] = await db.promise().execute('SELECT UUID() AS responsibleID')
      await executeQuery(`INSERT INTO ResponsibleOf (responsibleID, CUIL, studentCUIL) VALUES (UUID_TO_BIN(?), ?, ?);`, 
        [responsibleID, CUIL, student]
      );
    } catch (error) {
      throw error;
    }

    return { message: 'Responsible created' };
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
        'ResponsibleOf',
        'Responsible'
      ];
  
      for (const table of tables) {
        await deleteFromTable(table, CUIL);
      }
  
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting responsible');
    }
  }

  static async deleteStudent({ CUIL }) {
    try {
      await db.promise().execute(`DELETE FROM ResponsibleOf WHERE studentCUIL = ?`, [CUIL]);
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting student from responsible');
    }
  };

  static async update({ CUIL, input }) {
    const { phone_number, landline_phone_number, direction } = input;
    try {
      await db.promise().execute(`UPDATE Personal_Information SET phone_number = ?, landline_phone_number = ?, direction = ? WHERE CUIL = ?`, [phone_number, landline_phone_number, direction, CUIL]);

      return;
    } catch(e) {
      console.log(e);
      throw new Error('Error updating responsible');
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

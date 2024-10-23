import { db } from "../../config.js"
import axios from "axios"

db.connect(err => {
  if (err) {
    console.error('Directive database connection failed:', err.stack);
    return;
  };

  console.log('Connected to directive database.');
});

async function deleteFromTable(table, CUIL) {
  try {
    await db.promise().execute(`DELETE FROM ${table} WHERE CUIL = ?`, [CUIL]);
  } catch (e) {
    console.log(`Error deleting from ${table}:`, e);
    throw new Error(`Error deleting from ${table}`);
  }
}
export class DirectiveModel {
  static async findOne({ CUIL }) {
    const [directive] = await db.promise().execute('SELECT * FROM Directive WHERE CUIL = ?', [CUIL])

    if(directive.length === 0) return false
    
    return {directive}
  }

  static async getAll () {
    try {
      const [directives] = await db.promise().execute('SELECT * FROM Directive');
      if (directives.length === 0) {
        console.error('No directive found');
        return [];
      }
  
      const directivesGroup = await Promise.all(directives.map(async (directive) => {
        const CUIL = directive.CUIL;
  
        const account = await this.fetchSingleRecord('Account', CUIL);
        if (!account) return { errorMessage: `The directive with CUIL ${CUIL} does not have an account.` };
  
        const personalInformation = await this.fetchSingleRecord('Personal_Information', CUIL);
        if (!personalInformation) return { errorMessage: `The directive with CUIL ${CUIL} does not have personal information.` };

        const admin = await this.fetchSingleRecord('Admin', CUIL);
        if(!admin) return { errorMessage: `The directive with CUIL ${CUIL} is not admin.` };
  
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
          admin: admin.adminID.toString('hex')
        };
      }));
  
      return directivesGroup;
    } catch (error) {
      console.error('Error processing directives:', error);
      throw new Error('Internal server error');
    }
  };

  static async getByDNI({ DNI }) {
    try {
      const [[directive]] = await db.promise().execute('SELECT * FROM Personal_Information WHERE DNI = ?', [DNI])

      if(!directive) return { errorMessage: 'This directive have not an account.' }

      return {
        CUIL: directive.CUIL,
        DNI: directive.DNI
      }
    } catch(error) {
      console.error('Error processing directive:', error);
      throw new Error('Internal server error');
    }
  };

  static async getByCUIL({ CUIL }) {
    try {
      const account = await this.fetchSingleRecord('Account', CUIL);
      if (!account) return { errorMessage: 'This directive does not have an account.' };

      const personalInformation = await this.fetchSingleRecord('Personal_Information', CUIL);
      if (!personalInformation) return { errorMessage: 'This directive does not have personal information.' };

      const admin = await this.fetchSingleRecord('Admin', CUIL);
      if(!admin) return { errorMessage: `The directive with CUIL ${CUIL} is not admin.` };
  
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
        admin: admin.adminID.toString('hex')
      };
    } catch (error) {
      console.error('Error processing directive:', error);
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

      if(!account) return { errorMessage: 'This directive have not an account.' }

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
      console.error('Error processing directive:', error);
      throw new Error('Internal server error');
    };
  };

  static async create ({ input }) {
    const {
      CUIL, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number,direction
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
      await executeQuery(`INSERT INTO Directive (CUIL) VALUES (?);`, [CUIL]);

      await executeQuery(
        `INSERT INTO Personal_Information (CUIL, DNI, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number, direction) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [CUIL, DNI, first_name, second_name, last_name1, last_name2, phone_number, landline_phone_number, direction]
      );

      await executeQuery(`INSERT INTO Account (CUIL, accountID) VALUES (?, UUID_TO_BIN("${accountID}"));`, [CUIL]);

      const [[{adminID}]] = await db.promise().execute('SELECT UUID() AS adminID')
      await executeQuery(`INSERT INTO Admin (adminID, CUIL) VALUES (UUID_TO_BIN(?), ?);`, 
        [adminID, CUIL]
      );
    } catch (error) {
      throw error;
    }

    return { message: 'Directive created' };
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
        'Admin',
        'Directive'
      ];
  
      for (const table of tables) {
        await deleteFromTable(table, CUIL);
      }
  
    } catch (e) {
      console.log(e);
      throw new Error('Error deleting directive');
    }
  }

  static async update({ CUIL, input }) {
    const { phone_number, landline_phone_number, direction } = input;
    try {
      await db.promise().execute(`UPDATE Personal_Information SET phone_number = ?, landline_phone_number = ?, direction = ? WHERE CUIL = ?`, [phone_number, landline_phone_number, direction, CUIL]);

      return;
    } catch(e) {
      console.log(e);
      throw new Error('Error updating directive');
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

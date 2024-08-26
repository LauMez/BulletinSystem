import { db } from '../../config.js';

export class AuthModel {
  static async login({ username, password }) {
    try {
        return {
            username,
            password
        };
    } catch(err) {
        console.log(err);
    }
  };

  static async account({ accountID }) {
    const account = await db.promise().execute(`SELECT * FROM User WHERE accountID = UUID_TO_BIN("${accountID}")`)

    if(!account) return false

    return { account }
  }

  static async updateAccount({ accountID, password }) {
    const [account] = await db.promise().execute(`SELECT * FROM User WHERE accountID = UUID_TO_BIN("${accountID}")`)

    if(account.length === 0) return []


    return await db.promise().execute(`UPDATE User SET password = ? WHERE accountID = UUID_TO_BIN("${accountID}")`, [password])
  }

  static async delete({ accountID }) {
    const [account] = await db.promise().execute(`SELECT * FROM User WHERE accountID = UUID_TO_BIN("${accountID}")`)

    if(account.length === 0) return []

    return await db.promise().execute(`DELETE FROM User WHERE accountID = UUID_TO_BIN("${accountID}")`)
  }

  static async registerAccount({ DNI }) {
    const [uuidAccount] = await db.promise().execute('SELECT UUID() accountID;')
    const [{ accountID }] = uuidAccount

    await db.promise().execute(`INSERT INTO User (accountID, DNI) VALUES (UUID_TO_BIN("${accountID}"), ?)`, [DNI])

    const user = await db.promise().execute(`SELECT * FROM User WHERE accountID = UUID_TO_BIN("${accountID}")`)

    return { user }
  }
};

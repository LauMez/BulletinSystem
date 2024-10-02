import { db } from '../../config.js';

async function isStudent(dni) {
  try {
    const response = await fetch(`http://localhost:4567/student/dni/${dni}`);
    const student = await response.json();

    if (student.errorMessage) return false;

    return {
      CUIL: student.CUIL,
      role: 'student',
    };
  } catch (error) {
    console.error('Error fetching student data:', error);
    return false;
  }
}

async function isProfessor(dni) {
  try {
    const response = await fetch(`http://localhost:8734/professor/dni/${dni}`);
    const professor = await response.json();

    if (professor.errorMessage) return false;

    return {
      CUIL: professor.CUIL,
      role: 'professor',
    };
  } catch (error) {
    console.error('Error fetching professor data:', error);
    return false;
  }
}

async function isResponsible(dni) {
  try {
    const response = await fetch(`http://localhost:6348/responsible/dni/${dni}`);
    const responsible = await response.json();

    if (responsible.errorMessage) return false;

    return {
      CUIL: responsible.CUIL,
      role: 'responsible',
    };
  } catch (error) {
    console.error('Error fetching responsible data:', error);
    return false;
  }
}

async function isDirective(dni) {
  try {
    const response = await fetch(`http://localhost:9457/directive/dni/${dni}`);
    const directive = await response.json();

    if (directive.errorMessage) return false;

    return {
      CUIL: directive.CUIL,
      role: 'directive',
    };
  } catch (error) {
    console.error('Error fetching directive data:', error);
    return false;
  }
}

async function isPreceptor(dni) {
  try {
    const response = await fetch(`http://localhost:9457/preceptor/dni/${dni}`);
    const preceptor = await response.json();

    if (preceptor.errorMessage) return false;

    return {
      CUIL: preceptor.CUIL,
      role: 'preceptor',
    };
  } catch (error) {
    console.error('Error fetching preceptor data:', error);
    return false;
  }
}

async function determineUser(dni) {
  const student = await isStudent(dni);
  if (student) return student;
  console.log('student')

  const professor = await isProfessor(dni);
  if (professor) return professor;
  console.log('professor')

  const responsible = await isResponsible(dni);
  if (responsible) return responsible;
  console.log('responsible')

  const directive = await isDirective(dni);
  if (directive) return directive;
  console.log('directive')

  const preceptor = await isPreceptor(dni);
  if (preceptor) return preceptor;

  return null;
}

export class AuthModel {
  static async login({ dni }) {
    try {
      const [[user]] = await db.promise().execute('SELECT * FROM User WHERE DNI = ?', [dni])

      if(!user) return { incorrectUser: 'El DNI no existe o no esta registrado' }

      if(user.password === '' || !user.password) return { emptyPassword: 'Usuario requiere contraseña', accountID: user.accountID.toString('hex') };

      const determinedUser = await determineUser(dni);

      return {
        accountID: user.accountID.toString('hex'),
        dni,
        password: user.password,
        cuil: determinedUser.CUIL,
        role: determinedUser.role
      }
    } catch(error) {
        console.error('Error during login: ', error);
    }
  };

  static async account({ accountID }) {
    try {
      const [[account]] = await db.promise().execute(`SELECT * FROM User WHERE accountID = UUID_TO_BIN("${accountID}")`)

      if(!account) return { error: `Account doesn't exist` }

      return {
        accountID: account.accountID.toString('hex'),
        DNI: account.DNI
      }
    } catch(error) {
      console.error('Error during change of password: ', error);
    }
  }

  static async updateAccount({ accountID, passwordHaash }) {
    const [account] = await db.promise().execute(`SELECT * FROM User WHERE accountID = UUID_TO_BIN("${accountID}")`)

    if(account.length === 0) return []

    return await db.promise().execute(`UPDATE User SET password = ? WHERE accountID = UUID_TO_BIN("${accountID}")`, [passwordHaash])
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

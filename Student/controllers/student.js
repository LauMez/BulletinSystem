import { validateStudent, validatePartialStudent } from "../schemas/student.js";

const convertEmptyStringsToNull = (obj) => {
  const result = {};
  for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
          result[key] = obj[key].trim() === '' ? null : obj[key].trim();
      }
  }
  return result;
};

export class StudentController {
  constructor ({ studentModel }) {
    this.studentModel = studentModel;
  };

  getAll = async (req, res) => {
    try {
      const students = await this.studentModel.getAll();

      if (!students || students.length === 0) return res.status(404).json({ message: 'Students not found' });

      return res.json(students);
    } catch (error) {
      console.error('Error occurred while fetching students:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  getByCUIL = async (req, res) => {
    const { CUIL } = req.params;
    try {
      const student = await this.studentModel.getByCUIL({ CUIL });

      if (!student || student.length === 0) return res.status(404).json({ message: 'Student not found' });

      return res.json(student);
    } catch (error) {
      console.error('Error occurred while fetching student:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  getByDNI = async(req, res) => {
    const { DNI } = req.params
    try {
      const student = await this.studentModel.getByDNI({ DNI })

      if (!student || student.length === 0) return res.status(404).json({ message: 'Student not found' })

      return res.json(student)
    } catch( error) {
      console.log('Error ocurred while fetching student: ', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }


  getAccount = async (req, res) => {
    const { CUIL } =  req.params;

    try {
      const studentAccount = await this.studentModel.getAccount({ CUIL });

      if(studentAccount.length === 0) return res.status(404).json({message: 'Student account not found'});

      return res.json(studentAccount);
    } catch(error) {
      console.error('Error occurred while fetching student account:', error);
      return res.status(500).json({ nessage: 'Internal server error' });
    }
  };


  getCreate = async(req, res, errorMessage = null) => {
    try {
      const response = await fetch('http://localhost:1234/course');
      const courses = await response.json();
      return res.render('register', { courses: courses, errorMessage });
    } catch (error) {
        return res.status(500).render('register', { courses: [], errorMessage: 'Error fetching courses' });
    }
  }

  create = async (req, res) => {
    const student = validateStudent(req.body);
    if (!student.success) {
      const error = student.error.issues[0].message;
      return res.status(400).json({ error: error, status: 400 });
    }

    const processedData = convertEmptyStringsToNull(student.data);
    const existingStudent = await this.studentModel.findOne({ CUIL: student.data.CUIL });

    if (existingStudent) return res.status(409).json({ error: 'Ya hay un usuario registrado con ese CUIL.', status: 409 });

    const newStudent = await this.studentModel.create({ input: processedData });
    return res.status(201).json(newStudent);
  }


  delete = async (req, res) => {
    const { CUIL } = req.params;

    try {
      const student = await this.studentModel.delete({ CUIL });

      if (student !== 'ok') return res.status(404).json({ message: 'Students not found' });

      return res.status(200).json({ message: 'Student deleted' });
    } catch (error) {
      console.error('Error occurred while deleting student:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  update = async (req, res) => {
    try {
      const result = validatePartialStudent(req.body);

      if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

      await this.studentModel.update({ CUIL, input: result.data });

      return res.json({message: 'Student updated'});;
    } catch (error) {
      console.error('Error occurred while updating student:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateAccount = async (req, res) => {
    const { CUIL } = req.params;
    const { password } = req.body

    try {
      const account = await this.studentModel.updateAccount({ CUIL, password });

      if (!account || account.length === 0) return res.status(404).json({ message: 'Account not found' });

      await this.studentModel.updateAccount({ CUIL, password });
    } catch (error) {
      console.error('Error occurred while updating account:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

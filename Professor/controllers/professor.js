import { validateProfessor, validatePartialProfessor } from "../schemas/professor.js";
import axios from 'axios';

const convertEmptyStringsToNull = (obj) => {
  const result = {};
  for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
          result[key] = obj[key].trim() === '' ? null : obj[key].trim();
      }
  }
  return result;
};

export class ProfessorController {
  constructor ({ professorModel }) {
    this.professorModel = professorModel;
  };

  getAll = async (req, res) => {
    try {
      const professor = await this.professorModel.getAll();

      if (!professor || professor.length === 0) return res.status(404).json({ message: 'Professor not found' });

      return res.json(professor);
    } catch (error) {
      console.error('Error occurred while fetching professor:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  getByCUIL = async (req, res) => {
    const { CUIL } = req.params;
    try {
      const professor = await this.professorModel.getByCUIL({ CUIL });

      if (!professor || professor.length === 0) return res.status(404).json({ message: 'Professor not found' });

      return res.json(professor);
    } catch (error) {
      console.error('Error occurred while fetching professor:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }


  getAccount = async (req, res) => {
    const { CUIL } =  req.params;

    try {
      const professorAccount = await this.professorModel.getAccount({ CUIL });

      if(professorAccount.length === 0) return res.status(404).json({message: 'Professor account not found'});

      return res.json(professorAccount);
    } catch(error) {
      console.error('Error occurred while fetching professor account:', error);
      return res.status(500).json({ nessage: 'Internal server error' });
    }
  };


  getCreate = async(req, res, errorMessage = null) => {
    try {
      const courses = await axios.get('http://localhost:1234/course');
      return res.render('register', { courses: courses.data, errorMessage });
    } catch (error) {
        return res.status(500).render('register', { courses: [], errorMessage: 'Error fetching courses' });
    }
  }

  create = async (req, res) => {
    const professor = validateProfessor(req.body);
    if (!professor.success) {
      const firstError = professor.error.issues[0].message;
      return this.getCreate(req, res, firstError);
    }

    const processedData = convertEmptyStringsToNull(professor.data);
    console.log(professor.data.CUIL)
    const existingProfessor = await this.professorModel.findOne({ CUIL: professor.data.CUIL });

    if (existingProfessor) return this.getCreate(req, res, 'Ya hay un usuario registrado con ese CUIL.');

    const newProfessor = await this.professorModel.create({ input: processedData });
    return res.status(201).json(newProfessor);
  }


  delete = async (req, res) => {
    const { CUIL } = req.params;

    try {
      const professor = await this.professorModel.delete({ CUIL });

      return res.json({ message: 'professor deleted' });
    } catch (error) {
      console.error('Error occurred while deleting professor:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  update = async (req, res) => {
    const { CUIL } = req.params
    try {
      const result = validatePartialProfessor(req.body);

      if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

      await this.professorModel.update({ CUIL, input: result.data });

      return res.json({message: 'Professor updated'});;
    } catch (error) {
      console.error('Error occurred while updating professor:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateAccount = async (req, res) => {
    const { CUIL } = req.params;
    const { password } = req.body

    try {
      const account = await this.professorModel.updateAccount({ CUIL, password });

      return { message: "Account updated" }
    } catch (error) {
      console.error('Error occurred while updating account:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

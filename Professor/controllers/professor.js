import { validateProfessor, validatePartialProfessor } from "../schemas/professor.js";

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

  getByDNI = async(req, res) => {
    const { DNI } = req.params
    try {
      const professor = await this.professorModel.getByDNI({ DNI })

      if (!professor || professor.length === 0) return res.status(404).json({ message: 'Professor not found' })

      return res.json(professor)
    } catch( error) {
      console.log('Error ocurred while fetching professor: ', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  getBySubject = async(req, res) => {
    const { subjectID } = req.params
    try {
      const professor = await this.professorModel.getBySubject({ subjectID })

      if (!professor || professor.length === 0) return res.status(404).json({ message: 'Professor not found' })

      return res.json(professor)
    } catch( error) {
      console.log('Error ocurred while fetching professor: ', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  };

  getSubjects = async(req, res) => {
    const { CUIL } = req.params;

    try {
      const subjects = await this.professorModel.getSubjects({ CUIL });

      if(subjects.length === 0 || !subjects) return res.status(404).json({message: 'Professor subjects not found'});

      return res.json(subjects);
    } catch(error) {
      console.error('Error occurred while fetching professor subjects:', error);
      return res.status(500).json({ nessage: 'Internal server error' });
    };
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
      const response = await fetch('http://localhost:1234/course');
      const courses = await response.json();
      return res.render('register', { courses, errorMessage });
    } catch (error) {
        return res.status(500).render('register', { courses: [], errorMessage: 'Error fetching courses' });
    }
  }

  create = async (req, res) => {
    const professor = validateProfessor(req.body);
    if (!professor.success) {
      const error = professor.error.issues[0].message;
      return res.status(400).json({ error: error, status: 400 });
    }

    const processedData = convertEmptyStringsToNull(professor.data);
    const existingProfessor = await this.professorModel.findOne({ CUIL: professor.data.CUIL });

    if (existingProfessor) return res.status(409).json({ error: 'Ya hay un usuario registrado con ese CUIL.', status: 409 });

    const newProfessor = await this.professorModel.create({ input: processedData });
    return res.status(201).json(newProfessor);
  }


  delete = async (req, res) => {
    const { CUIL } = req.params;

    try {
      const professor = await this.professorModel.delete({ CUIL });

      if (professor !== 'ok') return res.status(404).json({ message: 'Professor not found' });

      return res.status(200).json({ message: 'Professor deleted' });
    } catch (error) {
      console.error('Error occurred while deleting professor:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  getImpartitionBySubject = async(req, res) => {
    try {
      const { subjectID } = req.params;

      const impartition = await this.professorModel.getImpartitionBySubject({ subjectID });

      if(!impartition) return res.status(404).json(impartition);

      return res.status(200).json(impartition);
    } catch (error) {
      console.error('Error occurred while deleting professor:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  editImpartition = async(req, res) => {
    try {
      const { CUIL, subjectID } = req.params;

      const editedImpartition = await this.professorModel.editImpartition({ CUIL, subjectID });

      if (!editedImpartition) return res.status(404).json({ message: 'Profesor no existe o fallo la edición.' });

      return res.status(200).json({ message: 'Impartition edited correctly.' });
    } catch (error) {
      console.error('Error occurred while updating professor impartition:', error);
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

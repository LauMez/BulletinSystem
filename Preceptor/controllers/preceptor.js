import { validatePreceptor, validatePartialPreceptor } from "../schemas/preceptor.js";
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

export class PreceptorController {
  constructor ({ preceptorModel }) {
    this.preceptorModel = preceptorModel;
  };

  getAll = async (req, res) => {
    try {
      const preceptor = await this.preceptorModel.getAll();

      if (!preceptor || preceptor.length === 0) return res.status(404).json({ message: 'Preceptor not found' });

      return res.json(preceptor);
    } catch (error) {
      console.error('Error occurred while fetching preceptor:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  getByCUIL = async (req, res) => {
    const { CUIL } = req.params;
    try {
      const preceptor = await this.preceptorModel.getByCUIL({ CUIL });

      if (!preceptor || preceptor.length === 0) return res.status(404).json({ message: 'Preceptor not found' });

      return res.json(preceptor);
    } catch (error) {
      console.error('Error occurred while fetching preceptor:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  getByDNI = async(req, res) => {
    const { DNI } = req.params
    try {
      const preceptor = await this.preceptorModel.getByDNI({ DNI })

      if (!preceptor || preceptor.length === 0) return res.status(404).json({ message: 'Preceptor not found' })

      return res.json(preceptor)
    } catch( error) {
      console.log('Error ocurred while fetching preceptor: ', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  };

  getCourses = async(req, res) => {
    const { CUIL } = req.params;

    try {
      const courses = await this.preceptorModel.getCourses({ CUIL });

      if(courses.length === 0 || !courses) return res.status(404).json({message: 'preceptor courses not found'});

      return res.json(courses);
    } catch(error) {
      console.error('Error occurred while fetching preceptor courses:', error);
      return res.status(500).json({ nessage: 'Internal server error' });
    };
  };

  getCourse = async(req, res) => {
    const { CUIL, courseID } = req.params;

    try {
      const course = await this.preceptorModel.getCourse({ CUIL, courseID });

      if(course.length === 0 || !course) return res.status(404).json({message: 'Preceptor course not found'});

      return res.json(course);
    } catch(error) {
      console.error('Error occurred while fetching preceptor course:', error);
      return res.status(500).json({ nessage: 'Internal server error' });
    };
  }

  getByCourse = async(req, res) => {
    const { courseID } = req.params;

    try {
      const preceptor = await this.preceptorModel.getByCourse({ courseID })

      if (!preceptor || preceptor.length === 0) return res.status(404).json({ message: 'Preceptor not found' })

      return res.json(preceptor);
    } catch( error) {
      console.log('Error ocurred while fetching preceptor: ', error)
      return res.status(500).json({ message: 'Internal server error' })
    };
  }

  getAccount = async (req, res) => {
    const { CUIL } =  req.params;

    try {
      const preceptorAccount = await this.preceptorModel.getAccount({ CUIL });

      if(preceptorAccount.length === 0) return res.status(404).json({message: 'Preceptor account not found'});

      return res.json(preceptorAccount);
    } catch(error) {
      console.error('Error occurred while fetching preceptor account:', error);
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
    const preceptor = validatePreceptor(req.body);
    if (!preceptor.success) {
      const error = preceptor.error.issues[0].message;
      return res.status(400).json({ error: error, status: 400 });
    }

    const processedData = convertEmptyStringsToNull(preceptor.data);
    const existingPreceptor = await this.preceptorModel.findOne({ CUIL: preceptor.data.CUIL });

    if (existingPreceptor) return res.status(409).json({ error: 'Ya hay un usuario registrado con ese CUIL.', status: 409 });

    const newPreceptor = await this.preceptorModel.create({ input: processedData });
    return res.status(201).json(newPreceptor);
  }


  delete = async (req, res) => {
    try {
      const { CUIL } = req.params;
      
      const preceptor = await this.preceptorModel.delete({ CUIL });

      if (preceptor !== 'ok') return res.status(404).json({ message: 'Preceptor not found' });

      return res.status(200).json({ message: 'preceptor deleted' });
    } catch (error) {
      console.error('Error occurred while deleting preceptor:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  getImpartitionByCourse = async(req, res) => {
    try {
      const { courseID } = req.params;

      const impartition = await this.preceptorModel.getImpartitionByCourse({ courseID });

      if(!impartition) return res.status(404).json(impartition);

      return res.status(200).json(impartition);
    } catch (error) {
      console.error('Error occurred while getting preceptor impartition:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  editImpartition = async(req, res) => {
    try {
      const { CUIL, courseID } = req.params;

      const editedImpartition = await this.preceptorModel.editImpartition({ CUIL, courseID });

      if (!editedImpartition) return res.status(404).json({ message: 'Preceptor no existe o fallo la edición.' });

      return res.status(200).json({ message: 'Impartition edited correctly.' });
    } catch (error) {
      console.error('Error occurred while deleting preceptor impartition:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  update = async (req, res) => {
    const { CUIL } = req.params
    try {
      const result = validatePartialPreceptor(req.body);

      if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

      await this.preceptorModel.update({ CUIL, input: result.data });

      return res.json({message: 'Preceptor updated'});
    } catch (error) {
      console.error('Error occurred while updating preceptor:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateAccount = async (req, res) => {
    const { CUIL } = req.params;
    const { password } = req.body

    try {
      const account = await this.preceptorModel.updateAccount({ CUIL, password });

      return { message: "Account updated" }
    } catch (error) {
      console.error('Error occurred while updating account:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

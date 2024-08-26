import { validateResponsible, validatePartialResponsible } from "../schemas/responsible.js";
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

export class ResponsibleController {
  constructor ({ responsibleModel }) {
    this.responsibleModel = responsibleModel;
  };

  getAll = async (req, res) => {
    try {
      const responsible = await this.responsibleModel.getAll();

      if (!responsible || responsible.length === 0) return res.status(404).json({ message: 'Responsible not found' });

      return res.json(responsible);
    } catch (error) {
      console.error('Error occurred while fetching responsible:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  getByCUIL = async (req, res) => {
    const { CUIL } = req.params;
    try {
      const responsible = await this.responsibleModel.getByCUIL({ CUIL });

      if (!responsible || responsible.length === 0) return res.status(404).json({ message: 'Responsible not found' });

      return res.json(responsible);
    } catch (error) {
      console.error('Error occurred while fetching responsible:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }


  getAccount = async (req, res) => {
    const { CUIL } =  req.params;

    try {
      const responsibleAccount = await this.responsibleModel.getAccount({ CUIL });

      if(responsibleAccount.length === 0) return res.status(404).json({message: 'Responsible account not found'});

      return res.json(responsibleAccount);
    } catch(error) {
      console.error('Error occurred while fetching responsible account:', error);
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
    const responsible = validateResponsible(req.body);
    if (!responsible.success) {
      const firstError = responsible.error.issues[0].message;
      return this.getCreate(req, res, firstError);
    }

    const processedData = convertEmptyStringsToNull(responsible.data);
    const existingResponsible = await this.responsibleModel.findOne({ CUIL: responsible.data.CUIL });

    if (existingResponsible) return this.getCreate(req, res, 'Ya hay un usuario registrado con ese CUIL.');

    const newResponsible = await this.responsibleModel.create({ input: processedData });
    return res.status(201).json(newResponsible);
  }


  delete = async (req, res) => {
    const { CUIL } = req.params;

    try {
      const responsible = await this.responsibleModel.delete({ CUIL });

      return res.json({ message: 'Responsible deleted' });
    } catch (error) {
      console.error('Error occurred while deleting responsible:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  update = async (req, res) => {
    const { CUIL } = req.params
    try {
      const result = validatePartialResponsible(req.body);

      if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

      await this.responsibleModel.update({ CUIL, input: result.data });

      return res.json({message: 'Responsible updated'});
    } catch (error) {
      console.error('Error occurred while updating responsible:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateAccount = async (req, res) => {
    const { CUIL } = req.params;
    const { password } = req.body

    try {
      const account = await this.responsibleModel.updateAccount({ CUIL, password });

      return { message: "Account updated" }
    } catch (error) {
      console.error('Error occurred while updating account:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

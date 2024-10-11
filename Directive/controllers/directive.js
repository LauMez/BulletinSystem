import { validateDirective, validatePartialDirective } from "../schemas/directive.js";

const convertEmptyStringsToNull = (obj) => {
  const result = {};
  for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
          result[key] = obj[key].trim() === '' ? null : obj[key].trim();
      }
  }
  return result;
};

export class DirectiveController {
  constructor ({ directiveModel }) {
    this.directiveModel = directiveModel;
  };

  getAll = async (req, res) => {
    try {
      const directive = await this.directiveModel.getAll();

      if (!directive || directive.length === 0) return res.status(404).json({ message: 'Directive not found' });

      return res.json(directive);
    } catch (error) {
      console.error('Error occurred while fetching directive:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  getByCUIL = async (req, res) => {
    const { CUIL } = req.params;
    try {
      const directive = await this.directiveModel.getByCUIL({ CUIL });

      if (!directive || directive.length === 0) return res.status(404).json({ message: 'Directive not found' });

      return res.json(directive);
    } catch (error) {
      console.error('Error occurred while fetching directive:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  getByDNI = async(req, res) => {
    const { DNI } = req.params
    try {
      const directive = await this.directiveModel.getByDNI({ DNI })

      if (!directive || directive.length === 0) return res.status(404).json({ message: 'Directive not found' })

      return res.json(directive)
    } catch( error) {
      console.log('Error ocurred while fetching directive: ', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  getAccount = async (req, res) => {
    const { CUIL } =  req.params;

    try {
      const directiveAccount = await this.directiveModel.getAccount({ CUIL });

      if(directiveAccount.length === 0) return res.status(404).json({message: 'Directive account not found'});

      return res.json(directiveAccount);
    } catch(error) {
      console.error('Error occurred while fetching directive account:', error);
      return res.status(500).json({ nessage: 'Internal server error' });
    }
  };


  getCreate = async(req, res, errorMessage = null) => {
    try {
      const coursesResponse = await fetch('http://localhost:1234/course');
      const courses = await coursesResponse.json();
      return res.render('register', { courses: courses.data, errorMessage });
    } catch (error) {
        return res.status(500).render('register', { courses: [], errorMessage: 'Error fetching courses' });
    }
  }

  create = async (req, res) => {
    const directive = validateDirective(req.body);
    if (!directive.success) {
      const firstError = directive.error.issues[0].message;
      return this.getCreate(req, res, firstError);
    }

    const processedData = convertEmptyStringsToNull(directive.data);
    const existingDirective = await this.directiveModel.findOne({ CUIL: directive.data.CUIL });

    if (existingDirective) return this.getCreate(req, res, 'Ya hay un usuario registrado con ese CUIL.');

    const newDirective = await this.directiveModel.create({ input: processedData });
    return res.status(201).json(newDirective);
  }


  delete = async (req, res) => {
    const { CUIL } = req.params;

    try {
      const directive = await this.directiveModel.delete({ CUIL });

      return res.json({ message: 'Directive deleted' });
    } catch (error) {
      console.error('Error occurred while deleting directive:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  update = async (req, res) => {
    const { CUIL } = req.params
    try {
      const result = validatePartialDirective(req.body);

      if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

      await this.directiveModel.update({ CUIL, input: result.data });

      return res.json({message: 'Directive updated'});
    } catch (error) {
      console.error('Error occurred while updating directive:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateAccount = async (req, res) => {
    const { CUIL } = req.params;
    const { password } = req.body

    try {
      const account = await this.directiveModel.updateAccount({ CUIL, password });

      return { message: "Account updated" }
    } catch (error) {
      console.error('Error occurred while updating account:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

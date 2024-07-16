import { validateAssessment, validatePartialAssessment, validatePartialPeriod } from "../schemas/bulletin.js";

export class BulletinController {
  constructor ({ bulletinModel }) {
    this.bulletinModel = bulletinModel;
  };

  getAll = async (req, res) => {
    try {
      const bulletins = await this.bulletinModel.getAll();

      if (!bulletins) return res.status(404).json({ message: 'Bulletins not found' });

      return res.json(bulletins);
    } catch (error) {
      console.error('Error occurred while fetching bulletins:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  };

  getByID = async (req, res) => {
    const { bulletinID } = req.params;

    try {
      const bulletin = await this.bulletinModel.getByID({ bulletinID });

      if (bulletin.length === 0) return res.status(404).json({ message: 'Bulletin not found' });

      return res.json(bulletin);
    } catch (error) {
      console.error('Error occurred while fetching bulletin:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  };

  getByCUIL = async(req, res) => {
    const { CUIL } = req.params;

    try {
      const bulletin = await this.bulletinModel.getByCUIL({ CUIL });

      if (bulletin.length === 0) return res.status(404).json({ message: 'Bulletin not found' });

      return res.json(bulletin);
    } catch (error) {
      console.error('Error occurred while fetching bulletin:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  };

  getBySubjectID = async(req, res) => {
    const { subjectID } = req.params;

    try {
      const bulletin = await this.bulletinModel.getBySubjectID({ subjectID });

      if (bulletin.length === 0) return res.status(404).json({ message: 'Bulletin not found' });

      return res.json(bulletin);
    } catch (error) {
      console.error('Error occurred while fetching bulletin:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  };

  create = async (req, res) => {
    const { CUIL } = req.params;
    
    await this.bulletinModel.create({ CUIL });

    res.status(201).json({message: 'Bulletin created'});
  };

  createAssessment = async(req, res) => {
    const result = validateAssessment(req.body);

    const { periodID } = req.params;

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });
    
    const newAssessment = await this.bulletinModel.createAssessment({ periodID, input: result.data });

    res.status(201).json(newAssessment);
  };

  updatePeriod = async(req, res) => {
    const result = validatePartialPeriod(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

    const { periodID } = req.params;

    await this.bulletinModel.updatePeriod({ periodID, input: result.data });

    return res.json({message: 'Period updated'});
  };

  updateAssessment = async(req, res) => {
    const result = validatePartialAssessment(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

    const { assessmentID } = req.params;

    const updatedAssessment = await this.bulletinModel.updateAssessment({ assessmentID, input: result.data });

    return res.json(updatedAssessment);
  };
};
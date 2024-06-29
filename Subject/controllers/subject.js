import { validateSubject, validatePartialSubject, validateSchedule, validatePartialSchedule } from "../schemas/subject.js";

export class SubjectController {
  constructor ({ subjectModel }) {
    this.subjectModel = subjectModel;
  };

  getAll = async (req, res) => {
    try {
      const subjects = await this.subjectModel.getAll();

      if (subjects.length === 0) return res.status(404).json({ message: 'Subjects not found' });

      return res.json(subjects);
    } catch (error) {
      console.error('Error occurred while fetching subjects:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  };

  getAllSchedules = async(req, res) => {
    try {
      const schedules = await this.subjectModel.getAllSchedules();

      if (schedules.length === 0) return res.status(404).json({ message: 'Schedules not found' });

      return res.json(schedules);
    } catch (error) {
      console.error('Error occurred while fetching schedules:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  }

  getByID = async (req, res) => {
    const { subjectID } = req.params;

    try {
      const subject = await this.subjectModel.getByID({ subjectID });

      if (subject.length === 0) return res.status(404).json({ message: 'Subject not found' });

      return res.json(subject);
    } catch (error) {
      console.error('Error occurred while fetching subject:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  };

  getSchedulesByID = async(req, res) => {
    const { subjectID } = req.params;

    try {
      const schedules = await this.subjectModel.getSchedulesByID({ subjectID });

      if (schedules.length === 0) return res.status(404).json({ message: 'Schedules not found' });

      return res.json(schedules);
    } catch (error) {
      console.error('Error occurred while fetching schedules:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  };

  getByScheduleID = async(req, res) => {
    const { subjectID, scheduleID } = req.params;

    try {
      const schedules = await this.subjectModel.getByScheduleID({ subjectID, scheduleID });

      if (schedules.length === 0) return res.status(404).json({ message: 'Schedules not found' });

      return res.json(schedules);
    } catch (error) {
      console.error('Error occurred while fetching schedules:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  };

  create = async (req, res) => {
    const result = validateSubject(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });
    
    const newSubject = await this.subjectModel.create({ input: result.data });

    res.status(201).json({message: 'Subject created'});
  };

  createSchedule = async(req, res) => {
    const result = validateSchedule(req.body);

    const { subjectID } = req.params;

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });
    
    const newSchedule = await this.subjectModel.createSchedule({ subjectID, input: result.data });

    res.status(201).json({message: 'Schedule created'});
  };

  delete = async (req, res) => {
    const { subjectID } = req.params;

    const result = await this.subjectModel.delete({ subjectID });

    if (result === false) return res.status(404).json({ message: 'Subject not found' });
    
    return res.json({ message: 'Subject deleted' });
  };

  deleteSchedule = async(req, res) => {
    const { subjectID, scheduleID } = req.params;

    const result = await this.subjectModel.deleteSchedule({ subjectID, scheduleID });

    if (result === false) return res.status(404).json({ message: 'Schedule not found' });
    
    return res.json({ message: 'Schedule deleted' });
  };

  update = async(req, res) => {
    const result = validatePartialSubject(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

    const { subjectID } = req.params;

    const updatedSubject = await this.subjectModel.update({ subjectID, input: result.data });

    return res.json({message: 'Subject updated'});
  };

  updateSchedule = async(req, res) => {
    const result = validatePartialSchedule(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

    const { subjectID, scheduleID } = req.params;

    const updatedSchedule = await this.subjectModel.updateSchedule({ subjectID, scheduleID, input: result.data });

    return res.json({message: 'Schedule updated'});
  }
};
import { validateSubject, validatePartialSubject, validateSchedule, validatePartialSchedule } from "../schemas/subject.js";

export class SubjectController {
  constructor ({ subjectModel }) {
    this.subjectModel = subjectModel;
  };

  getAll = async (req, res) => {
    try {
      const subjects = await this.subjectModel.getAll();

      if (subjects.length === 0) {
        return res.status(404).json({ message: 'No subjects found' });
      }

      return res.json(subjects);
    } catch (error) {
      console.error('Error occurred while fetching subjects:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  getAllSchedules = async(req, res) => {
    try {
      const schedules = await this.subjectModel.getAllSchedules();

      if (schedules.length === 0) {
        return res.status(404).json({ message: 'No schedules found' });
      }

      return res.json(schedules);
    } catch (error) {
      console.error('Error occurred while fetching schedules:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  getByID = async (req, res) => {
    const { subjectID } = req.params;

    try {
      const subject = await this.subjectModel.getByID({ subjectID });

      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      return res.json(subject);
    } catch (error) {
      console.error('Error occurred while fetching subject:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  getByCourseID = async(req, res) => {
    const { courseID } = req.params;

    try {
      const subjects = await this.subjectModel.getByCourseID({ courseID });

      if (subjects.length === 0) {
        return res.status(404).json({ message: 'No subjects found for the given course ID' });
      }

      return res.json(subjects);
    } catch (error) {
      console.error('Error occurred while fetching subjects:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  getSchedulesByID = async(req, res) => {
    const { subjectID } = req.params;

    try {
      const schedules = await this.subjectModel.getSchedulesByID({ subjectID });

      if (schedules.length === 0) {
        return res.status(404).json({ message: 'No schedules found for the given subject ID' });
      }

      return res.json(schedules);
    } catch (error) {
      console.error('Error occurred while fetching schedules:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  create = async (req, res) => {
    const result = validateSubject(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    try {
      await this.subjectModel.create({ input: result.data });
      return res.status(201).json({ message: 'Subject created' });
    } catch (error) {
      console.error('Error occurred while creating subject:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  createSchedule = async(req, res) => {
    const result = validateSchedule(req.body);
    const { subjectID } = req.params;

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    try {
      await this.subjectModel.createSchedule({ subjectID, input: result.data });
      return res.status(201).json({ message: 'Schedule created' });
    } catch (error) {
      console.error('Error occurred while creating schedule:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  delete = async (req, res) => {
    const { subjectID } = req.params;

    try {
      const result = await this.subjectModel.delete({ subjectID });

      if (!result) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      return res.json({ message: 'Subject deleted' });
    } catch (error) {
      console.error('Error occurred while deleting subject:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  deleteSchedule = async(req, res) => {
    const { scheduleID } = req.params;

    try {
      const result = await this.subjectModel.deleteSchedule({ scheduleID });

      if (!result) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      return res.json({ message: 'Schedule deleted' });
    } catch (error) {
      console.error('Error occurred while deleting schedule:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  update = async(req, res) => {
    const result = validatePartialSubject(req.body);
    const { subjectID } = req.params;

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    try {
      await this.subjectModel.update({ subjectID, input: result.data });
      return res.json({ message: 'Subject updated' });
    } catch (error) {
      console.error('Error occurred while updating subject:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateSchedule = async(req, res) => {
    const result = validatePartialSchedule(req.body);
    const { scheduleID } = req.params;

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    try {
      await this.subjectModel.updateSchedule({ scheduleID, input: result.data });
      return res.json({ message: 'Schedule updated' });
    } catch (error) {
      console.error('Error occurred while updating schedule:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
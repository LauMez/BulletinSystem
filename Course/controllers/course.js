import { validateCourse, validatePartialCourse, validateGroup, validatePartialGroup } from "../schemas/course.js";

export class CourseController {
  constructor ({ courseModel }) {
    this.courseModel = courseModel;
  };

  getAll = async (req, res) => {
    try {
      const courses = await this.courseModel.getAll();

      if (courses.length === 0) return res.status(404).json({ message: 'No courses found' });

      return res.json(courses);
    } catch (error) {
      console.error('Error occurred while fetching courses:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  getAllGroups = async (req, res) => {
    try {
      const groups = await this.courseModel.getAllGroups();

      if (groups.length === 0) return res.status(404).json({ message: 'No groups found' });

      return res.json(groups);
    } catch (error) {
      console.error('Error occurred while fetching groups:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  getByID = async (req, res) => {
    const { courseID } = req.params;

    try {
      const course = await this.courseModel.getByID({ courseID });

      if (!course) return res.status(404).json({ message: 'Course not found' });

      return res.json(course);
    } catch (error) {
      console.error('Error occurred while fetching course:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  getGroupsByID = async (req, res) => {
    const { courseID } = req.params;

    try {
      const groups = await this.courseModel.getGroupsByID({ courseID });

      if (groups.length === 0) return res.status(404).json({ message: 'No groups found for the given course ID' });

      return res.json(groups);
    } catch (error) {
      console.error('Error occurred while fetching groups:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  getByStudent = async(req, res) => {
    const { CUIL } = req.params
    try {
      const course = await this.courseModel.getByStudent({ CUIL });

      if (!course || course.length === 0) return res.status(404).json({ message: 'No course found for the given CUIL' });

      return res.json(course)
    } catch (error) {
      console.error('Error occurred while fetching course:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  getStudents = async(req, res) => {
    const { courseGroupID } = req.params
    try {
      const students = await this.courseModel.getStudents({ courseGroupID });

      if (!students || students.length === 0) return res.status(404).json({ message: 'No students found for the given courseGroupID' });

      return res.json(students)
    } catch (error) {
      console.error('Error occurred while fetching students:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  create = async (req, res) => {
    const result = validateCourse(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

    try {
      await this.courseModel.create({ input: result.data });
      return res.status(201).json({ message: 'Course created' });
    } catch (error) {
      console.error('Error occurred while creating course:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  createGroup = async (req, res) => {
    const { courseID } = req.params;
    const result = validateGroup(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

    try {
      const newGroup = await this.courseModel.createGroup({ courseID, input: result.data });
      return res.status(201).json({ message: 'Group created', group: newGroup });
    } catch (error) {
      console.error('Error occurred while creating group:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  delete = async (req, res) => {
    const { courseID } = req.params;

    try {
      const result = await this.courseModel.delete({ courseID });

      if (!result) return res.status(404).json({ message: 'Course not found' });

      return res.json({ message: 'Course deleted' });
    } catch (error) {
      console.error('Error occurred while deleting course:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  deleteGroup = async (req, res) => {
    const { courseGroupID } = req.params;

    try {
      const result = await this.courseModel.deleteGroup({ courseGroupID });

      if (!result) return res.status(404).json({ message: 'Group not found' });

      return res.json({ message: 'Group deleted' });
    } catch (error) {
      console.error('Error occurred while deleting group:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  update = async (req, res) => {
    const result = validatePartialCourse(req.body);
    const { courseID } = req.params;

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

    try {
      await this.courseModel.update({ courseID, input: result.data });
      return res.json({ message: 'Course updated' });
    } catch (error) {
      console.error('Error occurred while updating course:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateGroup = async (req, res) => {
    const result = validatePartialGroup(req.body);
    const { courseGroupID } = req.params;

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

    try {
      await this.courseModel.updateGroup({ courseGroupID, input: result.data });
      return res.json({ message: 'Group updated' });
    } catch (error) {
      console.error('Error occurred while updating group:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  getInscriptions = async (req, res) => {
    const { courseID } = req.params

    try {
      const inscriptions = await this.courseModel.getInscriptions({ courseID })
      return res.json(inscriptions)
    } catch(error) {
      console.log('Error occurred while fetching inscriptions: ', error)
      return res.status(500).json({ message: 'Internal server errror' })
    }
  }

  createInscription = async (req, res) => {
    const { courseID } = req.params
    const { CUIL } = req.body
    
    try {
      await this.courseModel.createInscription({ courseID, CUIL })
      return res.json({ message: "Inscription created" })
    } catch(error) {
      console.log('Error occurred while fetching inscriptions: ', error)
      return res.status(500).json({ message: 'Internal server errror' })
    }
  }

  deleteInscription = async (req, res) => {
    const { inscriptionID } = req.params

    try {
      await this.courseModel.deleteInscription({ inscriptionID })
      return res.json({ message: "Inscription deleted" })
    } catch(error) {
      console.log('Error occurred while fetching inscriptions: ', error)
      return res.status(500).json({ message: 'Internal server errror' })
    }
  }
};

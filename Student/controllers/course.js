import { validateCourse, validatePartialCourse, validateGroup, validatePartialGroup } from "../schemas/course.js";

export class CourseController {
  constructor ({ courseModel }) {
    this.courseModel = courseModel;
  };

  getAll = async (req, res) => {
    try {
      const courses = await this.courseModel.getAll();

      if (courses.length === 0) return res.status(404).json({ message: 'Courses not found' });

      return res.json(courses);
    } catch (error) {
      console.error('Error occurred while fetching courses:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  };

  getAllGroups = async (req, res) => {
    try {
      const groups = await this.courseModel.getAllGroups();

      if (groups.length === 0) return res.status(404).json({ message: 'Groups not found' });

      return res.json(groups);
    } catch (error) {
      console.error('Error occurred while fetching groups:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  }

  getByID = async (req, res) => {
    const { courseID } = req.params

    try {
      const course = await this.courseModel.getByID({ courseID });

      if (course.length === 0) return res.status(404).json({ message: 'Course not found' });

      return res.json(course);
    } catch (error) {
        console.error('Error occurred while fetching course:', error);
        return res.status(500).json({ message: 'Internal server error' });
    };
  };

  getGroupsByID = async (req, res) => {
    const { courseID } =  req.params;

    try {
      const groups = await this.courseModel.getGroupsByID({ courseID });

      if(groups.length === 0) return res.status(404).json({message: 'Groups not found'});

      return res.json(groups);
    } catch(e) {
      console.log(e);
      return res.status(500).json({ nessage: 'Internal server error' });
    }
  };

  getByGroupID = async (req, res) => {
    const { courseID, courseGroupID } =  req.params;

    try {
      const groups = await this.courseModel.getByGroupID({ courseID, courseGroupID });

      if(groups.length === 0) return res.status(404).json({message: 'Groups not found'});

      return res.json(groups);
    } catch(e) {
      console.log(e);
      return res.status(500).json({ nessage: 'Internal server error' });
    }
  };

  create = async (req, res) => {
    const result = validateCourse(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });
    
    const newCourse = await this.courseModel.create({ input: result.data });

    res.status(201).json({message: 'Course created'});
  }

  createGroup = async (req, res) => {
    const { courseID } = req.params;

    const result = validateGroup(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

    const newGroup = await this.courseModel.createGroup({ courseID, input: result.data });

    res.status(201).json(newGroup);
  };

  delete = async (req, res) => {
    const { courseID } = req.params;

    const result = await this.courseModel.delete({ courseID });

    if (result === false) return res.status(404).json({ message: 'Course not found' });
    
    return res.json({ message: 'Course deleted' });
  };

  deleteGroup = async (req, res) => {
    const { courseID, courseGroupID } = req.params;

    const result = await this.courseModel.deleteGroup({  courseID, courseGroupID });

    if(result === false) return res.status(404).json({message: 'Group not found'});

    return res.json({message: 'Group deleted'});
  }

  update = async (req, res) => {
    const result = validatePartialCourse(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

    const { courseID } = req.params;

    const updatedCourse = await this.courseModel.update({ courseID, input: result.data });

    return res.json({message: 'Course updated'});
  };

  updateGroup = async (req, res) => {
    const result = validatePartialGroup(req.body);

    if(!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

    const { courseID, courseGroupID } = req.params;

    const updateGroup = await this.courseModel.updateGroup({ courseID, courseGroupID, input: result.data });

    return res.json({message: 'Group updated'})
  }
};

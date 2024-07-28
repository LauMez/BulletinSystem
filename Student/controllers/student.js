import { validateStudent, validatePartialStudent, validatePartialAccount } from "../schemas/student.js";

export class StudentController {
  constructor ({ studentModel }) {
    this.studentModel = studentModel;
  };

  getAll = async (req, res) => {
    try {
      const students = await this.studentModel.getAll();

      if (students.length === 0 || !students) return res.status(404).json({ message: 'Students not found' });

      return res.json(students);
    } catch (error) {
      console.error('Error occurred while fetching students:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  };

  getByCUIL = async (req, res) => {
    const { CUIL } = req.params;
    try {
      const student = await this.studentModel.getByCUIL({ CUIL });

      if (student.length === 0) return res.status(404).json({ message: 'Student not found' });

      return res.json(student);
    } catch (error) {
      console.error('Error occurred while fetching student:', error);
      return res.status(500).json({ message: 'Internal server error' });
    };
  }

  getByCourseID = async (req, res) => {
    const { courseID } = req.params

    try {
      const students = await this.studentModel.getByCourseID({ courseID });

      if (students.length === 0) return res.status(404).json({ message: 'Students not found' });

      return res.json(students);
    } catch (error) {
        console.error('Error occurred while fetching students:', error);
        return res.status(500).json({ message: 'Internal server error' });
    };
  };

  getByCourseGroupID = async (req, res) => {
    const { courseGroupID } =  req.params;

    try {
      const students = await this.studentModel.getByCourseGroupID({ courseGroupID });

      if(students.length === 0) return res.status(404).json({message: 'Students not found'});

      return res.json(students);
    } catch(error) {
      console.error('Error occurred while fetching students:', error);
      return res.status(500).json({ nessage: 'Internal server error' });
    }
  };

  getBySubjectID = async (req, res) => {
    const { subjectID } =  req.params;

    try {
      const students = await this.studentModel.getBySubjectID({ subjectID });

      if(students.length === 0) return res.status(404).json({message: 'Students not found'});

      return res.json(students);
    } catch(error) {
      console.error('Error occurred while fetching students:', error);
      return res.status(500).json({ nessage: 'Internal server error' });
    }
  };

  getAccount = async (req, res) => {
    const { CUIL } =  req.params;

    try {
      const studentAccount = await this.studentModel.getAccount({ CUIL });

      if(studentAccount.length === 0) return res.status(404).json({message: 'Student account not found'});

      return res.json(studentAccount);
    } catch(error) {
      console.error('Error occurred while fetching student account:', error);
      return res.status(500).json({ nessage: 'Internal server error' });
    }
  };

  getCard = async (req, res) => {
    const { CUIL } =  req.params;

    try {
      const studentCard = await this.studentModel.getCard({ CUIL });

      if(studentCard.length === 0) return res.status(404).json({message: 'Student card not found'});

      return res.json(studentCard);
    } catch(error) {
      console.error('Error occurred while fetching student card:', error);
      return res.status(500).json({ nessage: 'Internal server error' });
    }
  };

  create = async (req, res) => {
    const result = validateStudent(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });
    
    await this.studentModel.create({ input: result.data });

    res.status(201).json({message: 'Student created'});
  }

  createCard = async (req, res) => {
    const { CUIL } = req.params;

    const { cardID } = req.body;

    if (!cardID) return res.status(400).json({ error: `Card doesn't exists` });

    const newCard = await this.studentModel.createCard({ CUIL, cardID });

    res.status(201).json(newCard);
  };

  createImpartition = async (req, res) => {
    const { CUIL } = req.params;

    const { courseID } = req.body;

    if (!courseID) return res.status(400).json({ error: `Course doesn't exists` });

    await this.studentModel.createImpartition({ CUIL, courseID });

    res.status(201).json({message: 'Student imparted in course'});
  };

  delete = async (req, res) => {
    const { CUIL } = req.params;

    const result = await this.studentModel.delete({ CUIL });

    if (result === false) return res.status(404).json({ message: 'Student not found' });
    
    return res.json({ message: 'Student deleted' });
  };

  update = async (req, res) => {
    const result = validatePartialStudent(req.body);

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

    const { courseID } = req.params;

    const updatedCourse = await this.studentModel.update({ courseID, input: result.data });

    return res.json({message: 'Student updated'});
  };

  updateAccount = async (req, res) => {
    const { CUIL } = req.params;
    const result = validatePartialAccount(req.body, CUIL);

    if(!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

    await this.studentModel.updateAccount({ CUIL, input: result.data });

    return res.json({message: 'Account updated'})
  };

  updateCard = async (req, res) => {
    const { cardID } = req.body;

    if (!cardID) return res.status(400).json({ error: `Card doesn't exists` });

    const { CUIL } = req.params;

    await this.studentModel.updateCard({ CUIL, cardID });

    return res.json({message: 'Card updated'})
  };

  updateImpartition = async (req, res) => {
    const { courseID } = req.body;

    if (!courseID) return res.status(400).json({ error: `Course doesn't exists` });

    const { CUIL } = req.params;

    await this.studentModel.updateImpartition({ CUIL, courseID });

    return res.json({message: 'Impartition updated'})
  };
};

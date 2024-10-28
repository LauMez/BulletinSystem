export class IndexController {
  constructor ({ indexModel }) {
    this.indexModel = indexModel;
  };

  index = async (req, res) => {
    try {
      const { CUIL } = req.params;

      const data = await this.indexModel.index({ CUIL });

      return res.render('index', { data });
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return res.status(500).send(error.message);
    }
  }

  profile = async(req, res) => {
    try {
      const { CUIL } = req.params;

      const data = await this.indexModel.profile({ CUIL });

      return res.render('profile', { data });
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return res.status(500).send(error.message);
    }
  }

  schedules = async(req, res) => {
    try {
      const { CUIL } = req.params;

      const subjects = await this.indexModel.schedules({ CUIL });

      if(!subjects) return res.status(500).json({ message: 'Materias no encontradas' });

      console.log('schedules subject: ', subjects);

      return res.render('schedules', { subjects });
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return res.status(500).send(error.message);
    }
  }

  bulletin = async(req, res) => {
    try {
      const { CUIL } = req.params;

      const subjects = await this.indexModel.bulletin({ CUIL });

      if(!subjects) return res.status(500).json({ message: 'Materias no encontradas' });

      console.log('bulletin subject: ', subjects);
      
      return res.render('bulletin', { subjects });
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return res.status(500).send(error.message);
    }
  }

  subject = async(req, res) => {
    try {
      const { CUIL, subjectID } = req.params;

      const subject = await this.indexModel.subject({ CUIL, subjectID });

      if(!subject) return res.status(500).json({ message: 'Materia no encontradas' });

      console.log('subject subject: ', subject);

      return res.render('subject', { subject });
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return res.status(500).send(error.message);
    }
  }

  getRegister = async (req, res, errorMessage = null) => {
      try {
        const courses = await this.indexModel.getRegister();
        return res.render('register', { courses, errorMessage })
      } catch (error) {
        return res.status(500).render('register', { courses: [], errorMessage: 'Error fetching courses' });
      }
  };

  register = async (req, res) => {
      try {
          const response = await fetch('http://localhost:4567/student/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
          });
          const student = await response.json();
      
          if (student.errorMessage) {
            return this.getRegister(req, res, student.errorMessage);
          }
      
          return this.getRegister(req, res, null);
      } catch (error) {
          console.error('Error during student registration:', error.message || error);
          return this.getRegister(req, res, 'Error registering student');
      }
  }
};

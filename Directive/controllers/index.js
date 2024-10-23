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

      const directive = await this.indexModel.profile({ CUIL });
      
      return res.render('profile', { directive });
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return res.status(500).send(error.message);
    }
  }

  getEditStudent = async(req, res) => {
    try {
      const { CUIL, studentCUIL } = req.params;

      const data = await this.indexModel.getEditStudent({ studentCUIL });

      return res.render('editStudent', { data, CUIL });
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return res.status(500).send(error.message);
    }
  };

  editStudent = async(req, res) => {
    try {
      const { studentCUIL } = req.params;
      const { courseID, courseGroupID } = req.body;

      const student = await this.indexModel.editStudent({ studentCUIL, courseID, courseGroupID });

      if(!student) return res.status(500).json({ message: 'El estudiante no existe o fallo la edición' });

      return res.status(200).json({ message: 'Student edited correctly.' });
    } catch(error) {
      console.error('Error editing student:', error.message);
      return res.status(500).send(error.message);
    }
  };

  getEditProfessor = async(req, res) => {
    try {
      const { CUIL, professorCUIL } = req.params;

      const data = await this.indexModel.getEditProfessor({ CUIL, professorCUIL });

      return res.render('editProfessor', { data, CUIL });
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return res.status(500).send(error.message);
    }
  };

  editProfessor = async(req, res) => {
    try {
      const { professorCUIL } = req.params;
      const { subjectID } = req.body;

      const professor = await this.indexModel.editProfessor({ professorCUIL, subjectID });

      if(!professor) return res.status(500).json({ message: 'El profesor no existe o fallo la edición' });

      return res.status(200).json({ message: 'Professor edited correctly.' });
    } catch(error) {
      console.error('Error editing professor:', error.message);
      return res.status(500).send(error.message);
    }
  };

  getEditPreceptor = async(req, res) => {
    try {
      const { CUIL, preceptorCUIL } = req.params;

      const data = await this.indexModel.getEditPreceptor({ CUIL, preceptorCUIL });

      return res.render('editPreceptor', { data, CUIL });
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return res.status(500).send(error.message);
    }
  };

  editPreceptor = async(req, res) => {
    try {
      const { preceptorCUIL } = req.params;
      const { courseID } = req.body;

      const preceptor = await this.indexModel.editPreceptor({ preceptorCUIL, courseID });

      if(!preceptor) return res.status(500).json({ message: 'El profesor no existe o fallo la edición' });

      return res.status(200).json({ message: 'preceptor edited correctly.' });
    } catch(error) {
      console.error('Error editing preceptor:', error.message);
      return res.status(500).send(error.message);
    }
  };

  deleteStudent = async(req, res) => {
    try {
      const { studentCUIL } = req.params;
      const deleteResponse = await fetch(`http://localhost:4567/student/${studentCUIL}`, { 
        method: 'DELETE' 
      });

      if (deleteResponse.ok) {
        return res.status(200).send('Student deleted');
      } else {
        console.error('Failed to delete student:', deleteResponse.statusText);
        return res.status(500).send('Failed to delete student');
      }
    } catch(error) {
      console.log('Error during deleting: ', error);
      return res.status(500).send('Error during deleting');
    }
  };

  deleteProfessor = async(req, res) => {
    try {
      const { professorCUIL } = req.params;
      const deleteResponse = await fetch(`http://localhost:8734/professor/${professorCUIL}`, { 
        method: 'DELETE' 
      });

      if (deleteResponse.ok) {
        return res.status(200).send('Professor deleted');
      } else {
        console.error('Failed to delete Professor:', deleteResponse.statusText);
        return res.status(500).send('Failed to delete Professor');
      }
    } catch(error) {
      console.log('Error during deleting: ', error);
      return res.status(500).send('Error during deleting');
    }
  };

  deletePreceptor = async(req, res) => {
    try {
      const { preceptorCUIL } = req.params;
      const deleteResponse = await fetch(`http://localhost:6534/preceptor/${preceptorCUIL}`, { 
        method: 'DELETE' 
      });

      if (deleteResponse.ok) {
        return res.status(200).send('Preceptor deleted');
      } else {
        console.error('Failed to delete Preceptor:', deleteResponse.statusText);
        return res.status(500).send('Failed to delete Preceptor');
      }
    } catch(error) {
      console.log('Error during deleting: ', error);
      return res.status(500).send('Error during deleting');
    }
  };

  logout = async(req, res) => {
    try {
      return await fetch('http://localhost:7654/logout', { method: 'POST' });
    } catch(error) {
      console.log('Error during logout: ', error);
      return res.status(500).send('Error during logout');
    }
  }
};

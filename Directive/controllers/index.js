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

  editStudent = async(req, res) => {
    try {
      const { CUIL, studentCUIL } = req.params;

      const data = await this.indexModel.editStudent({ CUIL, studentCUIL });

      return res.render('editStudent', { data });
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return res.status(500).send(error.message);
    }
  };

  editProfessor = async(req, res) => {
    try {
      const { CUIL, professorCUIL } = req.params;

      const data = await this.indexModel.editProfessor({ CUIL, professorCUIL });

      return res.render('editProfessor', { data });
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return res.status(500).send(error.message);
    }
  };

  editPreceptor = async(req, res) => {
    try {
      const { CUIL, preceptorCUIL } = req.params;

      const data = await this.indexModel.editPreceptor({ CUIL, preceptorCUIL });

      return res.render('editPreceptor', { data });
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return res.status(500).send(error.message);
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

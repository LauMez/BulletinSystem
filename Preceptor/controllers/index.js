export class IndexController {
  constructor ({ indexModel }) {
    this.indexModel = indexModel;
  };

  index = async (req, res) => {
    try {
      const { CUIL } = req.params;

      const data = await this.indexModel.index({ CUIL });

      return res.render('index', { data });
    } catch(error) {
      console.error('Error fetching data:', error);
      return res.status(500).send('Error fetching data');
    }
  }
  
  profile = async(req, res) => {
    try {
      const { CUIL } = req.params;

      const preceptor = await this.indexModel.profile({ CUIL });

      return res.render('profile', { preceptor });        
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return res.status(500).send('An error occurred while fetching data.');
    }
  }

  course = async(req, res) => {
    try {
      const { CUIL, courseID } = req.params;

      const data = await this.indexModel.course({ CUIL, courseID });

      return res.render('course', { data });
    } catch(error) {
      console.error('Error fetching data:', error);
      return res.status(500).send('Error fetching data');
    }
  };
  
  logout = async(req, res) => {
    try {
      return await fetch('http://localhost:7654/logout', {
        method: 'POST',
      });
    } catch(error) {
      console.log('Error during logout: ', error);
      return res.status(500).send('Error during logout');
    }
  }
};
  
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
  
        const responsible = await this.indexModel.profile({ CUIL });
  
        return res.render('profile', { responsible });
      } catch (error) {
        console.error('Error fetching data:', error.message);
        return res.status(500).send(error.message);
      }
    }

    profileStudentInCharge = async (req, res) => {
        try {
            const { studentCUIL } = req.params;
    
            const data = await this.indexModel.studentProfile({ studentCUIL });
      
            return res.render('profileStudentInCharge', { data });
        } catch (error) {
          console.error('Error fetching data:', error.message);
          return res.status(500).send(error.message);
        }
    };

    studentProfile = async (req, res) => {
        try {
            const { studentCUIL } = req.params;
    
            const data = await this.indexModel.studentProfile({ studentCUIL });
    
            return res.render('studentProfile', { data });
        } catch (error) {
          console.error('Error fetching data:', error.message);
          return res.status(500).send(error.message);
        }
    };

    studentSchedules = async(req, res) => {
        try {
            const { studentCUIL } = req.params;
      
            const subjects = await this.indexModel.studentSchedules({ studentCUIL });
      
            if(!subjects) return res.status(500).json({ message: 'Materias no encontradas' });

            console.log('schedules: ', subjects);
      
            return res.render('studentSchedules', { subjects });
        } catch (error) {
            console.error('Error fetching data:', error.message);
            return res.status(500).send(error.message);
        };
    };

    studentBulletin = async(req, res) => {
        try {
            const { studentCUIL } = req.params;
      
            const subjects = await this.indexModel.studentBulletin({ studentCUIL });
      
            if(!subjects) return res.status(500).json({ message: 'Materias no encontradas' });

            console.log('bulletin: ', subjects);
            
            return res.render('studentBulletin', { subjects });
        } catch (error) {
            console.error('Error fetching data:', error.message);
            return res.status(500).send(error.message);
        }
    };
};  
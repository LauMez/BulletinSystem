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
    };

    subject = async(req, res) => {
        try {
            const { CUIL, subjectID } = req.params;

            const data = await this.indexModel.subject({ subjectID });

            return res.render('subject', { data });
        } catch(error) {
            console.error('Error fetching data:', error.message);
            return res.status(500).send('An error occurred while fetching data.');
        }
    };

    profile = async(req, res) => {  
        try {
            const { CUIL } = req.params;

            const professor = await this.indexModel.profile({ CUIL });

            return res.render('profile', { professor });
        } catch (error) {
            console.error('Error fetching data:', error.message);
            return res.status(500).send('An error occurred while fetching data.');
        }
    }

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

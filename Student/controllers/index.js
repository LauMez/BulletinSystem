import axios from 'axios';

export class IndexController {
    index = async (req, res) => {
        // const user = await axios.get('http://localhost:7654/user')
        // console.log(user)

        return res.render('index')
    }

    getLogin = async (req, res) => {
        try {
            return res.render('login')
        } catch (error) {
            return res.status(500).render('login')
        }
    }

    login = async (req, res) => {
        try {
            const user = await axios.post('http://localhost:7654/login')
            console.log(user)

            res.redirect('/')
        } catch(error) {
            return this.getLogin(res, res)
        }
    }


    getRegister = async (req, res, errorMessage = null) => {
        try {
            const courses = await axios.get('http://localhost:1234/course');
            return res.render('register', { courses: courses.data, errorMessage});
          } catch (error) {
            return res.status(500).render('register', { courses: [], errorMessage: 'Error fetching courses' });
        }
    };

    register = async (req, res) => {
        try {
            const newStudent = await axios.post('http://localhost:4567/student/', req.body);

            console.log(newStudent)
        
            if (newStudent.data.errorMessage) {
              return this.getRegister(req, res, newStudent.data.errorMessage);
            }
        
            return this.getRegister(req, res, null);
        } catch (error) {
            console.error('Error during student registration:', error.message || error);
            return this.getRegister(req, res, 'Error registering student');
        }
    }
};

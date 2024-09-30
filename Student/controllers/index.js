export class IndexController {
    index = async (req, res) => {
      const { CUIL } = req.params

      try {
        const [studentResponse, courseResponse] = await Promise.all([
          fetch(`http://localhost:4567/student/${CUIL}`),
          fetch(`http://localhost:1234/course/student/${CUIL}`)
        ]);

        if(!studentResponse.ok) {
          throw new Error('Error fetching student or course data');
        }

        const student = await studentResponse.json();
        
        if (!courseResponse.ok) return res.render('index', { student, subjects: null });
        
        const course = await courseResponse.json();
        
        const subjectsResponse = await fetch(`http://localhost:4321/subject/course/${course.course.courseID}/group/${course.group.courseGroupID}`);
        
        if (!subjectsResponse.ok) return res.render('index', { student, subjects: null });
        
        const subjects = await subjectsResponse.json();
        
        return res.render('index', { student, subjects });
      } catch (error) {
        console.error('Error fetching data:', error.message);
        return res.status(500).send(error.message);
      }
    }

    profile = async(req, res) => {
      const { CUIL } = req.params

      try {
        const [studentResponse, courseResponse, responsiblesResponse] = await Promise.all([
          fetch(`http://localhost:4567/student/${CUIL}`),
          fetch(`http://localhost:1234/course/student/${CUIL}`),
          fetch(`http://localhost:6348/responsible/student/${CUIL}`)
        ]);
        
        if (!studentResponse.ok) {
          throw new Error('Error fetching student');
        }
        const student = await studentResponse.json();

        let course, group, responsibles;

        if(!courseResponse.ok) {
          course = null;
          group = null;
        }

        const courseData = await courseResponse.json() || null;
        responsibles = await responsiblesResponse.json() || null;

        console.log(responsibles)


        if(responsibles.errorMessage) responsibles = null;
  
        course = courseData.course || null;
        group = courseData.group || null;
    
        return res.render('profile', { student, course, group, responsibles });
          
      } catch (error) {
        console.error('Error fetching data:', error.message);
        return res.status(500).send(error.message);
      }
    }

    schedules = async(req, res) => {
      const { CUIL } = req.params

      try {
        const courseResponse = await fetch(`http://localhost:1234/course/student/${CUIL}`);
        const course = await courseResponse.json();
    
        const subjectsResponse = await fetch(`http://localhost:4321/subject/course/${course.course.courseID}`);
        const subjects = await subjectsResponse.json();
    
        return res.render('schedules', { subjects });
      } catch (error) {
        console.error('Error fetching schedules:', error);
        return res.status(500).send('Error fetching schedules');
      }
    }

    bulletin = async(req, res) => {
      const { CUIL } = req.params

      try {
        const courseResponse = await fetch(`http://localhost:1234/course/student/${CUIL}`);
        
        if (!courseResponse.ok) throw new Error('Error fetching course data');
        
        const course = await courseResponse.json();
    
        const subjectsResponse = await fetch(`http://localhost:4321/subject/course/${course.course.courseID}`);
    
        if (!subjectsResponse.ok) throw new Error('Error fetching subjects data');
    
        const subjects = await subjectsResponse.json();
    
        return res.render('bulletin', { subjects });
      } catch (error) {
        console.error('Error fetching data:', error.message);
        return res.status(500).send('An error occurred while fetching data.');
      }
    }

    subject = async(req, res) => {
        const { CUIL, subjectID } = req.params
        try {
            const subjectResponse = await fetch(`http://localhost:4321/subject/${subjectID}`)

            if (!subjectResponse.ok) throw new Error('Error fetching subject data');

            const subject = await subjectResponse.json()

            return res.render('subject', { subject })
        } catch (error) {
            console.error('Error fetching data:', error.message);
            return res.status(500).send('An error occurred while fetching data.');
        }
    }

    getRegister = async (req, res, errorMessage = null) => {
        try {
            console.log('nashe')
            const response = await fetch('http://localhost:1234/course');
            const courses = await response.json();
            return res.render('register', { courses, errorMessage});
        } catch (error) {
            console.log('adios')
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

            console.log(student)
        
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

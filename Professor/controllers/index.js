export class IndexController {
    index = async (req, res) => {
        const { CUIL } = req.params;

        try {
            const subjectsResponse = await fetch(`http://localhost:8734/professor/${CUIL}/subjects`);
            const subjectsData = await subjectsResponse.json();

            console.log(subjectsData)
    
            return res.render('index', {subjectsData, CUIL});
        } catch(error) {
            console.error('Error fetching data:', error);
            return res.status(500).send('Error fetching data');
        }
    };

    subject = async(req, res) => {
        try {
            const { CUIL, subjectID } = req.params;

            // const professorResponse = await fetch(`http://localhost:8734/professor/${CUIL}`);
            // const professor = await professorResponse.json();

            const subjectResponse = await fetch(`http://localhost:4321/subject/${subjectID}`);
            const subject = await subjectResponse.json();

            const courseResponse = await fetch(`http://localhost:1234/course/${subject.courseID}`);
            const course = await courseResponse.json();

            let students;
            if(!subject.courseGroupID || subject.courseGroupID == '') {
                const studentsResponse = await fetch(`http://localhost:1234/course/${subject.courseID}/inscription`);
                students = await studentsResponse.json();
            } else {
                const studentsResponse = await fetch(`http://localhost:1234/course/group/${subject.courseGroupID}/students`);
                students = await studentsResponse.json();
            }

            return res.render('subject', { subject, students, course });
        } catch(error) {
            console.error('Error fetching data:', error.message);
            return res.status(500).send('An error occurred while fetching data.');
        }
    };

    profile = async(req, res) => {
        const { CUIL } = req.params
  
        try {
            // const [professorResponse, courseResponse, responsiblesResponse] = await Promise.all([
            // fetch(`http://localhost:4567/student/${CUIL}`),
            // fetch(`http://localhost:1234/course/student/${CUIL}`),
            // fetch(`http://localhost:6348/responsible/student/${CUIL}`)
            // ]);

            const professorResponse = await fetch(`http://localhost:8734/professor/${CUIL}`);

            if (!professorResponse.ok) {
                throw new Error('Error fetching professor data');
            };

            const professor = await professorResponse.json();
            
            // if (!studentResponse.ok || !courseResponse.ok || !responsiblesResponse.ok) {
            // throw new Error('Error fetching student, course, or responsible data');
            // }
            
            // const student = await studentResponse.json();
            // const courseData = await courseResponse.json();
            // const responsibles = await responsiblesResponse.json();

            // const course = courseData.course
            // const group = courseData.group
        
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

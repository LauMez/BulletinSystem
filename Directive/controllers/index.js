export class IndexController {
  index = async (req, res) => {
    const { CUIL } = req.params

    try {
      const [studentsResponse, professorsResponse, preceptorsResponse, coursesResponse] = await Promise.all([
      fetch(`http://localhost:4567/student`),
      fetch(`http://localhost:8734/professor`),
      fetch(`http://localhost:6534/preceptor`),
      fetch(`http://localhost:1234/course`)
      ]);

      let students;
      if(!studentsResponse.ok) students = null;

      students = await studentsResponse.json();

      let professors;
      if (!professorsResponse.ok) professors = null;
      
      professors = await professorsResponse.json();

      let preceptors;
      if (!preceptorsResponse.ok) preceptors = null;
      
      preceptors = await preceptorsResponse.json();


      const CourseStudents = await Promise.all(students.map(async (student) => {
          const courseResponse = await fetch(`http://localhost:1234/course/student/${student.CUIL}`);
          const courseData = await courseResponse.json();

          return {
              student,
              course: {
                  year: courseData.course.year,
                  division: courseData.course.division,
                  group: courseData.group.group
              }
          }
      }));

      let courses;
      if(!coursesResponse.ok) courses = null;

      courses = await coursesResponse.json();

      const CourseSubjects = await Promise.all(courses.map(async (course) => {
          const subjectsResponse = await fetch(`http://localhost:4321/subject/course/${course.courseID}`);
          const subjects = await subjectsResponse.json();

          return {
              course,
              subjects
          }
      }));

      return res.render('index', { CUIL, data: CourseStudents, professors, preceptors, coursesData: CourseSubjects });
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return res.status(500).send(error.message);
    }
  }

  profile = async(req, res) => {
    const { CUIL } = req.params

    try {
      const directiveResponse = await fetch(`http://localhost:9457/directive/${CUIL}`);

      if (!directiveResponse.ok) {
          throw new Error('Error fetching directive data');
      };

      const directive = await directiveResponse.json();
    
      return res.render('profile', { directive });
        
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

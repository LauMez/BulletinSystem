export class IndexModel {
    static async index({ CUIL }) {
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

        return {
            CUIL,
            students: CourseStudents,
            professors,
            preceptors,
            courses: CourseSubjects
        }
    };

    static async profile({ CUIL }) {
        const directiveResponse = await fetch(`http://localhost:9457/directive/${CUIL}`);

        if (!directiveResponse.ok) {
            throw new Error('Error fetching directive data');
        };
  
        const directive = await directiveResponse.json();

        return directive;
    };

    static async editStudent({ CUIL, studentCUIL }) {
        const studentResponse = await fetch(`http://localhost:4567/student/${studentCUIL}`, { method: 'GET' });

        if (!studentResponse.ok) {
            throw new Error('Error fetching student data');
        };
  
        const coursesResponse = await fetch(`http://localhost:1234/course`, { method: 'GET' });
  
        if (!coursesResponse.ok) {
            throw new Error('Error fetching courses data');
        };
  
        const student = await studentResponse.json();
        const courses = await coursesResponse.json();

        return { student, courses };
    };

    static async editProfessor({ CUIL, professorCUIL }) {
        const professorResponse = await fetch(`http://localhost:8734/professor/${professorCUIL}`, { method: 'GET' });

        if (!professorResponse.ok) {
            throw new Error('Error fetching professor data');
        };
  
        const subjectsResponse = await fetch(`http://localhost:4321/subject`, { method: 'GET' });
  
        if (!subjectsResponse.ok) {
            throw new Error('Error fetching subjects data');
        };
  
        const professor = await professorResponse.json();
        const subjects = await subjectsResponse.json();

        return { professor, subjects };
    };

    static async editPreceptor({ CUIL, preceptorCUIL }) {
        const preceptorResponse = await fetch(`http://localhost:6534/preceptor/${preceptorCUIL}`, { method: 'GET' });

        if (!preceptorResponse.ok) {
            throw new Error('Error fetching preceptor data');
        };
  
        const coursesResponse = await fetch(`http://localhost:1234/course`, { method: 'GET' });
  
        if (!coursesResponse.ok) {
            throw new Error('Error fetching courses data');
        };
  
        const preceptor = await preceptorResponse.json();
        const courses = await coursesResponse.json();

        return { preceptor, courses };
    };
}
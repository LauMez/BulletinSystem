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

    static async getCreateStudent() {
        const coursesResponse = await fetch(`http://localhost:1234/course`, { method: 'GET' });
  
        if (!coursesResponse.ok) {
            throw new Error('Error fetching courses data');
        };

        const courses = await coursesResponse.json();

        return { courses };
    };

    static async createStudent({ data }) {
        const response = await fetch(`http://localhost:4567/student`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( data )
        })

        if (!response.ok) {
            const errorData = await response.json();
            const error = errorData.error;

            return { errorData: error, status: errorData.status };
        }

        return true;
    };

    static async getCreateProfessor() {
  
        const subjectsResponse = await fetch(`http://localhost:4321/subject`, { method: 'GET' });
  
        if (!subjectsResponse.ok) {
            throw new Error('Error fetching subjects data');
        };

        const subjects = await subjectsResponse.json();

        const availableSubjects = subjects.filter(subject => subject.impartition === null);

        return { subjects: availableSubjects };
    };

    static async createProfessor({ data }) {
        const response = await fetch(`http://localhost:8734/professor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( data )
        })

        if (!response.ok) {
            const errorData = await response.json();
            const error = errorData.error;

            return { errorData: error, status: errorData.status };
        }

        return true;
    };

    static async getCreatePreceptor() {  
        const coursesResponse = await fetch(`http://localhost:1234/course`, { method: 'GET' });
  
        if (!coursesResponse.ok) {
            throw new Error('Error fetching courses data');
        };
  
        const courses = await coursesResponse.json();

        const availableCourses = courses.filter(course => course.impartition === null);

        return { courses: availableCourses };
    };

    static async createPreceptor() {
        const response = await fetch(`http://localhost:4567/preceptor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                
            })
        })

        if (!response.ok) return null;

        return true;
    };

    static async getEditStudent({ studentCUIL }) {
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

    static async editStudent({ studentCUIL, courseID, courseGroupID }) {
        const response = await fetch(`http://localhost:1234/course/inscription/${studentCUIL}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                courseID,
                courseGroupID
            })
        });

        if (!response.ok) return null;

        return true;
    }

    static async getEditProfessor({ CUIL, professorCUIL }) {
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

        const availableSubjects = subjects.filter(subject => subject.impartition === null);

        return { professor, subjects: availableSubjects };
    };

    static async editProfessor({ professorCUIL, subjectID }) {
        const response = await fetch(`http://localhost:8734/professor/${professorCUIL}/impartition/${subjectID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) return null;

        return true;
    }

    static async getEditPreceptor({ CUIL, preceptorCUIL }) {
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

        const availableCourses = courses.filter(course => course.impartition === null);

        return { preceptor, courses: availableCourses };
    };

    static async editPreceptor({ preceptorCUIL, courseID }) {
        const response = await fetch(`http://localhost:6534/preceptor/${preceptorCUIL}/impartition/${courseID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) return null;

        return true;
    }
}
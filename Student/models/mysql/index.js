export class IndexModel {
    static async index({ CUIL }) {
        const [studentResponse, courseResponse] = await Promise.all([
            fetch(`http://localhost:4567/student/${CUIL}`),
            fetch(`http://localhost:1234/course/student/${CUIL}`)
        ]);

        if(!studentResponse.ok) {
        throw new Error('Error fetching student or course data');
        }

        const student = await studentResponse.json();
        
        if (!courseResponse.ok) return { student, subjects: null };
        
        const course = await courseResponse.json();
        
        const subjectsResponse = await fetch(`http://localhost:4321/subject/course/${course.course.courseID}/group/${course.group.courseGroupID}`);
        
        if (!subjectsResponse.ok) return { student, subjects: null };
        
        const subjects = await subjectsResponse.json();

        return { student, subjects }; 
    };

    static async profile({ CUIL }) {
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


        if(responsibles.errorMessage) responsibles = null;

        course = courseData.course || null;
        group = courseData.group || null;

        return { student, course, group, responsibles };
    };

    static async schedules({ CUIL }) {
        const courseResponse = await fetch(`http://localhost:1234/course/student/${CUIL}`);
        const course = await courseResponse.json();

        const subjectsResponse = await fetch(`http://localhost:4321/subject/course/${course.course.courseID}/group/${course.group.courseGroupID}`);
        const subjects = await subjectsResponse.json();

        if (!subjectsResponse.ok) return null;
    
        return subjects;
    }

    static async bulletin({ CUIL }) {
        const courseResponse = await fetch(`http://localhost:1234/course/student/${CUIL}`);
      
        if (!courseResponse.ok) throw new Error('Error fetching course data');
        
        const course = await courseResponse.json();
    
        const subjectsResponse = await fetch(`http://localhost:4321/subject/course/${course.course.courseID}/group/${course.group.courseGroupID}`);
    
        if (!subjectsResponse.ok) return null;
    
        const subjects = await subjectsResponse.json();

        return subjects;
    };

    static async subject({ CUIL, subjectID }) {
        const subjectResponse = await fetch(`http://localhost:4321/subject/${subjectID}`)

        if (!subjectResponse.ok) return null;

        const subject = await subjectResponse.json()

        return subject;
    };

    static async getRegister() {
        const response = await fetch('http://localhost:1234/course');
        const courses = await response.json();
        return courses;
    };
}
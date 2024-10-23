export class IndexModel {
    static async index({ CUIL }) {
        const [responsibleResponse] = await Promise.all([
            fetch(`http://localhost:6348/responsible/${CUIL}`)
        ]);

        if(!responsibleResponse.ok) {
        throw new Error('Error fetching responsible');
        }

        const responsible = await responsibleResponse.json();

        return { responsible }; 
    };

    static async profile({ CUIL }) {
        const [responsibleResponse] = await Promise.all([
            fetch(`http://localhost:6348/responsible/${CUIL}`)
        ]);

        if(!responsibleResponse.ok) {
        throw new Error('Error fetching responsible');
        }

        const responsible = await responsibleResponse.json();

        return responsible; 
    };

    static async studentProfile({ studentCUIL }) {
        const [studentResponse, courseResponse, responsiblesResponse] = await Promise.all([
            fetch(`http://localhost:4567/student/${studentCUIL}`),
            fetch(`http://localhost:1234/course/student/${studentCUIL}`),
            fetch(`http://localhost:6348/responsible/student/${studentCUIL}`)
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

    static async studentSchedules({ studentCUIL }) {
        const courseResponse = await fetch(`http://localhost:1234/course/student/${studentCUIL}`);

        if (!courseResponse.ok) throw new Error('Error fetching course data');
        
        const course = await courseResponse.json();

        const subjectsResponse = await fetch(`http://localhost:4321/subject/course/${course.course.courseID}/group/${course.group.courseGroupID}`);
        
        if (!subjectsResponse.ok) return null;
    
        const subjects = await subjectsResponse.json();

        if (!subjectsResponse.ok) return null;
    
        return subjects;
    };

    static async studentBulletin({ studentCUIL }) {
        const courseResponse = await fetch(`http://localhost:1234/course/student/${studentCUIL}`);
      
        if (!courseResponse.ok) throw new Error('Error fetching course data');
        
        const course = await courseResponse.json();
    
        const subjectsResponse = await fetch(`http://localhost:4321/subject/course/${course.course.courseID}/group/${course.group.courseGroupID}`);
    
        if (!subjectsResponse.ok) return null;
    
        const subjects = await subjectsResponse.json();

        return subjects;
    }
}
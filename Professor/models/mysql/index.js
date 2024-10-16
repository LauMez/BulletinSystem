export class IndexModel {
    static async index({ CUIL }) {
        const subjectsResponse = await fetch(`http://localhost:8734/professor/${CUIL}/subjects`);
        const subjects = await subjectsResponse.json();

        return { subjects, CUIL };
    };

    static async subject({ subjectID }) {
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

        return { subject, students, course };
    };

    static async profile({ CUIL }) {
        const professorResponse = await fetch(`http://localhost:8734/professor/${CUIL}`);

        if (!professorResponse.ok) {
            throw new Error('Error fetching professor data');
        };

        const professor = await professorResponse.json();

        return professor;
    };
}
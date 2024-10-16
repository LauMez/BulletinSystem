export class IndexModel {
    static async index({ CUIL }) {
        const preceptorResponse = await fetch(`http://localhost:6534/preceptor/${CUIL}`);
  
        if (!preceptorResponse.ok) {
            throw new Error('Error fetching preceptor data');
        };

        const preceptor = await preceptorResponse.json();

        const coursesResponse = await fetch(`http://localhost:6534/preceptor/${CUIL}/courses`);
        const courses = await coursesResponse.json();

        return { preceptor, CUIL, courses }
    };

    static async profile({ CUIL }) {
        const preceptorResponse = await fetch(`http://localhost:6534/preceptor/${CUIL}`);

        if (!preceptorResponse.ok) {
            throw new Error('Error fetching preceptor data');
        };

        const preceptor = await preceptorResponse.json();

        return preceptor;
    };

    static async course({ CUIL, courseID }) {
        const preceptorResponse = await fetch(`http://localhost:6534/preceptor/${CUIL}`);

        if (!preceptorResponse.ok) {
            throw new Error('Error fetching preceptor data');
        };

        const preceptor = await preceptorResponse.json();

        const courseResponse = await fetch(`http://localhost:6534/preceptor/${CUIL}/course/${courseID}`);
        const course = await courseResponse.json();

        return { preceptor, course };
    };
};
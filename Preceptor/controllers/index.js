export class IndexController {
    index = async (req, res) => {
        const { CUIL } = req.params;

        try {
            const preceptorResponse = await fetch(`http://localhost:6534/preceptor/${CUIL}`);
  
            if (!preceptorResponse.ok) {
                throw new Error('Error fetching preceptor data');
            };

            const preceptor = await preceptorResponse.json();

            const coursesResponse = await fetch(`http://localhost:6534/preceptor/${CUIL}/courses`);
            const coursesData = await coursesResponse.json();

            console.log(preceptor)
    
            return res.render('index', {coursesData, CUIL, preceptor});
        } catch(error) {
            console.error('Error fetching data:', error);
            return res.status(500).send('Error fetching data');
        }
    }
  
    profile = async(req, res) => {
      const { CUIL } = req.params
  
      try {
        const preceptorResponse = await fetch(`http://localhost:6534/preceptor/${CUIL}`);
  
        if (!preceptorResponse.ok) {
            throw new Error('Error fetching preceptor data');
        };
  
        const preceptor = await preceptorResponse.json();
      
        return res.render('profile', { preceptor });
          
      } catch (error) {
        console.error('Error fetching data:', error.message);
        return res.status(500).send('An error occurred while fetching data.');
      }
    }

    course = async(req, res) => {
        const { CUIL, courseID } = req.params;

        try {
            const preceptorResponse = await fetch(`http://localhost:6534/preceptor/${CUIL}`);
  
            if (!preceptorResponse.ok) {
                throw new Error('Error fetching preceptor data');
            };

            const preceptor = await preceptorResponse.json();

            const courseResponse = await fetch(`http://localhost:6534/preceptor/${CUIL}/course/${courseID}`);
            const courseData = await courseResponse.json();
            console.log(courseData);

            return res.render('course', { preceptor, courseData });
        } catch(error) {
            console.error('Error fetching data:', error);
            return res.status(500).send('Error fetching data');
        }
    };
  
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
  
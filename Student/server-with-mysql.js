import { createApp } from './app.js';

import { CourseModel } from './models/mysql/course.js';

createApp({ courseModel: CourseModel });
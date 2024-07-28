import { createApp } from './app.js';

import { StudentModel } from './models/mysql/student.js';

createApp({ studentModel: StudentModel });
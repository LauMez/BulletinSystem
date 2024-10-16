import { createApp } from './app.js';

import { StudentModel } from './models/mysql/student.js';
import { IndexModel } from './models/mysql/index.js';

createApp({ studentModel: StudentModel, indexModel: IndexModel });
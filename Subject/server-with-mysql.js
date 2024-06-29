import { createApp } from './app.js';

import { SubjectModel } from './models/mysql/subject.js';

createApp({ subjectModel: SubjectModel });
import { createApp } from './app.js';

import { ProfessorModel } from './models/mysql/professor.js';
import { IndexModel } from './models/mysql/index.js';

createApp({ professorModel: ProfessorModel, indexModel: IndexModel });
import { createApp } from './app.js';

import { ProfessorModel } from './models/mysql/professor.js';

createApp({ professorModel: ProfessorModel });
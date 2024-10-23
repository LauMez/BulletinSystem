import { createApp } from './app.js';

import { ResponsibleModel } from './models/mysql/responsible.js';
import { IndexModel } from './models/mysql/index.js';

createApp({ responsibleModel: ResponsibleModel, indexModel: IndexModel });
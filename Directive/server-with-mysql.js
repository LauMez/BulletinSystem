import { createApp } from './app.js';

import { DirectiveModel } from './models/mysql/directive.js';
import { IndexModel } from './models/mysql/index.js';

createApp({ directiveModel: DirectiveModel, indexModel: IndexModel });
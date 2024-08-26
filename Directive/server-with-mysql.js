import { createApp } from './app.js';

import { DirectiveModel } from './models/mysql/directive.js';

createApp({ directiveModel: DirectiveModel });
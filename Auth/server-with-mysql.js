import { createApp } from './app.js';

import { AuthModel } from './models/mysql/auth.js';

createApp({ authModel: AuthModel });
import { createApp } from './app.js';

import { BulletinModel } from './models/mysql/bulletin.js';

createApp({ bulletinModel: BulletinModel });
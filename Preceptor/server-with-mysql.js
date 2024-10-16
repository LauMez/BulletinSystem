import { createApp } from './app.js';

import { PreceptorModel } from './models/mysql/preceptor.js';
import { IndexModel } from './models/mysql/index.js';

createApp({ preceptorModel: PreceptorModel, indexModel: IndexModel });
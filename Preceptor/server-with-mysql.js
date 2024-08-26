import { createApp } from './app.js';

import { PreceptorModel } from './models/mysql/preceptor.js';

createApp({ preceptorModel: PreceptorModel });
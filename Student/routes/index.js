import { Router } from 'express';
import { IndexController } from '../controllers/index.js';

export const createIndexRouter = ({ indexModel }) => {
  const indexRouter = Router();

  const indexController = new IndexController({ indexModel });

  indexRouter.get('/:CUIL', indexController.index)

  indexRouter.get('/:CUIL/profile', indexController.profile)

  indexRouter.get('/:CUIL/schedules', indexController.schedules)

  indexRouter.get('/:CUIL/bulletin', indexController.bulletin)

  indexRouter.get('/:CUIL/subject/:subjectID', indexController.subject)

  indexRouter.get('/register', indexController.getRegister)
  indexRouter.post('/register', indexController.register)

  return indexRouter;
};  
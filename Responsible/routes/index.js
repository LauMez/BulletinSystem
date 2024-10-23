import { Router } from 'express';
import { IndexController } from '../controllers/index.js';

export const createIndexRouter = ({ indexModel }) => {
  const indexRouter = Router();

  const indexController = new IndexController({ indexModel });

  indexRouter.get('/:CUIL', indexController.index);

  indexRouter.get('/:CUIL/profile', indexController.profile);

  indexRouter.get('/:CUIL/profile/:studentCUIL', indexController.profileStudentInCharge);

  indexRouter.get('/:CUIL/studentProfile/:studentCUIL', indexController.studentProfile);

  indexRouter.get('/:CUIL/studentSchedules/:studentCUIL', indexController.studentSchedules);

  indexRouter.get('/:CUIL/studentBulletin/:studentCUIL', indexController.studentBulletin);

  return indexRouter;
};  
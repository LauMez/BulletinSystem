import { Router } from 'express';
import { IndexController } from '../controllers/index.js';

export const createIndexRouter = ({ indexModel }) => {
  const indexRouter = Router();

  const indexController = new IndexController({ indexModel });

  indexRouter.get('/:CUIL', indexController.index)

  indexRouter.get('/:CUIL/profile', indexController.profile);

  indexRouter.get('/:CUIL/course/:courseID', indexController.course);

  indexRouter.get('/:CUIL/logout', indexController.logout);

  return indexRouter;
};  
import { Router } from 'express';
import { IndexController } from '../controllers/index.js';

export const createIndexRouter = () => {
  const indexRouter = Router();

  const indexController = new IndexController();

  indexRouter.get('/:CUIL', indexController.index)

  indexRouter.get('/:CUIL/profile', indexController.profile);

  indexRouter.get('/:CUIL/course/:courseID', indexController.course);

  indexRouter.get('/:CUIL/logout', indexController.logout);

  return indexRouter;
};  
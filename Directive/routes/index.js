import { Router } from 'express';
import { IndexController } from '../controllers/index.js';

export const createIndexRouter = ({ indexModel }) => {
  const indexRouter = Router();

  const indexController = new IndexController({ indexModel });

  indexRouter.get('/:CUIL', indexController.index)

  indexRouter.get('/:CUIL/profile', indexController.profile);

  indexRouter.get('/:CUIL/editStudent/:studentCUIL', indexController.editStudent);
  indexRouter.get('/:CUIL/editProfessor/:professorCUIL', indexController.editProfessor);
  indexRouter.get('/:CUIL/editPreceptor/:preceptorCUIL', indexController.editPreceptor);

  indexRouter.get('/:CUIL/logout', indexController.logout);

  return indexRouter;
};  
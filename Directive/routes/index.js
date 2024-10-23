import { Router } from 'express';
import { IndexController } from '../controllers/index.js';

export const createIndexRouter = ({ indexModel }) => {
  const indexRouter = Router();

  const indexController = new IndexController({ indexModel });

  indexRouter.get('/:CUIL', indexController.index)

  indexRouter.get('/:CUIL/profile', indexController.profile);

  indexRouter.get('/:CUIL/editStudent/:studentCUIL', indexController.getEditStudent);
  indexRouter.get('/:CUIL/editProfessor/:professorCUIL', indexController.getEditProfessor);
  indexRouter.get('/:CUIL/editPreceptor/:preceptorCUIL', indexController.getEditPreceptor);

  indexRouter.patch('/:CUIL/editStudent/:studentCUIL', indexController.editStudent);
  indexRouter.patch('/:CUIL/editProfessor/:professorCUIL', indexController.editProfessor);
  indexRouter.patch('/:CUIL/editPreceptor/:preceptorCUIL', indexController.editPreceptor);

  indexRouter.delete('/:CUIL/deleteStudent/:studentCUIL', indexController.deleteStudent);
  indexRouter.delete('/:CUIL/deleteProfessor/:professorCUIL', indexController.deleteProfessor);
  indexRouter.delete('/:CUIL/deletePreceptor/:preceptorCUIL', indexController.deletePreceptor);

  indexRouter.get('/:CUIL/logout', indexController.logout);

  return indexRouter;
};  
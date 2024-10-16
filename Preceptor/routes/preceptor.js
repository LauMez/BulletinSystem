import { Router } from 'express';
import { PreceptorController } from '../controllers/preceptor.js';

export const createPreceptorRouter = ({ preceptorModel }) => {
  const preceptorRouter = Router();

  const preceptorController = new PreceptorController({preceptorModel});

  preceptorRouter.get('/', preceptorController.getAll);
  preceptorRouter.get('/:CUIL', preceptorController.getByCUIL);
  preceptorRouter.get('/dni/:DNI', preceptorController.getByDNI);

  preceptorRouter.get('/:CUIL/courses', preceptorController.getCourses);
  preceptorRouter.get('/:CUIL/course/:courseID', preceptorController.getCourse);

  preceptorRouter.get('/course/:courseID', preceptorController.getByCourse);

  preceptorRouter.get('/:CUIL/account', preceptorController.getAccount); 
  preceptorRouter.get('/register', preceptorController.getCreate);
  
  preceptorRouter.post('/', preceptorController.create); 

  preceptorRouter.delete('/:CUIL', preceptorController.delete); 

  preceptorRouter.get('/impartition/:courseID', preceptorController.getImpartitionByCourse);
  preceptorRouter.patch('/:CUIL/impartition/:courseID', preceptorController.editImpartition);

  preceptorRouter.patch('/:CUIL', preceptorController.update); 
  preceptorRouter.patch('/:CUIL/account', preceptorController.updateAccount); 
  return preceptorRouter;
};  
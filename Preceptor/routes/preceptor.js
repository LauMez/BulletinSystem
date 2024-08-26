import { Router } from 'express';
import { PreceptorController } from '../controllers/preceptor.js';

export const createPreceptorRouter = ({ preceptorModel }) => {
  const preceptorRouter = Router();

  const preceptorController = new PreceptorController({preceptorModel});

  preceptorRouter.get('/', preceptorController.getAll);
  preceptorRouter.get('/:CUIL', preceptorController.getByCUIL);
  preceptorRouter.get('/:CUIL/account', preceptorController.getAccount); 
  preceptorRouter.get('/register', preceptorController.getCreate);
  
  preceptorRouter.post('/', preceptorController.create); 

  preceptorRouter.delete('/:CUIL', preceptorController.delete); 

  preceptorRouter.patch('/:CUIL', preceptorController.update); 
  preceptorRouter.patch('/:CUIL/account', preceptorController.updateAccount); 
  return preceptorRouter;
};  
import { Router } from 'express';
import { ResponsibleController } from '../controllers/responsible.js';

export const createResponsibleRouter = ({ responsibleModel }) => {
  const responsibleRouter = Router();

  const responsibleController = new ResponsibleController({responsibleModel});

  responsibleRouter.get('/', responsibleController.getAll);
  responsibleRouter.get('/:CUIL', responsibleController.getByCUIL);
  responsibleRouter.get('/dni/:DNI', responsibleController.getByDNI);
  responsibleRouter.get('/student/:CUIL', responsibleController.getByStudentCUIL)

  responsibleRouter.get('/:CUIL/account', responsibleController.getAccount); 
  responsibleRouter.get('/register', responsibleController.getCreate);
  
  responsibleRouter.post('/', responsibleController.create); 

  responsibleRouter.delete('/:CUIL', responsibleController.delete); 

  responsibleRouter.patch('/:CUIL', responsibleController.update); 
  responsibleRouter.patch('/:CUIL/account', responsibleController.updateAccount); 
  return responsibleRouter;
};  
import { Router } from 'express';
import { DirectiveController } from '../controllers/directive.js';

export const createDirectiveRouter = ({ directiveModel }) => {
  const directiveRouter = Router();

  const directiveController = new DirectiveController({directiveModel});

  directiveRouter.get('/', directiveController.getAll);
  directiveRouter.get('/:CUIL', directiveController.getByCUIL);
  directiveRouter.get('/dni/:DNI', directiveController.getByDNI);

  directiveRouter.get('/:CUIL/account', directiveController.getAccount); 
  directiveRouter.get('/register', directiveController.getCreate);
  
  directiveRouter.post('/', directiveController.create); 

  directiveRouter.delete('/:CUIL', directiveController.delete); 

  directiveRouter.patch('/:CUIL', directiveController.update); 
  directiveRouter.patch('/:CUIL/account', directiveController.updateAccount); 
  return directiveRouter;
};  
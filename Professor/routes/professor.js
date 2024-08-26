import { Router } from 'express';
import { ProfessorController } from '../controllers/professor.js';

export const createProfessorRouter = ({ professorModel }) => {
  const professorRouter = Router();

  const professorController = new ProfessorController({professorModel});

  professorRouter.get('/', professorController.getAll);
  professorRouter.get('/:CUIL', professorController.getByCUIL);
  professorRouter.get('/:CUIL/account', professorController.getAccount); 
  professorRouter.get('/register', professorController.getCreate);
  
  professorRouter.post('/', professorController.create); 

  professorRouter.delete('/:CUIL', professorController.delete); 

  professorRouter.patch('/:CUIL', professorController.update); 
  professorRouter.patch('/:CUIL/account', professorController.updateAccount); 
  return professorRouter;
};  
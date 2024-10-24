import { Router } from 'express';
import { ProfessorController } from '../controllers/professor.js';

export const createProfessorRouter = ({ professorModel }) => {
  const professorRouter = Router();

  const professorController = new ProfessorController({professorModel});

  professorRouter.get('/', professorController.getAll);
  professorRouter.get('/:CUIL', professorController.getByCUIL);
  professorRouter.get('/dni/:DNI', professorController.getByDNI)
  professorRouter.get('/subject/:subjectID', professorController.getBySubject);

  professorRouter.get('/:CUIL/subjects', professorController.getSubjects);

  professorRouter.get('/:CUIL/account', professorController.getAccount); 
  professorRouter.get('/register', professorController.getCreate);
  
  professorRouter.post('/', professorController.create); 

  professorRouter.delete('/:CUIL', professorController.delete); 

  professorRouter.get('/impartition/:subjectID', professorController.getImpartitionBySubject);
  professorRouter.patch('/:CUIL/impartition/:subjectID', professorController.editImpartition);

  professorRouter.patch('/:CUIL', professorController.update); 
  professorRouter.patch('/:CUIL/account', professorController.updateAccount); 
  return professorRouter;
};  
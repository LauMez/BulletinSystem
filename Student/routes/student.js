import { Router } from 'express';
import { StudentController } from '../controllers/student.js';

export const createStudentRouter = ({ studentModel }) => {
  const studentRouter = Router();

  const studentController = new StudentController({studentModel});

  studentRouter.get('/', studentController.getAll);
  studentRouter.get('/:CUIL', studentController.getByCUIL);
  studentRouter.get('/:CUIL/account', studentController.getAccount); 
  studentRouter.get('/register', studentController.getCreate);
  
  studentRouter.post('/', studentController.create); 

  studentRouter.delete('/:CUIL', studentController.delete); 

  studentRouter.get('/:CUIL', studentController.getByCUIL); //

  studentRouter.get('/:CUIL/account', studentController.getAccount); //

  studentRouter.post('/', studentController.create); //

  studentRouter.delete('/:CUIL', studentController.delete); //

  studentRouter.patch('/:CUIL', studentController.update); //
  studentRouter.patch('/:CUIL/account', studentController.updateAccount); //

  studentRouter.patch('/:CUIL', studentController.update); 
  studentRouter.patch('/:CUIL/account', studentController.updateAccount); 
  return studentRouter;
};  
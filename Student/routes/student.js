import { Router } from 'express';
import { StudentController } from '../controllers/student.js';

export const createStudentRouter = ({ studentModel }) => {
  const studentRouter = Router();

  const studentController = new StudentController({studentModel});

  studentRouter.get('/', studentController.getAll); //

  studentRouter.get('/:CUIL', studentController.getByCUIL); //
  studentRouter.get('/course/:courseID', studentController.getByCourseID); //
  studentRouter.get('/course/group/:courseGroupID', studentController.getByCourseGroupID); //TODO: communication with course
  studentRouter.get('/subject/:subjectID', studentController.getBySubjectID); //TODO: communication with course

  studentRouter.get('/:CUIL/account', studentController.getAccount); //
  studentRouter.get('/:CUIL/card', studentController.getCard); //

  studentRouter.post('/', studentController.create); //
  studentRouter.post('/:CUIL/card', studentController.createCard);//
  studentRouter.post('/:CUIL/impartition', studentController.createImpartition); //

  studentRouter.delete('/:CUIL', studentController.delete); //

  studentRouter.patch('/:CUIL', studentController.update); //
  studentRouter.patch('/:CUIL/account', studentController.updateAccount); //
  studentRouter.patch('/:CUIL/card', studentController.updateCard); //
  studentRouter.patch('/:CUIL/impartition', studentController.updateImpartition); //

  return studentRouter;
};  
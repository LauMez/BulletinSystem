import { Router } from 'express';
import { CourseController } from '../controllers/course.js';

export const createCourseRouter = ({ courseModel }) => {
  const courseRouter = Router();

  const courseController = new CourseController({ courseModel });

  courseRouter.get('/', courseController.getAll);
  courseRouter.get('/:courseID', courseController.getByID);
  courseRouter.get('/student/:CUIL', courseController.getByStudent);

  courseRouter.get('/:courseID/students', courseController.getStudents);
  courseRouter.get('/group/:courseGroupID/students', courseController.getStudentsByGroup);

  courseRouter.post('/', courseController.create);
  courseRouter.patch('/:courseID', courseController.update);
  courseRouter.patch('/group/:courseGroupID', courseController.updateGroup);

  courseRouter.get('/groups', courseController.getAllGroups);
  courseRouter.get('/:courseID/groups', courseController.getGroupsByID);
  courseRouter.get('/group/:courseGroupID', courseController.getByCourseGroupID);
  courseRouter.post('/:courseID/group', courseController.createGroup);
  courseRouter.delete('/:courseID', courseController.delete);
  courseRouter.delete('/group/:courseGroupID', courseController.deleteGroup);

  courseRouter.get('/:courseID/inscription', courseController.getInscriptions);
  courseRouter.post('/:courseID/inscription', courseController.createInscription);
  courseRouter.patch('/inscription/:CUIL', courseController.editInscription);
  courseRouter.delete('/inscription/:inscriptionID', courseController.deleteInscription);

  return courseRouter;
};  
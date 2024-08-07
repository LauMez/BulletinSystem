import { Router } from 'express';
import { CourseController } from '../controllers/course.js';
import course from '../clients/course.js';

export const createCourseRouter = ({ courseModel }) => {
  const courseRouter = Router();

  const courseController = new CourseController({ courseModel });

  courseRouter.get('/', courseController.getAll);
  courseRouter.get('/groups', courseController.getAllGroups);
  courseRouter.get('/group/:courseGroupID', courseController.getByCourseGroupID);

  courseRouter.get('/:courseID', courseController.getByID);
  courseRouter.get('/:courseID/groups', courseController.getGroupsByID);
  courseRouter.get('/:courseID/group/:courseGroupID', courseController.getByGroupID);

  courseRouter.post('/', courseController.create);
  courseRouter.post('/:courseID/group', courseController.createGroup);

  courseRouter.delete('/:courseID', courseController.delete);
  courseRouter.delete('/:courseID/group/:courseGroupID', courseController.deleteGroup);

  courseRouter.patch('/:courseID', courseController.update);
  courseRouter.patch('/:courseID/group/:courseGroupID', courseController.updateGroup);

  return courseRouter;
};  
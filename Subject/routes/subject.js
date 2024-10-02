import { Router } from 'express';
import { SubjectController } from '../controllers/subject.js';

export const createSubjectRouter = ({ subjectModel }) => {
  const subjectRouter = Router();

  const subjectController = new SubjectController({ subjectModel });

  subjectRouter.get('/', subjectController.getAll);
  subjectRouter.get('/schedules', subjectController.getAllSchedules);

  subjectRouter.get('/:subjectID', subjectController.getByID);
  subjectRouter.get('/course/:courseID', subjectController.getByCourseID);
  subjectRouter.get('/course/:courseID/group/:courseGroupID', subjectController.getByCourseGroupID);
  subjectRouter.get('/:subjectID/schedules', subjectController.getSchedulesByID);

  subjectRouter.post('/', subjectController.create);
  subjectRouter.post('/:subjectID/schedule', subjectController.createSchedule);

  subjectRouter.delete('/:subjectID', subjectController.delete);
  subjectRouter.delete('/schedule/:scheduleID', subjectController.deleteSchedule);

  subjectRouter.patch('/:subjectID', subjectController.update);
  subjectRouter.patch('/schedule/:scheduleID', subjectController.updateSchedule);

  return subjectRouter;
}

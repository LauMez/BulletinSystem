import { Router } from 'express';
import { SubjectController } from '../controllers/subject.js';

export const createSubjectRouter = ({ subjectModel }) => {
  const subjectRouter = Router();

  const subjectController = new SubjectController({ subjectModel });

  subjectRouter.get('/', subjectController.getAll);
  subjectRouter.get('/schedules', subjectController.getAllSchedules);

  subjectRouter.get('/:subjectID', subjectController.getByID);
  subjectRouter.get('/:subjectID/schedules', subjectController.getSchedulesByID);
  subjectRouter.get('/:subjectID/schedule/:scheduleID', subjectController.getByScheduleID);

  subjectRouter.post('/', subjectController.create);
  subjectRouter.post('/:subjectID/schedule', subjectController.createSchedule);

  subjectRouter.delete('/:subjectID', subjectController.delete);
  subjectRouter.delete('/:subjectID/schedule/:scheduleID', subjectController.deleteSchedule);

  subjectRouter.patch('/:subjectID', subjectController.update);
  subjectRouter.patch('/:subjectID/schedule/:scheduleID', subjectController.updateSchedule);

  return subjectRouter;
}

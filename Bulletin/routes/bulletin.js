import { Router } from 'express';
import { BulletinController } from '../controllers/bulletin.js';

export const createBulletinRouter = ({ bulletinModel }) => {
  const bulletinRouter = Router();

  const bulletinController = new BulletinController({ bulletinModel });

  bulletinRouter.get('/', bulletinController.getAll);
  bulletinRouter.get('/schedules', bulletinController.getAllSchedules);

  bulletinRouter.get('/:subjectID', bulletinController.getByID);
  bulletinRouter.get('/:subjectID/schedules', bulletinController.getSchedulesByID);
  bulletinRouter.get('/:subjectID/schedule/:scheduleID', bulletinController.getByScheduleID);

  bulletinRouter.post('/', bulletinController.create);
  bulletinRouter.post('/:subjectID/schedule', bulletinController.createSchedule);

  bulletinRouter.delete('/:subjectID', bulletinController.delete);
  bulletinRouter.delete('/:subjectID/schedule/:scheduleID', bulletinController.deleteSchedule);

  bulletinRouter.patch('/:subjectID', bulletinController.update);
  bulletinRouter.patch('/:subjectID/schedule/:scheduleID', bulletinController.updateSchedule);

  return bulletinRouter;
}

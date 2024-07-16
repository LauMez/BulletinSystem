import { Router } from 'express';
import { BulletinController } from '../controllers/bulletin.js';

export const createBulletinRouter = ({ bulletinModel }) => {
  const bulletinRouter = Router();

  const bulletinController = new BulletinController({ bulletinModel });

  bulletinRouter.get('/', bulletinController.getAll);

  bulletinRouter.get('/:bulletinID', bulletinController.getByID);
  bulletinRouter.get('/CUIL/:CUIL', bulletinController.getByCUIL);
  bulletinRouter.get('/subject/:subjectID', bulletinController.getBySubjectID);

  bulletinRouter.post('/:CUIL', bulletinController.create);
  bulletinRouter.post('/:periodID/assessment', bulletinController.createAssessment);

  // bulletinRouter.delete('/:subjectID', bulletinController.delete);
  // bulletinRouter.delete('/:subjectID/schedule/:scheduleID', bulletinController.deleteSchedule);

  bulletinRouter.patch('/period/:periodID', bulletinController.updatePeriod);
  bulletinRouter.patch('/assessment/:assessmentID', bulletinController.updateAssessment);

  return bulletinRouter;
}

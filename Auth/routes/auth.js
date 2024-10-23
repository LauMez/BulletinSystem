import { Router } from 'express';
import { AuthController } from '../controllers/auth.js';

export const createAuthRouter = ({ authModel }) => {
  const authRouter = Router();

  const authController = new AuthController({authModel});

  authRouter.get('/', authController.index);
  authRouter.get('/login', authController.getLogin);
  authRouter.post('/login', authController.login);

  authRouter.get('/account/:accountID', authController.account)
  authRouter.patch('/account/:accountID', authController.updateAccount)
  authRouter.delete('/account/:accountID', authController.delete)

  authRouter.get('/change-password', authController.getChangePassword);
  authRouter.post('/change-password', authController.changePassword);

  authRouter.post('/register/account', authController.registerAccount);

  authRouter.post('/logout', authController.logout);

  return authRouter;
};  
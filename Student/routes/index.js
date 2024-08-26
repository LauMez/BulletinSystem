import { Router } from 'express';
import { IndexController } from '../controllers/index.js';

export const createIndexRouter = () => {
  const indexRouter = Router();

  const indexController = new IndexController();

  indexRouter.get('/', indexController.index)
  
  indexRouter.get('/login', indexController.getLogin)
  indexRouter.post('/login', indexController.login)

  indexRouter.get('/register', indexController.getRegister)
  indexRouter.post('/register', indexController.register)

  return indexRouter;
};  
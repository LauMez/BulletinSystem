import { SECRET_KEY } from '../config.js';
import jwt from 'jsonwebtoken'

export class AuthController {
  constructor ({ authModel }) {
    this.authModel = authModel;
  };

  index = async(req, res) => {
    const { user } = req.session;

    if (!user || !user.role) return res.redirect('/login');

    const roleRoutes = {
      student: `/student/${user.cuil}`,
      professor: `/professor/${user.cuil}`,
    };

    return res.redirect(roleRoutes[user.role] || '/login');
  };

  getLogin = async (req, res) => {
    const { user } = req.session;

    if (user) return res.redirect(user.role === 'student' ? `/student/${user.cuil}` : `/professor/${user.cuil}`);

    return res.render('login', { message: req.query.message || '' });
  };

  login = async(req, res) => {
    try {
      const { dni, password } = req.body;
  
      const user = await this.authModel.login({ dni, password });
  
      if (!user || user.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
  
      if (user.incorrectUser) return res.status(404).json({ error: user.incorrectUser });
      
      if (user.emptyPassword) return res.status(403).json({ error: user.emptyPassword, accountID: user.accountID });
  
      if (user.incorrectPassword) return res.status(404).json({ error: user.incorrectPassword });
  
      const { role, cuil } = user;
      const token = jwt.sign({ dni, cuil, role }, SECRET_KEY, { expiresIn: '1h' });

      res
        .cookie('access_token', token, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 
        })
        .json({ user, token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  logout = async(req, res) => {
    try {
      res.clearCookie('access_token').redirect('/login')
    } catch(error) {
      console.error('Error during logout:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  account = async(req, res) => {
    try {
      const { accountID } = req.params

      const account = await this.authModel.account({ accountID })
      
      if(account.error) return res.status(404).json({ error: account.error })
  
      return res.render('updateAccount', {account})
    } catch(error) {
      console.error('Error during change of password:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  updateAccount = async(req, res) => {
    const { accountID } = req.params
    const { password } = req.body
  
    try {
      const account = await this.authModel.updateAccount({ accountID, password })

      if (!account || account.length === 0) {
        return res.status(404).json({ message: 'Account not updated' });
    }

      return res.json({ message: "Account updated" })
    } catch (error) {
        console.error('Error deleting account:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  delete = async(req, res) => {
    const { accountID } = req.params;

    try {
        const account = await this.authModel.delete({ accountID });

        if (!account || account.length === 0) {
            return res.status(404).json({ message: 'Account not deleted' });
        }

        return res.json({ message: 'Account deleted' });
    } catch (error) {
        console.error('Error deleting account:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  registerAccount = async(req, res) => {
    const { DNI } = req.body;

    const user = await this.authModel.registerAccount({ DNI });

    return res.json(user);
  };
};
  
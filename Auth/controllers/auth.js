import { SECRET_KEY } from '../config.js';
import jwt from 'jsonwebtoken'

export class AuthController {
  constructor ({ authModel }) {
    this.authModel = authModel;
  };

  index = async(req, res) => {
      const { user } = req.session

      console.log(user)

      if(user) return res.render('index', { user });
      else return res.redirect('/login');
  };

  getUser = async(req, res) => {
    try {
      const { user } = req.session
      
      if(!user) return { message: 'no anda' }

      return user
    } catch {
      console.log('error capturing user')
    }
  }

  getLogin = async (req, res) => {
    return res.render('login');
  };

  login = async(req, res) => {
    const { username, password } = req.body;

    console.log(username, password);

    const login = await this.authModel.login({ username, password });
    const token = jwt.sign({ username: username, password: password }, SECRET_KEY, { expiresIn: '1h' })
    res
      .cookie('access_token', token, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60
      })
      .send({login, token})
  };

  logout = async(req, res) => {
      res.clearCookie('access_token').redirect('/login')
  }

  account = async(req, res) => {
    const { accountID } = req.params

    const account = await this.authModel.account({ accountID })

    return res.json(account)
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
  
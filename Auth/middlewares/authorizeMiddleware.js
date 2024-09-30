export const authorize = (allowedRoles) => {
    return (req, res, next) => {
      const { user } = req.session;
      
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).redirect('/login');
      }

      const url = req.originalUrl;
      let cuil;
      const match = url.match(/\/student\/(\d+)/);
      if (match && match[1]) {
        cuil = match[1];

        if(user.cuil !== cuil) { return res.redirect('/login'); }
      }
  
      next();
    };
  };
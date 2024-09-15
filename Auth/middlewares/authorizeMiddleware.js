export const authorize = (allowedRoles) => {
    return (req, res, next) => {
      const { user } = req.session;
  
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).redirect('/login');
      }
  
      next();
    };
  };
export const authorize = (allowedRoles) => {
    return (req, res, next) => {
      const { user } = req.session;
      
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).redirect('/login');
      }

      const url = req.originalUrl;
      let cuil;
      console.log('Original URL:', url); // Loggea la URL completa
      const match = url.match(/\/student\/(\d+)/); // Busca el CUIL en la URL
      if (match && match[1]) {
        cuil = match[1];
        console.log('CUIL encontrado:', cuil); // Aquí tienes el CUIL

        if(user.cuil !== cuil) { return res.redirect('/login'); }
      }
  
      next();
    };
  };
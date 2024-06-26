import jwt from 'jsonwebtoken';

export const checkRole = (roles) => {
  return (req, res, next) => {
    const token = req.header('token');
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - Missing token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const userRole = decoded.role.name;
      if (roles.includes(userRole)) {
        req.user = decoded;
        next();
      } else {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
  };
};


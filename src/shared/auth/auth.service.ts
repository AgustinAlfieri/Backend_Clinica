import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface userCredentials { email: string; password: string; }
interface payload { userId: string; role: string; iat: number; }


export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};


export const generateToken = (userId: string, role: string): string => {
  const secret = process.env.SECRET || 'sinSecret';  //hacer un get
  
  const payload :  payload = {
    userId: userId,
    role: role,
    iat: Date.now() / 1000
  };

  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export const verifyToken = (token: string): payload => {
  try {
    const secret = process.env.SECRET || 'sinSecret';
    const decoded = jwt.verify(token, secret) as payload;

    return {
      userId: decoded.userId,
      role: decoded.role,
      iat:  decoded.iat
    };
  } catch (error) {
      throw new Error('Token inválido');
  }
};
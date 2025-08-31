import { ok, err } from "neverthrow";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const decodeToken = (token) => {
  try {
    const data = jwt.verify(token, JWT_SECRET);
    return ok(data);
    
  } catch (error) {
    if (error.name === "TokenExpiredError") { 
      try {
        const data = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
        return err({ type: 'Expired', payload: data });
      } catch (inner) {
        return err({ type: 'Invalid' });
      }
    } else if (error.name === "JsonWebTokenError") {
      return err({ type: 'Invalid' });
    } else {
      return err({ type: 'Fatal' });
    }
  }
}
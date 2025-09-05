import { ObjectId } from "mongodb";

export const parseJSON = (string) => {
  try {
    return JSON.parse(string)
  } catch (error) {
    return null;
  }
}

export const parseID = (user_id) => {
  try {
    return ObjectId.createFromHexString(user_id);
  } catch (err) {
    return null;
  }
}

export const findCookie = (cookieHeader, name) => {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map(c => c.trim());
  for (const c of cookies) {
    const [key, value] = c.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
};
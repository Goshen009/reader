import { outpost } from "./outpost";

export function createUser() {
  let user = null;

  const login = async (this_email) => {
    // const url = `/.netlify/functions/login`;
    // const options = {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     email: this_email
    //   })
    // }
      
    // const response = await outpost(url, options);

    // if (response.isErr()) {
    //   return null;
    // }

    // user = response.value;
    // return user;

    user = {
      email: "canon0169@gmail.com",
      page_reached: 0
    };

    return user;
  }

  const getUser = () => user;

  const getUserEmail = () => user.email;
  const getUserPageReached = () => user.page_reached;

  return { login, getUser, getUserEmail, getUserPageReached };
}
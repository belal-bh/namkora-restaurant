"use strict";
import * as model from "./models/model";
import User, { createUser } from "./models/userModel";
import userTypes from "./models/userTypes";

const message = `Welcome to Namkora Restaurant!`;
console.log(message);

const init = () => {
  console.log(model.state);
  try {
    const admin = createUser("admin", "1234", userTypes.ADMIN);
  } catch (err) {
    console.error(` 💥💥💥 ${err}`);
    console.log(model.state.users);
  }

  try {
    const kabir = createUser("kabir", "1234", userTypes.CUSTOMER);
  } catch (err) {
    console.error(` 💥💥💥 ${err}`);
    console.log(model.state.users);
  }
};

init();

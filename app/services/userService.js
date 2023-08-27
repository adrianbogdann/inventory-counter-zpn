const {
  dbGetUsers,
  dbGetUserById,
  dbAddUser,
} = require("../repository/userRepository");

async function addUser(userPayload) {
  try {
    const user = await dbAddUser(userPayload);

    return user;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

async function getUsers() {
  try {
    const users = await dbGetUsers();
    return users;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

async function getUserById(id) {
  try {
    const user = await dbGetUserById(id);

    return user;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

module.exports = {
  addUser,
  getUsers,
  getUserById,
};

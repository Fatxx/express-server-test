const crypto = require('crypto');

const salt = crypto.randomBytes(16).toString('hex');

const setPassword = function (password) {
  // Hashing user's salt and password with 1000 iterations,
  const hash = crypto.pbkdf2Sync(
    password,
    salt,
    1000,
    64,
    'sha512',
  ).toString('hex');

  return hash;
};

// Method to check the entered password is correct or not
const validPassword = function (password, hashedPassword) {
  const hash = crypto.pbkdf2Sync(
    password,
    salt,
    1000,
    64,
    'sha512',
  ).toString('hex');
  return hashedPassword === hash;
};

module.exports = {
  setPassword,
  validPassword,
};

const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({
        email: args.userInput.email
      });
      if (existingUser) {
        throw new Error('User already exists!');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword
      });
      const result = await newUser.save();
      return {
        ...result._doc,
        password: null,
        id: result.id
      };
    } catch (err) {
      throw err;
    }
  },
  login: async ({
    email,
    password
  }) => {
    const user = await User.findOne({
      email: email
    });
    if (!user) {
      throw new Error('User does not exist!');
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      // better to use same error message for both
      throw new Error('Password is incorrect!');
    }
    const privateKey = process.env.SECRET_KEY;
    const tokenExpiration = 1; // in hours
    const token = jwt.sign({
      userId: user.id,
      email: user.email
    }, privateKey, {
      expiresIn: `${tokenExpiration}h`
    });
    return {
      userId: user.id,
      token: token,
      tokenExpiration: tokenExpiration
    };
  }
};
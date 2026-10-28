import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.SECURE,
    sameSite: process.env.SAMESITE, // same-site for both dev and prod
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  });

  return token;
};

export default generateToken;
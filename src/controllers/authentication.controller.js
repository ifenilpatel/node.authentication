import ejs from 'ejs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import db from '../models/index.js';
const { User } = db;

import { HTTP_STATUS, STATUS_CODE } from '../../constants/constant.js';

import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import sendEmail from '../../utils/emailHandler.js';

import AuthenticationDTO from '../dtos/authentication.dto.js';

export const onRegister = asyncHandler(async (req, res) => {
  const request = new AuthenticationDTO(req.body);

  const fetchData = await User.findOne({ where: { email: request.email } });
  if (fetchData) {
    throw new ApiError({ status: HTTP_STATUS.CONFLICT, statusCode: STATUS_CODE.RECORD_EXISTS, message: 'Try another email.' });
  }

  const insertData = {
    fullname: request.fullname,
    email: request.email,
    password: request.password,
  };

  const newUser = await User.create(insertData);

  const accessToken = newUser.funAccessToken();
  const refreshToken = newUser.funRefreshToken();

  newUser.refresh_token = refreshToken;
  await newUser.save();

  // send email to new user

  const templatePath = path.join(__dirname, '../../templates/welcome.ejs');
  const html = await ejs.renderFile(templatePath, { fullname: request.fullname });

  const info = await sendEmail({ to: request.email, subject: 'Welcome to Our App!', html });
  if (!info || !info.messageId) {
    console.log('Failed to send email');
  }

  const result = {
    accessToken,
    refreshToken,
    userInfo: {
      fullname: request.fullname,
      email: request.email,
    },
  };

  res.status(HTTP_STATUS.OK).json(new ApiResponse({ statusCode: STATUS_CODE.OK, message: 'User register successfully.', data: result }));
});

export const onSignIn = asyncHandler(async (req, res) => {
  const request = new AuthenticationDTO(req.body);

  const fetchData = await User.findOne({ where: { email: request.email } });
  if (!fetchData) {
    throw new ApiError({ status: HTTP_STATUS.UNAUTHORIZED, statusCode: STATUS_CODE.INVALID_CREDENTIALS, message: 'Invalid credentials.' });
  }

  const isMatch = await User.comparePassword(request.password, fetchData.password);
  if (!isMatch) {
    throw new ApiError({ statusCode: HTTP_STATUS.UNAUTHORIZED, errorCode: STATUS_CODE.INVALID_CREDENTIALS, message: 'Invalid credentials.' });
  }

  const accessToken = fetchData.funAccessToken();
  const refreshToken = fetchData.funRefreshToken();

  fetchData.refresh_token = refreshToken;
  await fetchData.save();

  const result = {
    accessToken,
    refreshToken,
    userInfo: {
      fullname: fetchData.fullname,
      email: fetchData.email,
    },
  };

  res.status(HTTP_STATUS.OK).json(new ApiResponse({ statusCode: STATUS_CODE.OK, message: 'User signed in successfully.', data: result }));
});

export const onRefreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError({ status: HTTP_STATUS.UNAUTHORIZED, statusCode: STATUS_CODE.TOKEN_EXPIRED, message: 'Invalid refresh token.' });
  }

  const fetchData = await User.findOne({ where: { user_id: decoded.user_id, refresh_token: refreshToken } });
  if (!fetchData) {
    throw new ApiError({ status: HTTP_STATUS.UNAUTHORIZED, statusCode: STATUS_CODE.UNAUTHORIZED, message: 'Refresh token not recognized.' });
  }

  const accessToken = fetchData.funAccessToken();

  const result = {
    accessToken: accessToken,
  };

  res.status(HTTP_STATUS.OK).json(new ApiResponse({ statusCode: STATUS_CODE.OK, message: 'Access token refreshed successfully.', data: result }));
});

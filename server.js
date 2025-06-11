import express from 'express';
import routes from './src/routes/index.js';

import './config/env.config.js';

import { HTTP_STATUS, STATUS_CODE } from './constants/constant.js';

import ApiError from './utils/ApiError.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

app.use((req, res, next) => {
  next(new ApiError({ status: HTTP_STATUS.NOT_FOUND, statusCode: STATUS_CODE.ROUTE_NOT_FOUND, message: 'The requested resource was not found' }));
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const statusCode = err.statusCode || 'GENRIC_ERROR';
  const message = err.message || 'Internal Server Error';
  const data = err.data || [];
  const extra = err.extra || {};

  res.status(status).json({
    statusCode,
    message,
    data,
    extra,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

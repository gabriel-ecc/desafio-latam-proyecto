import app from '../server.js';

export default (context, req) => {
  // Pass the request to the express app
  app(req, context.res);
};
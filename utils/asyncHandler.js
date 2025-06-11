const asyncHandler = (fn) => {
  return (req, res, next) => {
    try {
      const result = fn(req, res, next);
      // If it's a Promise (async), catch any errors
      if (result instanceof Promise) {
        result.catch(next);
      }
    } catch (err) {
      // Catch sync errors
      next(err);
    }
  };
};

export default asyncHandler;

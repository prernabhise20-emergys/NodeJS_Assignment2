const schemaValidator = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        throw error;
      }
      next();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
};

export { schemaValidator };

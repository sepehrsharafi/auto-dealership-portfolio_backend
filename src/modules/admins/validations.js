import Joi from "joi";

const createAdminValidator = async (req, res, next) => {
  try {
    const bodySchema = Joi.object({
      username: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9._]{3,30}$"))
        .required(),

      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9._@$%!]{5,30}$"))
        .required(),

      role: Joi.string().optional(),
    });
    const validatedBody = await bodySchema.validateAsync(req.body);
    req.validatedBody = validatedBody;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const updateAdminDataByIdValidator = async (req, res, next) => {
  try {
    const bodySchema = Joi.object({
      username: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9._]{3,30}$"))
        .optional(),

      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9._@$%!]{5,30}$"))
        .optional(),

      role: Joi.string().optional(),
    });

    const validatedBody = await bodySchema.validateAsync(req.body);

    req.validatedBody = validatedBody;

    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export { createAdminValidator, updateAdminDataByIdValidator };

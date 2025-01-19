import Joi from "joi";

export async function postTicketValidator(req, res, next) {
  try {
    const bodySchema = Joi.object({
      name: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      ticketSubject: Joi.string().required(),
      ticketBody: Joi.string().required(),
    });

    const validationBody = await bodySchema.validateAsync(req.body);
    req.validatedBody = validationBody;

    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteTicketValidator(req, res, next) {
  try {
    const paramsSchema = Joi.object({
      id: Joi.required(),
    }).required();

    const validationParams = await paramsSchema.validateAsync(req.params);
    req.validatedParams = validationParams;

    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateTicketValidator(req, res, next) {
  try {
    const paramsSchema = Joi.object({
      id: Joi.required(),
    }).required();

    const validationParams = await paramsSchema.validateAsync(req.params);
    req.validatedParams = validationParams;

    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

import Joi from "joi";
export const getCarByIdValidaitor = async (req, res, next) => {
  console.log(req.params);
  try {
    const paramsSchema = Joi.object({
      car_id: Joi.required(),
    }).required();

    const validationParams = await paramsSchema.validateAsync(req.params);
    req.validatedParams = validationParams;

    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const createCarValidator = async (req, res, next) => {
  try {
    const bodySchema = Joi.object({
      admin_id: Joi.number().integer().required(), // Foreign key admin ID
      car_id: Joi.string().required().trim().max(255), // Car-specific ID (required, max length 255)
      publish_date: Joi.date().optional(), // Publish date (required, ISO format)
      active: Joi.boolean().default(true), // Active status (boolean, default true)
      brand: Joi.string().required().trim().max(255), // Brand (required, max length 255)
      model: Joi.string().required().trim().max(255), // Model (required, max length 255)
      trim: Joi.string().trim().max(255).optional(), // Trim (optional, max length 255)
      mileage: Joi.number().integer().min(0).optional(), // Mileage (optional, non-negative)
      year_manufactured: Joi.number().integer().min(1886).required(), // Year manufactured (required, >= 1886)
      body_condition: Joi.string().trim().max(255).optional(), // Body condition (optional, max length 255)
      short_description: Joi.string().trim().optional(), // Short description (optional)
      type: Joi.string().trim().max(255).optional(), // Type (optional, max length 255)
      payment_type: Joi.string().optional(), // Payment type (optional, JSONB)
      tags: Joi.array().items(Joi.string()).optional(), // Tags (optional, array of strings)
      gearbox: Joi.string().trim().max(255).optional(), // Gearbox (optional, max length 255)
      chassis_condition: Joi.string().trim().max(255).optional(), // Chassis condition (optional, max length 255)
      engine_condition: Joi.string().trim().max(255).optional(), // Engine condition (optional, max length 255)
      exterior_color: Joi.string().trim().max(255).optional(), // Exterior color (optional, max length 255)
      interior_color: Joi.string().trim().max(255).optional(), // Interior color (optional, max length 255)
      full_description: Joi.string().trim().optional(), // Full description (optional)
    }).required();

    const validationBody = await bodySchema.validateAsync(req.body);
    req.validatedBody = validationBody;

    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const deleteCarByIdValidator = async (req, res, next) => {
  try {
    const paramsSchema = Joi.object({
      id: Joi.number().integer().positive().required(),
    });

    const validatedParams = await paramsSchema.validateAsync(req.params);
    req.validatedParams = validatedParams;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCarByIdValidator = async (req, res, next) => {
  try {
    const paramsSchema = Joi.object({
      id: Joi.number().integer().positive().required(), // car ID must be a positive integer
    });

    const bodySchema = Joi.object({
      admin_id: Joi.number().integer().optional(), // optional admin ID (foreign key)
      title: Joi.string().trim().max(255).optional(), // optional title, max length 255
      brand: Joi.string().trim().max(255).optional(), // optional brand, max length 255
      model: Joi.string().trim().max(255).optional(), // optional model, max length 255
      price: Joi.number().integer().min(0).optional(), // optional price, non-negative
      year: Joi.number().integer().min(1886).optional(), // optional year, must be >= 1886
      vin_number: Joi.string().trim().max(50).optional(), // optional VIN_number, max length 50
      mileage: Joi.number().integer().min(0).optional(), // optional mileage, non-negative
      body_type: Joi.string().trim().max(100).optional(), // optional body type, max length 100
      transmission: Joi.string().trim().max(100).optional(), // optional transmission, max length 100
      cylinder_count: Joi.number().integer().optional(), // optional cylinder count
      fuel_type: Joi.string().trim().max(100).optional(), // optional fuel type, max length 100
      exterior_color: Joi.string().trim().max(50).optional(), // optional exterior color, max length 50
      interior_color: Joi.string().trim().max(50).optional(), // optional interior color, max length 50
      chassis_condition: Joi.string().trim().max(255).optional(), // optional chassis condition, max length 255
      body_condition: Joi.string().trim().max(255).optional(), // optional body condition, max length 255
      published_at: Joi.date().optional(), // optional published_at date
      specifications: Joi.string().allow("").optional(), // optional specifications text, can be empty
      description: Joi.string().allow("").optional(), // optional description, can be empty
      active: Joi.boolean().optional(), // optional active status
    }).min(1);

    // Validate the params and body
    const validatedParams = await paramsSchema.validateAsync(req.params);
    const validatedBody = await bodySchema.validateAsync(req.body);

    // Attach the validated data to the request object
    req.validatedParams = validatedParams;
    req.validatedBody = validatedBody;

    // Proceed to the next middleware
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

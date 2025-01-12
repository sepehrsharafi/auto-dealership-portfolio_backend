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
      admin_id: Joi.number().integer().required(), // foreign key admin ID
      title: Joi.string().required().trim().max(255), // title (max length 255)
      brand: Joi.string().required().trim().max(255), // brand (max length 255)
      model: Joi.string().required().trim().max(255), // model (max length 255)
      price: Joi.number().integer().min(0).required(), // price (non-negative)
      year: Joi.number().integer().min(1886).required(), // year (must be >= 1886)
      VIN_number: Joi.string().trim().max(50), // VIN_number (max length 50)
      mileage: Joi.number().integer().min(0).optional(), // mileage (non-negative)
      Body_type: Joi.string().trim().max(100), // body type (max length 100)
      Transmission: Joi.string().trim().max(100), // transmission type (max length 100)
      cylinder_count: Joi.number().integer().optional(), // cylinder count (optional)
      Fuel_type: Joi.string().trim().max(100), // fuel type (max length 100)
      Exterior_color: Joi.string().trim().max(50), // exterior color (max length 50)
      Interior_color: Joi.string().trim().max(50), // interior color (max length 50)
      chassis_condition: Joi.string().trim().max(255), // chassis condition (max length 255)
      body_condition: Joi.string().trim().max(255), // body condition (max length 255)
      published_at: Joi.date().optional(), // published date (optional)
      Specifications: Joi.string().allow("").optional(), // specifications (text, optional)
      description: Joi.string().allow("").optional(), // description (text, optional)
      picture: Joi.string().uri().optional(), // picture (optional, valid URL)
      active: Joi.boolean().default(true), // active status (boolean, default true)
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
      picture: Joi.string().uri().optional(), // optional picture, must be a valid URI
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

import {
  getCarsByAdminIdService,
  getCarByIdService,
  createCarService,
  deleteCarByIdService,
  updateCarByIdService,
  getAllCarsService,
  getSliderService,
  getAllCarsDashboardService,
} from "../../services/cars/service.js";

export const getCarsByAdminIdController = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const data = await getCarsByAdminIdService(adminId);
    if (data === null) {
      res
        .status(404)
        .json({ message: "there is no car to show or an error happend" });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllCarsController = async (req, res) => {
  try {
    const data = await getAllCarsService();
    if (data === null) {
      res
        .status(404)
        .json({ message: "there is no car to show or an error happend" });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllCarsDashboardController = async (req, res) => {
  try {
    const data = await getAllCarsDashboardService();
    if (data === null) {
      res
        .status(404)
        .json({ message: "there is no car to show or an error happend" });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSliderController = async (req, res) => {
  try {
    const data = await getSliderService();
    if (data === null) {
      res
        .status(404)
        .json({ message: `there is no car to show or an error happend` });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getCarByIdController = async (req, res, next) => {
  try {
    const carId = req.validatedParams.car_id;
    const car = await getCarByIdService(carId);
    if (car === null) {
      res.status(404).json({
        message: `car with id=${carId} not exist`,
      });
    } else {
      res.status(200).json(car);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createCarController = async (req, res) => {
  try {
    const carDataObj = req.validatedBody;

    const createResult = await createCarService(carDataObj);
    if (createResult === null) {
      res.status(424).json({
        message: `car with title ${carDataObj.title} not created!!`,
      });
    } else {
      res.status(201).json({
        message: `car with title : ${carDataObj.title} is created`,
      });
      console.log(`car with title : ${carDataObj.title} is created`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCarByIdController = async (req, res) => {
  try {
    const carId = req.validatedParams.id;
    const deleteResult = await deleteCarByIdService(carId);
    if (deleteResult === null) {
      res.status(424).json({
        message: `car with id=${carId} not deleted!!`,
      });
    } else {
      res.status(201).json({
        message: `car with id=${carId} is deleted`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCarByIdController = async (req, res) => {
  try {
    const carId = req.validatedParams.id;
    const updateList = req.validatedBody;
    const columns = Object.keys(updateList);
    let allUpdatesSuccessful = true;

    for (const column of columns) {
      const updateResult = await updateCarByIdService(
        carId,
        column,
        updateList[column]
      );

      if (updateResult === null) {
        allUpdatesSuccessful = false;
        break;
      }
    }

    if (allUpdatesSuccessful) {
      res.status(200).json({
        message: `car with id=${carId} has been updated successfully.`,
      });
      console.log(`car with id=${carId} has been updated successfully.`);
    } else {
      res.status(400).json({
        message: `Failed to update car with id=${carId}.`,
      });
      console.log(`Failed to update car with id=${carId}.`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

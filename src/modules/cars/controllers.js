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
import { uploadFileToS3, deleteFilesInDirectory } from "../../SDKconf/sdk.js";
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
    const uploadedFiles = req.files;

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Generate a unique car_id
    const brand = carDataObj.brand.toUpperCase().substring(0, 3);
    const model = carDataObj.model.toUpperCase().substring(0, 3);
    const trim = carDataObj.trim.toUpperCase().substring(0, 3);
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    const carID = `${brand}${model}${trim}${randomNumber}`;
    carDataObj.car_id = carID;

    // Upload files to S3 and get their URLs
    const imageUrls = await Promise.all(
      uploadedFiles.map(async (file, index) => {
        try {
          const url = await uploadFileToS3(file, carID, index); // Pass carID to the upload function
          console.log(url);

          return url;
        } catch (error) {
          console.error(`Failed to upload file: ${file.originalname}`, error);
          return null;
        }
      })
    );

    // Clear failed uploads
    const validImageUrls = imageUrls.filter((url) => url !== null);

    if (validImageUrls.length === 0) {
      return res.status(400).json({ message: "Failed to upload any images" });
    }

    carDataObj.image_urls = validImageUrls;

    const createResult = await createCarService(carDataObj);

    if (createResult === null) {
      res.status(424).json({
        message: `Car not created!`,
      });
    } else {
      res.status(201).json({
        message: `Car created!`,
        data: validImageUrls,
      });
      console.log("Car created:", validImageUrls);
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
    const updateList = req.validatedBody;
    const uploadedFiles = req.files;
    const carId = req.validatedParams.car_id;
    const prevImageUrls = updateList.image_urls;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      console.log("no new images uploaded");
    }

    const columns = Object.keys(updateList);
    let allUpdatesSuccessful = true;

    // Upload files to S3 and get their URLs
    const imageUrls = await Promise.all(
      uploadedFiles.map(async (file, index) => {
        try {
          await deleteFilesInDirectory(carId, prevImageUrls);
          const url = await uploadFileToS3(file, carId, index);
          console.log(url);

          return url;
        } catch (error) {
          console.error(`Failed to upload file: ${file.originalname}`, error);
          return null;
        }
      })
    );

    const validImageUrls = imageUrls.filter((url) => url !== null);

    if (validImageUrls.length === 0) {
      return res.status(400).json({ message: "Failed to upload any images" });
    }

    updateList.image_urls = validImageUrls;

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

export const deleteCarByIdController = async (req, res) => {
  try {
    const carId = req.validatedParams.car_id;
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

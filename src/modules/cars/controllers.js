import {
  getCarsByAdminIdService,
  getCarByIdService,
  createCarService,
  deleteCarByIdService,
  updateCarByIdService,
  getAllCarsService,
  getSliderService,
  getAllCarsDashboardService,
  getCarsSoldService,
  updateCarsSoldService,
} from "../../services/cars/service.js";
import {
  uploadFileToS3,
  deleteFilesInDirectory,
  deleteFolderByCarID,
} from "../../SDKconf/sdk.js";
import compressImage from "../../core/utils/compressing/compressImage.js";

export const getCarsSoldController = async (req, res) => {
  try {
    const data = await getCarsSoldService();
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

export const updateCarsSoldController = async (req, res) => {
  try {
    const data = await updateCarsSoldService();
    if (data === null) {
      res
        .status(404)
        .json({ message: "there is no car sold to show or an error happend" });
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

    // Replace spaces and slashes in brand and model with '0'
    const sanitizeString = (str) => str.replace(/[ /]/g, "0");

    // car_id
    const brand = sanitizeString(
      carDataObj.brand.toUpperCase().substring(0, 3)
    );
    const model = sanitizeString(
      carDataObj.model.toUpperCase().substring(0, 3)
    );
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    const carID = `${brand}${model}${randomNumber}`;
    carDataObj.car_id = carID;

    const compressedFiles = await Promise.all(
      uploadedFiles.map(async (file) => {
        try {
          return await compressImage(file);
        } catch (error) {
          console.error(`Failed to compress file: ${file.originalname}`, error);
          return null;
        }
      })
    );

    const validCompressedFiles = compressedFiles.filter(
      (file) => file !== null
    );

    if (validCompressedFiles.length === 0) {
      return res.status(400).json({ message: "Failed to compress any images" });
    }

    // Upload compressed files to S3 and get their URLs
    const imageUrls = await Promise.all(
      validCompressedFiles.map(async (file) => {
        try {
          const url = await uploadFileToS3(file, carID); // Pass carID to the upload function
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
    console.log(carDataObj.images_sorted);

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
    const uploadedFiles = req.files || [];
    const carId = req.validatedParams.car_id;
    const prevImageUrls = updateList.image_urls || [];

    const columns = Object.keys(updateList);
    let allUpdatesSuccessful = true;

    let validCompressedFiles = [];
    if (uploadedFiles.length > 0) {
      const compressedFiles = await Promise.all(
        uploadedFiles.map(async (file) => {
          try {
            return await compressImage(file);
          } catch (error) {
            console.error(
              `Failed to compress file: ${file.originalname}`,
              error
            );
            return null;
          }
        })
      );

      validCompressedFiles = compressedFiles.filter((file) => file !== null);

      if (validCompressedFiles.length === 0) {
        return res
          .status(400)
          .json({ message: "Failed to compress any images" });
      }
    } else {
      console.log("No new images uploaded");
    }

    let validImageUrls = [];
    if (validCompressedFiles.length > 0) {
      const imageUrls = await Promise.all(
        validCompressedFiles.map(async (file, index) => {
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

      validImageUrls = imageUrls.filter((url) => url !== null);

      if (validImageUrls.length === 0) {
        return res.status(400).json({ message: "Failed to upload any images" });
      }
    }

    if (validImageUrls.length > 0) {
      updateList.image_urls = updateList.image_urls.concat(validImageUrls);
    }

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
        message: `Car with id=${carId} has been updated successfully.`,
      });
      console.log(`Car with id=${carId} has been updated successfully.`);
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
        message: `Car with id=${carId} not deleted!`,
      });
    } else {
      try {
        await deleteFolderByCarID(carId);
        console.log(`Folder for car with id=${carId} deleted successfully.`);
      } catch (folderError) {
        console.error(
          `Failed to delete folder for car with id=${carId}:`,
          folderError
        );
      }

      res.status(201).json({
        message: `Car with id=${carId} and associated files have been deleted.`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

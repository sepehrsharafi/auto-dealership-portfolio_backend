import {
  getCarsByAdminId,
  getCarById,
  createCar,
  deleteCarById,
  updateCarById,
  getAllCars,
  getSlider,
} from "../../models/cars/index.js";

export async function getCarsByAdminIdService(adminId) {
  const cars = await getCarsByAdminId(adminId);
  if (cars.length <= 0 || cars === null || cars === undefined) {
    return null;
  }
  return cars;
}
export async function getAllCarsService() {
  const cars = await getAllCars();
  if (cars.length <= 0 || cars === null || cars === undefined) {
    return null;
  }
  return cars;
}

export async function getSliderService() {
  const cars = await getSlider();
  if (cars.length <= 0 || cars === null || cars === undefined) {
    return null;
  }
  return cars;
}

export async function getCarByIdService(id) {
  const cars = await getCarById(id);
  if (!cars || cars.length <= 0) {
    return null;
  }
  return cars[0];
}

export async function createCarService(carDataObj) {
  const createResult = await createCar(carDataObj);
  if (
    createResult["rowCount"] <= 0 ||
    createResult === undefined ||
    createResult === null
  ) {
    return null;
  }
  return createResult;
}
export async function deleteCarByIdService(id) {
  const deleteResult = await deleteCarById(id);
  if (
    deleteResult["rowCount"] <= 0 ||
    deleteResult === undefined ||
    deleteResult === null
  ) {
    return null;
  }
  return deleteResult;
}

export async function updateCarByIdService(id, column, value) {
  const updateResult = await updateCarById(id, column, value);
  if (
    updateResult["rowCount"] <= 0 ||
    updateResult === undefined ||
    updateResult === null
  ) {
    return null;
  }
  return updateResult;
}

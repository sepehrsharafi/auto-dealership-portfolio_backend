import {
  getAdminByIdService,
  createAdminService,
  updateAdminDataByIdService,
  validateAdminLoginService,
} from "../../services/admins/service.js";
import { hash, validateHash } from "../../core/utils/encryption/index.js";
const getAdminByIdController = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    const admin = await getAdminByIdService(adminId);
    if (admin === null) {
      res.status(404).json({
        message: `admin with id=${adminId} not exist`,
      });
    } else {
      res.status(200).json(admin);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
const createAdminController = async (req, res) => {
  try {
    const { username, password, role } = req.validatedBody;
    const createResult = await createAdminService(username, password, role);
    if (createResult === null) {
      res.status(424).json({
        message: `Admin with name ${username} not created!!`,
      });
    } else {
      res.status(201).json({
        message: `Admin with Name : ${username} is created`,
      });
      console.log(`Admin with Name : ${username} is created`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateAdminDataByIdController = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const updateList = req.validatedBody;
    const columns = Object.keys(updateList);
    let allUpdatesSuccessful = true;

    for (const column of columns) {
      if (column == "password") {
        const encryptedPassword = await hash(updateList[column]);

        const updateResult = await updateAdminDataByIdService(
          adminId,
          column,
          encryptedPassword
        );

        if (updateResult === null) {
          allUpdatesSuccessful = false;
          break;
        }
      } else {
        const updateResult = await updateAdminDataByIdService(
          adminId,
          column,
          updateList[column]
        );

        if (updateResult === null) {
          allUpdatesSuccessful = false;
          break;
        }
      }
    }

    if (allUpdatesSuccessful) {
      res.status(200).json({
        message: `admin with id=${adminId} has been updated successfully.`,
      });
      console.log(`admin with id=${adminId} has been updated successfully.`);
    } else {
      res.status(400).json({
        message: `Failed to update admin with id=${adminId}.`,
      });
      console.log(`Failed to update admin with id=${adminId}.`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
const loginAdminController = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const jwt = await validateAdminLoginService(username, password);
    res.status(200).json({ jwt: jwt });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: error.message,
    });
  }
};
export {
  getAdminByIdController,
  createAdminController,
  updateAdminDataByIdController,
  loginAdminController,
};

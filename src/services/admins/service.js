import {
  getAdminById,
  createAdmin,
  updateAdminDataById,
  getAdminByUserName,
} from "../../models/admins/index.js";
import { hash, validateHash } from "../../core/utils/encryption/index.js";
import { jwtSign } from "../../core/auth/jwt-auth.js";
async function getAdminByIdService(id) {
  const admin = await getAdminById(id);
  if (!admin || admin.length <= 0) {
    return null;
  }
  return admin[0];
}
async function createAdminService(userName, password, role) {
  const encryptedPassword = await hash(password);

  const createResult = await createAdmin(userName, encryptedPassword, role);
  if (
    createResult["rowCount"] <= 0 ||
    createResult === undefined ||
    createResult === null
  ) {
    return null;
  }
  return createResult;
}

async function updateAdminDataByIdService(id, column, value) {
  const updateResult = await updateAdminDataById(id, column, value);
  if (
    updateResult["rowCount"] <= 0 ||
    updateResult === undefined ||
    updateResult === null
  ) {
    return null;
  }
  return updateResult;
}
async function validateAdminLoginService(userName, password) {
  const admin = await getAdminByUserName(userName);

  if (!admin) {
    throw new Error("Username or Password is not correct.");
  }

  const validatedHash = await validateHash(password, admin.password);
  if (!validatedHash) {
    throw new Error("Username or Password is not correct.");
  }
  const jwtAdminData = {
    id: admin.user_id,
    username: admin.username,
    role: admin.role,
  };
  const adminJwt = jwtSign(jwtAdminData);
  return adminJwt;
}

export {
  getAdminByIdService,
  createAdminService,
  updateAdminDataByIdService,
  validateAdminLoginService,
};

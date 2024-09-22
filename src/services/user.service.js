import { alertService } from "./alert.service";
import { fetchWrapper } from "@/helpers";
import { BehaviorSubject } from "rxjs";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users`;

export const userInfos =
  typeof window !== "undefined" && JSON.parse(localStorage.getItem("user"));
let userSubject = new BehaviorSubject(null);
let loginAccount =
  typeof window !== "undefined" && JSON.parse(localStorage.getItem("user"));
const roleLogin = loginAccount?.role;
if (roleLogin !== "USER" && roleLogin !== "SELLER" && roleLogin !== "TRADER") {
  logout();
} else userSubject = new BehaviorSubject(loginAccount);

export const userService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  login,
  reset,
  logout,
  register,
  getAll,
  getById,
  update,
  delete: _delete,
  getAdminById,
  updateUserPurchase,
  updateTrash,
  getAllTrashedUser,
  googleLogin,
  registerAccount
};

async function login(email, password) {
  const user = await fetchWrapper.post(`${baseUrl}/authenticate`, {
    email,
    password,
  });

  // publish user to subscribers and store in local storage to stay logged in between page refreshes
  userSubject.next(user);
  console.log("user");
  localStorage.setItem("user", JSON.stringify(user));
}

async function googleLogin(data) {
  console.log("user data", data);
  const user = await fetchWrapper.post(
    `${baseUrl}/googleAuthenticate`,
    data,
  );

  userSubject.next(user);
  console.log("user");
  localStorage.setItem("user", JSON.stringify(user));
}
async function updateUserPurchase(id, params) {
  const response = await fetchWrapper.put(
    `${baseUrl}/updateSteps/${id}`,
    params
  );
  return response;
}
async function updateTrash(id) {
  const response = await fetchWrapper.put(`${baseUrl}/trash/${id}`);
  return response;
}
async function reset(params) {
  return await fetchWrapper.post(`${baseUrl}/reset`, params);
}

function logout() {
  alertService.clear();
  // remove user from local storage, publish null to user subscribers and redirect to login page
  typeof window !== "undefined" && localStorage.removeItem("user");
  userSubject.next(null);
}

async function register(user) {
  return await fetchWrapper.post(`${baseUrl}/register`, user, false);
}
async function registerAccount(user){
  return await fetchWrapper.post(`${baseUrl}/register-account`, user, false);
}
async function getAllTrashedUser(currentPage) {
  return await fetchWrapper.get(`${baseUrl}/trash?page=${currentPage}`);
}
async function getAll(currentPage) {
  return await fetchWrapper.get(`${baseUrl}?page=${currentPage}`);
}

async function getById(id) {
  const user = await fetchWrapper.get(`${baseUrl}/${id}`);
  const data = { ...userSubject.value, ...user };
  localStorage.setItem("user", JSON.stringify(data));

  userSubject.next({ ...userSubject.value, ...user });
  return user;
}
async function getAdminById(id) {
  const user = await fetchWrapper.get(`${baseUrl}/${id}`);
  return user;
}

async function update(id, params) {
  await fetchWrapper.put(`${baseUrl}/${id}`, params);

  // update stored user if the logged in user updated their own record
  if (id === userSubject.value.id) {
    // update local storage
    const user = { ...userSubject.value, ...params };
    localStorage.setItem("user", JSON.stringify(user));

    // publish updated user to subscribers
    userSubject.next(user);
  }
}
// prefixed with underscored because delete is a reserved word in javascript
async function _delete(id) {
  const data = await fetchWrapper.delete(`${baseUrl}/${id}`);

  // auto logout if the logged in user deleted their own record
  if (id === userSubject.value.id) {
    logout();
  }
  return data;
}

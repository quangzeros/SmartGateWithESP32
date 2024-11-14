import { baseURL } from "@/baseurl";
import axios from "axios";

const instance = axios.create({
  baseURL: `${baseURL()}`,
  timeout: 10000,
  headers: { "X-Custom-Header": "foobar" },
});

export async function getLogsById(id: any) {
  try {
    let res = await instance.get(`/logs/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getLogs() {
  try {
    let res = await instance.get("/logs");
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getUserById(id: any) {
  try {
    let res = await instance.get(`/users/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getUsers() {
  try {
    let res = await instance.get("/users");
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
export async function postLogin(email: any, password: any) {
  try {
    let res = await instance.post("/users/login", {
      email: email,
      password: password,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function createUser(
  id: any,
  name: any,
  email: any,
  password: any
) {
  try {
    let res = await instance.post("/users", {
      id: id,
      name: name,
      email: email,
      password: password,
    });
    return res.data;
  } catch (err) {
    throw new Error("Người dùng đã tồn tại");
  }
}

export async function updateUser(
  id: any,
  name: any,
  state: any,
  totalAmount: any
) {
  try {
    let res = await instance.post(`/users/${id}`, {
      name: name,
      state: state,
      totalAmount: totalAmount,
    });
    return res.data;
  } catch (err) {
    throw new Error("Người dùng đã tồn tại");
  }
}

export async function deleteUser(id: any) {
  try {
    let res = await instance.delete(`/users/${id}`);
    return res.data;
  } catch (err) {
    throw new Error("Error");
  }
}

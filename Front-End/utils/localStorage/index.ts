import AsyncStorage from "@react-native-async-storage/async-storage";

export async function removeLocalStorage(key: any) {
  let data = await AsyncStorage.removeItem(key);
  return data;
}

export async function getLocalStorage(key: any) {
  let data = await AsyncStorage.getItem(key);
  return data;
}

export async function setLocalStorage(key: any, value: any) {
  await AsyncStorage.setItem(key, value);
}

import { getUserById, updateUser } from "@/networking/ApiClient";
import { useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Loading from "../loading";

const EditUser = ({ route, navigation }: any) => {
  const { userId } = route.params;
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      getUserById(userId).then((res) => {
        setUser(res);
        setName(res.name);
        setState(res.state);
        setTotalAmount(res.totalAmount.toString());
        setIsLoading(false);
      });
    }, [userId])
  );
  if (isLoading) {
    return <Loading />;
  }

  // Xử lý cập nhật thông tin người dùng
  const handleSave = () => {
    updateUser(userId, name, state, parseInt(totalAmount)).then(() => {
      navigation.navigate("UserDetail", { userId: userId }); // Quay lại màn hình trước sau khi lưu
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa thông tin người dùng</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tên:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="Nhập tên mới"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>State:</Text>
        <TextInput
          style={styles.input}
          value={state}
          onChangeText={(text) => setState(text)}
          placeholder="State"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Thanh toán:</Text>
        <TextInput
          style={styles.input}
          value={totalAmount}
          onChangeText={(text) => setTotalAmount(text)}
          placeholder="Thanh toán"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#1E90FF", // Màu xanh
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff", // Màu chữ trắng
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default EditUser;

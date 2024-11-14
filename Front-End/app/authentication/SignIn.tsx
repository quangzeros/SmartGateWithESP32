import { getUsers, postLogin } from "@/networking/ApiClient";
import { setLocalStorage } from "@/utils/localStorage";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
const SignIn = function ({ setIsSignIn, navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
    const user = await postLogin(email, password);
    if (user == undefined) {
      return;
    }
    setIsSignIn(true);
    setLocalStorage("user", JSON.stringify(user));
    // setScreen(true);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")} // Đường dẫn tới logo (đảm bảo bạn đã thêm logo vào dự án)
        style={styles.logo}
        resizeMode="contain" // Điều chỉnh kích thước logo để phù hợp
      />
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text>Forget Password?</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.signupText}> Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
  },
  logo: {
    width: 150, // Kích thước chiều rộng của logo
    height: 150, // Kích thước chiều cao của logo
    alignSelf: "center", // Căn giữa logo
    marginBottom: 20, // Khoảng cách dưới logo
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#1e90ff",
    fontWeight: "bold",
  },
});
export default SignIn;

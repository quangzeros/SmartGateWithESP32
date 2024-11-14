import { removeLocalStorage, setLocalStorage } from "@/utils/localStorage";
import React from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";

export default function Setting({ setIsSignIn, user }: any) {
  const handleLogout = async () => {
    await removeLocalStorage("user");
    setIsSignIn(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin người dùng</Text>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "../assets/images/avatar-default.png" }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>
      <Button title="Đăng xuất" onPress={handleLogout} color="#d9534f" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  email: {
    fontSize: 16,
    color: "gray",
  },
});

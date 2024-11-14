import { getUsers } from "@/networking/ApiClient";
import { useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";

const UserList = ({ navigation }: any) => {
  const [users, setUsers] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getUsers().then((res) => {
        setUsers(res);
      });
    }, [])
  );

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.userContainer}
        onPress={() => navigation.navigate("UserDetail", { userId: item._id })}
      >
        <Text style={styles.userId}>ID: {item._id}</Text>
        <Text style={styles.userName}>Tên: {item.name}</Text>
        <Text style={styles.userEmail}>Email: {item.email}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách người dùng</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
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
  userContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userId: {
    fontWeight: "bold",
    fontSize: 16,
  },
  userName: {
    fontSize: 16,
    marginTop: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});

export default UserList;

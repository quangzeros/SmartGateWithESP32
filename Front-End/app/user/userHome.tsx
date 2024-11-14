import { getLogsById, getUserById } from "@/networking/ApiClient";
import { formatCurrencyVND } from "@/utils/calculate/formatPrice";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import { baseURL } from "@/baseurl";
import { formattedDate } from "@/utils/calculate/formatDate";

const NotificationItem = ({ timeIn, timeOut }: any) => (
  <View style={styles.notificationItem}>
    <Text style={{ fontSize: 20 }}>
      Giờ vào:{" "}
      <Text style={{ fontWeight: 600 }}>{" " + formattedDate(timeIn)}</Text>
    </Text>
    <Text style={{ fontSize: 20 }}>
      Giờ ra:
      <Text style={{ fontWeight: 600 }}> {"   " + formattedDate(timeOut)}</Text>
    </Text>
  </View>
);

const UserHome = ({ userInitial }: any) => {
  const [user, setUser] = useState(userInitial);
  const [notifications, setNotifications] = useState([
    { _id: "1", timeIn: "08:00", timeOut: "17:00" },
  ]);

  useFocusEffect(
    useCallback(() => {
      getUserById(userInitial._id).then((res) => {
        setUser(res);
        getLogsById(userInitial._id).then((res) => {
          setNotifications(res);
        });
      });

      const socket = io(baseURL());

      socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
        // Gửi id của user để server biết kết nối này thuộc user nào
        socket.emit("registerUser", { id: userInitial._id });
      });

      // Lắng nghe sự kiện từ server
      socket.on("userUpdated", (data) => {
        console.log("Received data from server:", data);
        setUser(data);
      });

      socket.on("logUpdated", (data) => {
        console.log("Received data from server:", data);
        setNotifications((pre) => {
          const logId = pre.find((el) => el._id == data._id);
          if (logId) {
            pre[0] = data;
            return [...pre];
          }
          return [data, ...pre];
        });
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
      });

      return () => {
        if (socket.connected) {
          socket.disconnect();
        }
      };
    }, [userInitial])
  );

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{user?._id}</Text>

        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user?.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>

        <Text style={styles.label}>Thanh toán:</Text>
        <Text style={styles.value}>
          {formatCurrencyVND(user?.totalAmount * 1000)}
        </Text>

        <Text style={styles.label}>Status:</Text>
        <Text
          style={[
            styles.value,
            { color: user?.state == "in" ? "green" : "red" },
          ]}
        >
          {user.state == "in" ? "In" : "Out"}
        </Text>

        <Button
          title="Thanh toán"
          onPress={() => console.log("User thanh toán")}
        />
      </View>
      <View style={styles.containerLog}>
        <FlatList
          data={notifications}
          renderItem={({ item }) => <NotificationItem {...item} />}
          keyExtractor={(item) => item._id}
          style={{ flexGrow: 0 }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  containerLog: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 20,
    margin: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 50,
    marginBottom: 10,
  },
  label: {
    fontWeight: 400,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 700,
  },
  notificationItem: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default UserHome;

import { baseURL } from "@/baseurl";
import { getLogs } from "@/networking/ApiClient";
import { formattedDate } from "@/utils/calculate/formatDate";
import axios from "axios";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { View, Button, Text, StyleSheet, FlatList } from "react-native";
import { io } from "socket.io-client";

const NotificationItem = ({ timeIn, timeOut, userId }: any) => (
  <View style={styles.notificationItem}>
    <Text style={{ fontSize: 20 }}>
      UserId: <Text style={{ fontWeight: 600 }}>{userId}</Text>
    </Text>
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

const esp32Ip = "http://172.20.10.10";

const AdminHome = ({ userInitial }: any) => {
  // Quản lý trạng thái cổng, mặc định là đóng
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Hàm mở cổng
  const openGate = async () => {
    try {
      const response = await axios.get(`${esp32Ip}/open`);
      setIsGateOpen(true);
      console.log("Cổng đã được mở");
    } catch (error) {
      console.error(error);
    }
  };

  // Hàm đóng cổng
  const closeGate = async () => {
    try {
      const response = await axios.get(`${esp32Ip}/close`);
      setIsGateOpen(false);
      console.log("Cổng đã được đóng");
    } catch (error) {
      console.error(error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      axios.get(`${esp32Ip}/state`).then((res) => {
        if (res.data == "open") {
          console.log(res.data);
          setIsGateOpen(true);
        } else {
          console.log(res.data);
          setIsGateOpen(false);
        }
      });
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      getLogs().then((res) => {
        setNotifications(res);
      });

      const socket = io(baseURL());

      socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
        // Gửi id của user để server biết kết nối này thuộc user nào
        socket.emit("registerUser", {
          id: userInitial._id,
          role: userInitial.role,
        });
      });

      socket.on("logUpdated", (data) => {
        console.log("Received data from server:", data);
        setNotifications((pre) => {
          const logId = pre.find((el) => el._id == data._id);

          if (logId) {
            pre.map((el) => {
              if (el._id == data._id) {
                el.timeOut = data.timeOut;
              }
            });

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
      <View style={{ padding: 20 }}>
        {/* Hiển thị trạng thái của cổng */}
        <Text style={{ fontSize: 18, marginBottom: 20, marginTop: 50 }}>
          Trạng thái cổng:
        </Text>
        <Text
          style={[
            {
              fontSize: 32, // Tăng kích thước chữ
              fontWeight: "bold", // Nhấn mạnh chữ
              marginBottom: 50,
            },
            { color: isGateOpen == true ? "green" : "red" },
          ]}
        >
          {isGateOpen ? "Mở" : "Đóng"}
        </Text>

        {/* Nút Mở cổng */}
        <Button
          title="Mở cổng"
          onPress={openGate}
          disabled={isGateOpen} // Disable nếu cổng đã mở
        />

        {/* Khoảng cách giữa các nút */}
        <View style={{ height: 30 }} />

        {/* Nút Đóng cổng */}
        <Button
          title="Đóng cổng"
          onPress={closeGate}
          disabled={!isGateOpen} // Disable nếu cổng đã đóng
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={notifications}
          renderItem={({ item }) => <NotificationItem {...item} />}
          keyExtractor={(item) => item._id}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  notificationItem: {
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
});

export default AdminHome;

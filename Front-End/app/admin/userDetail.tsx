import { deleteUser, getLogsById, getUserById } from "@/networking/ApiClient";
import { formatCurrencyVND } from "@/utils/calculate/formatPrice";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import Loading from "../loading";
import { TouchableOpacity } from "react-native";
import { formattedDate } from "@/utils/calculate/formatDate";
import { baseURL } from "@/baseurl";
import { io } from "socket.io-client";
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
const UserDetail = ({ route, navigation }: any) => {
  const { userId } = route.params;
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    { _id: "1", timeIn: null, timeOut: null },
  ]);

  const handleDelete = async () => {
    try {
      await deleteUser(user._id);
      navigation.navigate("ListUsers");
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = () => {
    navigation.navigate("EditUser", { userId: userId });
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      getUserById(userId).then((res) => {
        setUser(res);
        setIsLoading(false);
        getLogsById(userId).then((res) => {
          setNotifications(res);
        });
      });

      const socket = io(baseURL());

      socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
        // Gửi id của user để server biết kết nối này thuộc user nào
        socket.emit("registerUser", { id: userId });
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

      socket.on("userUpdated", (data) => {
        console.log("Received data from server:", data);
        setUser(data);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
      });

      return () => {
        if (socket.connected) {
          socket.disconnect();
        }
      };
    }, [userId])
  );
  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin chi tiết người dùng</Text>

      <View style={styles.row}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{user._id}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Tên:</Text>
        <Text style={styles.value}>{user.name}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Thanh Toán:</Text>
        <Text style={styles.value}>
          {formatCurrencyVND(user.totalAmount * 1000)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>State:</Text>
        <Text style={styles.value}>{user.state == "in" ? "In" : "Out"}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.buttonText}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerLog}>
        <FlatList
          data={notifications}
          renderItem={({ item }) => <NotificationItem {...item} />}
          keyExtractor={(item) => item._id}
        />
      </View>
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
  containerLog: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 400, // Làm đậm phần label
  },
  value: {
    fontSize: 18,
    color: "black", // Màu xanh làm nổi bật
    fontWeight: "bold", // Làm đậm phần giá trị
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  editButton: {
    backgroundColor: "#1E90FF", // Màu xanh
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#FF6347", // Màu đỏ
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff", // Màu chữ trắng
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  notificationItem: {
    backgroundColor: "#fff",
    padding: 5,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default UserDetail;

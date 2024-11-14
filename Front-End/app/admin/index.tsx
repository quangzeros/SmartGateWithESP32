import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Setting from "../setting";
import AdminHome from "./adminHome";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import AddUserScreen from "./addUserScreen";
import UserList from "./listUsersScreen";
import UserDetail from "./userDetail";
import EditUser from "./editUser";

const Tab = createBottomTabNavigator();
export default function Admin({ setIsSignIn, user }: any) {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Admin"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        >
          {() => <AdminHome userInitial={user} />}
        </Tab.Screen>
        <Tab.Screen
          name="ListUsers"
          options={{
            title: "Users",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "list" : "list-outline"}
                color={color}
              />
            ),
          }}
          component={UserList}
        />

        <Tab.Screen
          name="AddUser"
          options={{
            title: "Add",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "add-circle" : "add-circle-outline"}
                color={color}
              />
            ),
          }}
          component={AddUserScreen}
        />

        <Tab.Screen
          name="Setting"
          options={{
            title: "Setting",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "settings" : "settings-outline"}
                color={color}
              />
            ),
          }}
        >
          {() => <Setting setIsSignIn={setIsSignIn} user={user} />}
        </Tab.Screen>
        <Tab.Screen
          name="UserDetail"
          options={{
            tabBarButton: () => null, // Ẩn tab này khỏi thanh điều hướng
          }}
          component={UserDetail}
        />

        <Tab.Screen
          name="EditUser"
          options={{
            tabBarButton: () => null, // Ẩn tab này khỏi thanh điều hướng
          }}
          component={EditUser}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

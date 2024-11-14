import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Setting from "../setting";
import UserHome from "./userHome";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

const Tab = createBottomTabNavigator();
export default function User({ setIsSignIn, user }: any) {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="User"
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
          {() => <UserHome userInitial={user} />}
        </Tab.Screen>
        <Tab.Screen
          name="Setting"
          options={{
            title: "Home",
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
      </Tab.Navigator>
    </NavigationContainer>
  );
}

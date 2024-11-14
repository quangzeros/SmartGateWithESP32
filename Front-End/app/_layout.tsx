import { getLocalStorage } from "@/utils/localStorage";

import { useEffect, useState } from "react";
import Loading from "./loading";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "./authentication/SignIn";

import Setting from "./setting";
import Admin from "./admin";
import User from "./user";

const Stack = createNativeStackNavigator();

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignIn, setIsSignIn] = useState(false);
  const [user, setUser] = useState({ role: "admin" });
  useEffect(() => {
    getLocalStorage("user")
      .then((res) => {
        if (res == null || res == "null" || res == undefined) {
          setIsSignIn(false);
        } else {
          const user = JSON.parse(res);
          setIsSignIn(true);
          setUser(user);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isSignIn]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isSignIn ? (
          <>
            {user.role == "admin" ? (
              <>
                <Stack.Screen name="Admin">
                  {() => <Admin setIsSignIn={setIsSignIn} user={user} />}
                </Stack.Screen>
              </>
            ) : (
              <>
                <Stack.Screen name="User">
                  {() => <User setIsSignIn={setIsSignIn} user={user} />}
                </Stack.Screen>
              </>
            )}
          </>
        ) : (
          <>
            <Stack.Screen name="SignIn">
              {() => <SignIn setIsSignIn={setIsSignIn} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from "../screens/HomeScreen";
import MovieScreen from "../screens/MovieScreen";
import PersonScreen from "../screens/PersonScreen";
import SearchScreen from "../screens/SearchScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import { useAuth } from "../hooks/useAuth";
import UpcomingScreen from "../screens/UpcomingScreen";
import TopRatedScreen from "../screens/TopRatedScreen";
import Bookmark from "../screens/Bookmark";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// export default function AppNavigation() {
//   const { user } = useAuth(); 
//   if(user) {
//     return (
//       <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Home"
//           options={{ headerShown: false }}
//           component={HomeScreen}
//         />
//         <Stack.Screen
//           name="Movie"
//           options={{ headerShown: false }}
//           component={MovieScreen}
//         />
//         <Stack.Screen
//           name="Person"
//           options={{ headerShown: false }}
//           component={PersonScreen}
//         />
//         <Stack.Screen
//           name="Search"
//           options={{ headerShown: false }}
//           component={SearchScreen}
//         />
//         <Stack.Screen
//           name="Upcoming"
//           options={{ headerShown: false }}
//           component={UpcomingScreen}  
//         />
//         <Stack.Screen
//           name="TopRated"
//           options={{ headerShown: false }}
//           component={TopRatedScreen}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>

//     )
  

function MyDrawer() {
  return (
    <Drawer.Navigator useLegacyImplementation>
      <Drawer.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
      <Drawer.Screen name="Bookmark" component={Bookmark} />
    </Drawer.Navigator>
  );
}

const HomeStack = () => {
  return (
    <Stack.Navigator>
    <Stack.Screen
      name="Home"
      options={{ headerShown: false }}
      component={HomeScreen}
    />
    <Stack.Screen
      name="Movie"
      options={{ headerShown: false }}
      component={MovieScreen}
    />
    <Stack.Screen
      name="Person"
      options={{ headerShown: false }}
      component={PersonScreen}
    />
    <Stack.Screen
      name="Search"
      options={{ headerShown: false }}
      component={SearchScreen}
    />
    <Stack.Screen
      name="Upcoming"
      options={{ headerShown: false }}
      component={UpcomingScreen}  
    />
    <Stack.Screen
      name="TopRated"
      options={{ headerShown: false }}
      component={TopRatedScreen}
    />
  </Stack.Navigator>
  );
};

export default function AppNavigation() {
  const { user } = useAuth(); 
  if(user) {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}  else {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        options={{ headerShown: false }}
        component={LoginScreen}
      />
      <Stack.Screen
        name="SignUp"
        options={{ headerShown: false }}
        component={SignUpScreen}
      />
    </Stack.Navigator>
  </NavigationContainer>
  )
}
}

import React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import MovieScreen from "../screens/MovieScreen";
import PersonScreen from "../screens/PersonScreen";
import SearchScreen from "../screens/SearchScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import GenreList from "../screens/GenreList";
import { useAuth } from "../hooks/useAuth";
import UpcomingScreen from "../screens/UpcomingScreen";
import TopRatedScreen from "../screens/TopRatedScreen";
import Bookmark from "../screens/Bookmark";
import { auth } from "../config/firebase";
import { getAuth } from "firebase/auth";
import GenreScreen from "../screens/GenreScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  const auth = getAuth();
  return (
    <Drawer.Navigator
      useLegacyImplementation
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeStack}  options={{ headerShown: false }}/>
      <Drawer.Screen name="Genres" component={GenreList}  options={{ headerShown: false }}/>
      <Drawer.Screen name="Bookmark" component={Bookmark}  options={{ headerShown: false }} />
      <Drawer.Screen name="Log Out" component={HandleLogOut}  options={{ headerShown: false }}/>
    </Drawer.Navigator>
  );
}

const HandleLogOut = () => {
  auth
    .signOut()
    .then(async () => {
      console.log("Sign out successfully");
      // Remove 'bookmarks' from AsyncStorage when logging out
      try {
        await AsyncStorage.removeItem('bookmarks');
        console.log("'bookmarks' removed from AsyncStorage");
      } catch (error) {
        console.log("Failed to remove 'bookmarks' from AsyncStorage:", error);
      }
    })
    .catch((error) => {
      console.log("Sign out failed");
    });
};

const CustomDrawerContent = (props) => {
  const { user } = useAuth();
  return (
    <DrawerContentScrollView {...props}>
      <View>
        {user && (
          <Text style={{ margin: 16, fontSize: 15 }}>
           <Text style={{fontStyle:"italic"}}> Welcome{" "}</Text>
            <Text style={{ color: "black", fontWeight: "bold" }}>
              {auth.currentUser?.email}
            </Text>
          </Text>
        )}
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
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
    <Stack.Screen
      name="Genre"
      options={{ headerShown: false }}
      component={GenreScreen}
    />
    <Stack.Screen
      name="GenreList"
      options={{ headerShown: false }}
      component={GenreList}
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

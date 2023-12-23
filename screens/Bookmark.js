import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeftIcon, XCircleIcon } from "react-native-heroicons/outline"; // Import XCircleIcon
import { styles } from "../theme";
import { fallbackMoviePoster, image185 } from "../api/moviedb";

const { width, height } = Dimensions.get("window");

export default function Bookmark({ navigation }) {
  const [bookmarks, setBookmarks] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchBookmarks = async () => {
      const storedBookmarks = await AsyncStorage.getItem("bookmarks");
      console.log("Stored Bookmarks:", storedBookmarks); // Log bookmarks for debugging
      setBookmarks(storedBookmarks ? JSON.parse(storedBookmarks) : []);
    };

    fetchBookmarks();
  }, [isFocused]);

  const navigateToMovie = (id) => {
    // Chuyển hướng đến màn hình chi tiết bộ phim
    navigation.navigate("Movie", { id });
  };

  const removeFromBookmarks = async (movieId) => {
    // Remove the movie from bookmarks
    const updatedBookmarks = bookmarks.filter((item) => item.id !== movieId);
    setBookmarks(updatedBookmarks);

    // Update AsyncStorage with the new bookmarks list
    await AsyncStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
  };

  return (
    <SafeAreaView className="bg-neutral-800 flex-1">
      <View className="flex-row items-center mx-4 mb-5">
        <TouchableOpacity
          style={styles.background}
          className="rounded-xl w-10 p-1 mr-20"
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold ml-5 ">Bookmark</Text>
      </View>
      <View>
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="flex-row justify-between items-center">
              <TouchableOpacity onPress={() => navigateToMovie(item.id)}>
                <View className="flex-row justify-start ml-2 mb-1 items-center">
                  <Image
                    source={{
                      uri: image185(item.poster_path) || fallbackMoviePoster,
                    }}
                    style={{
                      width: 50,
                      height: 75,
                      borderRadius: 5,
                      marginRight: 10,
                    }}
                  />
                  <View>
                  <Text className="text-gray-300 font-bold ml-1">
                  {item.title.length > 40
                    ? item.title.slice(0, 35) + "..."
                    : item.title}
                </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeFromBookmarks(item.id)}>
                <XCircleIcon size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
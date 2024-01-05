import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchGenresList } from "../api/moviedb";
import { ChevronLeftIcon } from "react-native-heroicons/outline"; 
import { styles } from "../theme";
import { SafeAreaView } from "react-native-safe-area-context";

const GenreList = () => {
  const [genres, setGenres] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGenres = async () => {
      const genresData = await fetchGenresList();
      setGenres(genresData);
    };

    fetchGenres();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      <View className="flex-row items-center mx-4 mb-5">
        <TouchableOpacity
          style={styles.background}
          className="rounded-xl w-10 p-1 mr-20"
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold ml-5 ">Genres</Text>
      </View>
      <View className="flex-row flex-wrap justify-center mx-4 space-x-2">
        {genres.map((genre, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              navigation.navigate("Genre", {
                genreId: genre.id,
                genreName: genre.name,
              })
            }
            className="mr-2 mb-2"
          >
            <Text className="text-white bg-neutral-700 px-3 py-1 rounded-md text-sm">
              {genre.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 30 }}>
          <Image
            source={require("../assets/images/genreSection.png")}
            style={{ height: 200, width: 200 }}
          />
        </View>
    </SafeAreaView>
  );
};

export default GenreList;

import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableWithoutFeedback,
    Dimensions,
    TouchableOpacity,
  } from "react-native";
  import React, { useCallback, useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { useNavigation } from "@react-navigation/native";
  import { fallbackMoviePoster, image185, searchMovies } from "../api/moviedb";
  import { ChevronLeftIcon } from "react-native-heroicons/outline";
  import { styles } from "../theme";




  const { width, height } = Dimensions.get("window");


  const SeeAllScreen = ({ route }) => {
    const { title, data } = route.params;
    const navigation = useNavigation();

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

        <Text className="text-white text-lg font-bold ml-5 ">{title}</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          className="space-y-3"
        >
          <View className="flex-row justify-between flex-wrap">
            {data.map((item, index) => {
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => navigation.push("Movie", item)}
                >
                  <View className="space-y-2 mb-4">
                    <Image
                      source={{
                        uri: image185(item.poster_path) || fallbackMoviePoster,
                      }}
                      className="rounded-3xl"
                      style={{ width: width * 0.44, height: height * 0.3 }}
                    />
                    <Text className="text-gray-300 ml-1">
                      {item.title.length > 22
                        ? item.title.slice(0, 22) + "..."
                        : item.title}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  export default SeeAllScreen;
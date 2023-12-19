import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { fallbackPersonImage, image185 } from "../api/moviedb";
var { width, height } = Dimensions.get("window");

export default function Cast({ cast, navigation }) {
  return (
    <View className="my-6">
      <Text className="text-white text-lg mx-4 mb-5">Top Cast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {cast &&
          cast.map((person, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate("Person", person)}
                className="mr-4 items-center"
              >
                <View className="space-y-1 mr-4">
                  <Image
                    className="rounded-3xl"
                    style={{ width: width * 0.33, height: height * 0.22 }}
                    source={{
                      uri:
                        image185(person?.profile_path) || fallbackPersonImage,
                    }}
                  />
                </View>

                <Text className="text-white text-xs mt-1">
                  {person?.character.length > 20
                    ? person.character.slice(0, 10) + "..."
                    : person?.character}
                </Text>
                <Text className="text-neutral-400 text-xs">
                  {person?.original_name.length > 20
                    ? person.original_name.slice(0, 10) + "..."
                    : person?.original_name}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
}

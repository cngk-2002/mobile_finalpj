import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { fallbackMoviePoster, image185, searchMovies } from "../api/moviedb";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { styles } from "../theme";

const { width, height } = Dimensions.get("window");

const TopRatedScreen = ({ route }) => {
  const { title, data } = route.params;
  const navigation = useNavigation();
  const itemsPerPage = 20; // Số lượng phim trên mỗi trang
  const [currentPage, setCurrentPage] = useState(1);

  // Tính chỉ mục bắt đầu và kết thúc của dữ liệu trên trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Hàm để chuyển đến trang tiếp theo
  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Hàm để chuyển đến trang trước đó
  const goToPrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
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
        <Text className="text-white text-lg font-bold ml-5 ">{title}</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        className="space-y-3"
      >
        <View className="flex-row justify-between flex-wrap">
          {currentData.map((item, index) => (
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
          ))}
        </View>
      </ScrollView>
      <View className="flex-row justify-between items-center mx-4 mt-3">
        <TouchableOpacity disabled={currentPage === 1} onPress={goToPrevPage}>
          <Text style={{ color: currentPage === 1 ? "gray" : "white" }}>
            Prev
          </Text>
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Page {currentPage}</Text>
        <TouchableOpacity
          disabled={endIndex >= data.length}
          onPress={goToNextPage}
        >
          <Text style={{ color: endIndex >= data.length ? "gray" : "white" }}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TopRatedScreen;

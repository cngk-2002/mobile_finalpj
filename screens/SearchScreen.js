import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { XMarkIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { fallbackMoviePoster, fallbackPersonImage, image185, searchMovies, searchPeople } from "../api/moviedb";
import { debounce } from "lodash";
import Loading from "../components/loading";


const { width, height } = Dimensions.get("window");

export default function SearchScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searchType, setSearchType] = useState("movies");
  const [searchText, setSearchText] = useState("");

  const handleSearch = (search) => {
    if (search && search.length > 2) {
      setLoading(true);
      searchMovies({
        query: search,
        include_adult: false,
        language: "en-US",
        page: "1",
      }).then((data) => {
        console.log("got search results");
        setLoading(false);
        if (data && data.results) setResults(data.results);
      });
    } else {
      setLoading(false);
      setResults([]);
    }
  };

  const handleActorSearch = (search) => {
    if (search && search.length > 2) {
      setLoading(true);
      searchPeople({
        query: search,
        language: "en-US",
        page: "1",
      }).then((data) => {
        console.log("got actor search results");
        setLoading(false);
        if (data && data.results) setResults(data.results);
      });
    } else {
      setLoading(false);
      setResults([]);
    }
  };

  const handleTextDebounce = useCallback(debounce(
    searchType === "movies" ? handleSearch : handleActorSearch,
    400
  ), [searchType]);

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setResults([]);
    setSearchText("");
  };

  return (
    <SafeAreaView className="bg-neutral-800 flex-1">
      <View className="mx-4 mb-3 flex-row justify-between items-center border border-neutral-500 rounded-full">
        <TextInput
          onChangeText={(text) => {
            setSearchText(text); // Update the searchText state
            handleTextDebounce(text);
          }}
          value={searchText}
          placeholder={`Search ${searchType === "movies" ? "movies" : "actors"}...`}
          placeholderTextColor={"lightgray"}
          className="pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider"
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeScreen")}
          className="rounded-full p-3 m-1 bg-neutral-500"
        >
          <XMarkIcon size="25" color="black" />
        </TouchableOpacity>
      </View>

      {/* Button or Segmented Control to switch search type */}
      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 10 }}>
        <TouchableOpacity onPress={() => handleSearchTypeChange("movies")} style={{ marginRight: 10 }}>
          <Text style={{ color: searchType === "movies" ? "white" : "gray" }}>Search Movies</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSearchTypeChange("actors")}>
          <Text style={{ color: searchType === "actors" ? "white" : "gray" }}>Search Actors</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Loading />
      ) : results.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 10 }}>
            Kết quả ({results.length})
          </Text>
          <View style={{ flexDirection: "row", flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 5 }}>
            {results.map((item, index) => {
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => {
                    if (searchType === "movies") {
                      navigation.push("Movie", item); // Điều hướng đến thông tin phim nếu đang tìm kiếm phim
                    } else {
                      navigation.push("Person", item); // Điều hướng đến thông tin diễn viên nếu đang tìm kiếm diễn viên
                    }
                  }}
                >
                  <View style={{ marginVertical: 5, marginHorizontal: 2 }}>
                    <Image
                      source={{
                        uri: searchType === "movies" ? image185(item.poster_path) || fallbackMoviePoster : image185(item.profile_path) || fallbackPersonImage, // Chọn hình ảnh tương ứng
                      }}
                      style={{ width: width * 0.44, height: height * 0.3, borderRadius: 10 }}
                    />
                    <Text style={{ color: 'lightgray', marginLeft: 5, maxWidth: 160 }}>
                      {searchType === "movies" ? (item.title.length > 22 ? item.title.slice(0, 22) + "..." : item.title) : item.name} {/* Hiển thị tên phim hoặc tên diễn viên tùy thuộc vào loại tìm kiếm */}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Image
            source={require("../assets/images/movieTime.png")}
            style={{ height: 200, width: 200 }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
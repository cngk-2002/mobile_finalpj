import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import Cast from "../components/cast";
import MovieList from "../components/movieList";
import { theme } from "../theme";
import {
  fallbackMoviePoster,
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
  image500,
  fetchMovieTrailers,
} from "../api/moviedb";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from "../components/loading";
import { fetchMovieDetailsWithRating } from "../api/moviedb";
import WebView from "react-native-webview"; // Import WebView
const ios = Platform.OS == "ios";
const topMargin = ios ? "" : "mt-3";
var { width, height } = Dimensions.get("window");

export default function MovieScreen(route) {
  const { params: item } = useRoute();
  const navigation = useNavigation();
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavourite, toggleFavourite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [isBookmarked, setBookmarked] = useState(false);

  const id = route?.params?.id || item?.id;
  const [movieDetails, setMovieDetails] = useState(null);

  const checkIfBookmarked = async (movieId) => {
    // Kiểm tra xem bộ phim có trong bookmarks không
    const bookmarks = await AsyncStorage.getItem('bookmarks');
    const parsedBookmarks = bookmarks ? JSON.parse(bookmarks) : [];
    const isBookmarked = parsedBookmarks.some((b) => b.id === movieId);
    setBookmarked(isBookmarked);
  };

  const toggleBookmark = async () => {
    // Đọc danh sách bookmark từ AsyncStorage
    let bookmarks = await AsyncStorage.getItem('bookmarks');
    bookmarks = bookmarks ? JSON.parse(bookmarks) : [];
  
    // Kiểm tra xem movie có trong bookmarks chưa
    const index = bookmarks.findIndex((b) => b.id === id);
  
    if (index !== -1) {
      // Nếu đã có trong bookmarks, loại bỏ khỏi danh sách
      bookmarks.splice(index, 1);
    } else {
      // Nếu chưa có trong bookmarks, thêm vào danh sách
      bookmarks.push(movie); // Save the entire movie object
    }
  
    // Lưu lại danh sách bookmarks mới vào AsyncStorage
    await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  
    // Cập nhật trạng thái isBookmarked
    setBookmarked(!isBookmarked);
  };

  useEffect(() => {
    const getMovieDetails = async () => {
      const data = await fetchMovieDetailsWithRating(id);
      setMovieDetails(data);
    };

    getMovieDetails();
  }, [id]);

  useEffect(() => {
    setLoading(true);
    getMovieDetails(item.id);
    getMovieCredits(item.id);
    getSimilarMovies(item.id);
    checkIfBookmarked(id);
  }, [item]);

  const getMovieDetails = async (id) => {
    const data = await fetchMovieDetails(id);
    console.log("got movie details");
    setLoading(false);
    if (data) {
      setMovie({ ...movie, ...data });
    }
  };

  const getMovieCredits = async (id) => {
    const data = await fetchMovieCredits(id);
    console.log("got movie credits");
    if (data && data.cast) {
      setCast(data.cast);
    }
  };

  const getSimilarMovies = async (id) => {
    const data = await fetchSimilarMovies(id);
    console.log("got similar movies");
    if (data && data.results) {
      setSimilarMovies(data.results);
    }
  };

  const handleWatchTrailer = async () => {
    const trailers = await fetchMovieTrailers(item.id);

    if (trailers && trailers.results && trailers.results.length > 0) {
      const trailerKey = trailers.results[0].key;
      setTrailerUrl(`https://www.youtube.com/embed/${trailerKey}`);
    } else {
      alert("No trailer found");
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      className="flex-1 bg-neutral-900"
    >
      <View className="w-full">
        <SafeAreaView
          className={`absolute z-20 w-full flex-row justify-between items-center px-4 ${topMargin}`}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "transparent",
              borderRadius: 10,
              padding: 10,
            }}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleBookmark}>
            <HeartIcon
              size="35"
              color={isBookmarked ? theme.background : "white"}
            />
          </TouchableOpacity>
        </SafeAreaView>
        {loading ? (
          <Loading />
        ) : (
          <View>
            <Image
              source={{
                uri: image500(movie.poster_path) || fallbackMoviePoster,
              }}
              style={{ width, height: height * 0.55 }}
            />
            <LinearGradient
              colors={[
                "transparent",
                "rgba(23, 23, 23, 0.8)",
                "rgba(23, 23, 23, 1)",
              ]}
              style={{ width, height: height * 0.4 }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              className="absolute bottom-0"
            />
          </View>
        )}
      </View>

      <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
        <Text className="text-white text-center text-3xl font-bold tracking-widest">
          {movie?.title} ({movie?.release_date?.split("-")[0] || "N/A"})
        </Text>
        {movieDetails && (
          <View className="flex items-center">
            <View className="bg-yellow-500 w-10 h-10 rounded-full items-center justify-center">
              <Text className="text-white font-bold">
                {movieDetails.vote_average.toFixed(1)}
              </Text>
            </View>
          </View>
        )}
        <View className="flex-row flex-wrap justify-center mx-4 space-x-2">
          {movie?.genres?.map((genre, index) => {
            return (
              <Text
                key={index}
                className="text-white bg-neutral-700 px-3 py-1 my-1 rounded-md text-sm"
              >
                {genre?.name}
              </Text>
            );
          })}
        </View>
        <TouchableOpacity
        onPress={handleWatchTrailer}
        className=" self-center py-3 px-3 bg-red-500 rounded-md"
      >
        <Text className="text-white text-base font-bold">Watch Trailer</Text>
      </TouchableOpacity>

      {/* Display WebView if trailerUrl is available */}
      {trailerUrl && (
        <View style={{ height: 300 }}>
          <WebView source={{ uri: trailerUrl }} />
        </View>
      )}

        <Text className="text-neutral-400 mx-4 tracking-wide">
          {movie?.overview}
        </Text>
      </View>
      {movie?.id && cast.length > 0 && (
        <Cast navigation={navigation} cast={cast} />
      )}
      {movie?.id && similarMovies.length > 0 && (
        <MovieList
          title={"More like this"}
          hideSeeAll={true}
          data={similarMovies}
        />
      )}
    </ScrollView>
  );
}



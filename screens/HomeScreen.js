import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import TrendingMovies from "../components/trendingMovies";
import MovieList from "../components/movieList";
import { StatusBar } from "expo-status-bar";
import {
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchUpcomingMovies,
  fetchPopularMovies,
} from "../api/moviedb";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/loading";
import { styles } from "../theme";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";


const ios = Platform.OS === "ios";

export default function HomeScreen() {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
    getPopularMovies();
  }, []);

  const getTrendingMovies = async () => {
    const data = await fetchTrendingMovies();
    console.log("got trending", data.results.length);
    if (data && data.results) setTrending(data.results);
    setLoading(false);
  };
  const getUpcomingMovies = async () => {
    const data = await fetchUpcomingMovies();
    console.log("got upcoming", data.results.length);
    if (data && data.results) setUpcoming(data.results);
  };
  const getTopRatedMovies = async () => {
    const data = await fetchTopRatedMovies();
    console.log("got top rated", data.results.length);
    if (data && data.results) setTopRated(data.results);
  };

  const getPopularMovies = async () => {
    try {
      const data = await fetchPopularMovies();
      console.log("got popular movies", data.results.length);
      if (data && data.results) setPopular(data.results);
    } catch (error) {
      console.log("error fetching popular movies: ", error);
    }
  };

  const HandleSeeAllPress = (title, data) => {
    if (title === "Top Rated") {
      navigation.navigate("TopRated", { title, data });
    } else {
      navigation.navigate("Upcoming", { title, data });
    }
  };

  return (
    <View className="flex-1 bg-neutral-800">
      <SafeAreaView className={ios ? "-mb-2" : "mb-3"}>
        <StatusBar style="light" />
        <View className="flex-row justify-between items-center mx-4">
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Bars3CenterLeftIcon size="30" strokeWidth={2} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-3xl font-bold">
            <Text style={styles.text}>M</Text>oviecon
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {trending.length > 0 && (
            <MovieList title="Trending" data={trending} hideSeeAll={true} />
          )}

          {popular.length > 0 && (
            <MovieList
              title="Popular Movies"
              data={popular}
              SeeAllPress={() =>
                HandleSeeAllPress("Popular Movies", popular)
              }
            />
          )}

          {upcoming.length > 0 && (
            <MovieList
              title="Coming Soon"
              data={upcoming}
              SeeAllPress={() => HandleSeeAllPress("Upcoming", upcoming)}
            />
          )}

          {topRated.length > 0 && (
            <MovieList
              title="Top Rated"
              data={topRated}
              SeeAllPress={() => HandleSeeAllPress("Top Rated", topRated)}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}
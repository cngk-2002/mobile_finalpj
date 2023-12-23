import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { fallbackMoviePoster, image185, fetchGenresMovie } from '../api/moviedb';

const { width, height } = Dimensions.get('window');

const GenreScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { genreId, genreName } = route.params;
  const [genreMovies, setGenreMovies] = useState([]);

  useEffect(() => {
    const fetchGenreMovies = async () => {
      const data = await fetchGenresMovie(genreId);
      setGenreMovies(data.results);
    };

    fetchGenreMovies();
  }, [genreId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
          <ChevronLeftIcon size={28} strokeWidth={2.5} color="white" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>{genreName}</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }} style={{ marginBottom: 60 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {genreMovies.map((item, index) => (
            <TouchableWithoutFeedback key={index} onPress={() => navigation.push('Movie', item)}>
              <View style={{ marginBottom: 10 }}>
                <Image
                  source={{ uri: image185(item.poster_path) || fallbackMoviePoster }}
                  style={{ width: width * 0.44, height: height * 0.3, borderRadius: 10 }}
                />
                <Text style={{ color: 'white', marginTop: 5 }}>{item.title}</Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GenreScreen;
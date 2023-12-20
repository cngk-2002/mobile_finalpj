// moviedb.js

import axios from "axios";

const apiKey = "e9aab9752d56fda1d7e53b3ad4b503b2";

// endpoints
const apiBaseUrl = "https://api.themoviedb.org/3";
const trendingMoviesEndpoint = `${apiBaseUrl}/trending/movie/day?api_key=${apiKey}`;
const upcomingMoviesEndpoint = `${apiBaseUrl}/movie/upcoming?api_key=${apiKey}`;
const topRatedMoviesEndpoint = `${apiBaseUrl}/movie/top_rated?api_key=${apiKey}`;
const searchMoviesEndpoint = `${apiBaseUrl}/search/movie?api_key=${apiKey}`;

// endpoints with dynamic params

// movie
const movieDetailsEndpoint = (id) =>
  `${apiBaseUrl}/movie/${id}?api_key=${apiKey}`;
const movieCreditsEndpoint = (id) =>
  `${apiBaseUrl}/movie/${id}/credits?api_key=${apiKey}`;
const similarMoviesEndpoint = (id) =>
  `${apiBaseUrl}/movie/${id}/similar?api_key=${apiKey}`;
const movieTrailersEndpoint = (id) =>
  `${apiBaseUrl}/movie/${id}/videos?api_key=${apiKey}`;
const popularMoviesEndpoint = `${apiBaseUrl}/movie/popular?api_key=${apiKey}`;
const movieDetailsWithRatingEndpoint = (id) =>
  `${apiBaseUrl}/movie/${id}?api_key=${apiKey}&append_to_response=credits,videos`;


// person
const personMoviesEndpoint = (id) =>
  `${apiBaseUrl}/person/${id}/movie_credits?api_key=${apiKey}`;
const personDetailsEndpoint = (id) =>
  `${apiBaseUrl}/person/${id}?api_key=${apiKey}`;
    
// functions to get images of different widths, (show images using these to improve the loading times)
export const image500 = (posterPath) =>
  posterPath ? "https://image.tmdb.org/t/p/w500" + posterPath : null;
export const image342 = (posterPath) =>
  posterPath ? "https://image.tmdb.org/t/p/w342" + posterPath : null;
export const image185 = (posterPath) =>
  posterPath ? "https://image.tmdb.org/t/p/w185" + posterPath : null;

// fallback images
export const fallbackMoviePoster =
  "https://img.myloview.com/stickers/white-laptop-screen-with-hd-video-technology-icon-isolated-on-grey-background-abstract-circle-random-dots-vector-illustration-400-176057922.jpg";
export const fallbackPersonImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmUiF-YGjavA63_Au8jQj7zxnFxS_Ay9xc6pxleMqCxH92SzeNSjBTwZ0l61E4B3KTS7o&usqp=CAU";

const apiCall = async (endpoint, params) => {
  const options = {
    method: "GET",
    url: endpoint,
    params: params ? params : {},
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log("error: ", error);
    return {};
  }
};

// home screen apis
export const fetchTrendingMovies = () => {
  return apiCall(trendingMoviesEndpoint);
};
export const fetchUpcomingMovies = async (page = 1, pageSize = 20) => {
  const params = {
    page,
    page_size: pageSize,
    api_key: apiKey,
  };

  try {
    let response = await apiCall(upcomingMoviesEndpoint, params);

    if (response.total_pages > page) {
      const nextPage1 = await apiCall(upcomingMoviesEndpoint, {
        ...params,
        page: page + 1,
      });
      response.results = response.results.concat(nextPage1.results);

      if (response.total_pages > page + 1) {
        const nextPage2 = await apiCall(upcomingMoviesEndpoint, {
          ...params,
          page: page + 2,
        });
        response.results = response.results.concat(nextPage2.results);
      }
    }

    return response;
  } catch (error) {
    console.log("error: ", error);
    return {};
  }
};

export const fetchTopRatedMovies = async (page = 1, pageSize = 20) => {
  const params = {
    page,
    page_size: pageSize,
    api_key: apiKey,
  };

  try {
    let response = await apiCall(topRatedMoviesEndpoint, params);

    if (response.total_pages > page) {
      const nextPage = await apiCall(topRatedMoviesEndpoint, {
        ...params,
        page: page + 1,
      });
      response.results = response.results.concat(nextPage.results);
    }

    return response;
  } catch (error) {
    console.log("error: ", error);
    return {};
  }
};

export const fetchPopularMovies = async (page = 1, pageSize = 20) => {
  const params = {
    page,
    page_size: pageSize,
    api_key: apiKey,
  };

  try {
    let response = await apiCall(popularMoviesEndpoint, params);

    if (response.total_pages > page) {
      const nextPage = await apiCall(popularMoviesEndpoint, {
        ...params,
        page: page + 1,
      });
      response.results = response.results.concat(nextPage.results);
    }

    return response;
  } catch (error) {
    console.log("error: ", error);
    return {};
  }
};

export const fetchMovieDetailsWithRating = (id) => {
  return apiCall(movieDetailsWithRatingEndpoint(id));
};

// movie screen apis
export const fetchMovieDetails = (id) => {
  return apiCall(movieDetailsEndpoint(id));
};
export const fetchMovieCredits = (movieId) => {
  return apiCall(movieCreditsEndpoint(movieId));
};
export const fetchSimilarMovies = (movieId) => {
  return apiCall(similarMoviesEndpoint(movieId));
};
export const fetchMovieTrailers = (movieId) => {
  return apiCall(movieTrailersEndpoint(movieId));
};

// person screen apis
export const fetchPersonDetails = (personId) => {
  return apiCall(personDetailsEndpoint(personId));
};
export const fetchPersonMovies = (personId) => {
  return apiCall(personMoviesEndpoint(personId));
};

// search screen apis
export const searchMovies = (params) => {
  return apiCall(searchMoviesEndpoint, params);
};

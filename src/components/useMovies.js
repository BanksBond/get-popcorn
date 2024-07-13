import { useEffect, useState } from "react";

const KEY = "5bdc2dda";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      callback?.();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          if (!res.ok) {
            throw new Error("Something went wrong while fetching Movies");
          }

          const data = await res.json();
          if (data.Error) {
            throw new Error(data.Error); // OMDB-specific error message
          }
          setMovies(data.Search);
        } catch (err) {
          console.error("Caught in Catch block: ", err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      const debounceTime = setTimeout(() => {
        // handleCloseMovie();
        fetchMovies();
      }, 500);

      return () => {
        clearTimeout(debounceTime);
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}

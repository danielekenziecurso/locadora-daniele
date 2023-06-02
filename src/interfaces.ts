type TMovies = {
  id: number;
  name: string;
  category: string;
  duration: number;
  price: number;
};

type TMoviesRequest = Omit<TMovies, "id">;

export { TMovies, TMoviesRequest };

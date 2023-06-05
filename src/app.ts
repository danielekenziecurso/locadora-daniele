import "dotenv/config";
import Express, { Application } from "express";
import { startDatabase } from "./database";
import {
  createMovies,
  deleteMovies,
  listMoviesId,
  listOfMovies,
  updateMovies,
} from "./logic";
import { checkMovieNameExists, ensureMovieExists } from "./middleware";

const app: Application = Express();

app.use(Express.json());

app.post("/movies", checkMovieNameExists, createMovies);

app.get("/movies", listOfMovies);

app.get("/movies/:id", ensureMovieExists, listMoviesId);

app.patch("/movies/:id", ensureMovieExists, checkMovieNameExists, updateMovies);

app.delete("/movies/:id", ensureMovieExists, deleteMovies);

const PORT: number = 3000;
const runningMsg: string = `Server running on http://localhost:${PORT}`;
app.listen(PORT, async () => {
  await startDatabase();
  console.log(runningMsg);
});

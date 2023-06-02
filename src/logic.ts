import { Request, Response } from "express";
import { client } from "./database";
import { QueryConfig, QueryResult } from "pg";
import { TMovies, TMoviesRequest } from "./interfaces";
import format from "pg-format";

const createMovies = async (req: Request, res: Response): Promise<Response> => {
  const moviesData: TMoviesRequest = req.body;

  const queryString: string = format(
    `
      INSERT INTO
        movies
        (%I)        
      VALUES
        (%L) 
        RETURNING *;
      `,
    Object.keys(moviesData),
    Object.values(moviesData)
  );

  const queryResult: QueryResult<TMovies> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const listOfMovies = async (req: Request, res: Response): Promise<Response> => {
  const category: any = req.query.category;
  let queryString: string = ``;
  let queryResult: QueryResult;

  if (category) {
    queryString = `
      SELECT * 
      FROM movies
      WHERE category = $1;
    `;
    const queryConfig: QueryConfig = {
      text: queryString,
      values: [category],
    };
    queryResult = await client.query(queryConfig);

    if (queryResult.rows.length === 0) {
      const categoriesQuery = `
        SELECT * 
        FROM movies;
      `;
      const categoriesResult = await client.query(categoriesQuery);

      return res.json(categoriesResult.rows);
    }
  } else {
    queryString = `
      SELECT * 
      FROM movies;
    `;
    queryResult = await client.query(queryString);
  }

  return res.json(queryResult.rows);
};

const listMoviesId = async (req: Request, res: Response): Promise<Response> => {
  const movie: TMovies = res.locals.movie;
  return res.json(movie);
};
const updateMovies = async (req: Request, res: Response): Promise<Response> => {
  const moviesData: Partial<TMoviesRequest> = req.body;
  const id: number = parseInt(req.params.id);
  const queryString: string = format(
    `
        UPDATE
             movies
        SET(%I) = row(%L)
        WHERE
            id = $1
       RETURNING *;
    `,
    Object.keys(moviesData),
    Object.values(moviesData)
  );
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<TMovies> = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

const deleteMovies = async (req: Request, res: Response): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString = `
        DELETE FROM
             movies 
        WHERE 
             id = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);
  return res.status(204).send();
};

export { createMovies, listOfMovies, listMoviesId, updateMovies, deleteMovies };

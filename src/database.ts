import { Client } from "pg";

const client: Client = new Client({
  user: "Daniele",
  host: "localhost",
  port: 5432,
  password: "2530",
  database: "locadora_sp2",
});

const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("Database connected");
};

export { startDatabase, client };

import { createConnection } from "typeorm";


export async function getDbConnection(){
  const conn = await createConnection();
  return conn;
}
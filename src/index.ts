import express from "express";
import { config } from "dotenv";
import { routerHandler } from "./Utils";
import db_connection from "./DB/connection";

/* dotenv */
config();
/* App */
const app: express.Application = express();
/* Port */
const port: string | number = process.env.PORT || 3000;
/* Body Parser */
app.use(express.json());
/* Routes */
routerHandler(app);
/* Database Connection */
db_connection();
/* Server */
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

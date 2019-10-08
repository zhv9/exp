import "reflect-metadata";
import {
  createConnection,
  getManager,
  Connection,
  getConnection
} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { User } from "./entity/User";
import { WorkItem } from "./entity/WorkItem";
import { getDbConnection } from "./db";
import * as path from "path";
import { movieRouter } from "./controller/movie_controller";
import { Container } from "inversify";
import { bindings } from "./inversify.config";
import { InversifyExpressServer } from "inversify-express-utils";

function registerRouters(app, routes) {
  // register express routes from defined application routes
  routes.forEach(route => {
    (app as any)[route.method](
      route.route,
      (req: Request, res: Response, next: Function) => {
        const result = new (route.controller as any)()[route.action](
          req,
          res,
          next
        );
        if (result instanceof Promise) {
          result.then(result =>
            result !== null && result !== undefined
              ? res.send(result)
              : undefined
          );
        } else if (result !== null && result !== undefined) {
          res.json(result);
        }
      }
    );
  });
}

async function addUserData(connection: Connection) {
  // insert new users for test
  await connection.manager.save(
    connection.manager.create(User, {
      firstName: "Timber",
      lastName: "Saw",
      age: 27
    })
  );

  await connection.manager.save(
    connection.manager.create(User, {
      firstName: "Phantom",
      lastName: "Assassin",
      age: 24
    })
  );

  const initWorkItem = new WorkItem();
  initWorkItem.text = "test";
  console.log(initWorkItem);

  await connection.manager.save(
    connection.manager.create(WorkItem, {
      text: "test"
    })
  );
}

(async () => {
  const port = 3000;
  const container = new Container();
  await container.loadAsync(bindings);
  const appInversify = new InversifyExpressServer(container);
  appInversify.setConfig(a => {
    a.use(bodyParser.json());
    a.use(bodyParser.urlencoded({ extended: true }));
    const appPath = path.join(__dirname, "../../public");
    a.use("/", express.static(appPath));
    a.use("/api/v1/movies", movieRouter);
    registerRouters(a, Routes);
  });
  const app = appInversify.build();

  app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
  });
  const conn = getConnection();
  addUserData(conn);
})();

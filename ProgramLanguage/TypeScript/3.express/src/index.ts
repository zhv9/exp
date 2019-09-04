import "reflect-metadata";
import { createConnection, getManager } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { User } from "./entity/User";
import { WorkItem } from "./entity/WorkItem";

createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    // insert new users for test
    await connection.manager.save(connection.manager.create(User, {
        firstName: "Timber",
        lastName: "Saw",
        age: 27
    }));
    await connection.manager.save(connection.manager.create(User, {
        firstName: "Phantom",
        lastName: "Assassin",
        age: 24
    }));

    const initWorkItem = new WorkItem();
    initWorkItem.text = 'test';
    console.log(initWorkItem);
    
    await connection.manager.save(connection.manager.create(WorkItem, {
        text: 'test'
    }));

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");

}).catch(error => console.log(error));


// createConnection().then(async connection => {
//   const app = express();
//   const router = express.Router();

//   router.get("", async (req, res, next) => {
//     const workItemRepository = getManager().getRepository(WorkItem);
//     try {
//       const workItem = workItemRepository.find({
//         order: {
//           createdAt: "DESC"
//         }
//       });
//     } catch (error) {
//       next(error);
//     }
//   });

//   router.post("", async (req, res, next) => {
//     const workItem = new WorkItem();
//     workItem.text = req.body.text;
//     const workItemRepository = getManager().getRepository(WorkItem);
//     try {
//       res.json(await workItemRepository.save(workItem));
//     } catch (error) {
//       next(error);
//     }
//   });

//   app.use("/work-item", router);
//   app.use(bodyParser.json());

//   app.listen(3001);
// });

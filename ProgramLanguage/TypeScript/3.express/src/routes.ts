import { UserController } from "./controller/UserController";
import { CheckListController } from "./controller/CheckListController";

export const Routes = [
  {
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all"
  },
  {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one"
  },
  {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
  },
  {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
  },
  {
    method: "get",
    route: "/work-items",
    controller: CheckListController,
    action: "all"
  },
  {
    method: "post",
    route: "/work-items",
    controller: CheckListController,
    action: "save"
  },
  {
    method: "put",
    route: "/work-items/:id",
    controller: CheckListController,
    action: "change"
  },
  {
    method: "delete",
    route: "/work-items/:id",
    controller: CheckListController,
    action: "remove"
  },

];

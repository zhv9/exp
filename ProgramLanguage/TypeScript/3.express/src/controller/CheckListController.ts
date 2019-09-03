import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { WorkItem } from "../entity/WorkItem";

export class CheckListController {
  private userRepository = getRepository(WorkItem);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find({ order: { createdAt: "DESC" } });
  }

  async change(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.update(request.params.id, {
      isChecked: request.body.isChecked
    });
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const workItem = new WorkItem();
    console.log(request.body);
    
    workItem.text = request.body.text;
    return this.userRepository.save(workItem);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let userToRemove = await this.userRepository.findOne(request.params.id);
    await this.userRepository.remove(userToRemove);
  }
}

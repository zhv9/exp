import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class WorkItem {
  @PrimaryGeneratedColumn()
  public id: number;
  @Column({
    length: 100
  })
  public text: string;
  @Column({ default: false })
  public isChecked: boolean;
  @CreateDateColumn({ type: "datetime" })
  public createdAt: Date;
  @UpdateDateColumn({ type: "datetime" })
  public updateAt: Date;
}

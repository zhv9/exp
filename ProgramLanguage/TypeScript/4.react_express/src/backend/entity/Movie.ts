import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  public id!: string;
  @Column()
  public title!: string;
  @Column()
  public year!: number;
}

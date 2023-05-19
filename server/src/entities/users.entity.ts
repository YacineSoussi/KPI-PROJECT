import { Role } from "src/authentication/authentication.enum";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class User {
 @PrimaryGeneratedColumn("uuid")
 public id: string;

 @Column()
 public email: string;

 @Column()
 public password: string;

 @Column({
      unique: true,
      nullable: true
 })
 public apiKey: string;

 @Column({
      unique: true,
      nullable: true
 })
 public secretKey: string;

 @Column()
 public url: string;

 @Column({
    type: "enum",
    enum: Role,
   default: Role.USER
    })
 public role: Role;

}
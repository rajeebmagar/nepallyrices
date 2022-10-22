import { Image } from "../../shared-models/image";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  middleName: string;
  gender: string;
  dateOfBirth: string;
  password: string;
  profilePicture: Image;
}

export class User implements IUser {
  public id: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public userName: string;
  public middleName: string;
  public gender: string;
  public dateOfBirth: string;
  public password: string;
  public roles: Array<string>;
  public profilePicture: Image;
  public isEditor(): boolean {
    if (this.roles) {
      return (
        this.roles.filter((role) => role.toLowerCase() === "editor").length > 0
      );
    }
    return false;
  }
}

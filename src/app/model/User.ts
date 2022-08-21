export class User {

  id! : number
  name! : String

  static fromHttp(user : User) : User {
const newUser = new User();
newUser.name = user.name;
newUser.id = user.id;
return newUser;
  }
}

export class User {
  _id?: any; 
  username!: string;
  email!: string;
  password?: string;
  role!: string; 

  constructor(data?: Partial<User>) {
    if (data) {
      this._id = data._id;
      this.username = data.username || '';
      this.email = data.email || '';
      this.password = data.password;
      this.role = data.role || 'user'; 
    }
  }
}

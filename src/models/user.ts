import fetch from 'node-fetch';
import { AddressSchema } from './schemas'
import { CompanySchema } from './schemas'
import Model from './model';
import Album from './album';
import dotenv from 'dotenv'
dotenv.config()

enum RelationType {
  BelongsTo = 'belongsTo',
  HasMany = 'hasMany',
}


class User extends Model {
  name: string;
  username: string;
  albums: Album[];

  static config = {
    endpoint: process.env.API_URL + "user",
    relations: {album:{type: RelationType.HasMany, model: Album, foreignKey: "userId"}}
  }

  constructor(user: {id: number, name: string, username: string, albums: Album[]}) {
      super(user)
      this.name = user.name;
      this.username = user.username;
      this.albums = user.albums
  }
}

export default User;

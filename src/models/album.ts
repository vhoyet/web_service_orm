import fetch, { Response } from 'node-fetch';
import User from './user'
import Photo from './photo'
import Model from './model'
import dotenv from 'dotenv'
dotenv.config()

enum RelationType {
  BelongsTo = 'belongsTo',
  HasMany = 'hasMany',
}

class Album extends Model{
  title: string
  userId: number
  user: User
  photos: Photo[]

  static config = {
    endpoint: process.env.API_URL + "album",
    relations: {
      user: {
        type: RelationType.BelongsTo,
        model: User,
        foreignKey: "userId"
      }, 
      photo: {
        type: RelationType.HasMany,
        model: Photo,
        foreignKey: "albumId"
      }
    }
  }

  constructor(album: {id: number, title: string, userId: number, photos: Photo[], user: User}) {
      super(album)
      this.title = album.title
      this.userId = album.userId
      this.user = album.user
      this.photos = album.photos
  }

}

export default Album;

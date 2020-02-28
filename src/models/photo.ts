import fetch from 'node-fetch';
import Model from './model';
import Album from './album';
import dotenv from 'dotenv'
dotenv.config()

enum RelationType {
  BelongsTo = 'belongsTo',
  HasMany = 'hasMany',
}

class Photo extends Model{
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;


  static config = {
    endpoint: process.env.API_URL + "photo",
    relations: {album:{type: RelationType.BelongsTo, model: Album, foreignKey: "albumId"}}
  }

  constructor(photo: {id: number, albumId: number, title: string, url: string, thumbnailUrl: string}) {
      super(photo);
      this.albumId = photo.albumId;
      this.title = photo.title;
      this.url = photo.url;
      this.thumbnailUrl = photo.thumbnailUrl

  }

}

export default Photo;

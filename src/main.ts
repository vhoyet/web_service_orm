import Album from './models/album'
import Photo from './models/photo'
import dotenv from 'dotenv'
dotenv.config()

async function run() {
  //const album = await Album.findById<Album>(1, { includes: ['user', 'photo'] })
  const album = await Album.find<Album>()
  console.log(album)
  /*const album2 = new Album(3, "yollooooow")
  const postAlbum = await Album.create(album2)
  console.log(postAlbum)*/
  //console.log(await Album.updateById({id: 2, title: "DraCoolooooos"}))
  
  debugger
}

run().catch((err) => {
  console.error(err)
})

import { NonFunctionKeys } from 'utility-types';
import Axios from 'axios';
import dotenv from 'dotenv'
dotenv.config()

type SchemaOf<T extends object> = Pick<T, NonFunctionKeys<T>>;

enum QueryFilterOrder {
  Asc = 'asc',
  Desc = 'desc',
}

interface QueryFilter {
  where?: Record<string, any>
  limit?: number,
  page?: number,
  sort?: string,
  order?: QueryFilterOrder,
}

interface FindByIdOptions {
  includes: string[],
}

type ModelIdType = number | string;

enum RelationType {
  BelongsTo = 'belongsTo',
  HasMany = 'hasMany',
}

/**
 * Define the configuration of a relation
 */
interface Relation {
  /** Type of the relation: hasMany, belongsTo, ... */
  type: RelationType,

  /** The target Model */
  model: any,

  /**
   * The key containing the relation link
   * - on the target model if hasMany
   * - on the current model if belongsTo
   */
  foreignKey: string,
}

interface ModelConfig {
  /**
   * The endpoint on the remote API, example 'users'
   */
  endpoint: string,

  /**
   * The definition of the relations
   */
  relations?: Record<string, Relation>,
}

class Model {
  protected static config: ModelConfig;

  id: string | number;

  constructor(model: {id: number}) {
    this.id = model.id;
  }

  static async create<T extends Model>(dataOrModel: SchemaOf<T> | T): Promise<T> {
    let model
    try {
      let response = await Axios.post(this.config.endpoint, dataOrModel)
      model = response.data
      model = new this(model)
    } catch (error) {
      console.log(error)
    }

    return model
  }
  
  static async find<T extends Model>(filter?: QueryFilter): Promise<T[]> {
    let models
    try {
      if(!filter){
        let response = await Axios.get(this.config.endpoint)
        models = response.data
      } else {
        let query = this.config.endpoint + "?"
        let atLeastOneFilter = false
        for(let [key, value] of Object.entries(filter)){
          if(value){
            atLeastOneFilter = true;
            if(key == "where"){
              for(let [keyWhere, valueWhere] of Object.entries(value)){
                query += key + "=" + value + '&'
              }
            } else {
              query += key + "=" + value + '&'
            }
          }
        }
        query = atLeastOneFilter ? query.substring(0, query.length - 1) : query
        let response = await Axios.get(query)
        models = response.data
      }
      let l = models.length
      for(let i = 0 ; i < l ; i++) {
        models[i] = new this(models[i])
      }
    } catch (error) {
      console.log(error)
    }
    
    return models
  }
  
  static async findById<T extends Model>(id: ModelIdType, options?: FindByIdOptions): Promise<T> {
    let model
    try {
      let response = await Axios.get(this.config.endpoint + "/" + id)
      model = response.data
      if(options && this.config.relations){
        let l = options.includes.length
        let relation
        let allModels
        let belongsToModels
        let hasManyModel
        for(let i = 0 ; i < l ; i++) {
          relation = this.config.relations[options.includes[i]]
          if(relation.type == 'belongsTo'){
            response = await Axios.get(process.env.API_URL + options.includes[i] + '/' + model[relation.foreignKey])
            hasManyModel = new relation.model(response.data)
            model[options.includes[i]] = hasManyModel
          } else if(relation.type == 'hasMany') {
            response = await Axios.get(process.env.API_URL + options.includes[i])
            allModels = response.data
            belongsToModels = new Array()
            let length = allModels.length
            for(let i = 0 ; i < length ; i++) {
              if(allModels[i][relation.foreignKey] === model.id)
                belongsToModels.push( new relation.model(allModels[i]) )
            }
            model[options.includes[i] + "s"] = belongsToModels
          }  
        }
      }
      model = new this(model)
    } catch (error) {
      console.error(error)
    }
    return model
  }

  static async updateById<T extends Model>(id: ModelIdType | T, data?: Partial<SchemaOf<T>>): Promise<T> {
    let model
    let response
    try {
      if(typeof id === "string" || typeof id === "number")
        response = await Axios.patch(this.config.endpoint + "/" + id, data)
      else{
        response = await Axios.patch(this.config.endpoint + "/" + id.id, id)
      }
      model = response.data
      model = new this(model)
    } catch (error) {
      console.error(error)
    }
    return model
  }

  static async deleteById(id: ModelIdType): Promise<boolean> {
    try {
      return await Axios.delete(this.config.endpoint + "/" + id)
    } catch (error) {
      console.error(error)
    }
    return false
  }

  /**
   * Push changes that has occured on the instance
   */
  //save<T extends Model>(): Promise<T>;

  /**
   * Push given changes, and update the instance
   */
  //update<T extends Model>(data: Partial<SchemaOf<T>>): Promise<T>;

  /**
   * Remove the remote data
   */
  //remove(): Promise<void>;
}

export default Model;

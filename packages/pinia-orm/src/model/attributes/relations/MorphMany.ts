import { Schema as NormalizrSchema } from 'normalizr'
import { Schema } from '../../../schema/Schema'
import { Element, Collection } from '../../../data/Data'
import { Query } from '../../../query/Query'
import { Model } from '../../Model'
import { Relation, Dictionary } from './Relation'

export class MorphMany extends Relation {
  /**
   * The field name that contains id of the parent model.
   */
  protected morphId: string

  /**
   * The field name that contains type of the parent model.
   */
  protected morphType: string

  /**
   * The local key of the model.
   */
  protected localKey: string

  /**
   * Create a new morph-many relation instance.
   */
  constructor(
    parent: Model,
    related: Model,
    morphId: string,
    morphType: string,
    localKey: string
  ) {
    super(parent, related)
    this.morphId = morphId
    this.morphType = morphType
    this.localKey = localKey
  }

  /**
   * Get all related models for the relationship.
   */
  getRelateds(): Model[] {
    return [this.related]
  }

  /**
   * Define the normalizr schema for the relation.
   */
  define(schema: Schema): NormalizrSchema {
    return schema.many(this.related, this.parent)
  }

  /**
   * Attach the parent type and id to the given relation.
   */
  attach(record: Element, child: Element): void {
    child[this.morphId] = record[this.localKey]
    child[this.morphType] = this.parent.$entity()
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraints(query: Query, models: Collection): void {
    query.where(this.morphType, this.parent.$entity())
    query.whereIn(this.morphId, this.getKeys(models, this.localKey))
  }

  /**
   * Match the eagerly loaded results to their parents.
   */
  match(relation: string, models: Collection, query: Query): void {
    const dictionary = this.buildDictionary(query.get())

    models.forEach((model) => {
      const key = model[this.localKey]

      dictionary[key]
        ? model.$setRelation(relation, dictionary[key])
        : model.$setRelation(relation, [])
    })
  }

  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  protected buildDictionary(results: Collection): Dictionary {
    return this.mapToDictionary(results, (result) => {
      return [result[this.morphId], result]
    })
  }

  /**
   * Make related models.
   */
  make(elements?: Element[]): Model[] {
    return elements
      ? elements.map((element) => this.related.$newInstance(element))
      : []
  }
}

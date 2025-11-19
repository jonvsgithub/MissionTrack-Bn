import { FindOptions, Model, ModelStatic } from 'sequelize';

export class BaseRepository<T extends Model> {
  constructor(protected model: ModelStatic<T>) {}

  create(payload: Record<string, unknown>): Promise<T> {
    return this.model.create(payload as any);
  }

  findById(id: string, options?: FindOptions): Promise<T | null> {
    return this.model.findByPk(id, options);
  }

  findOne(options: FindOptions): Promise<T | null> {
    return this.model.findOne(options);
  }

  findAll(options?: FindOptions): Promise<T[]> {
    return this.model.findAll(options);
  }

  update(id: string, payload: Record<string, unknown>): Promise<[number]> {
    return this.model.update(payload as any, { where: { id } as any });
  }

  delete(id: string): Promise<number> {
    return this.model.destroy({ where: { id } as any });
  }
}


export interface Repository<T> {
    findAll: T[] | undefined
    findOne(obj: {id: string}): T | undefined
    add(obj: T): T | undefined
    update(obj: T): T | undefined
    delete(obj: {id: string}): T | undefined
}
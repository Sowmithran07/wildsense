import { isUsingInMemoryStore } from './db.js';
import { InMemoryModel } from './inMemoryStore.js';

export const createModelProxy = (name, mongooseModel) => {
  const inMemoryModel = new InMemoryModel(name);

  return new Proxy(mongooseModel, {
    get(target, prop) {
      if (isUsingInMemoryStore) {
        if (typeof inMemoryModel[prop] === 'function') {
          return inMemoryModel[prop].bind(inMemoryModel);
        }
        return inMemoryModel[prop];
      }
      return target[prop];
    },
  });
};

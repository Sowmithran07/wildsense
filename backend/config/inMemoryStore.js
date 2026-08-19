import bcrypt from 'bcryptjs';

// Global In-Memory Collections Store
class InMemoryDatabase {
  constructor() {
    this.collections = {
      User: [],
      Sensor: [],
      AnimalDetection: [],
      Alert: [],
      Incident: [],
      Notification: [],
      AnimalSighting: [],
    };
    this.idCounter = 1000;
  }

  generateId() {
    this.idCounter++;
    return `64f8a${this.idCounter.toString(16).padStart(19, '0')}`;
  }

  getCollection(name) {
    if (!this.collections[name]) {
      this.collections[name] = [];
    }
    return this.collections[name];
  }
}

export const dbInstance = new InMemoryDatabase();

class QueryChain {
  constructor(dataPromise, collectionName) {
    this.dataPromise = dataPromise;
    this.collectionName = collectionName;
    this._populateFields = [];
    this._sortKey = null;
    this._skipCount = 0;
    this._limitCount = null;
    this._selectExclude = [];
  }

  sort(sortParam) {
    this._sortKey = sortParam;
    return this;
  }

  skip(count) {
    this._skipCount = Number(count) || 0;
    return this;
  }

  limit(count) {
    this._limitCount = Number(count) || 0;
    return this;
  }

  populate(field, select) {
    this._populateFields.push({ field, select });
    return this;
  }

  select(selectParam) {
    if (typeof selectParam === 'string') {
      if (selectParam.startsWith('-')) {
        this._selectExclude.push(selectParam.substring(1));
      }
    }
    return this;
  }

  async exec() {
    let result = await this.dataPromise;

    if (!Array.isArray(result)) {
      if (result) {
        result = this._applyPopulateSingle(result);
      }
      return result;
    }

    // Apply Sort
    if (this._sortKey) {
      const isDesc = typeof this._sortKey === 'string' && this._sortKey.startsWith('-');
      const field = typeof this._sortKey === 'string' && isDesc ? this._sortKey.substring(1) : this._sortKey;
      
      result.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];
        if (valA instanceof Date) valA = valA.getTime();
        if (valB instanceof Date) valB = valB.getTime();
        if (valA < valB) return isDesc ? 1 : -1;
        if (valA > valB) return isDesc ? -1 : 1;
        return 0;
      });
    }

    // Apply Skip & Limit
    if (this._skipCount > 0) {
      result = result.slice(this._skipCount);
    }
    if (this._limitCount && this._limitCount > 0) {
      result = result.slice(0, this._limitCount);
    }

    // Apply Populate
    if (this._populateFields.length > 0) {
      result = result.map((item) => this._applyPopulateSingle(item));
    }

    return result;
  }

  _applyPopulateSingle(item) {
    const cloned = { ...item };
    for (const pop of this._populateFields) {
      const field = typeof pop.field === 'string' ? pop.field : pop.field.path;
      const val = cloned[field];

      if (val) {
        const targetId = typeof val === 'object' ? val._id || val : val;
        // Search across collections
        for (const [colName, docs] of Object.entries(dbInstance.collections)) {
          const match = docs.find((d) => String(d._id) === String(targetId));
          if (match) {
            cloned[field] = { ...match };
            break;
          }
        }
      }
    }
    return cloned;
  }

  then(onFulfilled, onRejected) {
    return this.exec().then(onFulfilled, onRejected);
  }
}

const matchQuery = (doc, query = {}) => {
  for (const [key, expected] of Object.entries(query)) {
    if (key === '$or' && Array.isArray(expected)) {
      const matchesAny = expected.some((subQ) => matchQuery(doc, subQ));
      if (!matchesAny) return false;
      continue;
    }

    const docVal = doc[key];

    if (expected && typeof expected === 'object' && !(expected instanceof Date)) {
      if ('$in' in expected && Array.isArray(expected.$in)) {
        if (!expected.$in.includes(docVal)) return false;
      }
      if ('$gte' in expected) {
        const valDate = docVal instanceof Date ? docVal.getTime() : docVal;
        const expDate = expected.$gte instanceof Date ? expected.$gte.getTime() : expected.$gte;
        if (valDate < expDate) return false;
      }
      if ('$lte' in expected) {
        const valDate = docVal instanceof Date ? docVal.getTime() : docVal;
        const expDate = expected.$lte instanceof Date ? expected.$lte.getTime() : expected.$lte;
        if (valDate > expDate) return false;
      }
      if ('$regex' in expected) {
        const regex = new RegExp(expected.$regex, expected.$options || 'i');
        if (!regex.test(String(docVal || ''))) return false;
      }
    } else if (expected !== undefined) {
      if (key === '_id') {
        if (String(docVal) !== String(expected)) return false;
      } else if (docVal !== expected) {
        return false;
      }
    }
  }
  return true;
};

export class InMemoryModel {
  constructor(name) {
    this.name = name;
  }

  _wrapDocument(data) {
    if (!data) return null;
    const doc = {
      _id: data._id || dbInstance.generateId(),
      ...data,
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
      save: async function () {
        this.updatedAt = new Date();
        const collection = dbInstance.getCollection(this.__modelName || 'General');
        const idx = collection.findIndex((d) => String(d._id) === String(this._id));
        if (idx !== -1) {
          collection[idx] = { ...this };
        } else {
          collection.push({ ...this });
        }
        return this;
      },
      comparePassword: async function (candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
      },
      toObject: function () {
        const obj = { ...this };
        delete obj.save;
        delete obj.comparePassword;
        delete obj.toObject;
        return obj;
      },
    };
    doc.__modelName = this.name;
    return doc;
  }

  async countDocuments(query = {}) {
    const list = dbInstance.getCollection(this.name);
    return list.filter((d) => matchQuery(d, query)).length;
  }

  find(query = {}) {
    const list = dbInstance.getCollection(this.name);
    const matches = list.filter((d) => matchQuery(d, query)).map((d) => this._wrapDocument(d));
    return new QueryChain(Promise.resolve(matches), this.name);
  }

  findOne(query = {}) {
    const list = dbInstance.getCollection(this.name);
    const match = list.find((d) => matchQuery(d, query));
    return new QueryChain(Promise.resolve(match ? this._wrapDocument(match) : null), this.name);
  }

  findById(id) {
    return this.findOne({ _id: id });
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const list = dbInstance.getCollection(this.name);
    const idx = list.findIndex((d) => String(d._id) === String(id));
    if (idx === -1) return null;

    const updated = {
      ...list[idx],
      ...updateData,
      updatedAt: new Date(),
    };
    list[idx] = updated;
    return this._wrapDocument(updated);
  }

  async findByIdAndDelete(id) {
    const list = dbInstance.getCollection(this.name);
    const idx = list.findIndex((d) => String(d._id) === String(id));
    if (idx === -1) return null;
    const removed = list.splice(idx, 1)[0];
    return this._wrapDocument(removed);
  }

  async updateMany(query, updateData) {
    const list = dbInstance.getCollection(this.name);
    let modifiedCount = 0;
    list.forEach((d, idx) => {
      if (matchQuery(d, query)) {
        list[idx] = { ...d, ...updateData, updatedAt: new Date() };
        modifiedCount++;
      }
    });
    return { modifiedCount };
  }

  async create(data) {
    let toInsert = data;
    if (toInsert.password && !toInsert.password.startsWith('$2a$') && !toInsert.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      toInsert.password = await bcrypt.hash(toInsert.password, salt);
    }

    const doc = this._wrapDocument(toInsert);
    const list = dbInstance.getCollection(this.name);
    list.push(doc);
    return doc;
  }

  async aggregate(pipeline = []) {
    let data = [...dbInstance.getCollection(this.name)];

    for (const stage of pipeline) {
      if (stage.$match) {
        data = data.filter((d) => matchQuery(d, stage.$match));
      }
      if (stage.$group) {
        const groups = {};
        const groupKey = stage.$group._id;

        data.forEach((d) => {
          let keyVal;
          if (typeof groupKey === 'string' && groupKey.startsWith('$')) {
            keyVal = d[groupKey.substring(1)];
          } else if (groupKey && typeof groupKey === 'object' && groupKey.$dateToString) {
            const date = new Date(d.detectedAt || d.createdAt);
            keyVal = date.toISOString().split('T')[0];
          } else {
            keyVal = d[groupKey] || 'All';
          }

          if (!groups[keyVal]) {
            groups[keyVal] = { _id: keyVal, count: 0, total: 0, critical: 0, high: 0, medium: 0, low: 0 };
          }
          groups[keyVal].count += 1;
          groups[keyVal].total += 1;
          if (d.threatLevel === 'CRITICAL') groups[keyVal].critical += 1;
          if (d.threatLevel === 'HIGH') groups[keyVal].high += 1;
          if (d.threatLevel === 'MEDIUM') groups[keyVal].medium += 1;
          if (d.threatLevel === 'LOW') groups[keyVal].low += 1;
        });

        data = Object.values(groups);
      }
      if (stage.$sort) {
        const [sortField, sortDir] = Object.entries(stage.$sort)[0];
        data.sort((a, b) => (a[sortField] < b[sortField] ? -sortDir : sortDir));
      }
      if (stage.$limit) {
        data = data.slice(0, stage.$limit);
      }
    }

    return data;
  }
}

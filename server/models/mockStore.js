const bcrypt = require('bcryptjs');

const generateId = () => {
  return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
};

// Global in-memory collections
const collections = {
  users: [],
  events: [],
  registrations: [],
  feedbacks: [],
};

class MockDocument {
  constructor(data, collectionName) {
    Object.assign(this, data);
    this._collectionName = collectionName;
    if (!this._id) {
      this._id = generateId();
    }
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
    this.updatedAt = new Date();
  }

  async save() {
    this.updatedAt = new Date();
    const list = collections[this._collectionName];
    const index = list.findIndex(item => item._id.toString() === this._id.toString());
    if (index !== -1) {
      list[index] = this;
    } else {
      list.push(this);
    }
    return this;
  }

  async matchPassword(enteredPassword) {
    if (!this.password) return false;
    if (this.password.startsWith('$2')) {
      return await bcrypt.compare(enteredPassword, this.password);
    }
    return this.password === enteredPassword;
  }
}

class MockQuery {
  constructor(sourceList, query = {}, collectionName = '', isSingle = false) {
    this.sourceList = sourceList;
    this.query = query;
    this.collectionName = collectionName;
    this.isSingle = isSingle;
    this.populateFields = [];
    this.sortOption = null;
  }

  populate(field, select) {
    this.populateFields.push({ field, select });
    return this;
  }

  sort(sortObj) {
    this.sortOption = sortObj;
    return this;
  }

  select(selectFields) {
    return this;
  }

  _execute() {
    let results = this.sourceList.filter((item) => {
      for (const [key, val] of Object.entries(this.query)) {
        if (key === '$or' && Array.isArray(val)) {
          const matchesOr = val.some((subQuery) => {
            for (const [sKey, sVal] of Object.entries(subQuery)) {
              if (sVal && sVal.$regex) {
                const regex = new RegExp(sVal.$regex, sVal.$options || '');
                if (item[sKey] && regex.test(item[sKey])) return true;
              } else if (item[sKey]?.toString() === sVal?.toString()) {
                return true;
              }
            }
            return false;
          });
          if (!matchesOr) return false;
        } else if (val && typeof val === 'object' && val.$in && Array.isArray(val.$in)) {
          if (!val.$in.some((inVal) => inVal?.toString() === item[key]?.toString())) return false;
        } else if (val && typeof val === 'object' && val.toString) {
          if (item[key]?.toString() !== val.toString()) return false;
        } else if (item[key]?.toString() !== val?.toString()) {
          return false;
        }
      }
      return true;
    });

    if (this.sortOption) {
      results.sort((a, b) => {
        if (this.sortOption.date) return new Date(a.date) - new Date(b.date);
        if (this.sortOption.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
        return 0;
      });
    }

    // Populate
    results = results.map((item) => {
      const clone = Object.assign(Object.create(Object.getPrototypeOf(item)), item);
      for (const p of this.populateFields) {
        if (p.field === 'organizer' || p.field === 'organizerId') {
          clone[p.field] =
            collections.users.find(
              (u) => u._id.toString() === (item[p.field]?._id || item[p.field])?.toString()
            ) || null;
        } else if (p.field === 'participant') {
          clone.participant =
            collections.users.find(
              (u) => u._id.toString() === (item.participant?._id || item.participant)?.toString()
            ) || null;
        } else if (p.field === 'event') {
          clone.event =
            collections.events.find(
              (e) => e._id.toString() === (item.event?._id || item.event)?.toString()
            ) || null;
        } else if (p.field === 'assignedEvents') {
          clone.assignedEvents = (item.assignedEvents || [])
            .map((evId) => collections.events.find((e) => e._id.toString() === (evId?._id || evId)?.toString()) || evId)
            .filter(Boolean);
        } else if (p.field === 'volunteers') {
          clone.volunteers = (item.volunteers || [])
            .map((vId) => collections.users.find((u) => u._id.toString() === (vId?._id || vId)?.toString()) || vId)
            .filter(Boolean);
        }
      }
      return clone;
    });

    return this.isSingle ? results[0] || null : results;
  }

  then(resolve, reject) {
    try {
      const result = this._execute();
      resolve(result);
    } catch (err) {
      if (reject) reject(err);
      else throw err;
    }
  }

  catch(reject) {
    return this.then(null, reject);
  }
}

const createMockModel = (collectionName) => {
  return {
    async countDocuments() {
      return collections[collectionName].length;
    },

    async create(data) {
      if (Array.isArray(data)) {
        const createdList = [];
        for (const item of data) {
          const doc = new MockDocument(item, collectionName);
          if (collectionName === 'users' && doc.password && !doc.password.startsWith('$2')) {
            const salt = await bcrypt.genSalt(10);
            doc.password = await bcrypt.hash(doc.password, salt);
          }
          collections[collectionName].push(doc);
          createdList.push(doc);
        }
        return createdList;
      }

      const doc = new MockDocument(data, collectionName);
      if (collectionName === 'users' && doc.password && !doc.password.startsWith('$2')) {
        const salt = await bcrypt.genSalt(10);
        doc.password = await bcrypt.hash(doc.password, salt);
      }
      collections[collectionName].push(doc);
      return doc;
    },

    find(query = {}) {
      return new MockQuery(collections[collectionName], query, collectionName, false);
    },

    findOne(query = {}) {
      return new MockQuery(collections[collectionName], query, collectionName, true);
    },

    findById(id) {
      return new MockQuery(collections[collectionName], { _id: id }, collectionName, true);
    },

    async findByIdAndUpdate(id, data, options = {}) {
      const doc = collections[collectionName].find(item => item._id.toString() === id.toString());
      if (!doc) return null;
      Object.assign(doc, data);
      doc.updatedAt = new Date();
      return doc;
    },

    async findByIdAndDelete(id) {
      const index = collections[collectionName].findIndex(item => item._id.toString() === id.toString());
      if (index !== -1) {
        return collections[collectionName].splice(index, 1)[0];
      }
      return null;
    },
  };
};

module.exports = {
  createMockModel,
  collections,
};

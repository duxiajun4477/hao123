/**
 * InfoVault - IndexedDB Database Layer
 * 支持所有数据类型的本地存储：密码、钱包、证件、图片、笔记、收藏
 * v3 - 新增本地全量加密支持
 */
const InfoVaultDB = {
  DB_NAME: 'InfoVault',
  DB_VERSION: 3,
  
  // 数据类型定义
  ENTRY_TYPES: {
    PASSWORD: 'password',
    WALLET: 'wallet',
    IDENTITY: 'identity',
    IMAGE: 'image',
    NOTE: 'note',
    BOOKMARK: 'bookmark',
    EMAIL: 'email',
    CRYPTO: 'crypto',
    FILE: 'file'
  },

  // 分类标签
  CATEGORIES: {
    password: ['社交', '购物', '金融', '工作', '娱乐', '教育', '其他'],
    wallet: ['支付宝', '微信支付', '银行卡', '加密货币', '其他'],
    identity: ['身份证', '护照', '驾驶证', '社保卡', '学生证', '其他'],
    email: ['Gmail', 'QQ邮箱', '网易126', '网易163', 'Outlook', 'iCloud', '企业邮', '其他'],
    crypto: ['ETH', 'BTC', 'SOL', 'USDT', 'BSC', '其他'],
    image: ['身份证', '银行卡', '驾驶证', '护照', '社保卡', '户口本', '毕业证', '合同', '其他'],
    file: ['文档', 'PDF', '压缩包', '安装包', '备份', '其他'],
  },

  _db: null,
  _encryptionKey: null, // 会话期间缓存的加密密钥

  // ====== 加密管理 ======
  
  // 设置加密密钥（用户输入主密码时调用）
  async setEncryptionKey(password) {
    if (!password) {
      this._encryptionKey = null;
      return;
    }
    // 用 PBKDF2 从主密码派生 AES 密钥
    const enc = new TextEncoder();
    const salt = enc.encode('InfoVault-Local-Encryption-v1');
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
    this._encryptionKey = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  },

  isEncryptionEnabled() {
    return !!this._encryptionKey;
  },

  // 加密数据（写入时）
  async _encryptData(plainObj) {
    if (!this._encryptionKey) return null;
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this._encryptionKey,
      enc.encode(JSON.stringify(plainObj))
    );
    // 组合 iv(12) + ciphertext，base64 编码
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);
    return btoa(String.fromCharCode(...combined));
  },

  // 解密数据（读取时）
  async _decryptData(encryptedB64) {
    if (!encryptedB64 || !this._encryptionKey) return null;
    try {
      const combined = Uint8Array.from(atob(encryptedB64), c => c.charCodeAt(0));
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);
      const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, this._encryptionKey, data);
      return JSON.parse(new TextDecoder().decode(plain));
    } catch (e) {
      console.error('Decrypt error:', e);
      return null;
    }
  },

  // 准备存储对象：保留索引字段明文，内容加密
  async _prepareForStore(entry) {
    // 提取索引字段（明文存储）
    const stored = {
      id: entry.id,
      type: entry.type,
      name: entry.name || '',
      deletedAt: entry.deletedAt || null,
      favorite: !!entry.favorite,
      createdAt: entry.createdAt || new Date().toISOString(),
      updatedAt: entry.updatedAt || new Date().toISOString(),
    };
    
    if (this._encryptionKey) {
      // 加密完整的 entry 数据
      stored._enc = await this._encryptData(entry);
    } else {
      // 未加密：直接存储所有字段
      Object.assign(stored, entry);
    }
    return stored;
  },

  // 从存储对象还原完整数据
  async _restoreFromStore(stored) {
    if (!stored) return null;
    if (stored._enc && this._encryptionKey) {
      // 解密
      const decrypted = await this._decryptData(stored._enc);
      if (decrypted) {
        // 用密文数据覆盖，保留索引字段
        return { ...decrypted, id: stored.id };
      }
    }
    // 未加密或解密失败：直接返回
    return stored;
  },

  async open() {
    if (this._db) return this._db;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (e.oldVersion < 1) {
          const store = db.createObjectStore('entries', { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
          store.createIndex('deletedAt', 'deletedAt', { unique: false });
          store.createIndex('favorite', 'favorite', { unique: false });
          store.createIndex('type_deleted', ['type', 'deletedAt'], { unique: false });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('sync_log')) {
          db.createObjectStore('sync_log', { keyPath: 'id', autoIncrement: true });
        }
      };
      req.onsuccess = (e) => {
        this._db = e.target.result;
        resolve(this._db);
      };
      req.onerror = (e) => reject(e.target.error);
    });
  },

  // ====== CRUD ======

  async add(entry) {
    await this.open();
    const now = new Date().toISOString();
    const data = {
      ...entry,
      id: entry.id || crypto.randomUUID(),
      createdAt: entry.createdAt || now,
      updatedAt: now,
      deletedAt: null
    };
    const stored = await this._prepareForStore(data);
    await this._put('entries', stored);
    return data;
  },

  async update(id, changes) {
    await this.open();
    const existing = await this.get(id);
    if (!existing) throw new Error('Entry not found: ' + id);
    const updated = { ...existing, ...changes, updatedAt: new Date().toISOString() };
    const stored = await this._prepareForStore(updated);
    await this._put('entries', stored);
    return updated;
  },

  async get(id) {
    await this.open();
    const stored = await this._get('entries', id);
    return this._restoreFromStore(stored);
  },

  async delete(id, permanent = false) {
    await this.open();
    if (permanent) {
      return this._delete('entries', id);
    }
    return this.update(id, { deletedAt: new Date().toISOString() });
  },

  async restore(id) {
    return this.update(id, { deletedAt: null });
  },

    async getAll(type, includeDeleted = false) {
    // 使用 exportAll + JS 过滤，绕过 IndexedDB 索引可能存在的问题
    const all = await this.exportAll();
    return all.filter(e => e.type === type && (includeDeleted || !e.deletedAt));
  },

async getAllActive() {
    await this.open();
    const tx = this._db.transaction('entries', 'readonly');
    const store = tx.objectStore('entries');
    // 先同步读取所有原始数据
    const rawResults = await new Promise((resolve, reject) => {
      const results = [];
      const req = store.openCursor();
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          if (!cursor.value.deletedAt) {
            results.push(cursor.value);
          }
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      req.onerror = (e) => reject(e.target.error);
    });
    // 批量解密
    const finalResults = [];
    for (const stored of rawResults) {
      const restored = await this._restoreFromStore(stored);
      if (restored) finalResults.push(restored);
    }
    return finalResults;
  },

  // ====== 统计 ======
  async getStats() {
    const all = await this.getAllActive();
    const stats = { total: 0 };
    for (const type of Object.values(this.ENTRY_TYPES)) {
      stats[type] = 0;
    }
    for (const entry of all) {
      stats[entry.type] = (stats[entry.type] || 0) + 1;
      stats.total++;
    }
    stats.expiredPasswords = 0;
    return stats;
  },

  // ====== 最近访问 ======
  async getRecent(limit = 10) {
    const all = await this.getAllActive();
    return all
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, limit);
  },

  // ====== 设置 ======
  async getSetting(key) {
    const val = await this._get('settings', key);
    return val ? val.value : null;
  },

  async setSetting(key, value) {
    await this._put('settings', { key, value, updatedAt: new Date().toISOString() });
  },

  // ====== 内部方法 ======
  async _put(storeName, data) {
    const db = await this.open();
    const tx = db.transaction(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const req = tx.objectStore(storeName).put(data);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  },

  async _get(storeName, key) {
    const db = await this.open();
    const tx = db.transaction(storeName, 'readonly');
    return new Promise((resolve, reject) => {
      const req = tx.objectStore(storeName).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = (e) => reject(e.target.error);
    });
  },

  async _delete(storeName, key) {
    const db = await this.open();
    const tx = db.transaction(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const req = tx.objectStore(storeName).delete(key);
      req.onsuccess = () => resolve();
      req.onerror = (e) => reject(e.target.error);
    });
  },

  // ====== 数据导入/导出 ======
  async exportAll() {
    await this.open();
    const tx = this._db.transaction('entries', 'readonly');
    const store = tx.objectStore('entries');
    // 先同步读取所有原始数据
    const rawResults = await new Promise((resolve, reject) => {
      const results = [];
      const req = store.openCursor();
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      req.onerror = (e) => reject(e.target.error);
    });
    // 批量解密
    const finalResults = [];
    for (const stored of rawResults) {
      const restored = await this._restoreFromStore(stored);
      if (restored) finalResults.push(restored);
    }
    return finalResults;
  },

  async importAll(data, mergeStrategy = 'skip') {
    await this.open();
    const tx = this._db.transaction('entries', 'readwrite');
    const store = tx.objectStore('entries');
    
    for (const entry of data) {
      const existingStored = await this._get('entries', entry.id);
      if (existingStored) {
        if (mergeStrategy === 'overwrite') {
          const stored = await this._prepareForStore({ ...entry, updatedAt: new Date().toISOString() });
          store.put(stored);
        }
      } else {
        const stored = await this._prepareForStore(entry);
        store.put(stored);
      }
    }
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(data.length);
      tx.onerror = (e) => reject(e.target.error);
    });
  }
};

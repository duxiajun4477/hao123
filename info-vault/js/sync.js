/**
 * InfoVault - GitHub Sync Engine
 * 通过 GitHub REST API 自动同步加密数据到私有仓库
 */
const InfoVaultSync = {
  GITHUB_API: 'https://api.github.com',
  SYNC_PATH: 'infovault-data/data.json',
  MANIFEST_PATH: 'infovault-data/manifest.json',
  
  _token: null,
  _repo: null,
  _branch: 'main',
  _lastSync: null,
  _syncInProgress: false,
  _listeners: [],

  // 初始化同步配置
  async init() {
    this._token = await InfoVaultDB.getSetting('github_token');
    this._repo = await InfoVaultDB.getSetting('github_repo');
    this._lastSync = await InfoVaultDB.getSetting('last_sync_time');
    return this.isConfigured();
  },

  isConfigured() {
    return !!(this._token && this._repo);
  },

  // 注册同步状态监听器
  onChange(listener) {
    this._listeners.push(listener);
  },

  _notify(status) {
    for (const fn of this._listeners) fn(status);
  },

  // 配置 GitHub 同步
  async configure(token, repo, branch = 'main') {
    this._token = token;
    this._repo = repo;
    this._branch = branch;
    await InfoVaultDB.setSetting('github_token', token);
    await InfoVaultDB.setSetting('github_repo', repo);
    await InfoVaultDB.setSetting('github_branch', branch);
    
    // 测试连接
    return this.testConnection();
  },

  // 清除配置
  async disconnect() {
    this._token = null;
    this._repo = null;
    await InfoVaultDB.setSetting('github_token', '');
    await InfoVaultDB.setSetting('github_repo', '');
    await InfoVaultDB.setSetting('last_sync_time', '');
    this._notify({ type: 'disconnected' });
  },

  // 测试连接
  async testConnection() {
    try {
      const resp = await this._apiRequest(`/repos/${this._repo}`);
      if (resp.ok) {
        this._notify({ type: 'connected' });
        return { success: true };
      }
      const err = await resp.json();
      return { success: false, error: err.message || '连接失败' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // GitHub API 请求
  async _apiRequest(path, options = {}) {
    const url = `${this.GITHUB_API}${path}`;
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'InfoVault/1.0'
    };
    if (this._token) {
      headers['Authorization'] = `Bearer ${this._token}`;
    }
    if (options.body && !options.rawBody) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }
    return fetch(url, { ...options, headers });
  },

  // 获取文件的 SHA（用于更新）
  async _getFileSha(path) {
    const resp = await this._apiRequest(`/repos/${this._repo}/contents/${path}?ref=${this._branch}`);
    if (resp.status === 404) return null;
    if (!resp.ok) throw new Error('获取文件信息失败');
    const data = await resp.json();
    return data.sha;
  },

  // ====== 核心同步方法 ======

  // 读取远程数据
  async _readRemoteData() {
    try {
      const resp = await this._apiRequest(
        `/repos/${this._repo}/contents/${this.SYNC_PATH}?ref=${this._branch}`
      );
      if (resp.status === 404) return null;
      if (!resp.ok) throw new Error('读取远程数据失败');
      
      const data = await resp.json();
      // content 是 base64 编码的
      const content = atob(data.content.replace(/\n/g, ''));
      return { content, sha: data.sha };
    } catch (e) {
      console.error('读取远程数据失败:', e);
      return null;
    }
  },

  // 读取远程 manifest
  async _readManifest() {
    try {
      const resp = await this._apiRequest(
        `/repos/${this._repo}/contents/${this.MANIFEST_PATH}?ref=${this._branch}`
      );
      if (resp.status === 404) return null;
      if (!resp.ok) throw new Error('读取同步信息失败');
      const data = await resp.json();
      const content = atob(data.content.replace(/\n/g, ''));
      return { ...JSON.parse(content), sha: data.sha };
    } catch (e) {
      return null;
    }
  },

  // 推送同步
  async push() {
    if (!this.isConfigured() || this._syncInProgress) return;
    this._syncInProgress = true;
    this._notify({ type: 'sync_start', direction: 'push' });
    
    try {
      // 导出所有数据
      const allData = await InfoVaultDB.exportAll();
      const settings = await this._getAllSettings();
      
      // 加密数据
      const encrypted = await this._encryptData(JSON.stringify({ entries: allData, settings }));
      
      // 获取当前文件的 SHA（用于更新）
      let sha = null;
      try {
        sha = await this._getFileSha(this.SYNC_PATH);
      } catch (e) { /* 文件可能还不存在 */ }
      
      // 推送数据文件
      const body = {
        message: `Sync InfoVault data - ${new Date().toISOString()}`,
        content: btoa(encrypted),
        branch: this._branch
      };
      if (sha) body.sha = sha;
      
      const resp = await this._apiRequest(
        `/repos/${this._repo}/contents/${this.SYNC_PATH}`,
        { method: 'PUT', body }
      );
      
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.message || '推送失败');
      }
      
      // 更新 manifest
      await this._updateManifest();
      
      this._lastSync = new Date().toISOString();
      await InfoVaultDB.setSetting('last_sync_time', this._lastSync);
      this._notify({ type: 'sync_complete', direction: 'push', time: this._lastSync });
    } catch (e) {
      this._notify({ type: 'sync_error', error: e.message });
      console.error('Push error:', e);
    } finally {
      this._syncInProgress = false;
    }
  },

  // 拉取同步
  async pull() {
    if (!this.isConfigured() || this._syncInProgress) return { success: false, error: '同步进行中' };
    this._syncInProgress = true;
    this._notify({ type: 'sync_start', direction: 'pull' });
    
    try {
      const remote = await this._readRemoteData();
      if (!remote) {
        this._notify({ type: 'sync_complete', direction: 'pull', message: '远程无数据' });
        return { success: true, message: '远程无数据' };
      }
      
      // 解密数据
      let data;
      try {
        data = await this._decryptData(remote.content);
      } catch (e) {
        this._notify({ type: 'sync_error', error: '解密失败：密码不匹配' });
        return { success: false, error: '解密失败' };
      }
      
      const parsed = JSON.parse(data);
      
      // 导入到本地数据库
      if (parsed.entries && parsed.entries.length > 0) {
        await InfoVaultDB.importAll(parsed.entries, 'overwrite');
      }
      
      // 恢复设置
      if (parsed.settings) {
        for (const [key, value] of Object.entries(parsed.settings)) {
          if (!['github_token', 'github_repo', 'last_sync_time'].includes(key)) {
            await InfoVaultDB.setSetting(key, value);
          }
        }
      }
      
      this._lastSync = new Date().toISOString();
      await InfoVaultDB.setSetting('last_sync_time', this._lastSync);
      this._notify({ type: 'sync_complete', direction: 'pull', time: this._lastSync, count: parsed.entries?.length || 0 });
      
      return { success: true, count: parsed.entries?.length || 0 };
    } catch (e) {
      this._notify({ type: 'sync_error', error: e.message });
      return { success: false, error: e.message };
    } finally {
      this._syncInProgress = false;
    }
  },

  // 双向同步（先推后拉）
  async sync() {
    if (!this.isConfigured()) return { success: false, error: '未配置同步' };
    
    // 先拉取远程数据
    const pullResult = await this.pull();
    // 再推送本地数据
    await this.push();
    
    return pullResult;
  },

  // 更新 manifest
  async _updateManifest() {
    try {
      const manifest = {
        lastSync: new Date().toISOString(),
        version: 2,
        deviceId: await this._getDeviceId()
      };
      
      let sha = null;
      try {
        sha = await this._getFileSha(this.MANIFEST_PATH);
      } catch (e) { /* ignore */ }
      
      const body = {
        message: `Update sync manifest - ${manifest.lastSync}`,
        content: btoa(JSON.stringify(manifest, null, 2)),
        branch: this._branch
      };
      if (sha) body.sha = sha;
      
      await this._apiRequest(
        `/repos/${this._repo}/contents/${this.MANIFEST_PATH}`,
        { method: 'PUT', body }
      );
    } catch (e) {
      console.error('Update manifest error:', e);
    }
  },

  async _getDeviceId() {
    let deviceId = await InfoVaultDB.getSetting('device_id');
    if (!deviceId) {
      deviceId = 'device_' + crypto.randomUUID().slice(0, 8);
      await InfoVaultDB.setSetting('device_id', deviceId);
    }
    return deviceId;
  },

  async _getAllSettings() {
    const db = await InfoVaultDB.open();
    const tx = db.transaction('settings', 'readonly');
    const store = tx.objectStore('settings');
    return new Promise((resolve, reject) => {
      const results = {};
      const req = store.openCursor();
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          results[cursor.value.key] = cursor.value.value;
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      req.onerror = (e) => reject(e.target.error);
    });
  },

  // 加密/解密（使用主密码或 Token）
  async _encryptData(plaintext) {
    const masterPwd = await InfoVaultDB.getSetting('master_password_hash') || this._token;
    const enc = new TextEncoder();
    const data = enc.encode(plaintext);
    
    // 生成密钥
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await crypto.subtle.importKey(
      'raw', enc.encode(masterPwd), 'PBKDF2', false, ['deriveKey']
    );
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
    
    const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(ciphertext), salt.length + iv.length);
    
    return btoa(String.fromCharCode(...new Uint8Array(combined)));
  },

  async _decryptData(cipherB64) {
    const masterPwd = await InfoVaultDB.getSetting('master_password_hash') || this._token;
    const combined = Uint8Array.from(atob(cipherB64), c => c.charCodeAt(0));
    
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const data = combined.slice(28);
    
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw', enc.encode(masterPwd), 'PBKDF2', false, ['deriveKey']
    );
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    return new TextDecoder().decode(plain);
  },

  // 获取同步状态
  getStatus() {
    return {
      configured: this.isConfigured(),
      lastSync: this._lastSync,
      inProgress: this._syncInProgress,
      repo: this._repo
    };
  }
};

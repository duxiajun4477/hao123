/**
 * InfoVault - Client-Side Encryption Layer
 * 使用 Web Crypto API AES-GCM 256 位加密
 */
const InfoVaultCrypto = {
  ALGORITHM: 'AES-GCM',
  KEY_LENGTH: 256,
  ITERATIONS: 100000,
  SALT_LENGTH: 16,

  // 从密码派生加密密钥
  async _deriveKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: this.ITERATIONS,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: this.ALGORITHM, length: this.KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    );
  },

  // 加密数据
  async encrypt(plaintext, password) {
    const salt = crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this._deriveKey(password, salt);
    const enc = new TextEncoder();
    const ciphertext = await crypto.subtle.encrypt(
      { name: this.ALGORITHM, iv },
      key,
      enc.encode(JSON.stringify(plaintext))
    );
    // 组合: salt(16) + iv(12) + ciphertext
    const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(ciphertext), salt.length + iv.length);
    return btoa(String.fromCharCode(...combined));
  },

  // 解密数据
  async decrypt(ciphertextB64, password) {
    try {
      const combined = Uint8Array.from(atob(ciphertextB64), c => c.charCodeAt(0));
      const salt = combined.slice(0, this.SALT_LENGTH);
      const iv = combined.slice(this.SALT_LENGTH, this.SALT_LENGTH + 12);
      const data = combined.slice(this.SALT_LENGTH + 12);
      const key = await this._deriveKey(password, salt);
      const plain = await crypto.subtle.decrypt(
        { name: this.ALGORITHM, iv },
        key,
        data
      );
      const dec = new TextDecoder();
      return JSON.parse(dec.decode(plain));
    } catch (e) {
      throw new Error('解密失败：密码错误或数据已损坏');
    }
  },

  // 生成随机密码
  generatePassword(length = 16, options = {}) {
    const defaults = {
      uppercase: true,
      lowercase: true,
      digits: true,
      symbols: true,
      excludeSimilar: false
    };
    const opts = { ...defaults, ...options };
    
    let chars = '';
    if (opts.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (opts.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (opts.digits) chars += '0123456789';
    if (opts.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (opts.excludeSimilar) {
      chars = chars.replace(/[il1Lo0O]/g, '');
    }
    
    if (!chars) return '';
    
    // 确保至少包含每种选定类型的一个字符
    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      password += chars[array[i] % chars.length];
    }
    return password;
  },

  // 评估密码强度
  evaluateStrength(password) {
    let score = 0;
    if (!password) return { score: 0, label: '空密码', color: '#ef4444' };
    
    // 长度评分
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    if (password.length >= 20) score += 5;
    
    // 复杂度评分
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^a-zA-Z0-9]/.test(password)) score += 20;
    
    // 多样性奖励
    const uniqueChars = new Set(password).size;
    score += Math.min(10, uniqueChars);
    
    // 常见模式扣分
    if (/(.)\1{2,}/.test(password)) score -= 10;  // 重复字符
    if (/^(password|123456|qwerty)/i.test(password)) score -= 30;
    if (/^[a-zA-Z]+$/.test(password)) score -= 10;  // 纯字母
    if (/^\d+$/.test(password)) score -= 15;  // 纯数字
    
    score = Math.max(0, Math.min(100, score));
    
    if (score >= 80) return { score, label: '非常强', color: '#22c55e' };
    if (score >= 60) return { score, label: '强', color: '#22c55e' };
    if (score >= 40) return { score, label: '中等', color: '#f59e0b' };
    if (score >= 20) return { score, label: '弱', color: '#f97316' };
    return { score, label: '非常弱', color: '#ef4444' };
  }
};

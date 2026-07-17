/**
 * InfoVault - Full-Text Search Engine
 * 跨所有条目类型进行全文搜索，支持中文分词
 */
const InfoVaultSearch = {
  _cache: null,
  _cacheTime: 0,

  // 构建搜索文本（所有可搜索字段合并为一个大字符串）
  _buildSearchText(entry) {
    const parts = [entry.name || ''];
    
    // 根据不同条目类型添加搜索字段
    switch (entry.type) {
      case 'password':
        parts.push(entry.website || '');
        parts.push(entry.username || '');
        parts.push(entry.url || '');
        parts.push(entry.notes || '');
        break;
      case 'wallet':
        parts.push(entry.platform || '');
        parts.push(entry.accountName || '');
        parts.push(entry.accountNumber || '');
        parts.push(entry.notes || '');
        break;
      case 'identity':
        parts.push(entry.realName || '');
        parts.push(entry.idNumber || '');
        parts.push(entry.issuingAuthority || '');
        parts.push(entry.identityType || '');
        parts.push(entry.notes || '');
        break;
      case 'image':
        parts.push(entry.filename || '');
        parts.push(entry.description || '');
        parts.push(entry.tags?.join(' ') || '');
        break;
      case 'note':
        parts.push(entry.content || '');
        parts.push(entry.title || '');
        parts.push((entry.tags || []).join(' '));
        break;
      case 'bookmark':
        parts.push(entry.url || '');
        parts.push(entry.title || '');
        parts.push(entry.description || '');
        parts.push((entry.tags || []).join(' '));
        break;
      case 'email':
        parts.push(entry.email || '');
        parts.push(entry.username || '');
        parts.push(entry.smtpHost || '');
        parts.push(entry.imapHost || '');
        parts.push(entry.notes || '');
        break;
      case 'crypto':
        parts.push(entry.chain || '');
        parts.push(entry.address || '');
        parts.push(entry.privateKey || '');
        parts.push(entry.seedPhrase || '');
        parts.push(entry.notes || '');
        break;
      case 'file':
        parts.push(entry.filename || '');
        parts.push(entry.mimeType || '');
        parts.push(entry.description || '');
        parts.push((entry.tags || []).join(' '));
        break;
    }
    
    // 添加标签
    if (entry.tags && Array.isArray(entry.tags)) {
      parts.push(entry.tags.join(' '));
    }
    if (entry.category) parts.push(entry.category);
    
    return parts.join(' ').toLowerCase();
  },

  // 简单的分词匹配（支持中文）
  _tokenize(text) {
    // 去除标点符号，分割单词
    const clean = text.replace(/[^\w\u4e00-\u9fff\s]/g, ' ').toLowerCase();
    // 英文按空格分词，中文按单字
    const tokens = [];
    for (const word of clean.split(/\s+/)) {
      if (!word) continue;
      if (/[\u4e00-\u9fff]/.test(word)) {
        // 中文：每个字作为一个 token + 整体
        tokens.push(word);
        for (const ch of word) tokens.push(ch);
      } else {
        tokens.push(word);
      }
    }
    return [...new Set(tokens.filter(t => t.length > 0))];
  },

  // 搜索
  async search(query, options = {}) {
    if (!query || !query.trim()) return [];
    
    const q = query.trim().toLowerCase();
    const tokens = this._tokenize(q);
    if (tokens.length === 0) return [];
    
    // 从数据库获取所有活跃条目
    let entries;
    if (options.type) {
      entries = await InfoVaultDB.getAll(options.type);
    } else {
      entries = await InfoVaultDB.getAllActive();
    }
    
    // 评分并排序
    const scored = [];
    for (const entry of entries) {
      const searchText = this._buildSearchText(entry);
      const score = this._score(tokens, searchText, q);
      if (score > 0) {
        // 提取匹配片段
        const snippet = this._extractSnippet(searchText, q, 60);
        scored.push({ entry, score, snippet });
      }
    }
    
    scored.sort((a, b) => b.score - a.score);
    
    const limit = options.limit || 50;
    return scored.slice(0, limit);
  },

  // 评分算法
  _score(tokens, searchText, rawQuery) {
    const lower = searchText.toLowerCase();
    let score = 0;
    
    // 完全匹配加分
    if (lower.includes(rawQuery)) {
      score += 100;
    }
    
    // 精确短语匹配
    if (rawQuery.includes(' ') && lower.includes(rawQuery)) {
      score += 50;
    }
    
    for (const token of tokens) {
      if (token.length === 0) continue;
      let count = 0;
      let pos = 0;
      while ((pos = lower.indexOf(token, pos)) !== -1) {
        count++;
        pos += token.length;
        // 位置越靠前权重越高
        score += Math.max(0, 20 - Math.floor(pos / 10));
      }
      // 每个 token 命中加分
      if (count > 0) {
        score += 15 * count;
        // 短 token（单字）权重降低
        if (token.length === 1 && /[\u4e00-\u9fff]/.test(token)) {
          score -= 5;
        }
      }
    }
    
    // 名称字段权重加倍
    const nameStart = lower.slice(0, lower.indexOf(' '));
    if (nameStart.includes(rawQuery)) {
      score += 30;
    }
    
    // 标签命中加分
    if (lower.includes('#' + rawQuery)) {
      score += 40;
    }
    
    return score;
  },

  // 提取匹配上下文片段
  _extractSnippet(text, query, maxLen) {
    const lower = text.toLowerCase();
    const idx = lower.indexOf(query.toLowerCase());
    if (idx === -1) return text.slice(0, maxLen) + '...';
    
    const start = Math.max(0, idx - Math.floor(maxLen / 3));
    const end = Math.min(text.length, idx + query.length + Math.floor(maxLen / 2));
    let snippet = text.slice(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet += '...';
    return snippet;
  },

  // 清空缓存
  clearCache() {
    this._cache = null;
    this._cacheTime = 0;
  }
};

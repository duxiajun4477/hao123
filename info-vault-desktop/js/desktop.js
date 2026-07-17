/**
 * InfoVault Desktop - Main Application
 */
var InfoVaultApp = {
  currentView: 'dashboard',
  currentItem: null,
  searchTimeout: null,

  // SVG 图标集合
  icons: {
    password: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.3 9.3"/><path d="m18.4 4.6 1.6-1.6 1.6 1.6-1.6 1.6z"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>',
    identity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.3 9.3"/><path d="m18.4 4.6 1.6-1.6 1.6 1.6-1.6 1.6z"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M3 12h18"/><path d="M5.636 5.636l12.728 12.728"/><path d="M18.364 5.636L5.636 18.364"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    notify: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  },

  // 类型名称映射
  typeNames: {
    password: '密码',
    wallet: '钱包',
    identity: '证件',
    image: '图片',
    note: '笔记',
    bookmark: '收藏',
    email: '邮箱',
    crypto: '加密货币',
    file: '文件',
  },

  typeColors: {
    password: '#3b6ef6',
    wallet: '#f59e0b',
    identity: '#a855f7',
    image: '#22c55e',
    note: '#3b82f6',
    bookmark: '#ec4899',
    email: '#22c55e',
    crypto: '#f59e0b',
    file: '#3b82f6',
  },

  // ====== 初始化 ======
  async init() {
    // 初始化数据库
    await InfoVaultDB.open();
    
    // 初始化同步
    await InfoVaultSync.init();
    InfoVaultSync.onChange((status) => this._onSyncStatusChange(status));
    if (InfoVaultSync.isConfigured()) {
      this._updateSyncUI();
    }

    // 检查是否需要解锁
    const masterHash = await InfoVaultDB.getSetting('master_password_hash');
    if (masterHash) {
      document.getElementById('unlockOverlay').classList.add('open');
      document.getElementById('unlockPwd').focus();
      // 回车键解锁
      document.getElementById('unlockPwd').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.unlock();
      });
    } else {
      this._afterUnlock();
    }

    // 导航
    document.querySelectorAll('[data-view]').forEach(el => {
      el.addEventListener('click', () => this.navigateTo(el.dataset.view));
    });

    // 搜索
    const searchInput = document.getElementById('globalSearchInput');
    searchInput.addEventListener('input', () => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => this.handleSearch(searchInput.value), 300);
    });
    searchInput.addEventListener('focus', () => {
      if (searchInput.value) this.handleSearch(searchInput.value);
    });
    document.getElementById('searchOverlay').addEventListener('click', () => this.closeSearch());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeSearch();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('globalSearchInput').focus();
      }
    });

    // 同步按钮
    document.getElementById('btnSync').addEventListener('click', () => this.handleSync());

    // 模态框关闭
    document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeModal();
    });
  },

  // ====== 解锁/锁定 ======
  async unlock() {
    const pwd = document.getElementById('unlockPwd').value;
    const hash = await this._hashPassword(pwd);
    const storedHash = await InfoVaultDB.getSetting('master_password_hash');
    
    if (hash !== storedHash) {
      document.getElementById('unlockError').textContent = '❌ 密码错误，请重试';
      document.getElementById('unlockPwd').value = '';
      document.getElementById('unlockPwd').focus();
      return;
    }
    
    // 设置加密密钥
    await InfoVaultDB.setEncryptionKey(pwd);
    document.getElementById('unlockOverlay').classList.remove('open');
    document.getElementById('unlockError').textContent = '';
    this._afterUnlock();
    
    // 更新标题栏锁图标
    const lockBtn = document.getElementById('btnLock');
    if (lockBtn) {
      lockBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
      lockBtn.title = '锁定';
    }
  },

  _afterUnlock() {
    // 导航
    document.querySelectorAll('[data-view]').forEach(el => {
      el.addEventListener('click', () => this.navigateTo(el.dataset.view));
    });

    // 搜索
    const searchInput = document.getElementById('globalSearchInput');
    searchInput.addEventListener('input', () => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => this.handleSearch(searchInput.value), 300);
    });
    searchInput.addEventListener('focus', () => {
      if (searchInput.value) this.handleSearch(searchInput.value);
    });
    document.getElementById('searchOverlay').addEventListener('click', () => this.closeSearch());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeSearch();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('globalSearchInput').focus();
      }
    });

    // 自动同步
    if (InfoVaultSync.isConfigured()) {
      setTimeout(() => InfoVaultSync.sync(), 2000);
      setInterval(() => {
        if (InfoVaultSync.isConfigured()) InfoVaultSync.sync();
      }, 5 * 60 * 1000); // 每5分钟
    }

    // 锁定按钮
    const lockBtn = document.getElementById('btnLock');
    if (lockBtn) {
      lockBtn.style.display = '';
      lockBtn.addEventListener('click', () => this.lock());
    }

    // 加载默认视图
    this.navigateTo('dashboard');

    // 安全 & 同步增强
    this._setupSecurityAndSync();
  },

  _setupSecurityAndSync() {
    // 剪贴板30秒后自动清除（劫持copyToClipboard）
    const origCopy = this.copyToClipboard.bind(this);
    this.copyToClipboard = (text, msg) => {
      navigator.clipboard.writeText(text).then(() => {
        this.toast(msg || '已复制（30秒后自动清除）');
        if (this._clipboardTimer) clearTimeout(this._clipboardTimer);
        this._clipboardTimer = setTimeout(() => {
          navigator.clipboard.writeText('').catch(() => {});
          this._clipboardTimer = null;
        }, 30000);
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta);
        ta.select(); document.execCommand('copy');
        document.body.removeChild(ta);
        this.toast(msg || '已复制');
      });
    };
    // 闲置5分钟自动锁定
    const resetIdle = () => {
      if (this._idleTimer) clearTimeout(this._idleTimer);
      this._idleTimer = setTimeout(() => {
        InfoVaultDB.getSetting('master_password_hash').then(hash => {
          if (hash && InfoVaultDB.isEncryptionEnabled()) { this.lock(); this.toast('闲置超时，已自动锁定','info'); }
        });
      }, 300000);
    };
    ['mousemove','keydown','click','scroll','touchstart'].forEach(e => document.addEventListener(e, resetIdle, {passive:true}));
    resetIdle();
    // 页面可见时拉取，隐藏时推送
    document.addEventListener('visibilitychange', () => {
      if (!InfoVaultSync.isConfigured()) return;
      if (document.visibilityState === 'visible') InfoVaultSync.pull();
      else InfoVaultSync.push();
    });
    // 关闭前推送
    window.addEventListener('beforeunload', () => { if (InfoVaultSync.isConfigured()) InfoVaultSync.push(); });
    // 多标签页同步
    try { this._bc = new BroadcastChannel('infovault-sync');
      this._bc.onmessage = () => this.renderView(this.currentView);
    } catch(e) {}
  },

  lock() {
    // 清除加密密钥
    InfoVaultDB.setEncryptionKey(null);
    // 显示解锁界面
    document.getElementById('unlockOverlay').classList.add('open');
    document.getElementById('unlockPwd').value = '';
    document.getElementById('unlockPwd').focus();
    document.getElementById('unlockError').textContent = '';
    // 清空内容区
    document.getElementById('contentArea').innerHTML = '';
  },

  // ====== 导航 ======
  navigateTo(view) {
    this.currentView = view;
    // 更新导航高亮
    document.querySelectorAll('[data-view]').forEach(el => {
      el.classList.toggle('active', el.dataset.view === view);
    });
    // 更新标题
    const titles = {
      dashboard: '仪表盘', passwords: '密码管理', wallets: '虚拟钱包',
      identities: '证件管理', notes: '安全笔记', bookmarks: '收藏夹',
      images: '图片管理', emails: '邮箱账号', crypto: '加密货币', files: '文件管理', trash: '回收站',
      settings: '设置', help: '帮助与支持'
    };
    document.getElementById('pageTitle').textContent = titles[view] || view;
    // 渲染视图
    this.renderView(view);
  },

  async renderView(view) {
    const area = document.getElementById('contentArea');
    switch (view) {
      case 'dashboard': await this.renderDashboard(area); break;
      case 'passwords': await this.renderPasswords(area); break;
      case 'wallets': await this.renderWallets(area); break;
      case 'identities': await this.renderIdentities(area); break;
      case 'notes': await this.renderNotes(area); break;
      case 'bookmarks': await this.renderBookmarks(area); break;
      case 'images': await this.renderImages(area); break;
      case 'emails': await this.renderEmails(area); break;
      case 'crypto': await this.renderCrypto(area); break;
      case 'files': await this.renderFiles(area); break;
      case 'trash': await this.renderTrash(area); break;
      case 'settings': await this.renderSettings(area); break;
      case 'help': await this.renderHelp(area); break;
      default: area.innerHTML = '<div class="empty-state"><h3>页面开发中</h3></div>';
    }
  },

  // ====== 仪表盘 ======
  async renderDashboard(area) {
    const stats = await InfoVaultDB.getStats();
    const recent = await InfoVaultDB.getRecent(8);
    
    area.innerHTML = `
      <!-- Welcome Banner -->
      <section class="card" style="background: linear-gradient(135deg, rgba(59,110,246,0.15) 0%, transparent 100%); overflow: hidden; position: relative; margin-bottom: 24px;">
        <div style="position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: rgba(59,110,246,0.08); border-radius: 50%;"></div>
        <div style="position: relative; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h2 style="font-size: 22px; font-weight: 700; color: var(--color-neutral-900); margin-bottom: 4px;">欢迎使用 InfoVault</h2>
            <p style="color: var(--color-neutral-500); font-size: var(--text-sm);">你的个人信息安全管家 · 共 ${stats.total} 个条目</p>
          </div>
          ${stats.total === 0 ? `<button class="btn btn-primary" onclick="InfoVaultApp.seedDemoData()" style="flex-shrink:0;">加载演示数据</button>` : ''}
        </div>
      </section>

      <!-- Stats -->
      <section class="stat-grid" style="margin-bottom: 24px;">
        <div class="stat-card"><div class="stat-icon blue">${this.icons.globe}</div><div><div class="stat-number">${stats.password || 0}</div><div class="stat-label">网站账号</div></div></div>
        <div class="stat-card"><div class="stat-icon orange">${this.icons.wallet}</div><div><div class="stat-number">${stats.wallet || 0}</div><div class="stat-label">虚拟钱包</div></div></div>
        <div class="stat-card"><div class="stat-icon purple">${this.icons.identity}</div><div><div class="stat-number">${stats.identity || 0}</div><div class="stat-label">证件信息</div></div></div>
        <div class="stat-card"><div class="stat-icon green">${this.icons.note}</div><div><div class="stat-number">${stats.note || 0}</div><div class="stat-label">安全笔记</div></div></div>
      </section>

      <!-- Recent -->
      <section class="card">
        <div class="card-header">
          <span class="card-title">最近更新</span>
        </div>
        ${recent.length === 0 ? '<div class="empty-state" style="padding: 40px 20px;"><p>还没有数据，点击左侧菜单开始添加</p></div>' : `
        <div style="display: flex; flex-direction: column; gap: 4px;">
          ${recent.map(item => `
            <div class="sidebar-nav-item" style="cursor: pointer;" onclick="InfoVaultApp.openItem('${item.id}')">
              <span style="width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: ${this.typeColors[item.type]}20; color: ${this.typeColors[item.type]}; flex-shrink: 0;">
                ${this.icons[item.type === 'bookmark' ? 'bookmark' : item.type === 'password' ? 'key' : item.type]}
              </span>
              <span style="flex: 1; font-size: var(--text-sm); color: var(--color-neutral-900);">${this._escape(item.name)}</span>
              <span class="badge ${this._badgeClass(item.type)}">${this.typeNames[item.type]}</span>
              <span style="font-size: var(--text-xs); color: var(--color-neutral-500);">${this._timeAgo(item.updatedAt)}</span>
            </div>
          `).join('')}
        </div>`}
      </section>
    `;
  },

  // ====== 密码管理 ======
  async renderPasswords(area) {
    const entries = await InfoVaultDB.getAll('password');
    area.innerHTML = `
      <div class="toolbar">
        <div class="search-box" style="width: 260px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; color: var(--color-neutral-500); flex-shrink: 0;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="搜索网站/用户名..." id="pwSearch" oninput="InfoVaultApp.filterPasswords(this.value)" style="flex:1; background:transparent; border:none; outline:none; color:var(--color-neutral-900); font-size:var(--text-sm);">
        </div>
        <div class="filter-group" id="pwFilterGroup">
          <button class="filter-btn active" data-filter="all" onclick="InfoVaultApp.filterPasswordsByCat('all')">全部</button>
          ${InfoVaultDB.CATEGORIES.password.map(c => `<button class="filter-btn" data-filter="${c}" onclick="InfoVaultApp.filterPasswordsByCat('${c}')">${c}</button>`).join('')}
        </div>
        <div style="flex:1"></div>
        <button class="btn btn-danger btn-sm" onclick="InfoVaultApp.deleteSelected()" style="display:none;" id="btnBatchDelete">批量删除</button>
        <button class="btn btn-primary" onclick="InfoVaultApp.showAddPassword()">${this.icons.plus} 添加密码</button>
      </div>
      <div class="card" style="padding:0; overflow:hidden;">
        ${entries.length === 0 ? '<div class="empty-state" style="padding:60px 20px;"><h3>还没有密码</h3><p>点击上方"添加密码"按钮开始添加</p></div>' : `
        <div class="table-wrap">
          <table id="pwTable">
            <thead><tr>
              <th style="width:30px"><input type="checkbox" id="pwSelectAll" onchange="InfoVaultApp.toggleSelectAll(this.checked)" style="accent-color:var(--color-primary-500);"></th>
              <th>网站</th><th>用户名</th><th>密码</th><th>分类</th><th>安全等级</th><th>更新时间</th><th style="text-align:right">操作</th>
            </tr></thead>
            <tbody>${entries.map(e => this._passwordRow(e)).join('')}</tbody>
          </table>
        </div>`}
      </div>
    `;
  },

  _passwordRow(e) {
    const strength = InfoVaultCrypto.evaluateStrength(e.password);
    const pwEnc = this._escape(e.password);
    return `<tr class="hover:bg-muted/30 transition-colors group" data-pwid="${e.id}">
      <td style="width:30px"><input type="checkbox" class="pw-checkbox" data-id="${e.id}" onchange="InfoVaultApp._updateBatchDeleteBtn()" style="accent-color:var(--color-primary-500);"></td>
      <td><div style="display:flex;align-items:center;gap:10px;">
        <div style="width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:${e.color || '#3b6ef6'};color:white;font-size:12px;font-weight:700;flex-shrink:0;">${(e.name||'?')[0].toUpperCase()}</div>
        <span style="font-weight:500;color:var(--color-neutral-900);">${this._escape(e.name)}</span>
        <button class="btn btn-icon btn-ghost" onclick="InfoVaultApp.toggleFavorite('${e.id}')" title="${e.favorite ? '取消收藏' : '收藏'}" style="color:${e.favorite ? '#f59e0b' : 'var(--color-neutral-400)'};">${e.favorite ? '★' : '☆'}</button>
      </div></td>
      <td style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--color-neutral-500);">${this._escape(this._maskStr(e.username, 6))}</td>
      <td><div style="display:flex;align-items:center;gap:6px;">
        <span class="pw-dots" data-pw="${pwEnc}" data-pwlen="${Math.min(12, Math.max(6, (e.password||'').length))}" data-showing="false" style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--color-neutral-500);letter-spacing:2px;">${'•'.repeat(Math.min(12, Math.max(6, (e.password||'').length)))}</span>
        <button class="btn btn-icon btn-ghost" onclick="InfoVaultApp.copyToClipboardFromAttr(this)" data-copy="${pwEnc}" title="复制密码">${this.icons.copy}</button>
        <button class="btn btn-icon btn-ghost toggle-pw" onclick="InfoVaultApp.togglePassword(this)" title="显示密码">${this.icons.eye}</button>
      </div></td>
      <td><span class="badge ${this._badgeClass(e.category)}">${e.category || '未分类'}</span></td>
      <td><div style="display:flex;align-items:center;gap:6px;">
        <span style="width:8px;height:8px;border-radius:50%;background:${strength.color};"></span>
        <span style="font-size:var(--text-xs);color:${strength.color};font-weight:500;">${strength.label}</span>
      </div></td>
      <td style="font-size:var(--text-xs);color:var(--color-neutral-500);">${this._timeAgo(e.updatedAt)}</td>
      <td style="text-align:right;">
        <div style="display:flex;gap:4px;justify-content:flex-end;opacity:0.6;transition:opacity 0.15s;" onmouseenter="this.style.opacity=1" onmouseleave="this.style.opacity=0.6">
          <a href="${e.url || '#'}" target="_blank" class="btn btn-icon btn-ghost" title="打开网站">${this.icons.link}</a>
          <button class="btn btn-icon btn-ghost" onclick="InfoVaultApp.editEntry('${e.id}')" title="编辑">${this.icons.edit}</button>
          <button class="btn btn-icon btn-ghost" onclick="InfoVaultApp.deleteEntry('${e.id}')" title="删除" style="color:#ef4444;">${this.icons.trash}</button>
        </div>
      </td>
    </tr>`;
  },

  filterPasswords(query) {
    const rows = document.querySelectorAll('#pwTable tbody tr');
    const q = query.toLowerCase();
    rows.forEach(r => {
      r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  },

  _pwFilterActive: 'all',
  filterPasswordsByCat(cat) {
    this._pwFilterActive = cat;
    document.querySelectorAll('#pwFilterGroup .filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === cat));
    const rows = document.querySelectorAll('#pwTable tbody tr');
    rows.forEach(r => {
      if (cat === 'all') { r.style.display = ''; return; }
      r.style.display = r.querySelector('.badge')?.textContent === cat ? '' : 'none';
    });
  },

  // ====== 钱包管理 ======
  async renderWallets(area) {
    const entries = await InfoVaultDB.getAll('wallet');
    area.innerHTML = `
      <div class="toolbar">
        <div class="search-box" style="width:260px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;color:var(--color-neutral-500);flex-shrink:0;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="搜索钱包..." id="wlSearch" oninput="InfoVaultApp.filterGeneric(this.value, '#wlGrid .wallet-card')" style="flex:1;background:transparent;border:none;outline:none;color:var(--color-neutral-900);font-size:var(--text-sm);">
        </div>
        <div style="flex:1"></div>
        <button class="btn btn-primary" onclick="InfoVaultApp.showAddWallet()">${this.icons.plus} 添加钱包</button>
      </div>
      ${entries.length === 0 ? '<div class="empty-state"><h3>还没有钱包</h3><p>点击上方按钮开始添加虚拟钱包</p></div>' : `
      <div class="stat-grid" id="wlGrid">
        ${entries.map(e => `
          <div class="stat-card wallet-card" style="cursor:pointer;" onclick="InfoVaultApp.openItem('${e.id}')">
            <div class="stat-icon orange">${this.icons.wallet}</div>
            <div style="flex:1;min-width:0;">
              <div class="stat-number" style="font-size:20px;">${this._escape(e.name)}</div>
              <div style="font-size:var(--text-xs);color:var(--color-neutral-500);margin-top:2px;">${this._escape(e.platform || '')} · ${this._escape(e.accountName || '')}</div>
              <div style="font-size:var(--text-sm);font-weight:600;color:var(--color-neutral-900);margin-top:4px;">${e.balance || '0.00'} ${e.currency || 'CNY'}</div>
            </div>
          </div>
        `).join('')}
      </div>`}
    `;
  },

  // ====== 证件管理 ======
  async renderIdentities(area) {
    const entries = await InfoVaultDB.getAll('identity');
    area.innerHTML = `
      <div class="toolbar">
        <div class="search-box" style="width:260px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;color:var(--color-neutral-500);flex-shrink:0;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="搜索证件..." oninput="InfoVaultApp.filterGeneric(this.value, '#idTable tbody tr')" style="flex:1;background:transparent;border:none;outline:none;color:var(--color-neutral-900);font-size:var(--text-sm);">
        </div>
        <div style="flex:1"></div>
        <button class="btn btn-primary" onclick="InfoVaultApp.showAddIdentity()">${this.icons.plus} 添加证件</button>
      </div>
      <div class="card" style="padding:0;overflow:hidden;">
        ${entries.length === 0 ? '<div class="empty-state" style="padding:60px 20px;"><h3>还没有证件</h3><p>点击上方按钮添加证件信息</p></div>' : `
        <div class="table-wrap">
          <table id="idTable">
            <thead><tr><th>证件类型</th><th>姓名</th><th>证件号码</th><th>发证机关</th><th>有效期</th><th style="text-align:right">操作</th></tr></thead>
            <tbody>${entries.map(e => `<tr>
              <td><div style="display:flex;align-items:center;gap:10px;">
                <span class="badge badge-purple">${this._escape(e.identityType || '其他')}</span>
              </div></td>
              <td style="font-weight:500;color:var(--color-neutral-900);">${this._escape(e.realName)}</td>
              <td style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--color-neutral-500);">${this._escape(this._maskStr(e.idNumber, 8))}</td>
              <td style="color:var(--color-neutral-600);">${this._escape(e.issuingAuthority || '-')}</td>
              <td style="font-size:var(--text-xs);color:var(--color-neutral-500);">${e.expiryDate || '长期有效'}</td>
              <td style="text-align:right;"><div style="display:flex;gap:4px;justify-content:flex-end;">
                <button class="btn btn-icon btn-ghost" onclick="InfoVaultApp.editEntry('${e.id}')">${this.icons.edit}</button>
                <button class="btn btn-icon btn-ghost" onclick="InfoVaultApp.deleteEntry('${e.id}')" style="color:#ef4444;">${this.icons.trash}</button>
              </div></td>
            </tr>`).join('')}</tbody>
          </table>
        </div>`}
      </div>
    `;
  },

  // ====== 笔记 ======
  async renderNotes(area) {
    const entries = await InfoVaultDB.getAll('note');
    area.innerHTML = `
      <div class="toolbar">
        <div class="search-box" style="width:260px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;color:var(--color-neutral-500);flex-shrink:0;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="搜索笔记..." oninput="InfoVaultApp.filterGeneric(this.value, '#noteGrid .note-card')" style="flex:1;background:transparent;border:none;outline:none;color:var(--color-neutral-900);font-size:var(--text-sm);">
        </div>
        <div style="flex:1"></div>
        <button class="btn btn-primary" onclick="InfoVaultApp.showAddNote()">${this.icons.plus} 写笔记</button>
      </div>
      ${entries.length === 0 ? '<div class="empty-state"><h3>还没有笔记</h3><p>点击上方按钮开始记录</p></div>' : `
      <div class="stat-grid" id="noteGrid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr));">
        ${entries.map(e => `
          <div class="card note-card" style="cursor:pointer;" onclick="InfoVaultApp.openItem('${e.id}')">
            <div style="font-weight:600;color:var(--color-neutral-900);margin-bottom:8px;font-size:var(--text-sm);">${this._escape(e.title || '无标题')}</div>
            <div style="font-size:var(--text-xs);color:var(--color-neutral-500);line-height:1.6;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;">${this._escape((e.content||'').slice(0, 200))}</div>
            ${e.tags?.length ? `<div style="display:flex;gap:4px;margin-top:12px;flex-wrap:wrap;">${e.tags.map(t => `<span class="badge badge-gray">#${this._escape(t)}</span>`).join('')}</div>` : ''}
            <div style="font-size:10px;color:var(--color-neutral-500);margin-top:12px;">${this._timeAgo(e.updatedAt)}</div>
          </div>
        `).join('')}
      </div>`}
    `;
  },

  // ====== 收藏夹 ======
  async renderBookmarks(area) {
    const entries = await InfoVaultDB.getAll('bookmark');
    area.innerHTML = `
      <div class="toolbar">
        <div class="search-box" style="width:260px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;color:var(--color-neutral-500);flex-shrink:0;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="搜索收藏..." oninput="InfoVaultApp.filterGeneric(this.value, '#bmGrid .bookmark-card')" style="flex:1;background:transparent;border:none;outline:none;color:var(--color-neutral-900);font-size:var(--text-sm);">
        </div>
        <div style="flex:1"></div>
        <button class="btn btn-primary" onclick="InfoVaultApp.showAddBookmark()">${this.icons.plus} 添加收藏</button>
      </div>
      ${entries.length === 0 ? '<div class="empty-state"><h3>还没有收藏</h3><p>点击上方按钮添加收藏</p></div>' : `
      <div class="stat-grid" id="bmGrid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr));">
        ${entries.map(e => `
          <div class="card bookmark-card" style="cursor:pointer;" onclick="InfoVaultApp.openItem('${e.id}')">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="width:40px;height:40px;border-radius:8px;background:rgba(236,72,153,0.1);color:#ec4899;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${this.icons.link}</div>
              <div style="flex:1;min-width:0;">
                <div style="font-weight:500;color:var(--color-neutral-900);font-size:var(--text-sm);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${this._escape(e.title || e.name)}</div>
                <div style="font-size:var(--text-xs);color:var(--color-primary-500);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${this._escape(e.url || '')}</div>
              </div>
            </div>
            ${e.description ? `<div style="font-size:var(--text-xs);color:var(--color-neutral-500);margin-top:8px;line-height:1.5;">${this._escape(e.description)}</div>` : ''}
            ${e.tags?.length ? `<div style="display:flex;gap:4px;margin-top:8px;flex-wrap:wrap;">${e.tags.map(t => `<span class="badge badge-gray">#${this._escape(t)}</span>`).join('')}</div>` : ''}
          </div>
        `).join('')}
      </div>`}
    `;
  },

  // ====== 邮箱账号 ======
  async renderEmails(area) {
    const entries = await InfoVaultDB.getAll('email');
    area.innerHTML = `
      <div class="toolbar">
        <div class="search-box" style="width:260px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;color:var(--color-neutral-500);flex-shrink:0;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="搜索邮箱..." oninput="InfoVaultApp.filterGeneric(this.value, '#emailTable tbody tr')" style="flex:1;background:transparent;border:none;outline:none;color:var(--color-neutral-900);font-size:var(--text-sm);">
        </div>
        <div style="flex:1"></div>
        <button class="btn btn-primary" onclick="InfoVaultApp.showAddEmail()" style="background:#22c55e;">${this.icons.plus} 添加邮箱</button>
      </div>
      <div class="card" style="padding:0;overflow:hidden;">
        ${entries.length === 0 ? '<div class="empty-state" style="padding:60px 20px;"><h3>还没有邮箱账号</h3><p>添加你的邮箱账号，安全存储邮箱密码和服务器配置</p></div>' : `
        <div class="table-wrap">
          <table id="emailTable">
            <thead><tr><th>邮箱</th><th>用户名</th><th>分类</th><th>SMTP</th><th>更新时间</th><th style="text-align:right">操作</th></tr></thead>
            <tbody>${entries.map(e => `<tr>
              <td><div style="display:flex;align-items:center;gap:10px;">
                <div style="width:32px;height:32px;border-radius:8px;background:rgba(34,197,94,0.12);color:#22c55e;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${this.icons.note}</div>
                <span style="font-weight:500;color:var(--color-neutral-900);">${this._escape(e.email || e.name)}</span>
              </div></td>
              <td style="color:var(--color-neutral-600);font-size:var(--text-xs);">${this._escape(e.username || '')}</td>
              <td><span class="badge badge-green">${this._escape(e.category || '个人')}</span></td>
              <td style="font-size:var(--text-xs);color:var(--color-neutral-500);font-family:var(--font-mono);">${e.smtpHost ? e.smtpHost + ':' + e.smtpPort : '-'}</td>
              <td style="font-size:var(--text-xs);color:var(--color-neutral-500);">${this._timeAgo(e.updatedAt)}</td>
              <td style="text-align:right;"><div style="display:flex;gap:4px;justify-content:flex-end;">
                <button class="btn btn-icon btn-ghost" onclick="InfoVaultApp.editEntry('${e.id}')">${this.icons.edit}</button>
                <button class="btn btn-icon btn-ghost" onclick="InfoVaultApp.deleteEntry('${e.id}')" style="color:#ef4444;">${this.icons.trash}</button>
              </div></td>
            </tr>`).join('')}</tbody>
          </table>
        </div>`}
      </div>
    `;
  },

  // ====== 加密货币钱包 ======
  async renderCrypto(area) {
    const entries = await InfoVaultDB.getAll('crypto');
    area.innerHTML = `
      <div class="toolbar">
        <div class="search-box" style="width:260px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;color:var(--color-neutral-500);flex-shrink:0;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="搜索链/地址..." oninput="InfoVaultApp.filterGeneric(this.value, '#cryptoGrid .crypto-card')" style="flex:1;background:transparent;border:none;outline:none;color:var(--color-neutral-900);font-size:var(--text-sm);">
        </div>
        <div style="flex:1"></div>
        <button class="btn btn-primary" onclick="InfoVaultApp.showAddCrypto()" style="background:#f59e0b;">${this.icons.plus} 添加钱包</button>
      </div>
      ${entries.length === 0 ? '<div class="empty-state"><h3>还没有加密货币钱包</h3><p>安全存储你的私钥、助记词和Keystore</p></div>' : `
      <div class="stat-grid" id="cryptoGrid">
        ${entries.map(e => `
          <div class="stat-card crypto-card" style="cursor:pointer;flex-direction:column;align-items:stretch;" onclick="InfoVaultApp.openItem('${e.id}')">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
              <div class="stat-icon orange" style="width:36px;height:36px;">${this.icons.key}</div>
              <div style="flex:1;">
                <div style="font-weight:600;color:var(--color-neutral-900);font-size:var(--text-sm);">${this._escape(e.name)}</div>
                <span class="badge badge-orange">${this._escape(e.chain || 'ETH')}</span>
              </div>
            </div>
            <div style="font-size:11px;color:var(--color-neutral-500);font-family:var(--font-mono);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${this._escape(this._maskStr(e.address, 10))}</div>
            <div style="display:flex;gap:12px;margin-top:8px;font-size:11px;color:var(--color-neutral-500);">
              ${e.privateKey ? '<span>🔑 有私钥</span>' : ''}
              ${e.seedPhrase ? '<span>📝 有助记词</span>' : ''}
              ${e.keystore ? '<span>📦 有Keystore</span>' : ''}
            </div>
          </div>
        `).join('')}
      </div>`}
    `;
  },

  // ====== 文件管理 ======
  async renderFiles(area) {
    const entries = await InfoVaultDB.getAll('file');
    area.innerHTML = `
      <div class="toolbar">
        <div class="search-box" style="width:260px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;color:var(--color-neutral-500);flex-shrink:0;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="搜索文件名..." oninput="InfoVaultApp.filterGeneric(this.value, '#fileGrid .file-card')" style="flex:1;background:transparent;border:none;outline:none;color:var(--color-neutral-900);font-size:var(--text-sm);">
        </div>
        <div style="flex:1"></div>
        <button class="btn btn-primary" onclick="InfoVaultApp.uploadFile()">${this.icons.plus} 上传文件</button>
      </div>
      ${entries.length === 0 ? '<div class="empty-state"><h3>还没有文件</h3><p>上传文档、PDF、压缩包等任意文件，加密存储</p></div>' : `
      <div class="stat-grid" id="fileGrid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr));">
        ${entries.map(e => `
          <div class="card file-card" style="cursor:pointer;" onclick="InfoVaultApp.downloadFile('${e.id}')">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="width:40px;height:40px;border-radius:10px;background:rgba(59,130,246,0.1);color:#3b82f6;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${this.icons.download}</div>
              <div style="flex:1;min-width:0;">
                <div style="font-weight:500;color:var(--color-neutral-900);font-size:var(--text-sm);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${this._escape(e.name)}</div>
                <div style="font-size:11px;color:var(--color-neutral-500);">${e.fileSize || ''} · ${e.mimeType || '未知类型'}</div>
              </div>
            </div>
            <div style="font-size:10px;color:var(--color-neutral-500);margin-top:8px;">${this._timeAgo(e.updatedAt)}</div>
          </div>
        `).join('')}
      </div>`}
    `;
  },
  async renderImages(area) {
    const entries = await InfoVaultDB.getAll('image');
    area.innerHTML = `
      <div class="toolbar">
        <div class="search-box" style="width:260px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;color:var(--color-neutral-500);flex-shrink:0;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="搜索图片名称..." oninput="InfoVaultApp.filterGeneric(this.value, '#imgGrid .image-card')" style="flex:1;background:transparent;border:none;outline:none;color:var(--color-neutral-900);font-size:var(--text-sm);">
        </div>
        <div style="flex:1"></div>
        <button class="btn btn-primary" onclick="InfoVaultApp.uploadImage()">${this.icons.plus} 上传图片</button>
      </div>
      ${entries.length === 0 ? '<div class="empty-state"><h3>还没有图片</h3><p>点击上传按钮添加图片</p></div>' : `
      <div class="image-grid" id="imgGrid">
        ${entries.map(e => `
          <div class="image-card" onclick="InfoVaultApp.openItem('${e.id}')">
            <div class="image-card-bg" style="background:${e.gradient || 'linear-gradient(135deg, #3b6ef6, #8db1ff)'}; display:flex; align-items:center; justify-content:center;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
            <div class="image-card-hover">
              <button class="btn btn-icon" style="background:rgba(255,255,255,0.2);color:white;backdrop-filter:blur(4px);" onclick="event.stopPropagation();InfoVaultApp.downloadImage('${e.id}')">${this.icons.download}</button>
              <button class="btn btn-icon" style="background:rgba(255,255,255,0.2);color:#ef4444;backdrop-filter:blur(4px);" onclick="event.stopPropagation();InfoVaultApp.deleteEntry('${e.id}')">${this.icons.trash}</button>
            </div>
            <div class="image-card-info">
              <div class="image-card-name">${this._escape(e.filename || e.name)}</div>
              <div style="font-size:10px;color:rgba(255,255,255,0.6);">${e.fileSize || ''} ${this._timeAgo(e.updatedAt)}</div>
            </div>
          </div>
        `).join('')}
      </div>`}
    `;
  },

  async uploadImage() {
    const cats = InfoVaultDB.CATEGORIES.image || ['身份证', '银行卡', '其他'];
    const catStr = cats.map((c, i) => i+1+'.'+c).join(' ');
    const input = prompt('选择图片分类 (输入数字或自定义名称):\n'+catStr+'\n直接回车选「其他」');
    let category = '其他';
    if (input !== null && input.trim()) {
      const num = parseInt(input);
      if (num > 0 && num <= cats.length) category = cats[num-1];
      else category = input.trim();
    }
    await this._doUpload('image', category, 'image/*');
  },

  async uploadFile() {
    const cats = InfoVaultDB.CATEGORIES.file || ['文档', 'PDF', '其他'];
    const catStr = cats.map((c, i) => i+1+'.'+c).join(' ');
    const input = prompt('选择文件分类 (输入数字或自定义名称):\n'+catStr+'\n直接回车选「其他」');
    let category = '其他';
    if (input !== null && input.trim()) {
      const num = parseInt(input);
      if (num > 0 && num <= cats.length) category = cats[num-1];
      else category = input.trim();
    }
    await this._doUpload('file', category);
  },

  async _doUpload(type, category, accept) {
    const input = document.createElement('input');
    input.type = 'file';
    if (accept) input.accept = accept;
    input.multiple = true;
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      let completed = 0;
      for (const file of files) {
        try {
          const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          });
          const name = file.name.replace(/\.[^.]+$/, '');
          const entry = { type, name, filename: file.name, fileSize: (file.size/1024).toFixed(1)+' KB', mimeType: file.type||'application/octet-stream', category };
          if (type === 'image') { entry.dataUrl = dataUrl; entry.gradient = this._randomGradient(); }
          else { entry.fileData = dataUrl; }
          await InfoVaultDB.add(entry);
          completed++;
        } catch(err) { console.error('Upload error:', err); }
      }
      this.toast('✅ 已上传 '+completed+'/'+files.length+' 个'+(type==='image'?'图片':'文件')+'到「'+category+'」');
      this.renderView(this.currentView);
      if (InfoVaultSync.isConfigured()) InfoVaultSync.push();
    };
    input.click();
  },

async uploadFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = async (e) => {
      let count = 0;
      for (const file of e.target.files) {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const dataUrl = ev.target.result;
          const name = file.name.replace(/\.[^.]+$/, '');
          await InfoVaultDB.add({
            type: 'file',
            name: name,
            filename: file.name,
            fileSize: (file.size / 1024).toFixed(1) + ' KB',
            mimeType: file.type || 'application/octet-stream',
            fileData: dataUrl
          });
          count++;
        };
        reader.readAsDataURL(file);
      }
      setTimeout(() => {
        this.toast(`已上传 ${e.target.files.length} 个文件`);
        this.renderView(this.currentView);
        if (InfoVaultSync.isConfigured()) InfoVaultSync.push();
      }, 500);
    };
    input.click();
  },

  async downloadFile(id) {
    const entry = await InfoVaultDB.get(id);
    if (!entry || !entry.fileData) { this.toast('文件数据不可用', 'error'); return; }
    const a = document.createElement('a');
    a.href = entry.fileData;
    a.download = entry.filename || entry.name || 'download';
    a.click();
    this.toast('已下载');
  },

  // ====== 查看条目详情 ======
  async openItem(id) {
    const entry = await InfoVaultDB.get(id);
    if (!entry) { this.toast('条目不存在', 'error'); return; }
    
    // 存储当前条目供详情页使用
    this._currentDetailEntry = entry;
    
    let body = '';
    switch (entry.type) {
      case 'password': {
        const strength = InfoVaultCrypto.evaluateStrength(entry.password);
        const pwEnc = this._escape(entry.password);
        body = `
          <div class="detail-section">
            <div class="detail-section-title">网站信息</div>
            <div class="detail-grid">
              <div class="detail-label">网站名称</div><div class="detail-value" style="font-weight:600;">${this._escape(entry.name)}</div>
              <div class="detail-label">URL</div><div class="detail-value mono">${entry.url ? `<a href="${this._escape(entry.url)}" target="_blank" style="color:var(--color-primary-500);">${this._escape(entry.url)}</a>` : '-'}</div>
              <div class="detail-label">用户名</div><div class="detail-value mono">${this._escape(entry.username)} <button class="btn btn-icon btn-ghost" onclick="InfoVaultApp.copyToClipboard('${this._escape(entry.username)}','用户名已复制')">${this.icons.copy}</button></div>
              <div class="detail-label">密码</div><div class="detail-value mono" id="detailPw" data-pw="${pwEnc}">${'•'.repeat(16)} <button class="btn btn-icon btn-ghost" onclick="InfoVaultApp.copyToClipboard(document.getElementById('detailPw').dataset.pw,'密码已复制')">${this.icons.copy}</button>
                <button class="btn btn-icon btn-ghost" onclick="InfoVaultApp.showDetailPassword()">${this.icons.eye}</button></div>
              <div class="detail-label">安全等级</div><div class="detail-value"><span style="color:${strength.color};font-weight:600;">${strength.label} (${strength.score}/100)</span></div>
              <div class="detail-label">分类</div><div class="detail-value"><span class="badge badge-blue">${entry.category || '未分类'}</span></div>
            </div>
          </div>
          ${entry.notes ? `<div class="detail-section"><div class="detail-section-title">备注</div><p style="font-size:var(--text-sm);color:var(--color-neutral-800);">${this._escape(entry.notes)}</p></div>` : ''}
          <div class="detail-section"><div class="detail-section-title">时间</div><div class="detail-grid">
            <div class="detail-label">创建时间</div><div class="detail-value" style="font-size:var(--text-xs);">${new Date(entry.createdAt).toLocaleString()}</div>
            <div class="detail-label">更新时间</div><div class="detail-value" style="font-size:var(--text-xs);">${new Date(entry.updatedAt).toLocaleString()}</div>
          </div></div>`;
        break;
      }
      case 'wallet': body = `
        <div class="detail-section">
          <div class="detail-section-title">钱包信息</div>
          <div class="detail-grid">
            <div class="detail-label">名称</div><div class="detail-value" style="font-weight:600;">${this._escape(entry.name)}</div>
            <div class="detail-label">平台</div><div class="detail-value">${entry.platform || '-'}</div>
            <div class="detail-label">账户</div><div class="detail-value mono">${this._escape(entry.accountName || '')}</div>
            <div class="detail-label">账号/卡号</div><div class="detail-value mono">${this._escape(entry.accountNumber || '') || '-'}</div>
            <div class="detail-label">余额</div><div class="detail-value" style="font-weight:600;font-size:var(--text-lg);color:var(--state-success);">${entry.balance || '0.00'} ${entry.currency || 'CNY'}</div>
          </div>
        </div>`;
        break;
      case 'identity': body = `
        <div class="detail-section">
          <div class="detail-section-title">证件信息</div>
          <div class="detail-grid">
            <div class="detail-label">证件类型</div><div class="detail-value"><span class="badge badge-purple">${entry.identityType || '其他'}</span></div>
            <div class="detail-label">姓名</div><div class="detail-value" style="font-weight:600;">${this._escape(entry.realName)}</div>
            <div class="detail-label">证件号码</div><div class="detail-value mono">${this._escape(entry.idNumber)}</div>
            <div class="detail-label">发证机关</div><div class="detail-value">${this._escape(entry.issuingAuthority || '-')}</div>
            <div class="detail-label">有效期</div><div class="detail-value">${entry.expiryDate || '长期有效'}</div>
          </div>
        </div>`;
        break;
      case 'email': body = `
        <div class="detail-section">
          <div class="detail-section-title">邮箱信息</div>
          <div class="detail-grid">
            <div class="detail-label">邮箱地址</div><div class="detail-value" style="font-weight:600;">${this._escape(entry.email)}</div>
            <div class="detail-label">用户名</div><div class="detail-value mono">${this._escape(entry.username || '')}</div>
            <div class="detail-label">密码</div><div class="detail-value mono"><span id="detailEmailPw">${'•'.repeat(12)}</span> <button class="btn btn-icon btn-ghost" onclick="InfoVaultApp.copyToClipboard('${this._escape(entry.password)}','密码已复制')">${this.icons.copy}</button>
              <button class="btn btn-icon btn-ghost" onclick="document.getElementById('detailEmailPw').textContent='${this._escape(entry.password)}'">${this.icons.eye}</button></div>
            <div class="detail-label">SMTP</div><div class="detail-value mono">${entry.smtpHost || '-'}:${entry.smtpPort || '-'}</div>
            <div class="detail-label">IMAP</div><div class="detail-value mono">${entry.imapHost || '-'}:${entry.imapPort || '-'}</div>
            <div class="detail-label">分类</div><div class="detail-value"><span class="badge badge-green">${entry.category || '个人'}</span></div>
          </div>
        </div>`;
        break;
      case 'crypto': body = `
        <div class="detail-section">
          <div class="detail-section-title">钱包信息</div>
          <div class="detail-grid">
            <div class="detail-label">名称</div><div class="detail-value" style="font-weight:600;">${this._escape(entry.name)}</div>
            <div class="detail-label">链/网络</div><div class="detail-value"><span class="badge badge-orange">${entry.chain || 'ETH'}</span></div>
            <div class="detail-label">地址</div><div class="detail-value mono" style="font-size:11px;word-break:break-all;">${this._escape(entry.address || '-')} <button class="btn btn-icon btn-ghost" onclick="InfoVaultApp.copyToClipboard('${this._escape(entry.address)}','地址已复制')">${this.icons.copy}</button></div>
            ${entry.privateKey ? `<div class="detail-label">私钥</div><div class="detail-value mono" style="font-size:11px;"><span id="detailPK">${'•'.repeat(32)}</span> <button class="btn btn-icon btn-ghost" onclick="InfoVaultApp.copyToClipboard('${this._escape(entry.privateKey)}','私钥已复制')">${this.icons.copy}</button>
              <button class="btn btn-icon btn-ghost" onclick="document.getElementById('detailPK').textContent='${this._escape(entry.privateKey)}'">${this.icons.eye}</button></div>` : ''}
            ${entry.seedPhrase ? `<div class="detail-label">助记词</div><div class="detail-value mono" style="font-size:11px;"><span id="detailSeed">${'•'.repeat(48)}</span> <button class="btn btn-icon btn-ghost" onclick="InfoVaultApp.copyToClipboard('${this._escape(entry.seedPhrase)}','助记词已复制')">${this.icons.copy}</button>
              <button class="btn btn-icon btn-ghost" onclick="document.getElementById('detailSeed').textContent='${this._escape(entry.seedPhrase)}'">${this.icons.eye}</button></div>` : ''}
            ${entry.keystore ? `<div class="detail-label">Keystore</div><div class="detail-value" style="font-size:11px;"><button class="btn btn-sm btn-secondary" onclick="InfoVaultApp.copyToClipboard('${this._escape(entry.keystore)}','Keystore已复制')">复制 Keystore</button></div>` : ''}
            <div class="detail-label">钱包密码</div><div class="detail-value mono"><span id="detailCpwd">${'•'.repeat(8)}</span> <button class="btn btn-icon btn-ghost" onclick="document.getElementById('detailCpwd').textContent='${this._escape(entry.password || '')}'">${this.icons.eye}</button></div>
          </div>
        </div>`;
        break;
      default: body = `<pre style="font-size:var(--text-sm);color:var(--color-neutral-800);white-space:pre-wrap;">${JSON.stringify(entry, null, 2)}</pre>`;
    }

    this._showModal(entry.name, `
      ${body}
      <div class="form-actions">
        <button class="btn btn-secondary" onclick="InfoVaultApp.closeModal(); InfoVaultApp.editEntry('${entry.id}')">${this.icons.edit} 编辑</button>
        <button class="btn btn-danger" onclick="InfoVaultApp.deleteEntry('${entry.id}')">${this.icons.trash} 删除</button>
        <button class="btn btn-primary" onclick="InfoVaultApp.closeModal()">关闭</button>
      </div>
    `);
  },

  showDetailPassword() {
    const el = document.getElementById('detailPw');
    if (!el) return;
    const pw = el.dataset.pw || '';
    const copyIcon = this.icons.copy;
    el.innerHTML = `${pw} <button class="btn btn-icon btn-ghost" onclick="InfoVaultApp.copyToClipboard(document.getElementById('detailPw').dataset.pw,'密码已复制')">${copyIcon}</button>`;
  },

  // ====== 编辑/删除 ======
  async editEntry(id) {
    const entry = await InfoVaultDB.get(id);
    if (!entry) return;
    switch (entry.type) {
      case 'password': this.showAddPassword(entry); break;
      case 'wallet': this.showAddWallet(entry); break;
      case 'identity': this.showAddIdentity(entry); break;
      case 'note': this.showAddNote(entry); break;
      case 'bookmark': this.showAddBookmark(entry); break;
      case 'email': this.showAddEmail(entry); break;
      case 'crypto': this.showAddCrypto(entry); break;
      default: this.toast('暂不支持编辑此类型', 'error');
    }
  },

  async deleteEntry(id) {
    if (!confirm('确定要删除这个条目吗？')) return;
    await InfoVaultDB.delete(id);
    this.toast('已删除');
    this.closeModal();
    this.renderView(this.currentView);
    if (InfoVaultSync.isConfigured()) InfoVaultSync.push();
  },

  async toggleFavorite(id) {
    const entry = await InfoVaultDB.get(id);
    if (!entry) return;
    await InfoVaultDB.update(id, { favorite: !entry.favorite });
    this.renderView(this.currentView);
  },

  async deleteSelected() {
    const checks = document.querySelectorAll('.pw-checkbox:checked');
    if (checks.length === 0) { this.toast('请先选择条目', 'info'); return; }
    if (!confirm(`确定删除选中的 ${checks.length} 个条目？`)) return;
    for (const cb of checks) {
      await InfoVaultDB.delete(cb.dataset.id);
    }
    this.toast(`已删除 ${checks.length} 个条目`);
    this.renderView(this.currentView);
    if (InfoVaultSync.isConfigured()) InfoVaultSync.push();
  },

  toggleSelectAll(checked) {
    document.querySelectorAll('.pw-checkbox').forEach(cb => cb.checked = checked);
    this._updateBatchDeleteBtn();
  },

  _updateBatchDeleteBtn() {
    const btn = document.getElementById('btnBatchDelete');
    if (!btn) return;
    const count = document.querySelectorAll('.pw-checkbox:checked').length;
    if (count > 0) {
      btn.style.display = 'inline-flex';
      btn.textContent = `批量删除 (${count})`;
    } else {
      btn.style.display = 'none';
    }
  },

  // ====== 搜索 ======
  async handleSearch(query) {
    if (!query || !query.trim()) { this.closeSearch(); return; }
    const results = await InfoVaultSearch.search(query, { limit: 20 });
    const panel = document.getElementById('searchResults');
    const list = document.getElementById('searchResultsList');
    const count = document.getElementById('searchResultsCount');
    
    if (results.length === 0) {
      count.textContent = '未找到结果';
      list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--color-neutral-500);font-size:var(--text-sm);">没有匹配的条目</div>';
    } else {
      count.textContent = `找到 ${results.length} 个结果`;
      list.innerHTML = results.map(r => {
        const e = r.entry;
        return `<div class="search-result-item" onclick="InfoVaultApp.closeSearch(); InfoVaultApp.openItem('${e.id}')">
          <div class="search-result-icon" style="background:${this.typeColors[e.type]}20;color:${this.typeColors[e.type]};">${this.icons[e.type === 'bookmark' ? 'bookmark' : e.type === 'password' ? 'key' : e.type]}</div>
          <div class="search-result-info">
            <div class="search-result-name">${this._escape(e.name)} <span style="font-weight:400;color:var(--color-neutral-500);">${e.username ? '- ' + this._escape(e.username) : ''}</span></div>
            <div class="search-result-desc">${this._escape(r.snippet.slice(0, 80))}</div>
          </div>
          <span class="search-result-type badge ${this._badgeClass(e.type)}">${this.typeNames[e.type]}</span>
        </div>`;
      }).join('');
    }
    
    panel.classList.add('open');
    document.getElementById('searchOverlay').classList.add('open');
  },

  closeSearch() {
    document.getElementById('searchResults').classList.remove('open');
    document.getElementById('searchOverlay').classList.remove('open');
  },

  // ====== 同步 ======
  async handleSync() {
    if (!InfoVaultSync.isConfigured()) {
      this.toast('请先在设置中配置同步', 'info');
      this.navigateTo('settings');
      return;
    }
    this.toast('正在同步...', 'info');
    const result = await InfoVaultSync.sync();
    if (result.success) {
      this.toast(`同步完成${result.count ? `，导入 ${result.count} 条` : ''}`);
    } else if (result.error) {
      this.toast('同步失败: ' + result.error, 'error');
    }
    this._updateSyncUI();
  },

  _onSyncStatusChange(status) {
    const dot = document.getElementById('syncDot');
    const text = document.getElementById('syncStatusText');
    switch (status.type) {
      case 'sync_start': dot.className = 'sync-dot syncing'; text.textContent = '同步中...'; break;
      case 'sync_complete': dot.className = 'sync-dot synced'; text.textContent = status.time ? `已同步 · ${this._timeAgo(status.time)}` : '已同步'; break;
      case 'sync_error': dot.className = 'sync-dot error'; text.textContent = '同步失败'; break;
      case 'disconnected': dot.className = 'sync-dot error'; text.textContent = '未同步'; break;
      case 'connected': dot.className = 'sync-dot synced'; text.textContent = '已连接'; break;
    }
  },

  _updateSyncUI() {
    const status = InfoVaultSync.getStatus();
    const dot = document.getElementById('syncDot');
    const text = document.getElementById('syncStatusText');
    if (status.configured) {
      dot.className = 'sync-dot synced';
      text.textContent = status.lastSync ? `已同步 · ${this._timeAgo(status.lastSync)}` : '已连接';
    } else {
      dot.className = 'sync-dot error';
      text.textContent = '未同步';
    }
  },

  // ====== 设置方法 ======
  async saveSyncConfig() {
    const tokenInput = document.getElementById('githubToken');
    const repo = document.getElementById('githubRepo').value;
    let token = tokenInput.value;
    
    // Token 留空时保留已有值
    if (!token) {
      token = await InfoVaultDB.getSetting('github_token');
    }
    
    if (!token || !repo) { this.toast('请填写 Token 和仓库地址', 'error'); return; }
    const result = await InfoVaultSync.configure(token, repo);
    if (result.success) {
      this.toast('GitHub 连接成功！');
      this.renderView('settings');
      InfoVaultSync.push();
    } else {
      this.toast('连接失败: ' + result.error, 'error');
    }
  },

  async disconnectSync() {
    if (!confirm('确定断开同步连接？本地数据不会丢失。')) return;
    await InfoVaultSync.disconnect();
    this.toast('已断开同步');
    this.renderView('settings');
  },

  async exportData() {
    const data = await InfoVaultDB.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `infovault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast('数据已导出');
  },

  async importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!Array.isArray(data)) throw new Error('无效的格式');
        const count = await InfoVaultDB.importAll(data, 'overwrite');
        this.toast(`已导入 ${count} 条数据`);
        this.renderView(this.currentView);
      } catch (err) {
        this.toast('导入失败: ' + err.message, 'error');
      }
    };
    input.click();
  },

  async clearAllData() {
    if (!confirm('⚠ 确定要清除所有数据吗？此操作不可恢复！')) return;
    if (!confirm('再次确认：所有密码、钱包、证件等数据将被永久删除！')) return;
    const db = await InfoVaultDB.open();
    const tx = db.transaction('entries', 'readwrite');
    const store = tx.objectStore('entries');
    await new Promise((resolve, reject) => {
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = (e) => reject(e.target.error);
    });
    this.toast('所有数据已清除');
    this.renderView(this.currentView);
  },

  // ====== 辅助方法 ======

  _showForm(title, isEdit, fields, onSubmit) {
    this._showModal(
      isEdit ? `编辑${title}` : `添加${title}`,
      `<form id="modalForm" onsubmit="return false">${fields}
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="InfoVaultApp.closeModal()">取消</button>
          <button type="submit" class="btn btn-primary" onclick="return InfoVaultApp._submitForm('${isEdit ? 'update' : 'add'}')">${isEdit ? '保存' : '添加'}</button>
        </div>
      </form>`
    );
    this._currentOnSubmit = onSubmit;
  },

  _currentOnSubmit: null,

  async _submitForm() {
    if (this._currentOnSubmit) {
      return await this._currentOnSubmit();
    }
    return false;
  },

  _showModal(title, body) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = body;
    document.getElementById('modalOverlay').classList.add('open');
  },

  closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
    this._currentOnSubmit = null;
  },

  _gatherForm(fields) {
    const data = {};
    for (const f of fields) {
      const el = document.getElementById('f_' + f);
      if (el) data[f] = el.value;
    }
    return data;
  },

  async generatePasswordField() {
    const pwd = InfoVaultCrypto.generatePassword(16);
    const el = document.getElementById('f_password');
    if (el) { el.value = pwd; this._updateStrength(pwd); }
  },

  _updateStrength(password) {
    const strength = InfoVaultCrypto.evaluateStrength(password);
    const fill = document.getElementById('pwStrengthFill');
    if (fill) {
      fill.style.width = strength.score + '%';
      fill.style.background = strength.color;
    }
  },

  togglePassword(btn) {
    const row = btn.closest('tr');
    const dots = row.querySelector('.pw-dots');
    if (dots) {
      if (dots.dataset.showing === 'true') {
        const len = parseInt(dots.dataset.pwlen) || 12;
        dots.textContent = '•'.repeat(len);
        dots.dataset.showing = 'false';
        btn.innerHTML = this.icons.eye;
      } else {
        dots.textContent = dots.dataset.pw || '';
        dots.dataset.showing = 'true';
        btn.innerHTML = this.icons.eyeOff;
      }
    }
  },

  copyToClipboard(text, msg) {
    navigator.clipboard.writeText(text).then(() => {
      this.toast(msg || '已复制');
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.toast(msg || '已复制');
    });
  },

  copyToClipboardFromAttr(btn) {
    const text = btn.dataset.copy;
    if (text) this.copyToClipboard(text, '密码已复制');
  },

  filterGeneric(query, selector) {
    const q = query.toLowerCase();
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  },

  _maskStr(str, visible = 4) {
    if (!str || str.length <= visible) return str || '';
    return str.slice(0, visible) + '••••';
  },

  _timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '刚刚';
    if (mins < 60) return `${mins} 分钟前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} 小时前`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} 天前`;
    return new Date(dateStr).toLocaleDateString();
  },

  _badgeClass(type) {
    const map = { password: 'badge-blue', wallet: 'badge-orange', identity: 'badge-purple', note: 'badge-green', bookmark: 'badge-red', image: 'badge-green' };
    return map[type] || 'badge-gray';
  },

  _escape(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  },

  async _hashPassword(password) {
    const enc = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', enc.encode(password + 'InfoVault'));
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  },

  toast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? this.icons.check : type === 'error' ? this.icons.close : this.icons.notify;
    toast.innerHTML = `${icon} ${message}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; toast.style.transition = 'all 0.3s'; setTimeout(() => toast.remove(), 300); }, 2500);
  }
};

// 启动应用
document.addEventListener('DOMContentLoaded', () => InfoVaultApp.init());

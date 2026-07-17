/**
 * InfoVault Mobile - Main Application
 */
const MobiVault = {
  currentView: 'home',

  icons: {
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.3 9.3"/><path d="m18.4 4.6 1.6-1.6 1.6 1.6-1.6 1.6z"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>',
    identity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  },

  typeNames: { password: '密码', wallet: '钱包', identity: '证件', note: '笔记', bookmark: '收藏' },
  typeColors: { password: '#3b6ef6', wallet: '#f59e0b', identity: '#a855f7', note: '#3b82f6', bookmark: '#ec4899' },

  async init() {
    await InfoVaultDB.open();
    await InfoVaultSync.init();
    InfoVaultSync.onChange(() => {});

    // 导航
    document.querySelectorAll('[data-mview]').forEach(el => {
      el.addEventListener('click', () => {
        const view = el.dataset.mview;
        if (view === 'add') { this.showAddMenu(); return; }
        this.navigateTo(view);
      });
    });

    document.getElementById('mModalClose').addEventListener('click', () => this.closeModal());
    document.getElementById('mModalOverlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeModal();
    });

    this.navigateTo('home');
  },

  navigateTo(view) {
    this.currentView = view;
    document.querySelectorAll('[data-mview]').forEach(el => {
      el.classList.toggle('active', el.dataset.mview === view);
    });
    const titles = { home: '信息金库', passwords: '密码库', collect: '收藏夹', profile: '我的' };
    document.querySelector('.mobile-header-title').textContent = titles[view] || 'InfoVault';
    this.renderView(view);
  },

  async renderView(view) {
    const area = document.getElementById('mContent');
    switch (view) {
      case 'home': await this.renderHome(area); break;
      case 'passwords': await this.renderPasswords(area); break;
      case 'collect': await this.renderCollect(area); break;
      case 'profile': await this.renderProfile(area); break;
    }
  },

  // ====== 首页 ======
  async renderHome(area) {
    const stats = await InfoVaultDB.getStats();
    const recent = await InfoVaultDB.getRecent(5);
    area.innerHTML = `
      <div class="m-search" id="mGlobalSearch">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" placeholder="搜索所有条目..." id="mSearchInput">
      </div>

      <div class="m-stats">
        <div class="m-stat"><div class="m-stat-icon" style="background:rgba(59,110,246,0.12);color:#3b6ef6;">${this.icons.globe}</div><div><div class="m-stat-num">${stats.password||0}</div><div class="m-stat-label">账号</div></div></div>
        <div class="m-stat"><div class="m-stat-icon" style="background:rgba(245,158,11,0.12);color:#f59e0b;">${this.icons.wallet}</div><div><div class="m-stat-num">${stats.wallet||0}</div><div class="m-stat-label">钱包</div></div></div>
        <div class="m-stat"><div class="m-stat-icon" style="background:rgba(168,85,247,0.12);color:#a855f7;">${this.icons.identity}</div><div><div class="m-stat-num">${stats.identity||0}</div><div class="m-stat-label">证件</div></div></div>
        <div class="m-stat"><div class="m-stat-icon" style="background:rgba(59,130,246,0.12);color:#3b82f6;">${this.icons.note}</div><div><div class="m-stat-num">${stats.note||0}</div><div class="m-stat-label">笔记</div></div></div>
      </div>

      <div class="m-card">
        <div class="m-card-title">快速添加</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
          <button class="m-btn m-btn-secondary" style="font-size:12px;padding:10px;" onclick="MobiVault.showQuickAdd('password')">${this.icons.key} 密码</button>
          <button class="m-btn m-btn-secondary" style="font-size:12px;padding:10px;" onclick="MobiVault.showQuickAdd('wallet')">${this.icons.wallet} 钱包</button>
          <button class="m-btn m-btn-secondary" style="font-size:12px;padding:10px;" onclick="MobiVault.showQuickAdd('note')">${this.icons.note} 笔记</button>
        </div>
      </div>

      <div class="m-card">
        <div class="m-card-title">最近更新</div>
        ${recent.length === 0 ? '<p style="font-size:var(--text-sm);color:var(--color-neutral-500);text-align:center;padding:20px;">还没有数据</p>' :
          recent.map(e => `<div class="m-list-item" onclick="MobiVault.showDetail('${e.id}')">
            <div class="m-list-icon" style="background:${this.typeColors[e.type]}15;color:${this.typeColors[e.type]};">${this.icons[e.type === 'bookmark' ? 'bookmark' : e.type === 'password' ? 'key' : e.type]}</div>
            <div class="m-list-info"><div class="m-list-name">${this._esc(e.name)}</div><div class="m-list-desc">${this.typeNames[e.type]}</div></div>
            <div class="m-list-meta">${this._timeAgo(e.updatedAt)}</div>
          </div>`).join('')
        }
      </div>
    `;

    // 搜索
    document.getElementById('mSearchInput').addEventListener('input', (e) => {
      this._doSearch(e.target.value);
    });
  },

  // ====== 密码库 ======
  async renderPasswords(area) {
    const entries = await InfoVaultDB.getAll('password');
    area.innerHTML = `
      <div class="m-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" placeholder="搜索密码..." id="mPwSearch">
      </div>
      ${entries.length === 0 ? '<div class="m-empty"><h3>暂无密码</h3><p>点击下方 + 添加密码</p></div>' :
        entries.map(e => {
          const strength = InfoVaultCrypto.evaluateStrength(e.password);
          return `<div class="m-list-item" onclick="MobiVault.showDetail('${e.id}')">
            <div class="m-list-icon" style="background:${e.color||'#3b6ef6'};color:white;font-size:12px;font-weight:700;">${(e.name||'?')[0]}</div>
            <div class="m-list-info"><div class="m-list-name">${this._esc(e.name)}</div><div class="m-list-desc">${this._esc(e.username||'')}</div></div>
            <div><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${strength.color};"></span></div>
          </div>`;
        }).join('')
      }
    `;
    const input = document.getElementById('mPwSearch');
    if (input) input.addEventListener('input', (e) => this._filterList(e.target.value, '#mContent .m-list-item'));
  },

  // ====== 收藏夹 ======
  async renderCollect(area) {
    const bookmarks = await InfoVaultDB.getAll('bookmark');
    area.innerHTML = `
      <div class="m-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" placeholder="搜索收藏..." id="mColSearch">
      </div>
      ${bookmarks.length === 0 ? '<div class="m-empty"><h3>暂无收藏</h3><p>添加一些收藏吧</p></div>' :
        bookmarks.map(e => `<div class="m-list-item" onclick="MobiVault.showDetail('${e.id}')">
          <div class="m-list-icon" style="background:rgba(236,72,153,0.12);color:#ec4899;">${this.icons.bookmark}</div>
          <div class="m-list-info"><div class="m-list-name">${this._esc(e.title||e.name)}</div><div class="m-list-desc">${this._esc(e.url||'')}</div></div>
        </div>`).join('')
      }
    `;
    const input = document.getElementById('mColSearch');
    if (input) input.addEventListener('input', (e) => this._filterList(e.target.value, '#mContent .m-list-item'));
  },

  // ====== 我的 ======
  async renderProfile(area) {
    const syncStatus = InfoVaultSync.getStatus();
    const stats = await InfoVaultDB.getStats();
    area.innerHTML = `
      <div style="text-align:center;padding:24px 0 16px;">
        <div style="width:64px;height:64px;border-radius:50%;background:var(--color-primary-500);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div style="font-size:var(--text-lg);font-weight:600;color:var(--color-neutral-900);">InfoVault</div>
        <div style="font-size:var(--text-xs);color:var(--color-neutral-500);">共 ${stats.total} 个条目</div>
      </div>
      <div class="m-card">
        <div class="m-list-item" onclick="MobiVault.showSettings()">
          <div class="m-list-icon" style="background:rgba(59,110,246,0.12);color:#3b6ef6;">${this.icons.settings}</div>
          <div class="m-list-info"><div class="m-list-name">设置</div></div>
          ${this.icons.chevronRight}
        </div>
        <div class="m-list-item" onclick="MobiVault.handleSync()">
          <div class="m-list-icon" style="background:rgba(34,197,94,0.12);color:#22c55e;">${this.icons.shield}</div>
          <div class="m-list-info"><div class="m-list-name">同步数据</div><div class="m-list-desc">${syncStatus.configured ? '已配置 · 点击同步' : '未配置同步'}</div></div>
          ${this.icons.chevronRight}
        </div>
        <div class="m-list-item" onclick="MobiVault.exportMobile()">
          <div class="m-list-icon" style="background:rgba(245,158,11,0.12);color:#f59e0b;">${this.icons.bookmark}</div>
          <div class="m-list-info"><div class="m-list-name">导出数据</div></div>
          ${this.icons.chevronRight}
        </div>
      </div>
    `;
  },

  // ====== 添加菜单 ======
  showAddMenu() {
    this._showModal('快速添加', `
      <div style="display:grid;gap:12px;">
        <button class="m-btn m-btn-primary" onclick="MobiVault.closeModal();MobiVault.showQuickAdd('password')">${this.icons.key} 添加密码</button>
        <button class="m-btn m-btn-primary" style="background:#f59e0b;" onclick="MobiVault.closeModal();MobiVault.showQuickAdd('wallet')">${this.icons.wallet} 添加钱包</button>
        <button class="m-btn m-btn-primary" style="background:#a855f7;" onclick="MobiVault.closeModal();MobiVault.showQuickAdd('identity')">${this.icons.identity} 添加证件</button>
        <button class="m-btn m-btn-secondary" onclick="MobiVault.closeModal();MobiVault.showQuickAdd('note')">${this.icons.note} 写笔记</button>
        <button class="m-btn m-btn-secondary" onclick="MobiVault.closeModal();MobiVault.showQuickAdd('bookmark')">${this.icons.bookmark} 添加收藏</button>
      </div>
    `);
  },

  // ====== 快速添加表单 ======
  showQuickAdd(type) {
    const forms = {
      password: `
        <div class="m-form-group"><label class="m-form-label">网站名称</label><input class="m-form-input" id="mf_name" placeholder="例如: GitHub"></div>
        <div class="m-form-group"><label class="m-form-label">用户名/邮箱</label><input class="m-form-input" id="mf_username" placeholder="user@example.com"></div>
        <div class="m-form-group"><label class="m-form-label">密码</label><input class="m-form-input" id="mf_password" type="text" placeholder="密码" style="font-family:var(--font-mono);"></div>
        <button class="m-btn m-btn-primary" onclick="MobiVault.saveQuick('password')">保存密码</button>
      `,
      wallet: `
        <div class="m-form-group"><label class="m-form-label">名称</label><input class="m-form-input" id="mf_name" placeholder="支付宝"></div>
        <div class="m-form-group"><label class="m-form-label">账户</label><input class="m-form-input" id="mf_accountName" placeholder="账户名称"></div>
        <div class="m-form-group"><label class="m-form-label">余额</label><input class="m-form-input" id="mf_balance" type="number" step="0.01" placeholder="0.00"></div>
        <button class="m-btn m-btn-primary" style="background:#f59e0b;" onclick="MobiVault.saveQuick('wallet')">保存钱包</button>
      `,
      identity: `
        <div class="m-form-group"><label class="m-form-label">姓名</label><input class="m-form-input" id="mf_realName" placeholder="真实姓名"></div>
        <div class="m-form-group"><label class="m-form-label">证件号码</label><input class="m-form-input" id="mf_idNumber" placeholder="证件号码"></div>
        <div class="m-form-group"><label class="m-form-label">证件类型</label><select class="m-form-select" id="mf_identityType"><option>身份证</option><option>护照</option><option>驾驶证</option></select></div>
        <button class="m-btn m-btn-primary" style="background:#a855f7;" onclick="MobiVault.saveQuick('identity')">保存证件</button>
      `,
      note: `
        <div class="m-form-group"><label class="m-form-label">标题</label><input class="m-form-input" id="mf_title" placeholder="笔记标题"></div>
        <div class="m-form-group"><label class="m-form-label">内容</label><textarea class="m-form-textarea" id="mf_content" placeholder="开始记录..."></textarea></div>
        <button class="m-btn m-btn-secondary" onclick="MobiVault.saveQuick('note')">保存笔记</button>
      `,
      bookmark: `
        <div class="m-form-group"><label class="m-form-label">URL</label><input class="m-form-input" id="mf_url" placeholder="https://example.com"></div>
        <div class="m-form-group"><label class="m-form-label">标题</label><input class="m-form-input" id="mf_title" placeholder="页面标题"></div>
        <button class="m-btn m-btn-secondary" onclick="MobiVault.saveQuick('bookmark')">保存收藏</button>
      `,
    };
    this._showModal(this.typeNames[type], forms[type] || '<p>暂不支持</p>');
  },

  async saveQuick(type) {
    const g = (id) => document.getElementById('mf_' + id)?.value || '';
    let data = { type, name: g('name') || g('title') || g('realName') || g('url') || '未命名' };
    switch (type) {
      case 'password': data = { ...data, username: g('username'), password: g('password') }; break;
      case 'wallet': data = { ...data, accountName: g('accountName'), balance: g('balance'), currency: 'CNY', platform: g('platform') || '其他' }; break;
      case 'identity': data = { ...data, realName: g('realName'), idNumber: g('idNumber'), identityType: g('identityType') || '身份证' }; break;
      case 'note': data = { ...data, title: g('title'), content: g('content') }; data.name = data.title || '无标题'; break;
      case 'bookmark': data = { ...data, url: g('url'), title: g('title') || g('url'), description: '' }; break;
    }
    if (type === 'password' && !data.username) { this.toast('请填写用户名', 'error'); return; }
    await InfoVaultDB.add(data);
    this.toast('已添加');
    this.closeModal();
    if (InfoVaultSync.isConfigured()) InfoVaultSync.push();
  },

  // ====== 查看详情 ======
  async showDetail(id) {
    const e = await InfoVaultDB.get(id);
    if (!e) return;
    let body = '';
    if (e.type === 'password') {
      const s = InfoVaultCrypto.evaluateStrength(e.password);
      body = `<div class="m-detail-section"><div class="m-detail-section-title">网站信息</div>
        <div class="m-detail-grid">
          <div class="m-detail-label">网站</div><div class="m-detail-value" style="font-weight:600;">${this._esc(e.name)}</div>
          <div class="m-detail-label">URL</div><div class="m-detail-value">${e.url ? '<a href="'+this._esc(e.url)+'" style="color:#3b6ef6;">'+this._esc(e.url)+'</a>' : '-'}</div>
          <div class="m-detail-label">用户名</div><div class="m-detail-value" style="font-family:var(--font-mono);font-size:var(--text-sm);">${this._esc(e.username)} <button class="mobile-header-btn" style="display:inline-flex;width:28px;height:28px;" onclick="MobiVault.copy('${this._esc(e.username)}','已复制用户名')">${this.icons.copy}</button></div>
          <div class="m-detail-label">密码</div><div class="m-detail-value" id="mdPw" style="font-family:var(--font-mono);font-size:var(--text-sm);">******** <button class="mobile-header-btn" style="display:inline-flex;width:28px;height:28px;" onclick="document.getElementById('mdPw').innerHTML='${this._esc(e.password)}'">${this.icons.eye}</button> <button class="mobile-header-btn" style="display:inline-flex;width:28px;height:28px;" onclick="MobiVault.copy('${this._esc(e.password)}','已复制密码')">${this.icons.copy}</button></div>
          <div class="m-detail-label">强度</div><div class="m-detail-value"><span style="color:${s.color};">${s.label}</span></div>
        </div></div>`;
    } else {
      body = `<pre style="font-size:var(--text-xs);color:var(--color-neutral-800);white-space:pre-wrap;font-family:var(--font-mono);">${JSON.stringify(e, null, 2)}</pre>`;
    }
    body += `<div style="display:flex;gap:8px;margin-top:16px;">
      <button class="m-btn m-btn-secondary" style="flex:1;" onclick="MobiVault._deleteMobile('${id}')">${this.icons.trash} 删除</button>
    </div>`;
    this._showModal(e.name, body);
  },

  // ====== 设置页（移动端简易版） ======
  showSettings() {
    // 异步读取已有配置
    Promise.all([
      InfoVaultDB.getSetting('github_token'),
      InfoVaultDB.getSetting('github_repo')
    ]).then(([token, repo]) => {
      this._showModal('设置', `
        <div class="m-form-group"><label class="m-form-label">GitHub Token</label><input class="m-form-input" id="ms_token" type="password" value="${this._esc(token || '')}" placeholder="ghp_xxxxxxxx"></div>
        <div class="m-form-group"><label class="m-form-label">仓库地址</label><input class="m-form-input" id="ms_repo" value="${this._esc(repo || '')}" placeholder="username/repo"></div>
        <button class="m-btn m-btn-primary" onclick="MobiVault.saveMobileSync()">保存同步配置</button>
        <div style="height:12px;"></div>
        <button class="m-btn m-btn-secondary" onclick="MobiVault.exportMobile()">导出数据</button>
      `);
    });
  },

  async saveMobileSync() {
    const token = document.getElementById('ms_token').value;
    const repo = document.getElementById('ms_repo').value;
    if (!token || !repo) { this.toast('请填写完整', 'error'); return; }
    const r = await InfoVaultSync.configure(token, repo);
    if (r.success) { this.toast('连接成功'); this.closeModal(); InfoVaultSync.push(); }
    else { this.toast('失败: ' + r.error, 'error'); }
  },

  async exportMobile() {
    const data = await InfoVaultDB.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `infovault-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast('已导出');
  },

  async handleSync() {
    if (!InfoVaultSync.isConfigured()) { this.toast('请先在"我的-设置"中配置同步', 'info'); return; }
    this.toast('同步中...', 'info');
    const r = await InfoVaultSync.sync();
    if (r.success) this.toast(`同步完成${r.count ? '，导入'+r.count+'条' : ''}`);
    else this.toast('同步失败: ' + (r.error || '未知错误'), 'error');
  },

  async _deleteMobile(id) {
    if (!confirm('确定删除？')) return;
    await InfoVaultDB.delete(id);
    this.toast('已删除');
    this.closeModal();
    this.renderView(this.currentView);
    if (InfoVaultSync.isConfigured()) InfoVaultSync.push();
  },

  // ====== 搜索 ======
  async _doSearch(query) {
    if (!query || !query.trim()) {
      document.querySelectorAll('#mContent .m-list-item').forEach(el => el.style.display = '');
      return;
    }
    const results = await InfoVaultSearch.search(query, { limit: 10 });
    // 替换最近更新为搜索结果
    const listContainer = document.querySelector('#mContent .m-card:last-child');
    if (!listContainer) return;
    const titleEl = listContainer.querySelector('.m-card-title');
    if (titleEl) titleEl.textContent = results.length > 0 ? `搜索结果 (${results.length})` : '最近更新';
    const itemsContainer = listContainer.querySelector('.m-list-item')?.parentNode || listContainer.querySelector('div:last-child');
    if (!itemsContainer) return;
    if (results.length === 0) {
      itemsContainer.innerHTML = '<p style="font-size:var(--text-sm);color:var(--color-neutral-500);text-align:center;padding:20px;">未找到匹配</p>';
    } else {
      itemsContainer.innerHTML = results.map(r => {
        const e = r.entry;
        return `<div class="m-list-item" onclick="MobiVault.showDetail('${e.id}')">
          <div class="m-list-icon" style="background:${this.typeColors[e.type]}15;color:${this.typeColors[e.type]};">${this.icons[e.type === 'bookmark' ? 'bookmark' : e.type === 'password' ? 'key' : e.type]}</div>
          <div class="m-list-info"><div class="m-list-name">${this._esc(e.name)}</div><div class="m-list-desc">${this._esc(r.snippet.slice(0,40))}</div></div>
          <span class="badge ${this._badgeClass(e.type)}">${this.typeNames[e.type]}</span>
        </div>`;
      }).join('');
    }
  },

  // ====== 辅助 ======
  _filterList(query, selector) {
    const q = query.toLowerCase();
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  },

  _showModal(title, body) {
    document.getElementById('mModalTitle').textContent = title;
    document.getElementById('mModalBody').innerHTML = body;
    document.getElementById('mModalOverlay').classList.add('open');
  },

  closeModal() {
    document.getElementById('mModalOverlay').classList.remove('open');
  },

  copy(text, msg) {
    navigator.clipboard.writeText(text).then(() => this.toast(msg));
  },

  _timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '刚刚';
    if (mins < 60) return `${mins}分钟前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}小时前`;
    return `${Math.floor(hours/24)}天前`;
  },

  _badgeClass(type) {
    const map = { password: 'badge-blue', wallet: 'badge-orange', identity: 'badge-purple', note: 'badge-green', bookmark: 'badge-red' };
    return map[type] || 'badge-gray';
  },

  _esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },

  toast(message, type = 'success') {
    const existing = document.querySelector('.m-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `m-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(-50%) translateY(-20px)'; toast.style.transition = 'all 0.3s'; setTimeout(() => toast.remove(), 300); }, 2000);
  },
};

document.addEventListener('DOMContentLoaded', () => MobiVault.init());

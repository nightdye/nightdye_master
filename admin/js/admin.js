const ADMIN_API = 'https://login.nightdye.cn/api/admin_api.php';
const LOG_API   = 'https://api.nightdye.cn/nightdye/logs/';

function getToken() {
    return localStorage.getItem('nd_admin_token') || '';
}

async function adminFetch(action, body = {}) {
    const res = await fetch(ADMIN_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify({ action, ...body })
    });
    return res.json();
}

// ── 弹窗工具 ──
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

document.querySelectorAll('.modal-overlay').forEach(el => {
    el.addEventListener('click', e => { if (e.target === el) el.classList.remove('active'); });
});

['closeLogModal', 'closeUserModal', 'closeInviteModal'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
        document.getElementById(id).closest('.modal-overlay').classList.remove('active');
    });
});

// ── 日志 ──
async function loadLog(type) {
    const date = new Date().toISOString().slice(0, 10);
    const file = type === 'suspicious' ? `suspicious_${date}.log` : `${date}.log`;
    document.getElementById('logModalTitle').innerHTML =
        `<i class="fas fa-file-alt"></i> ${type === 'suspicious' ? '可疑请求' : '应用日志'} · ${date}`;
    document.getElementById('logContent').textContent = '加载中...';
    openModal('logModal');
    try {
        const res = await fetch(LOG_API + file);
        const text = await res.text();
        document.getElementById('logContent').textContent = text || '（暂无日志）';
    } catch {
        document.getElementById('logContent').textContent = '加载失败，请检查网络或权限。';
    }
}

document.getElementById('btnViewLog').addEventListener('click', e => { e.preventDefault(); loadLog('app'); });
document.getElementById('btnViewSuspicious').addEventListener('click', e => { e.preventDefault(); loadLog('suspicious'); });

// ── 用户管理 ──
async function loadUsers() {
    document.getElementById('userList').innerHTML = '加载中...';
    openModal('userModal');
    const data = await adminFetch('list_users');
    if (!data.success) {
        document.getElementById('userList').innerHTML = `<p style="color:var(--error-color)">${data.message || '加载失败'}</p>`;
        return;
    }
    const users = data.users || [];
    if (!users.length) { document.getElementById('userList').innerHTML = '<p style="color:var(--text-secondary)">暂无用户</p>'; return; }
    document.getElementById('userList').innerHTML = users.map(u => `
        <div class="user-item">
            <div>
                <div class="user-name">${u.username}</div>
                <div class="user-meta">${u.email || ''} · 注册于 ${u.created_at || '-'}</div>
            </div>
            <span class="badge ${u.role === 'admin' ? 'badge-cyan' : 'badge-gray'}">${u.role || 'user'}</span>
        </div>`).join('');
}

document.getElementById('btnUserMgr').addEventListener('click', e => { e.preventDefault(); loadUsers(); });

// ── 邀请码 ──
async function loadInvites() {
    document.getElementById('inviteList').innerHTML = '加载中...';
    openModal('inviteModal');
    const data = await adminFetch('list_invites');
    if (!data.success) {
        document.getElementById('inviteList').innerHTML = `<p style="color:var(--error-color)">${data.message || '加载失败'}</p>`;
        return;
    }
    renderInvites(data.invites || []);
}

function renderInvites(invites) {
    if (!invites.length) { document.getElementById('inviteList').innerHTML = '<p style="color:var(--text-secondary)">暂无邀请码</p>'; return; }
    document.getElementById('inviteList').innerHTML = invites.map(i => `
        <div class="invite-item">
            <code class="invite-code">${i.code}</code>
            <div style="display:flex;align-items:center;gap:8px">
                <span class="badge ${i.used ? 'badge-gray' : 'badge-cyan'}">${i.used ? '已使用' : '未使用'}</span>
                <span style="font-size:0.72rem;color:var(--text-secondary)">${i.created_at || ''}</span>
            </div>
        </div>`).join('');
}

document.getElementById('btnInviteMgr').addEventListener('click', e => { e.preventDefault(); loadInvites(); });

document.getElementById('btnGenInvite').addEventListener('click', async () => {
    const data = await adminFetch('gen_invite');
    if (data.success) loadInvites();
    else alert(data.message || '生成失败');
});

// ============================
// HELPHUB AI - APP LOGIC
// ============================

// Toast notification
function showToast(msg, type = '') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'toast' + (type ? ' ' + type : '');
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => t.classList.remove('show'), 3000);
}

// Render a request card (home / explore)
function renderRequestCard(req, compact = false) {
  const urgCls = tagClass(req.urgency);
  const staCls = tagClass(req.status);
  const catCls = tagClass(req.category);
  const subTags = req.tags.slice(0, 3).map(t => `<span class="sub-tag">${t}</span>`).join('');
  return `
    <div class="request-card" onclick="location.href='request-detail.html?id=${req.id}'">
      <div class="request-tags">
        <span class="tag ${catCls}">${req.category}</span>
        <span class="tag ${urgCls}">${req.urgency}</span>
        <span class="tag ${staCls}">${req.status}</span>
      </div>
      <div class="request-card-title">${req.title}</div>
      ${req.description && !compact ? `<div class="request-card-desc">${req.description}</div>` : ''}
      ${subTags ? `<div class="request-card-sub-tags">${subTags}</div>` : ''}
      <div class="request-card-footer">
        <div>
          <div class="request-card-author">${req.author}</div>
          <div class="request-card-meta">${req.location} • ${req.helpers} helper${req.helpers !== 1 ? 's' : ''} interested</div>
        </div>
        <span class="open-details">Open details</span>
      </div>
    </div>
  `;
}

// Render featured requests on home page
function renderFeaturedRequests() {
  const container = document.getElementById('featuredRequests');
  if (!container) return;
  container.innerHTML = REQUESTS.slice(0, 3).map(r => renderRequestCard(r)).join('');
}

// Render explore feed
function renderExploreFeed(filter = {}) {
  const container = document.getElementById('exploreFeed');
  if (!container) return;
  let filtered = REQUESTS.filter(r => {
    if (filter.category && filter.category !== 'all' && r.category !== filter.category) return false;
    if (filter.urgency && filter.urgency !== 'all' && r.urgency !== filter.urgency) return false;
    return true;
  });
  if (filtered.length === 0) {
    container.innerHTML = '<p style="color:var(--muted);padding:24px;">No requests match your filters.</p>';
    return;
  }
  container.innerHTML = filtered.map(r => `
    <div class="feed-card" onclick="location.href='request-detail.html?id=${r.id}'">
      <div class="feed-card-header">
        <span class="tag ${tagClass(r.category)}">${r.category}</span>
        <span class="tag ${tagClass(r.urgency)}">${r.urgency}</span>
        <span class="tag ${tagClass(r.status)}">${r.status}</span>
      </div>
      <div class="feed-card-title">${r.title}</div>
      <div class="feed-card-desc">${r.description}</div>
      <div class="request-card-sub-tags" style="margin-bottom:10px;">
        ${r.tags.map(t => `<span class="sub-tag">${t}</span>`).join('')}
      </div>
      <div class="feed-card-footer">
        <div>
          <div class="feed-card-author">${r.author}</div>
          <div class="feed-card-meta">${r.location} • ${r.helpers} helper${r.helpers !== 1 ? 's' : ''} interested</div>
        </div>
        <span class="open-details">Open details</span>
      </div>
    </div>
  `).join('');
}

// Render notifications
function renderNotifications() {
  const container = document.getElementById('notifList');
  if (!container) return;
  container.innerHTML = NOTIFICATIONS.map(n => `
    <div class="notif-item">
      <div>
        <div class="notif-title">${n.title}</div>
        <div class="notif-meta">${n.type} • ${n.time}</div>
      </div>
      <span class="notif-badge ${n.read ? 'read' : 'unread'}">${n.read ? 'Read' : 'Unread'}</span>
    </div>
  `).join('');
}

// Render leaderboard
function renderLeaderboard() {
  const container = document.getElementById('helperRankings');
  if (!container) return;
  const sorted = [...USERS].sort((a, b) => b.trust - a.trust);
  container.innerHTML = sorted.map((u, i) => `
    <div class="helper-row">
      <div class="helper-avatar" style="background:${u.color}">${u.initials}</div>
      <div class="helper-info">
        <div class="helper-name">#${i + 1} ${u.name}</div>
        <div class="helper-skills">${u.skills.slice(0,3).join(', ')}</div>
      </div>
      <div class="helper-stats">
        <div class="helper-trust">${u.trust}%</div>
        <div class="helper-contributions">${u.contributions} contributions</div>
      </div>
    </div>
  `).join('');

  const badgeContainer = document.getElementById('badgeRankings');
  if (!badgeContainer) return;
  badgeContainer.innerHTML = sorted.map(u => `
    <div class="badge-card">
      <div class="badge-name">${u.name}</div>
      <div class="badge-badges">${u.badges.join(' • ')}</div>
      <div class="trust-bar-bg">
        <div class="trust-bar-fill" style="width:${u.trust}%"></div>
      </div>
    </div>
  `).join('');
}

// Render AI center
function renderAICenter() {
  const recsContainer = document.getElementById('aiRecs');
  if (!recsContainer) return;
  recsContainer.innerHTML = REQUESTS.map(r => `
    <div class="ai-rec-item">
      <div class="ai-rec-title">${r.title}</div>
      <div class="ai-rec-desc">${r.aiSummary}</div>
      <div class="request-tags">
        ${r.aiTags.map(t => `<span class="tag ${tagClass(t)}">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// Render request detail
function renderRequestDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id')) || 1;
  const req = REQUESTS.find(r => r.id === id) || REQUESTS[0];

  const titleEl = document.getElementById('reqTitle');
  const descEl = document.getElementById('reqDesc');
  const tagsEl = document.getElementById('reqTags');
  const summaryEl = document.getElementById('reqSummary');
  const summaryTagsEl = document.getElementById('reqSummaryTags');
  const helpersEl = document.getElementById('reqHelpers');

  if (titleEl) titleEl.textContent = req.title;
  if (descEl) descEl.textContent = req.description;
  if (tagsEl) {
    tagsEl.innerHTML = `
      <span class="tag ${tagClass(req.category)}">${req.category}</span>
      <span class="tag ${tagClass(req.urgency)}">${req.urgency}</span>
      <span class="tag ${tagClass(req.status)}">${req.status}</span>
    `;
  }
  if (summaryEl) summaryEl.textContent = req.aiSummary;
  if (summaryTagsEl) {
    summaryTagsEl.innerHTML = req.tags.map(t => `<span class="tag">${t}</span>`).join('');
  }
  if (helpersEl) {
    helpersEl.innerHTML = USERS.slice(0, 2).map(u => `
      <div class="helper-mini-row">
        <div class="helper-avatar" style="background:${u.color};width:36px;height:36px;font-size:12px;">${u.initials}</div>
        <div style="flex:1;">
          <div style="font-weight:700;font-size:13px;">${u.name}</div>
          <div style="font-size:12px;color:var(--muted);">${u.skills.slice(0,3).join(', ')}</div>
        </div>
        <span class="trust-badge">Trust ${u.trust}%</span>
      </div>
    `).join('');
  }
}

// Render messages
function renderMessages() {
  const container = document.getElementById('messagesList');
  if (!container) return;
  container.innerHTML = MESSAGES.map(m => `
    <div class="message-item">
      <div>
        <div class="message-from">${m.from} → ${m.to}</div>
        <div class="message-text">${m.text}</div>
      </div>
      <div class="message-time">${m.time}</div>
    </div>
  `).join('');
}

// Render profile
function renderProfile() {
  const user = getCurrentUser();
  const nameEl = document.getElementById('profileName');
  const roleLocEl = document.getElementById('profileRoleLoc');
  const trustEl = document.getElementById('profileTrust');
  const contribEl = document.getElementById('profileContrib');
  const skillsEl = document.getElementById('profileSkills');
  const badgesEl = document.getElementById('profileBadges');
  const editNameEl = document.getElementById('editName');
  const editLocEl = document.getElementById('editLoc');
  const editSkillsEl = document.getElementById('editSkills');
  const editInterestsEl = document.getElementById('editInterests');

  if (nameEl) nameEl.textContent = user.name;
  if (roleLocEl) roleLocEl.textContent = `${user.role} • ${user.location}`;
  if (trustEl) trustEl.textContent = user.trust + '%';
  if (contribEl) contribEl.textContent = user.contributions;
  if (skillsEl) skillsEl.innerHTML = user.skills.map(s => `<span class="chip teal">${s}</span>`).join('');
  if (badgesEl) badgesEl.innerHTML = user.badges.map(b => `<span class="chip">${b}</span>`).join('');
  if (editNameEl) editNameEl.value = user.name;
  if (editLocEl) editLocEl.value = user.location;
  if (editSkillsEl) editSkillsEl.value = user.skills.join(', ');
  if (editInterestsEl) editInterestsEl.value = user.interests.join(', ');
}

// Auth form submission
function handleAuth() {
  const userSel = document.getElementById('demoUser');
  const roleSel = document.getElementById('roleSelect');
  if (!userSel) return;
  const userName = userSel.value;
  const role = roleSel ? roleSel.value : 'Both';
  setSession({ user: userName, role });
  showToast('Welcome to HelpHub AI! 🎉', 'teal');
  setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
}

// Create request form
function handleCreateRequest() {
  const title = document.getElementById('reqTitleInput');
  if (!title || !title.value.trim()) {
    showToast('Please add a title for your request.');
    return;
  }
  showToast('Request published to the community! 🚀', 'teal');
  setTimeout(() => { window.location.href = 'explore.html'; }, 1200);
}

// AI suggestions simulation
function applyAISuggestions() {
  const titleInput = document.getElementById('reqTitleInput');
  const descInput = document.getElementById('reqDescInput');
  const catSelect = document.getElementById('reqCategory');
  const urgSelect = document.getElementById('reqUrgency');
  const tagInput = document.getElementById('reqTags');

  const catEl = document.getElementById('aiCategory');
  const urgEl = document.getElementById('aiUrgency');
  const tagsEl = document.getElementById('aiTagsSugg');
  const rewriteEl = document.getElementById('aiRewrite');

  const title = titleInput ? titleInput.value : '';
  const desc = descInput ? descInput.value : '';

  let cat = 'Community', urg = 'Low', tags = 'Add more detail for smarter tags';
  let rewrite = 'Start describing the challenge to generate a stronger version.';

  if (title.toLowerCase().includes('javascript') || title.toLowerCase().includes('react') || title.toLowerCase().includes('css') || title.toLowerCase().includes('html')) {
    cat = 'Web Development'; urg = 'High';
    tags = 'JavaScript, Debugging, Review';
    rewrite = 'I need help reviewing my JavaScript project before submission. I have specific bugs I can\'t resolve under deadline.';
  } else if (title.toLowerCase().includes('figma') || title.toLowerCase().includes('design') || title.toLowerCase().includes('poster')) {
    cat = 'Design'; urg = 'Medium';
    tags = 'Figma, UI/UX, Feedback';
    rewrite = 'Seeking experienced design feedback on my Figma project with focus on hierarchy and visual consistency.';
  } else if (title.toLowerCase().includes('interview') || title.toLowerCase().includes('career') || title.toLowerCase().includes('job')) {
    cat = 'Career'; urg = 'Medium';
    tags = 'Interview Prep, Career, Frontend';
    rewrite = 'Looking for a mock interview partner to help me prepare for upcoming frontend internship interviews.';
  }

  if (catEl) catEl.textContent = cat;
  if (urgEl) urgEl.textContent = urg;
  if (tagsEl) tagsEl.textContent = tags;
  if (rewriteEl) rewriteEl.textContent = rewrite;
  if (catSelect) catSelect.value = cat;
  if (urgSelect) urgSelect.value = urg.charAt(0).toUpperCase() + urg.slice(1).toLowerCase();
  if (tagInput) tagInput.value = tags;

  showToast('AI suggestions applied!', 'teal');
}

// Update create AI guidance live
function updateAIGuidance() {
  const titleInput = document.getElementById('reqTitleInput');
  const catEl = document.getElementById('aiCategory');
  const urgEl = document.getElementById('aiUrgency');
  const title = titleInput ? titleInput.value : '';

  let cat = 'Community', urg = 'Low';
  if (title.toLowerCase().includes('javascript') || title.toLowerCase().includes('css') || title.toLowerCase().includes('react') || title.toLowerCase().includes('html')) {
    cat = 'Web Development'; urg = 'High';
  } else if (title.toLowerCase().includes('figma') || title.toLowerCase().includes('design')) {
    cat = 'Design'; urg = 'Medium';
  } else if (title.toLowerCase().includes('interview') || title.toLowerCase().includes('career')) {
    cat = 'Career'; urg = 'Medium';
  }
  if (catEl) catEl.textContent = cat;
  if (urgEl) urgEl.textContent = urg;
}

// Send message
function sendMessage() {
  const textarea = document.getElementById('msgText');
  const toSelect = document.getElementById('msgTo');
  if (!textarea || !textarea.value.trim()) {
    showToast('Please write a message first.');
    return;
  }
  MESSAGES.unshift({
    from: getCurrentUser().name,
    to: toSelect ? toSelect.value : 'Community',
    text: textarea.value,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  });
  textarea.value = '';
  renderMessages();
  showToast('Message sent!', 'teal');
}

// Save profile
function saveProfile() {
  showToast('Profile updated successfully!', 'teal');
}

// Mark as solved / I can help
function markSolved() {
  showToast('Request marked as solved! ✓', 'teal');
}
function iCanHelp() {
  showToast('You\'ve offered to help! A notification was sent.', 'teal');
}
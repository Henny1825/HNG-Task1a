 const state = {
    title:       'Redesign the onboarding flow for mobile users',
    description: 'Audit the current 6-step onboarding funnel, identify friction points, and produce wireframes for a streamlined 3-step flow optimised for small screens. Collaborate with the UX team to validate designs through usability testing, and deliver a final spec document for engineering handoff by the deadline.',
    priority:    'High',
    status:      'In Progress',
    dueDate:     '2026-05-01',
    dueISO:      '2026-05-01T18:00:00Z',
  };
  let snapshot = { ...state };

  const card         = document.getElementById('todo-card');
  const titleEl      = document.querySelector('[data-testid="test-todo-title"]');
  const descEl       = document.querySelector('[data-testid="test-todo-description"]');
  const priorityEl   = document.querySelector('[data-testid="test-todo-priority"]');
  const priorityDot  = document.querySelector('[data-testid="test-todo-priority-indicator"]');
  const statusBadge  = document.querySelector('[data-testid="test-todo-status"]');
  const statusCtrl   = document.querySelector('[data-testid="test-todo-status-control"]');
  const checkbox     = document.querySelector('[data-testid="test-todo-complete-toggle"]');
  const timeEl       = document.getElementById('time-remaining');
  const dueDateEl    = document.querySelector('[data-testid="test-todo-due-date"]');
  const editForm     = document.getElementById('edit-form');
  const editBtn      = document.getElementById('edit-btn');
  const saveBtn      = document.getElementById('save-btn');
  const cancelBtn    = document.getElementById('cancel-btn');
  const collapsible  = document.getElementById('collapsible-section');
  const expandToggle = document.getElementById('expand-toggle');

  function friendly(ms) {
    const abs  = Math.abs(ms);
    const mins  = Math.floor(abs / 60000);
    const hours = Math.floor(abs / 3600000);
    const days  = Math.floor(abs / 86400000);
    if (abs < 60000)   return ms < 0 ? 'Overdue now!'         : 'Due now!';
    if (abs < 3600000) return ms < 0 ? `Overdue by ${mins} min${mins>1?'s':''}` : `Due in ${mins} min${mins>1?'s':''}`;
    if (abs < 86400000)return ms < 0 ? `Overdue by ${hours} hr${hours>1?'s':''}` : `Due in ${hours} hr${hours>1?'s':''}`;
    if (days === 1)    return ms < 0 ? 'Overdue by 1 day'     : 'Due tomorrow';
    return ms < 0 ? `Overdue by ${days} days` : `Due in ${days} days`;
  }

  function updateTime() {
    if (state.status === 'Done') {
      timeEl.textContent = 'Completed';
      timeEl.setAttribute('aria-label', 'Task completed');
      card.classList.remove('is-overdue');
      return;
    }
    const due  = new Date(state.dueISO);
    const diff = due - Date.now();
    const text = friendly(diff);
    timeEl.textContent = text;
    timeEl.setAttribute('aria-label', `Time remaining: ${text}`);
    if (diff < 0) card.classList.add('is-overdue');
    else          card.classList.remove('is-overdue');
  }

  updateTime();
  setInterval(updateTime, 30000);
  
  function applyPriority(p) {
    card.classList.remove('priority-high', 'priority-medium', 'priority-low');
    const map = { High: 'priority-high', Medium: 'priority-medium', Low: 'priority-low' };
    card.classList.add(map[p]);
    const labels = { High: '▲ High', Medium: '◆ Medium', Low: '▼ Low' };
    priorityEl.textContent = labels[p];
    priorityEl.setAttribute('aria-label', `Priority: ${p}`);
  }

  function applyStatus(s) {
    state.status = s;
    statusBadge.textContent = s;
    statusBadge.setAttribute('aria-label', `Status: ${s}`);
    statusBadge.className = '';
    const map = { 'Pending': 'status-pending', 'In Progress': 'status-inprogress', 'Done': 'status-done' };
    statusBadge.classList.add(map[s]);
    statusCtrl.value = s;
    checkbox.checked = (s === 'Done');
    if (s === 'Done') {
      card.classList.add('is-done');
    } else {
      card.classList.remove('is-done');
      if (s === 'Pending') checkbox.checked = false;
    }
    updateTime();
  }

  statusCtrl.addEventListener('change', () => applyStatus(statusCtrl.value));

  checkbox.addEventListener('change', () => {
    applyStatus(checkbox.checked ? 'Done' : 'Pending');
  });

  expandToggle.addEventListener('click', () => {
    const expanded = collapsible.classList.toggle('expanded');
    collapsible.setAttribute('aria-expanded', expanded);
    expandToggle.setAttribute('aria-expanded', expanded);
    expandToggle.textContent = expanded ? '↑ Show less' : '↓ Show more';
  });

  function openEditForm() {
    snapshot = { ...state };
    document.getElementById('edit-title').value       = state.title;
    document.getElementById('edit-description').value = state.description;
    document.getElementById('edit-priority').value    = state.priority;
    document.getElementById('edit-due-date').value    = state.dueDate;
    editForm.classList.add('active');
    editBtn.setAttribute('aria-expanded', 'true');
    document.getElementById('edit-title').focus();
  }

  function closeEditForm() {
    editForm.classList.remove('active');
    editBtn.setAttribute('aria-expanded', 'false');
    editBtn.focus();
  }

  editBtn.addEventListener('click', openEditForm);

  saveBtn.addEventListener('click', () => {
    const newTitle    = document.getElementById('edit-title').value.trim();
    const newDesc     = document.getElementById('edit-description').value.trim();
    const newPriority = document.getElementById('edit-priority').value;
    const newDate     = document.getElementById('edit-due-date').value;

    if (!newTitle) return;

    state.title       = newTitle;
    state.description = newDesc;
    state.priority    = newPriority;
    state.dueDate     = newDate;
    state.dueISO      = `${newDate}T18:00:00Z`;

    titleEl.textContent = newTitle;
    descEl.textContent  = newDesc;

    const d = new Date(`${newDate}T18:00:00Z`);
    const formatted = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    dueDateEl.textContent = `Due ${formatted}`;
    dueDateEl.setAttribute('datetime', state.dueISO);
    timeEl.setAttribute('datetime', state.dueISO);

    applyPriority(newPriority);
    updateTime();
    closeEditForm();
  });

  cancelBtn.addEventListener('click', () => {
    Object.assign(state, snapshot);
    closeEditForm();
  });

  applyPriority(state.priority);
  applyStatus(state.status);
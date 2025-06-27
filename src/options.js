async function loadTemplates() {
  const { templates = [] } = await browser.storage.local.get('templates');
  const list = document.getElementById('templateList');
  list.textContent = '';
  for (const [index, t] of templates.entries()) {
    const li = document.createElement('li');
    const edit = document.createElement('button');
    edit.textContent = 'Edit';
    edit.className = 'edit';
    edit.addEventListener('click', () => {
      document.getElementById('name').value = t.name;
      document.getElementById('subject').value = t.subject;
      document.getElementById('body').innerHTML = t.body;
      document.getElementById('editIndex').value = index;
      document.getElementById('saveBtn').textContent = 'Update Template';
    });
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.className = 'delete';
    del.addEventListener('click', async () => {
      templates.splice(index, 1);
      await browser.storage.local.set({ templates });
      loadTemplates();
    });
    const label = document.createElement('span');
    label.textContent = t.subject ? `${t.name} - ${t.subject}` : t.name;
    li.appendChild(edit);
    li.appendChild(del);
    li.appendChild(label);
    list.appendChild(li);
  }
}

document.getElementById('templateForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const body = document.getElementById('body').innerHTML;
  if (!name || !body.trim()) return;
  const data = await browser.storage.local.get({ templates: [] });
  const editIndex = document.getElementById('editIndex').value;
  if (editIndex === '') {
    data.templates.push({ name, subject, body });
  } else {
    data.templates[editIndex] = { name, subject, body };
  }
  await browser.storage.local.set(data);
  e.target.reset();
  document.getElementById('body').innerHTML = '';
  document.getElementById('editIndex').value = '';
  document.getElementById('saveBtn').textContent = 'Add Template';
  loadTemplates();
});

loadTemplates();

async function parseQuicktext(xml) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  return Array.from(doc.querySelectorAll('text')).map((node) => {
    const name = node.querySelector('name')?.textContent.trim() || 'Untitled';
    const subject = node.querySelector('subject')?.textContent.trim() || '';
    const body = node.querySelector('body')?.textContent || '';
    return { name, subject, body };
  });
}

document.getElementById('importBtn').addEventListener('click', async () => {
  const file = document.getElementById('quicktextFile').files[0];
  if (!file) return;
  const xml = await file.text();
  const imported = await parseQuicktext(xml);
  if (imported.length === 0) return;
  const data = await browser.storage.local.get({ templates: [] });
  data.templates.push(...imported);
  await browser.storage.local.set(data);
  document.getElementById('quicktextFile').value = '';
  loadTemplates();
});

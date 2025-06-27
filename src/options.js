async function loadTemplates() {
  const { templates = [] } = await browser.storage.local.get('templates');
  const list = document.getElementById('templateList');
  list.textContent = '';
  for (const [index, t] of templates.entries()) {
    const li = document.createElement('li');
    li.textContent = t.subject ? `${t.name} - ${t.subject}` : t.name;
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.className = 'delete';
    del.addEventListener('click', async () => {
      templates.splice(index, 1);
      await browser.storage.local.set({ templates });
      loadTemplates();
    });
    li.appendChild(del);
    list.appendChild(li);
  }
}

document.getElementById('addForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const body = document.getElementById('body').value;
  if (!name || !body) return;
  const data = await browser.storage.local.get({ templates: [] });
  data.templates.push({ name, subject, body });
  await browser.storage.local.set(data);
  e.target.reset();
  loadTemplates();
});

loadTemplates();

async function loadTemplates() {
  const { templates = [] } = await browser.storage.local.get('templates');
  const container = document.getElementById('templates');
  container.textContent = '';
  if (templates.length === 0) {
    container.textContent = 'No templates defined.';
    return;
  }
  for (const t of templates) {
    const btn = document.createElement('button');
    btn.textContent = t.name;
    btn.addEventListener('click', async () => {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        await browser.compose.setComposeDetails(tab.id, {
          subject: t.subject,
          body: t.body
        });
      }
      window.close();
    });
    container.appendChild(btn);
  }
}

document.addEventListener('DOMContentLoaded', loadTemplates);

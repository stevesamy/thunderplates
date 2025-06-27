// background.js

async function createContextMenus() {
  await browser.menus.removeAll();
  const { templates = [] } = await browser.storage.local.get('templates');
  if (templates.length === 0) {
    return;
  }
  const parentId = browser.menus.create({
    id: 'thunderplates-parent',
    title: 'Insert template',
    contexts: ['editable'],
  });
  for (const [index, t] of templates.entries()) {
    browser.menus.create({
      id: `thunderplates-${index}`,
      parentId,
      title: t.name,
      contexts: ['editable'],
    });
  }
}

browser.runtime.onInstalled.addListener(async () => {
  // Initialize storage with empty templates array if not present
  await browser.storage.local.get({ templates: [] });
  createContextMenus();
});

browser.runtime.onStartup.addListener(createContextMenus);

browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.templates) {
    createContextMenus();
  }
});

browser.menus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId.startsWith('thunderplates-')) {
    const index = parseInt(info.menuItemId.split('-')[1], 10);
    const { templates = [] } = await browser.storage.local.get('templates');
    const template = templates[index];
    if (template) {
      await browser.compose.insertHTML(tab.id, template.body);
    }
  }
});

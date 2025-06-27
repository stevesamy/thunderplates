// background.js

async function buildMenus() {
  await browser.menus.removeAll();
  const { templates = [] } = await browser.storage.local.get('templates');
  for (const [index, t] of templates.entries()) {
    browser.menus.create({
      id: `template-${index}`,
      title: t.name,
      contexts: ['editable'],
    });
  }
  browser.menus.refresh();
}

browser.runtime.onInstalled.addListener(async () => {
  await browser.storage.local.get({ templates: [] });
  buildMenus();
});

browser.runtime.onStartup.addListener(buildMenus);

browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.templates) {
    buildMenus();
  }
});

browser.menus.onClicked.addListener(async (info, tab) => {
  if (!info.menuItemId.startsWith('template-')) return;
  const index = parseInt(info.menuItemId.split('-')[1], 10);
  const { templates = [] } = await browser.storage.local.get('templates');
  const t = templates[index];
  if (!t) return;
  const details = {};
  if (t.subject) {
    details.subject = t.subject;
  }
  if (Object.keys(details).length > 0) {
    await browser.compose.setComposeDetails(tab.id, details);
  }
  await browser.tabs.sendMessage(tab.id, {
    command: 'insertTemplate',
    html: t.body,
  });
});

// Ensure menus are available when the background script first loads
buildMenus();

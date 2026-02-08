import { getRulesForUrl } from '@/utils/storage';

export default defineBackground(() => {
  browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete' || !tab.url) return;

    const rules = await getRulesForUrl(tab.url);

    for (const rule of rules) {
      if (rule.css) {
        try {
          await browser.scripting.insertCSS({
            target: { tabId },
            css: rule.css,
          });
        } catch (e) {
          console.warn(`Failed to inject CSS for rule "${rule.name}":`, e);
        }
      }

      if (rule.js) {
        try {
          await browser.scripting.executeScript({
            target: { tabId },
            world: 'MAIN',
            func: (code: string) => {
              const script = document.createElement('script');
              script.textContent = code;
              document.documentElement.appendChild(script);
              script.remove();
            },
            args: [rule.js],
          });
        } catch (e) {
          console.warn(`Failed to inject JS for rule "${rule.name}":`, e);
        }
      }
    }
  });
});

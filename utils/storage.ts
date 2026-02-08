export interface Rule {
  id: string;
  name: string;
  urlPattern: string;
  css: string;
  js: string;
  enabled: boolean;
  favicon?: string;
}

const RULES_KEY = 'rules';

export async function getRules(): Promise<Rule[]> {
  const data = await browser.storage.local.get(RULES_KEY) as Record<string, Rule[]>;
  return data[RULES_KEY] ?? [];
}

export async function saveRule(rule: Rule): Promise<void> {
  const rules = await getRules();
  const index = rules.findIndex((r) => r.id === rule.id);
  if (index >= 0) {
    rules[index] = rule;
  } else {
    rules.push(rule);
  }
  await browser.storage.local.set({ [RULES_KEY]: rules });
}

export async function deleteRule(id: string): Promise<void> {
  const rules = await getRules();
  await browser.storage.local.set({
    [RULES_KEY]: rules.filter((r) => r.id !== id),
  });
}

export function matchesUrl(pattern: string, url: string): boolean {
  try {
    // Convert extension match pattern to regex
    // Pattern format: scheme://host/path (e.g. *://*.github.com/*)
    const regexStr = pattern
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // escape regex special chars
      .replace(/\*/g, '.*');                   // convert * wildcard to .*
    const regex = new RegExp(`^${regexStr}$`);
    return regex.test(url);
  } catch {
    return false;
  }
}

export async function getRulesForUrl(url: string): Promise<Rule[]> {
  const rules = await getRules();
  return rules.filter((r) => r.enabled && matchesUrl(r.urlPattern, url));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function domainToPattern(hostname: string): string {
  return `*://${hostname}/*`;
}

export type Theme = 'light' | 'dark' | 'system';

export async function getTheme(): Promise<Theme> {
  const data = await browser.storage.local.get('theme') as Record<string, Theme>;
  return data.theme ?? 'dark';
}

export async function setTheme(theme: Theme): Promise<void> {
  await browser.storage.local.set({ theme });
}

export function applyTheme(theme: Theme) {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', isDark);
}

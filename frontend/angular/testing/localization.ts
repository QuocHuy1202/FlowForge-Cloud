import { resolve } from 'node:path';
import { Subject } from 'rxjs';
import { readFileSync } from 'node:fs';

const resourceRoot = '../../backend/src/FlowForge.Domain.Shared/Localization/FlowForge/';
export const resources = Object.fromEntries(['en', 'vi'].map(language => [
  language,
  JSON.parse(readFileSync(resolve(process.cwd(), `${resourceRoot}${language}.json`), 'utf8')).Texts,
])) as Record<string, Record<string, string>>;

export function localizationMock(language = 'en') {
  return {
    language,
    languageChange$: new Subject<string>(),
    instant(key: string, ...params: string[]) {
      const text = resources[this.language][key.replace(/^::/, '')] ?? key;
      return text.replace(/\{(\d+)\}/g, (_, index) => params[Number(index)] ?? '');
    },
  };
}

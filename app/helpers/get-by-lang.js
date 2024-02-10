import { helper } from '@ember/component/helper';
import { DEFAULT_LANGUAGE } from 'frontend-price-management/config';

export function getByLang([object, lang]) {
  lang = lang || DEFAULT_LANGUAGE;
  if (Array.isArray(object)) {
    const objectsByLang = object.filter((o) => o.language === lang);
    if (object.length > 0) {
      console.assert(
        objectsByLang.length > 0,
        `requested language '${lang}' not available from ${object}`
      );
    }
    return objectsByLang.map((o) => o.content);
  }
  console.assert(
    lang === object.language,
    `requested language ${lang} not available from ${object}`
  );
  return object.content;
}

export default helper(getByLang);

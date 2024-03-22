import { DEFAULT_LANGUAGE } from 'frontend-price-management/config';

export default function getByLang(object, lang) {
  lang = lang || DEFAULT_LANGUAGE;
  if (Array.isArray(object)) {
    const objectsByLang = object.filter((o) => o.language === lang);
    return objectsByLang.map((o) => o.content);
  } else {
    return object.content;
  }
}

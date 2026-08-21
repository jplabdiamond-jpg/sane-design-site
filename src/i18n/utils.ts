// ────────────────────────────────────────────────
//  i18n — helper functions
// ────────────────────────────────────────────────
import { ui, DEFAULT_LOCALE, EN_AVAILABLE, type Locale, type UIKey } from './ui';

/** URL のパスから現在の言語を判定（/en... は en、それ以外は ja） */
export function getLangFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  if (first === 'en') return 'en';
  return DEFAULT_LOCALE;
}

/** 指定言語の翻訳関数を返す */
export function useTranslations(lang: Locale) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[DEFAULT_LOCALE][key];
  };
}

/** ハッシュ／クエリを除いたベースパス（末尾スラッシュ付き）を得る */
function basePath(path: string): string {
  const p = path.split('#')[0].split('?')[0];
  if (p === '' || p === '/') return '/';
  return p.endsWith('/') ? p : p + '/';
}

/**
 * リンク先を言語に合わせて解決する。
 * - ja: /en プレフィックスを除去した日本語ルート
 * - en: 英語版が存在するルートのみ /en を付与。無ければ日本語版へフォールバック。
 * アンカー（/#faq）やクエリはそのまま維持する。
 */
export function localizePath(path: string, lang: Locale): string {
  let p = path.startsWith('/') ? path : '/' + path;

  if (lang === 'ja') {
    return p.replace(/^\/en(?=\/|$)/, '') || '/';
  }

  // en
  const base = basePath(p);
  if (EN_AVAILABLE.includes(base)) {
    // '/#faq' → '/en/#faq' 、 '/works/' → '/en/works/'
    return ('/en' + p).replace(/^\/en$/, '/en/');
  }
  return p; // 未翻訳ページは日本語版のまま
}

/** 現在のパスに対応する「もう一方の言語」の URL を返す（言語切替ボタン用） */
export function alternatePath(url: URL, target: Locale): string {
  const current = getLangFromUrl(url);
  if (current === target) return url.pathname;
  if (target === 'ja') {
    return url.pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  }
  // → en
  const base = basePath(url.pathname);
  if (EN_AVAILABLE.includes(base)) {
    return ('/en' + url.pathname).replace(/^\/en$/, '/en/');
  }
  // 英語版が無いページ: トップの英語版へ
  return '/en/';
}

/** hreflang 用に、ja/en 双方の絶対 URL を返す（英語版が存在する場合のみ en を出す） */
export function hreflangUrls(url: URL, site: URL | undefined) {
  const origin = site ? site.origin : url.origin;
  const jaPath = url.pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  const base = basePath(jaPath);
  const hasEn = EN_AVAILABLE.includes(base);
  const enPath = ('/en' + jaPath).replace(/^\/en$/, '/en/');
  return {
    ja: origin + jaPath,
    en: hasEn ? origin + enPath : null,
  };
}

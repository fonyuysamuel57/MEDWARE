import { Injectable, signal, computed, effect } from '@angular/core';
import { translations } from '../data/translations';
import { Language } from '../models/types';

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new(config: Record<string, unknown>, elementId: string) => void;
      };
    };
  }
}

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly _lang = signal<Language>('en');

  readonly lang = this._lang.asReadonly();
  readonly isEnglish = computed(() => this._lang() === 'en');

  /** BCP-47 locale string for use with Intl APIs (e.g. toLocaleDateString). */
  readonly locale = computed(() => this._lang() === 'fr' ? 'fr-FR' : 'en-US');

  constructor() {
    // Keep the Google Translate widget in sync whenever Angular's language changes.
    effect(() => this.syncGoogleTranslate(this._lang()));
  }

  /** Toggle between English and French (Angular-native bilingual support). */
  toggleLanguage(): void {
    this._lang.update(l => l === 'en' ? 'fr' : 'en');
  }

  /**
   * Switch to any language supported by the Google Translate widget
   * (e.g. 'es', 'de'). For 'en' / 'fr' prefer toggleLanguage() so
   * Angular bindings also update.
   */
  switchToLanguage(langCode: string): void {
    this.syncGoogleTranslate(langCode.toLowerCase().split('-')[0]);
  }

  getLang(): Language {
    return this._lang();
  }

  /** Translate a static UI string key from translations.ts. */
  t(key: string): string {
    return translations[this._lang()][key] ?? translations['en'][key] ?? key;
  }

  /**
   * Return the language-correct string from a bilingual Firestore field pair.
   * Falls back to `en` when the French value is absent or empty.
   *
   * Usage: ts.field(doc.title, doc.titleFr)
   */
  field(en: string, fr: string | undefined | null): string {
    return this._lang() === 'fr' ? (fr || en) : en;
  }

  /**
   * Return the language-correct string[] from a bilingual Firestore list pair.
   * Falls back to the English list when the French list is absent or empty.
   *
   * Usage: ts.fieldList(doc.symptoms, doc.symptomsFr)
   */
  fieldList(en: string[], fr: string[] | undefined | null): string[] {
    return this._lang() === 'fr' ? (fr?.length ? fr : en) : en;
  }

  /**
   * Localize any Firestore document by the field / fieldFr naming convention.
   * Works for any current or future collection — no component changes needed.
   *
   * Usage: ts.localize(doc, 'topic')
   */
  localize<T extends Record<string, unknown>>(obj: T, key: keyof T & string): string {
    if (this._lang() === 'fr') {
      const val = obj[`${key}Fr` as keyof T];
      if (typeof val === 'string' && val) return val;
    }
    return (obj[key] as string) ?? '';
  }

  /**
   * Same as localize but for array fields.
   *
   * Usage: ts.localizeList(doc, 'steps')
   */
  localizeList<T extends Record<string, unknown>>(obj: T, key: keyof T & string): string[] {
    if (this._lang() === 'fr') {
      const val = obj[`${key}Fr` as keyof T];
      if (Array.isArray(val) && val.length) return val as string[];
    }
    return (obj[key] as string[]) ?? [];
  }

  /**
   * Drive the Google Translate widget to the given language code.
   * Sets the googtrans cookie (read by the widget on load) and
   * programmatically updates the widget's combo-select so the change
   * takes effect immediately without a page reload.
   */
  private syncGoogleTranslate(langCode: string): void {
    if (typeof document === 'undefined') return;
    const hostname = window.location.hostname;

    if (langCode === 'en') {
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = `googtrans=; domain=${hostname}; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/`;
      document.cookie = `googtrans=/en/${langCode}; domain=${hostname}; path=/`;
    }

    const selectEl = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (selectEl) {
      selectEl.value = langCode === 'en' ? '' : langCode;
      selectEl.dispatchEvent(new Event('change'));
    }
  }
}

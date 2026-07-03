import { Injectable, signal, computed } from '@angular/core';
import { translations } from '../data/translations';
import { Language } from '../models/types';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly _lang = signal<Language>('en');

  readonly lang = this._lang.asReadonly();
  readonly isEnglish = computed(() => this._lang() === 'en');

  /** BCP-47 locale string for the active language (usable with Intl APIs). */
  readonly locale = computed(() => this._lang() === 'fr' ? 'fr-FR' : 'en-US');

  toggleLanguage(): void {
    this._lang.update(l => l === 'en' ? 'fr' : 'en');
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
   * Localize any Firestore document by the `field` / `fieldFr` naming convention.
   * Picks `obj[key]` for English and `obj[key + 'Fr']` for French — meaning any
   * collection that follows this pattern (current or future) is automatically
   * translatable without touching components.
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
   * Same as `localize` but for array fields.
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
}

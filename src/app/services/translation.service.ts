import { Injectable, signal, computed } from '@angular/core';
import { translations } from '../data/translations';
import { Language } from '../models/types';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly _lang = signal<Language>('en');

  readonly lang = this._lang.asReadonly();

  readonly isEnglish = computed(() => this._lang() === 'en');

  toggleLanguage(): void {
    this._lang.update(l => l === 'en' ? 'fr' : 'en');
  }

  t(key: string): string {
    return translations[this._lang()][key] ?? translations['en'][key] ?? key;
  }

  getLang(): Language {
    return this._lang();
  }
}

import { Injectable } from '@angular/core';
import { SYMPTOMS_DATA } from '../data/symptoms.data';
import { Symptom } from '../models/types';

@Injectable({ providedIn: 'root' })
export class SearchService {
  searchSymptoms(query: string, lang: 'en' | 'fr'): Symptom[] {
    if (!query || query.trim().length < 2) return [];
    const q = query.trim().toLowerCase();
    return SYMPTOMS_DATA.filter(s => {
      const name = lang === 'fr' ? s.symptomFr : s.symptom;
      return name.toLowerCase().includes(q);
    });
  }
}

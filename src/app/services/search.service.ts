import { Injectable, inject, signal } from '@angular/core';
import { SymptomsService } from './symptoms.service';
import { Symptom } from '../models/types';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly symptomsService = inject(SymptomsService);

  readonly focusedSymptomId = signal<number | null>(null);

  searchSymptoms(query: string, lang: 'en' | 'fr'): Symptom[] {
    if (!query || query.trim().length < 2) return [];
    const q = query.trim().toLowerCase();
    return this.symptomsService.symptoms().filter(s => {
      const name = lang === 'fr' ? s.symptomFr : s.symptom;
      return name.toLowerCase().includes(q);
    });
  }

  focusSymptom(id: number): void {
    this.focusedSymptomId.set(null);
    setTimeout(() => this.focusedSymptomId.set(id));
  }

  clearFocus(): void {
    this.focusedSymptomId.set(null);
  }
}

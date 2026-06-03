import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { SYMPTOMS_DATA } from '../../data/symptoms.data';
import { Symptom } from '../../models/types';

@Component({
  selector: 'app-symptoms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './symptoms.component.html',
  styleUrl: './symptoms.component.css'
})
export class SymptomsComponent {
  readonly ts = inject(TranslationService);
  readonly allSymptoms: Symptom[] = SYMPTOMS_DATA;
  readonly INITIAL_COUNT = 5;
  showAll = signal(false);
  searchQuery = signal('');

  get filteredSymptoms(): Symptom[] {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.allSymptoms;
    return this.allSymptoms.filter(s => {
      const name = this.ts.getLang() === 'fr' ? s.symptomFr : s.symptom;
      return name.toLowerCase().includes(q);
    });
  }

  get visibleSymptoms(): Symptom[] {
    const filtered = this.filteredSymptoms;
    return (this.showAll() || this.searchQuery().trim().length > 0)
      ? filtered
      : filtered.slice(0, this.INITIAL_COUNT);
  }

  getSymptomName(s: Symptom): string {
    return this.ts.getLang() === 'fr' ? s.symptomFr : s.symptom;
  }

  getDiseases(s: Symptom): string[] {
    return this.ts.getLang() === 'fr' ? s.diseasesFr : s.diseases;
  }

  getSeverityLabel(severity: Symptom['severity']): string {
    const key = `symptoms.severity.${severity}`;
    return this.ts.t(key);
  }

  onSearch(val: string): void {
    this.searchQuery.set(val);
    this.showAll.set(false);
  }

  toggleShowAll(): void {
    this.showAll.update(v => !v);
    if (!this.showAll()) {
      document.getElementById('symptoms')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

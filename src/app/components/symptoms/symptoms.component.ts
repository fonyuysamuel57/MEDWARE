import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';
import { SymptomsService } from '../../services/symptoms.service';
import { Symptom } from '../../models/types';

interface NewSymptomForm {
  symptom: string;
  severity: Symptom['severity'];
  diseases: string;
}

type SymptomDoc = Symptom & { docId: string };

const EMPTY_FORM: NewSymptomForm = { symptom: '', severity: 'moderate', diseases: '' };

@Component({
  selector: 'app-symptoms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './symptoms.component.html',
  styleUrl: './symptoms.component.css'
})
export class SymptomsComponent {
  readonly ts = inject(TranslationService);
  readonly auth = inject(AuthService);
  private readonly symptomsService = inject(SymptomsService);

  readonly allSymptoms = this.symptomsService.symptoms;
  readonly INITIAL_COUNT = 5;
  showAll = signal(false);
  searchQuery = signal('');
  showCreateForm = signal(false);

  newForm: NewSymptomForm = { ...EMPTY_FORM };

  get filteredSymptoms(): SymptomDoc[] {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.allSymptoms();
    return this.allSymptoms().filter(s => {
      const name = this.ts.getLang() === 'fr' ? s.symptomFr : s.symptom;
      return name.toLowerCase().includes(q);
    });
  }

  get visibleSymptoms(): SymptomDoc[] {
    const filtered = this.filteredSymptoms;
    return (this.showAll() || this.searchQuery().trim().length > 0)
      ? filtered
      : filtered.slice(0, this.INITIAL_COUNT);
  }

  getSymptomName(s: SymptomDoc): string {
    return this.ts.getLang() === 'fr' ? s.symptomFr : s.symptom;
  }

  getDiseases(s: SymptomDoc): string[] {
    return this.ts.getLang() === 'fr' ? s.diseasesFr : s.diseases;
  }

  getSeverityLabel(severity: Symptom['severity']): string {
    return this.ts.t(`symptoms.severity.${severity}`);
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

  async addSymptom(): Promise<void> {
    const diseases = this.newForm.diseases.split('\n').map(d => d.trim()).filter(Boolean);
    if (!this.newForm.symptom || diseases.length === 0) return;
    const symptom: Symptom = {
      id: Date.now(),
      symptom: this.newForm.symptom,
      symptomFr: this.newForm.symptom,
      diseases,
      diseasesFr: diseases,
      severity: this.newForm.severity,
    };
    await this.symptomsService.addSymptom(symptom);
    this.cancelCreate();
  }

  cancelCreate(): void {
    this.newForm = { ...EMPTY_FORM };
    this.showCreateForm.set(false);
  }

  async removeSymptom(s: SymptomDoc): Promise<void> {
    await this.symptomsService.deleteSymptom(s.docId);
  }
}

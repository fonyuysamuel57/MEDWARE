import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';
import { DiseasesService } from '../../services/diseases.service';
import { Disease } from '../../models/types';

interface NewDiseaseForm {
  name: string;
  icon: string;
  color: string;
  firstAid: string;
  causes: string;
  symptoms: string;
  prevention: string;
  misconceptions: string;
  treatments: string;
}

type DiseaseDoc = Disease & { docId: string };

const EMPTY_FORM: NewDiseaseForm = {
  name: '', icon: '🏥', color: '#00ACC1', firstAid: '',
  causes: '', symptoms: '', prevention: '', misconceptions: '', treatments: '',
};

@Component({
  selector: 'app-diseases',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diseases.component.html',
  styleUrl: './diseases.component.css'
})
export class DiseasesComponent {
  readonly ts = inject(TranslationService);
  readonly auth = inject(AuthService);
  private readonly diseasesService = inject(DiseasesService);

  readonly allDiseases = this.diseasesService.diseases;
  readonly INITIAL_COUNT = 5;
  showAll = signal(false);
  expandedId = signal<number | null>(null);
  showCreateForm = signal(false);

  newForm: NewDiseaseForm = { ...EMPTY_FORM };

  get visibleDiseases(): DiseaseDoc[] {
    return this.showAll() ? this.allDiseases() : this.allDiseases().slice(0, this.INITIAL_COUNT);
  }

  toggleExpand(id: number): void {
    this.expandedId.update(cur => cur === id ? null : id);
  }

  isExpanded(id: number): boolean {
    return this.expandedId() === id;
  }

  getName(d: DiseaseDoc): string {
    return this.ts.field(d.name, d.nameFr);
  }

  getFirstAid(d: DiseaseDoc): string {
    return this.ts.field(d.firstAid, d.firstAidFr);
  }

  getList(en: string[], fr: string[]): string[] {
    return this.ts.fieldList(en, fr);
  }

  toggleShowAll(): void {
    this.showAll.update(v => !v);
    if (!this.showAll()) {
      document.getElementById('diseases')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private toLines(value: string): string[] {
    return value.split('\n').map(s => s.trim()).filter(Boolean);
  }

  async addDisease(): Promise<void> {
    const causes = this.toLines(this.newForm.causes);
    const symptoms = this.toLines(this.newForm.symptoms);
    const prevention = this.toLines(this.newForm.prevention);
    const misconceptions = this.toLines(this.newForm.misconceptions);
    const treatments = this.toLines(this.newForm.treatments);
    if (!this.newForm.name || !this.newForm.firstAid || causes.length === 0 || symptoms.length === 0) return;

    const disease: Disease = {
      id: Date.now(),
      name: this.newForm.name,
      nameFr: this.newForm.name,
      icon: this.newForm.icon,
      color: this.newForm.color,
      firstAid: this.newForm.firstAid,
      firstAidFr: this.newForm.firstAid,
      causes, causesFr: causes,
      symptoms, symptomsFr: symptoms,
      prevention, preventionFr: prevention,
      misconceptions, misconceptionsFr: misconceptions,
      treatments, treatmentsFr: treatments,
    };
    await this.diseasesService.addDisease(disease);
    this.cancelCreate();
  }

  cancelCreate(): void {
    this.newForm = { ...EMPTY_FORM };
    this.showCreateForm.set(false);
  }

  async removeDisease(d: DiseaseDoc): Promise<void> {
    await this.diseasesService.deleteDisease(d.docId);
  }
}

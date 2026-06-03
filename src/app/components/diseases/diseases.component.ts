import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { DISEASES_DATA } from '../../data/diseases.data';
import { Disease } from '../../models/types';

@Component({
  selector: 'app-diseases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diseases.component.html',
  styleUrl: './diseases.component.css'
})
export class DiseasesComponent {
  readonly ts = inject(TranslationService);
  readonly allDiseases: Disease[] = DISEASES_DATA;
  readonly INITIAL_COUNT = 5;
  showAll = signal(false);
  expandedId = signal<number | null>(null);

  get visibleDiseases(): Disease[] {
    return this.showAll() ? this.allDiseases : this.allDiseases.slice(0, this.INITIAL_COUNT);
  }

  toggleExpand(id: number): void {
    this.expandedId.update(cur => cur === id ? null : id);
  }

  isExpanded(id: number): boolean {
    return this.expandedId() === id;
  }

  getName(d: Disease): string {
    return this.ts.getLang() === 'fr' ? d.nameFr : d.name;
  }

  getField(d: Disease, field: 'firstAid' | 'firstAidFr'): string {
    return this.ts.getLang() === 'fr' ? d.firstAidFr : d.firstAid;
  }

  getList(en: string[], fr: string[]): string[] {
    return this.ts.getLang() === 'fr' ? fr : en;
  }

  toggleShowAll(): void {
    this.showAll.update(v => !v);
    if (!this.showAll()) {
      document.getElementById('diseases')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

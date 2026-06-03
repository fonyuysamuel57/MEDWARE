import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { FIRST_AID_DATA } from '../../data/first-aid.data';
import { FirstAidItem } from '../../models/types';

@Component({
  selector: 'app-first-aid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './first-aid.component.html',
  styleUrl: './first-aid.component.css'
})
export class FirstAidComponent {
  readonly ts = inject(TranslationService);
  readonly allItems: FirstAidItem[] = FIRST_AID_DATA;
  readonly INITIAL_COUNT = 5;
  showAll = signal(false);

  get visibleItems(): FirstAidItem[] {
    return this.showAll() ? this.allItems : this.allItems.slice(0, this.INITIAL_COUNT);
  }

  getTitle(item: FirstAidItem): string {
    return this.ts.getLang() === 'fr' ? item.titleFr : item.title;
  }

  getSteps(item: FirstAidItem): string[] {
    return this.ts.getLang() === 'fr' ? item.stepsFr : item.steps;
  }

  getWarning(item: FirstAidItem): string | undefined {
    return this.ts.getLang() === 'fr' ? item.warningFr : item.warning;
  }

  toggleShowAll(): void {
    this.showAll.update(v => !v);
    if (!this.showAll()) {
      document.getElementById('first-aid')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

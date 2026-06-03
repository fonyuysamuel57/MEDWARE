import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { MISCONCEPTIONS_DATA } from '../../data/misconceptions.data';
import { Misconception } from '../../models/types';

@Component({
  selector: 'app-misconceptions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './misconceptions.component.html',
  styleUrl: './misconceptions.component.css'
})
export class MisconceptionsComponent {
  readonly ts = inject(TranslationService);
  readonly items: Misconception[] = MISCONCEPTIONS_DATA;

  getMyth(m: Misconception): string {
    return this.ts.getLang() === 'fr' ? m.mythFr : m.myth;
  }

  getTruth(m: Misconception): string {
    return this.ts.getLang() === 'fr' ? m.truthFr : m.truth;
  }

  getCategory(m: Misconception): string {
    return this.ts.getLang() === 'fr' ? m.categoryFr : m.category;
  }
}

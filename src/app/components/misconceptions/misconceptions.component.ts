import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';
import { MisconceptionsService } from '../../services/misconceptions.service';
import { Misconception } from '../../models/types';

interface NewMisconceptionForm {
  icon: string;
  category: string;
  myth: string;
  truth: string;
}

type MisconceptionDoc = Misconception & { docId: string };

@Component({
  selector: 'app-misconceptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './misconceptions.component.html',
  styleUrl: './misconceptions.component.css'
})
export class MisconceptionsComponent {
  readonly ts = inject(TranslationService);
  readonly auth = inject(AuthService);
  private readonly misconceptionsService = inject(MisconceptionsService);

  readonly items = this.misconceptionsService.items;
  showCreateForm = signal(false);

  newForm: NewMisconceptionForm = { icon: '❓', category: '', myth: '', truth: '' };

  getMyth(m: MisconceptionDoc): string {
    return this.ts.field(m.myth, m.mythFr);
  }

  getTruth(m: MisconceptionDoc): string {
    return this.ts.field(m.truth, m.truthFr);
  }

  getCategory(m: MisconceptionDoc): string {
    return this.ts.field(m.category, m.categoryFr);
  }

  async addMisconception(): Promise<void> {
    if (!this.newForm.icon || !this.newForm.category || !this.newForm.myth || !this.newForm.truth) return;
    const item: Misconception = {
      id: Date.now(),
      icon: this.newForm.icon,
      category: this.newForm.category,
      categoryFr: this.newForm.category,
      myth: this.newForm.myth,
      mythFr: this.newForm.myth,
      truth: this.newForm.truth,
      truthFr: this.newForm.truth,
    };
    await this.misconceptionsService.addItem(item);
    this.cancelCreate();
  }

  cancelCreate(): void {
    this.newForm = { icon: '❓', category: '', myth: '', truth: '' };
    this.showCreateForm.set(false);
  }

  async removeMisconception(item: MisconceptionDoc): Promise<void> {
    await this.misconceptionsService.deleteItem(item.docId);
  }
}

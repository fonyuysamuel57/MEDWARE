import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';
import { FirstAidService } from '../../services/first-aid.service';
import { FirstAidItem } from '../../models/types';

interface NewFirstAidForm {
  title: string;
  icon: string;
  steps: string;
  warning: string;
}

type FirstAidDoc = FirstAidItem & { docId: string };

@Component({
  selector: 'app-first-aid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './first-aid.component.html',
  styleUrl: './first-aid.component.css'
})
export class FirstAidComponent {
  readonly ts = inject(TranslationService);
  readonly auth = inject(AuthService);
  private readonly firstAidService = inject(FirstAidService);

  readonly allItems = this.firstAidService.items;
  readonly INITIAL_COUNT = 5;
  showAll = signal(false);
  showCreateForm = signal(false);

  newForm: NewFirstAidForm = { title: '', icon: '🩹', steps: '', warning: '' };

  get visibleItems(): FirstAidDoc[] {
    return this.showAll() ? this.allItems() : this.allItems().slice(0, this.INITIAL_COUNT);
  }

  getTitle(item: FirstAidDoc): string {
    return this.ts.field(item.title, item.titleFr);
  }

  getSteps(item: FirstAidDoc): string[] {
    return this.ts.fieldList(item.steps, item.stepsFr);
  }

  getWarning(item: FirstAidDoc): string | undefined {
    return item.warning ? this.ts.field(item.warning, item.warningFr) : undefined;
  }

  toggleShowAll(): void {
    this.showAll.update(v => !v);
    if (!this.showAll()) {
      document.getElementById('first-aid')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  async addFirstAidItem(): Promise<void> {
    const steps = this.newForm.steps.split('\n').map(s => s.trim()).filter(Boolean);
    if (!this.newForm.title || !this.newForm.icon || steps.length === 0) return;
    const warning = this.newForm.warning.trim();
    const item: FirstAidItem = {
      id: Date.now(),
      title: this.newForm.title,
      titleFr: this.newForm.title,
      icon: this.newForm.icon,
      steps,
      stepsFr: steps,
      ...(warning ? { warning, warningFr: warning } : {}),
    };
    await this.firstAidService.addItem(item);
    this.cancelCreate();
  }

  cancelCreate(): void {
    this.newForm = { title: '', icon: '🩹', steps: '', warning: '' };
    this.showCreateForm.set(false);
  }

  async removeFirstAidItem(item: FirstAidDoc): Promise<void> {
    await this.firstAidService.deleteItem(item.docId);
  }
}

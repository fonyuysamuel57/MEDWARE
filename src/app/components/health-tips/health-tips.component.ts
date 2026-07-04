import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';
import { HealthTipsService } from '../../services/health-tips.service';
import { HealthTip } from '../../models/types';

interface NewTipForm {
  topic: string;
  icon: string;
  color1: string;
  color2: string;
  content: string;
  consequences: string;
}

type HealthTipDoc = HealthTip & { docId: string };

const EMPTY_FORM: NewTipForm = {
  topic: '', icon: '🌿', color1: '#006064', color2: '#00BCD4', content: '', consequences: '',
};

@Component({
  selector: 'app-health-tips',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './health-tips.component.html',
  styleUrl: './health-tips.component.css'
})
export class HealthTipsComponent implements OnInit, OnDestroy {
  readonly ts = inject(TranslationService);
  readonly auth = inject(AuthService);
  private readonly healthTipsService = inject(HealthTipsService);

  readonly allTips = this.healthTipsService.tips;
  currentIndex = signal(0);
  showCreateForm = signal(false);
  private autoPlayTimer: ReturnType<typeof setInterval> | null = null;

  newForm: NewTipForm = { ...EMPTY_FORM };

  ngOnInit(): void { this.startAutoPlay(); }
  ngOnDestroy(): void { this.stopAutoPlay(); }

  startAutoPlay(): void {
    this.autoPlayTimer = setInterval(() => this.next(), 7000);
  }

  stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  next(): void {
    const len = this.allTips().length;
    if (len === 0) return;
    this.currentIndex.update(i => (i + 1) % len);
  }

  prev(): void {
    const len = this.allTips().length;
    if (len === 0) return;
    this.currentIndex.update(i => (i - 1 + len) % len);
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  get currentTip(): HealthTipDoc | null {
    const tips = this.allTips();
    if (tips.length === 0) return null;
    const idx = Math.min(this.currentIndex(), tips.length - 1);
    return tips[idx];
  }

  getTopic(tip: HealthTipDoc): string {
    return this.ts.field(tip.topic, tip.topicFr);
  }

  getContent(tip: HealthTipDoc): string {
    return this.ts.field(tip.content, tip.contentFr);
  }

  getConsequences(tip: HealthTipDoc): string {
    return this.ts.field(tip.consequences, tip.consequencesFr);
  }

  async addTip(): Promise<void> {
    if (!this.newForm.topic || !this.newForm.content || !this.newForm.consequences) return;
    const gradient = `linear-gradient(135deg, ${this.newForm.color1} 0%, ${this.newForm.color2} 100%)`;
    const tip: HealthTip = {
      id: Date.now(),
      topic: this.newForm.topic,
      topicFr: this.newForm.topic,
      icon: this.newForm.icon,
      gradient,
      content: this.newForm.content,
      contentFr: this.newForm.content,
      consequences: this.newForm.consequences,
      consequencesFr: this.newForm.consequences,
    };
    await this.healthTipsService.addTip(tip);
    this.cancelCreate();
  }

  cancelCreate(): void {
    this.newForm = { ...EMPTY_FORM };
    this.showCreateForm.set(false);
  }

  async removeTip(tip: HealthTipDoc): Promise<void> {
    const tips = this.allTips();
    if (this.currentIndex() >= tips.length - 1) {
      this.currentIndex.set(Math.max(0, tips.length - 2));
    }
    await this.healthTipsService.deleteTip(tip.docId);
  }
}

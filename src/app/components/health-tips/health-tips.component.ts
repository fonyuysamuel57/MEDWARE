import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { HEALTH_TIPS_DATA } from '../../data/health-tips.data';
import { HealthTip } from '../../models/types';

@Component({
  selector: 'app-health-tips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health-tips.component.html',
  styleUrl: './health-tips.component.css'
})
export class HealthTipsComponent implements OnInit, OnDestroy {
  readonly ts = inject(TranslationService);
  readonly tips: HealthTip[] = HEALTH_TIPS_DATA;

  currentIndex = signal(0);
  private autoPlayTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

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
    this.currentIndex.update(i => (i + 1) % this.tips.length);
  }

  prev(): void {
    this.currentIndex.update(i => (i - 1 + this.tips.length) % this.tips.length);
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  get currentTip(): HealthTip {
    return this.tips[this.currentIndex()];
  }

  getTopic(tip: HealthTip): string {
    return this.ts.getLang() === 'fr' ? tip.topicFr : tip.topic;
  }

  getContent(tip: HealthTip): string {
    return this.ts.getLang() === 'fr' ? tip.contentFr : tip.content;
  }

  getConsequences(tip: HealthTip): string {
    return this.ts.getLang() === 'fr' ? tip.consequencesFr : tip.consequences;
  }
}

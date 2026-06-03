import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  readonly ts = inject(TranslationService);

  readonly navButtons = [
    { labelKey: 'hero.btn.basicTips',      target: 'health-tips',    icon: '💡' },
    { labelKey: 'hero.btn.diseases',        target: 'diseases',       icon: '🏥' },
    { labelKey: 'hero.btn.firstAid',        target: 'first-aid',      icon: '🩺' },
    { labelKey: 'hero.btn.symptoms',        target: 'symptoms',       icon: '🔬' },
    { labelKey: 'hero.btn.articles',        target: 'articles',       icon: '📰' },
    { labelKey: 'hero.btn.healthTips',      target: 'health-tips',    icon: '🌿' },
    { labelKey: 'hero.btn.misconceptions',  target: 'misconceptions', icon: '❓' },
  ];

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

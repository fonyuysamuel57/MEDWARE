import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';
import { ArticlesService } from '../../services/articles.service';
import { Article } from '../../models/types';

interface NewArticleForm {
  title: string;
  content: string;
  author: string;
  tags: string;
  imageUrl: string;
}

type ArticleDoc = Article & { docId: string };

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css'
})
export class ArticlesComponent {
  readonly ts = inject(TranslationService);
  readonly auth = inject(AuthService);
  private readonly articlesService = inject(ArticlesService);

  readonly articles = this.articlesService.articles;
  expandedId = signal<number | null>(null);
  showUploadForm = signal(false);
  showLoginForm = signal(false);
  loginPassword = signal('');
  loginError = signal(false);

  newForm: NewArticleForm = {
    title: '', content: '', author: '', tags: '', imageUrl: ''
  };

  getTitle(a: ArticleDoc): string {
    return this.ts.field(a.title, a.titleFr);
  }

  getContent(a: ArticleDoc): string {
    return this.ts.field(a.content, a.contentFr);
  }

  toggleExpand(id: number): void {
    this.expandedId.update(cur => cur === id ? null : id);
  }

  isExpanded(id: number): boolean { return this.expandedId() === id; }

  async tryLogin(): Promise<void> {
    const ok = await this.auth.login(this.loginPassword());
    if (ok) {
      this.loginError.set(false);
      this.showLoginForm.set(false);
      this.loginPassword.set('');
    } else {
      this.loginError.set(true);
    }
  }

  async publishArticle(): Promise<void> {
    if (!this.newForm.title || !this.newForm.content || !this.newForm.author) return;
    const article: Article = {
      id: Date.now(),
      title: this.newForm.title,
      titleFr: this.newForm.title,
      content: this.newForm.content,
      contentFr: this.newForm.content,
      author: this.newForm.author,
      date: new Date().toISOString().split('T')[0],
      imageUrl: this.newForm.imageUrl || '',
      tags: this.newForm.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    await this.articlesService.addArticle(article);
    this.newForm = { title: '', content: '', author: '', tags: '', imageUrl: '' };
    this.showUploadForm.set(false);
  }

  async removeArticle(a: ArticleDoc): Promise<void> {
    await this.articlesService.deleteArticle(a.docId);
  }

  cancelUpload(): void {
    this.newForm = { title: '', content: '', author: '', tags: '', imageUrl: '' };
    this.showUploadForm.set(false);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(
      this.ts.locale(),
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  }

  renderContent(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
  }
}

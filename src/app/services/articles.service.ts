import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  orderBy,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { Article } from '../models/types';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  private readonly firestore = inject(Firestore);
  private readonly articlesCollection = collection(this.firestore, 'articles');

  readonly articles = toSignal(
    collectionData(query(this.articlesCollection, orderBy('date', 'desc')), { idField: 'docId' }) as
      ReturnType<typeof collectionData<Article & { docId: string }>>,
    { initialValue: [] }
  );

  addArticle(article: Article): Promise<unknown> {
    return addDoc(this.articlesCollection, article);
  }

  updateArticle(docId: string, changes: Partial<Article>): Promise<void> {
    return updateDoc(doc(this.firestore, 'articles', docId), changes);
  }

  deleteArticle(docId: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'articles', docId));
  }
}

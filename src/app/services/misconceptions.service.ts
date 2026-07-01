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
  serverTimestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { Misconception } from '../models/types';

@Injectable({ providedIn: 'root' })
export class MisconceptionsService {
  private readonly firestore = inject(Firestore);
  private readonly itemsCollection = collection(this.firestore, 'misconceptions');

  readonly items = toSignal(
    collectionData(query(this.itemsCollection, orderBy('createdAt', 'desc')), { idField: 'docId' }) as
      ReturnType<typeof collectionData<Misconception & { docId: string }>>,
    { initialValue: [] }
  );

  addItem(item: Misconception): Promise<unknown> {
    return addDoc(this.itemsCollection, { ...item, createdAt: serverTimestamp() });
  }

  updateItem(docId: string, changes: Partial<Misconception>): Promise<void> {
    return updateDoc(doc(this.firestore, 'misconceptions', docId), changes);
  }

  deleteItem(docId: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'misconceptions', docId));
  }
}

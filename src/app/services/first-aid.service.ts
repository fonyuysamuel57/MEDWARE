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
import { FirstAidItem } from '../models/types';

@Injectable({ providedIn: 'root' })
export class FirstAidService {
  private readonly firestore = inject(Firestore);
  private readonly itemsCollection = collection(this.firestore, 'firstAid');

  readonly items = toSignal(
    collectionData(query(this.itemsCollection, orderBy('createdAt', 'desc')), { idField: 'docId' }) as
      ReturnType<typeof collectionData<FirstAidItem & { docId: string }>>,
    { initialValue: [] }
  );

  addItem(item: FirstAidItem): Promise<unknown> {
    return addDoc(this.itemsCollection, { ...item, createdAt: serverTimestamp() });
  }

  updateItem(docId: string, changes: Partial<FirstAidItem>): Promise<void> {
    return updateDoc(doc(this.firestore, 'firstAid', docId), changes);
  }

  deleteItem(docId: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'firstAid', docId));
  }
}

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
import { HealthTip } from '../models/types';

@Injectable({ providedIn: 'root' })
export class HealthTipsService {
  private readonly firestore = inject(Firestore);
  private readonly tipsCollection = collection(this.firestore, 'healthTips');

  readonly tips = toSignal(
    collectionData(query(this.tipsCollection, orderBy('createdAt', 'desc')), { idField: 'docId' }) as
      ReturnType<typeof collectionData<HealthTip & { docId: string }>>,
    { initialValue: [] }
  );

  addTip(tip: HealthTip): Promise<unknown> {
    return addDoc(this.tipsCollection, { ...tip, createdAt: serverTimestamp() });
  }

  updateTip(docId: string, changes: Partial<HealthTip>): Promise<void> {
    return updateDoc(doc(this.firestore, 'healthTips', docId), changes);
  }

  deleteTip(docId: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'healthTips', docId));
  }
}

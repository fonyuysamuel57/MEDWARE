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
import { Disease } from '../models/types';

@Injectable({ providedIn: 'root' })
export class DiseasesService {
  private readonly firestore = inject(Firestore);
  private readonly diseasesCollection = collection(this.firestore, 'diseases');

  readonly diseases = toSignal(
    collectionData(query(this.diseasesCollection, orderBy('createdAt', 'desc')), { idField: 'docId' }) as
      ReturnType<typeof collectionData<Disease & { docId: string }>>,
    { initialValue: [] }
  );

  addDisease(disease: Disease): Promise<unknown> {
    return addDoc(this.diseasesCollection, { ...disease, createdAt: serverTimestamp() });
  }

  updateDisease(docId: string, changes: Partial<Disease>): Promise<void> {
    return updateDoc(doc(this.firestore, 'diseases', docId), changes);
  }

  deleteDisease(docId: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'diseases', docId));
  }
}

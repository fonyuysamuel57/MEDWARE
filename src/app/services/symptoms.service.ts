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
import { Symptom } from '../models/types';

@Injectable({ providedIn: 'root' })
export class SymptomsService {
  private readonly firestore = inject(Firestore);
  private readonly symptomsCollection = collection(this.firestore, 'symptoms');

  readonly symptoms = toSignal(
    collectionData(query(this.symptomsCollection, orderBy('createdAt', 'desc')), { idField: 'docId' }) as
      ReturnType<typeof collectionData<Symptom & { docId: string }>>,
    { initialValue: [] }
  );

  addSymptom(symptom: Symptom): Promise<unknown> {
    return addDoc(this.symptomsCollection, { ...symptom, createdAt: serverTimestamp() });
  }

  updateSymptom(docId: string, changes: Partial<Symptom>): Promise<void> {
    return updateDoc(doc(this.firestore, 'symptoms', docId), changes);
  }

  deleteSymptom(docId: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'symptoms', docId));
  }
}

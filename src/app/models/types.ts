export interface FirstAidItem {
  id: number;
  title: string; titleFr: string;
  icon: string;
  steps: string[]; stepsFr: string[];
  warning?: string; warningFr?: string;
}

export interface Symptom {
  id: number;
  symptom: string; symptomFr: string;
  diseases: string[]; diseasesFr: string[];
  severity: 'mild' | 'moderate' | 'severe';
}

export interface Disease {
  id: number;
  name: string; nameFr: string;
  icon: string; color: string;
  firstAid: string; firstAidFr: string;
  causes: string[]; causesFr: string[];
  symptoms: string[]; symptomsFr: string[];
  prevention: string[]; preventionFr: string[];
  misconceptions: string[]; misconceptionsFr: string[];
  treatments: string[]; treatmentsFr: string[];
}

export interface HealthTip {
  id: number;
  topic: string; topicFr: string;
  gradient: string;
  icon: string;
  content: string; contentFr: string;
  consequences: string; consequencesFr: string;
}

export interface Article {
  id: number;
  title: string; titleFr: string;
  content: string; contentFr: string;
  author: string;
  date: string;
  imageUrl?: string;
  tags: string[];
}

export interface Misconception {
  id: number;
  myth: string; mythFr: string;
  truth: string; truthFr: string;
  category: string; categoryFr: string;
  icon: string;
}

export type Language = 'en' | 'fr';

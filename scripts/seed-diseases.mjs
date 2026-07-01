// One-time script: uploads the original diseases (previously in
// src/app/data/diseases.data.ts) into the Firestore "diseases" collection.
// Run once after creating the admin account in
// Firebase Console > Authentication > Users.
//
// Usage:
//   node scripts/seed-diseases.mjs <admin-password>

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ADMIN_EMAIL = 'fonyuysamuel57@gmail.com';

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/seed-diseases.mjs <admin-password>');
  process.exit(1);
}

const app = initializeApp({
  projectId: 'medware-4c955',
  appId: '1:203119931295:web:a5b532340cfb02d16917aa',
  storageBucket: 'medware-4c955.firebasestorage.app',
  apiKey: 'AIzaSyDojVvdBrMfMzz7SERVq4IHmjHrDjW9VwQ',
  authDomain: 'medware-4c955.firebaseapp.com',
  messagingSenderId: '203119931295',
  measurementId: 'G-YSPYTZG099',
});

const auth = getAuth(app);
const firestore = getFirestore(app);

const DISEASES_DATA = [
  {
    id: 1,
    name: 'Malaria',
    nameFr: 'Paludisme',
    icon: '🦟',
    color: '#00ACC1',
    firstAid: 'If malaria is suspected, seek medical attention immediately. While waiting: keep the person cool (not cold) for fever, give paracetamol (not aspirin) for fever and pain, ensure adequate hydration, and place in recovery position if vomiting.',
    firstAidFr: 'En cas de suspicion de paludisme, consultez immédiatement un médecin. En attendant: gardez la personne fraîche pour la fièvre, donnez du paracétamol (pas d\'aspirine), assurez une hydratation adéquate.',
    causes: ['Bite of infected female Anopheles mosquito', 'Plasmodium falciparum (most deadly strain, dominant in Cameroon)', 'Lack of mosquito nets', 'Stagnant water breeding grounds near homes', 'Outdoor activity at dusk and dawn'],
    causesFr: ['Piqûre du moustique femelle Anophèles infecté', 'Plasmodium falciparum (souche la plus mortelle, dominante au Cameroun)', 'Manque de moustiquaires', 'Eaux stagnantes près des habitations'],
    symptoms: ['High fever with chills and sweating', 'Severe headache', 'Muscle aches and fatigue', 'Nausea and vomiting', 'Jaundice (yellow skin/eyes)', 'Confusion (cerebral malaria)', 'Rapid breathing and pallor'],
    symptomsFr: ['Fièvre élevée avec frissons et sueurs', 'Maux de tête sévères', 'Douleurs musculaires et fatigue', 'Nausées et vomissements', 'Jaunisse', 'Confusion (paludisme cérébral)'],
    prevention: ['Sleep under insecticide-treated mosquito nets (ITNs)', 'Use insect repellent on exposed skin', 'Wear long-sleeved clothing at dusk/dawn', 'Eliminate stagnant water near home', 'Use indoor residual spraying (IRS)', 'Take prophylactic medication when in high-risk areas', 'Install screens on windows and doors'],
    preventionFr: ['Dormir sous des moustiquaires imprégnées d\'insecticide', 'Utiliser un répulsif sur la peau exposée', 'Porter des vêtements à manches longues au crépuscule/aube', 'Éliminer les eaux stagnantes près du domicile'],
    misconceptions: ['MYTH: "Malaria is caused by eating certain foods or cold weather." FACT: Malaria is caused exclusively by the Plasmodium parasite transmitted by mosquito bites.', 'MYTH: "Traditional herbs alone can cure malaria." FACT: Only WHO-approved antimalarial drugs (like ACT) can reliably cure malaria. Delayed treatment of malaria can be fatal.', 'MYTH: "If you have had malaria before, you are immune." FACT: While repeated infections can build partial immunity, nobody is fully immune to malaria.'],
    misconceptionsFr: ['MYTHE: "Le paludisme est causé par certains aliments ou le froid." FAIT: Le paludisme est causé exclusivement par le parasite Plasmodium transmis par les moustiques.', 'MYTHE: "Les herbes traditionnelles seules peuvent guérir le paludisme." FAIT: Seuls les antipaludéens approuvés peuvent guérir de manière fiable le paludisme.'],
    treatments: ['Artemisinin-based Combination Therapy (ACT) — first-line treatment in Cameroon', 'Chloroquine (for P. vivax in some regions)', 'IV artesunate for severe/cerebral malaria', 'Supportive care: IV fluids, antipyretics, anticonvulsants if needed', 'Blood transfusion for severe anemia'],
    treatmentsFr: ['Thérapie combinée à base d\'artémisinine (ACT) — traitement de première ligne au Cameroun', 'Artésunate IV pour le paludisme grave', 'Soins de soutien: fluides IV, antipyrétiques'],
  },
  {
    id: 2,
    name: 'Eye Defects & Disorders',
    nameFr: 'Troubles Oculaires',
    icon: '👁️',
    color: '#0097A7',
    firstAid: 'For eye injuries: do not rub; rinse with clean water for chemical exposure; cover with clean pad for physical injury. For vision problems: avoid bright lights, rest eyes, and seek immediate medical attention especially for sudden vision loss.',
    firstAidFr: 'Pour les blessures oculaires: ne pas frotter; rincer avec de l\'eau propre pour les expositions chimiques; couvrir avec un pansement propre. Pour les problèmes de vision: éviter les lumières vives et consulter immédiatement un médecin.',
    causes: ['Refractive errors (myopia, hyperopia, astigmatism)', 'Infections (bacterial, viral, fungal)', 'Onchocerciasis (river blindness) — common in Cameroon', 'Vitamin A deficiency', 'Trauma and injury', 'Genetic factors', 'Diabetes and hypertension (secondary complications)', 'Exposure to UV light without protection'],
    causesFr: ['Erreurs de réfraction (myopie, hypermétropie, astigmatisme)', 'Infections (bactériennes, virales, fongiques)', 'Onchocercose (cécité des rivières) — fréquente au Cameroun', 'Carence en vitamine A', 'Traumatisme et blessure'],
    symptoms: ['Blurred or double vision', 'Eye pain or redness', 'Excessive tearing or discharge', 'Sensitivity to light', 'Gradual or sudden vision loss', 'Seeing halos around lights', 'Swollen eyelids', 'Squinting in bright light (children)'],
    symptomsFr: ['Vision floue ou double', 'Douleur ou rougeur oculaire', 'Larmoiement excessif ou écoulement', 'Sensibilité à la lumière', 'Perte de vision progressive ou soudaine'],
    prevention: ['Regular eye examinations', 'Wear protective eyewear during hazardous activities', 'Ensure adequate Vitamin A intake (orange fruits/vegetables)', 'Use sunglasses with UV protection', 'Control diabetes and blood pressure', 'Protect children from injuries', 'Community-based onchocerciasis control programs', 'Good hand hygiene to prevent eye infections'],
    preventionFr: ['Examens oculaires réguliers', 'Porter des lunettes de protection lors d\'activités dangereuses', 'Assurer un apport adéquat en vitamine A', 'Contrôler le diabète et la tension artérielle'],
    misconceptions: ['MYTH: "Eating carrots restores poor vision." FACT: While Vitamin A (found in carrots) prevents night blindness, it cannot correct refractive errors or existing eye diseases.', 'MYTH: "Reading in dim light permanently damages eyes." FACT: It may cause eye strain but does not permanently damage vision.', 'MYTH: "Eye problems are always hereditary." FACT: Many eye conditions are preventable and caused by infections, nutrition, or injury.'],
    misconceptionsFr: ['MYTHE: "Manger des carottes restaure une mauvaise vue." FAIT: La Vitamine A prévient la cécité nocturne mais ne corrige pas les erreurs de réfraction.', 'MYTHE: "Lire dans l\'obscurité endommage définitivement les yeux." FAIT: Cela peut causer une fatigue oculaire mais n\'endommage pas définitivement la vision.'],
    treatments: ['Corrective lenses (glasses or contact lenses)', 'Refractive surgery (LASIK)', 'Antibiotic/antiviral eye drops for infections', 'Ivermectin for onchocerciasis', 'Cataract surgery', 'Glaucoma: eye drops, laser, or surgery', 'Vitamin A supplementation for deficiency', 'Anti-VEGF injections for macular degeneration'],
    treatmentsFr: ['Lunettes correctrices ou lentilles de contact', 'Chirurgie réfractive (LASIK)', 'Collyres antibiotiques/antiviraux pour les infections', 'Ivermectine pour l\'onchocercose', 'Chirurgie de la cataracte'],
  },
  {
    id: 3,
    name: 'Non-Communicable Diseases (NCDs)',
    nameFr: 'Maladies Non Transmissibles (MNT)',
    icon: '🫀',
    color: '#00838F',
    firstAid: 'For suspected heart attack: call emergency services, help person sit/rest, give aspirin if not allergic. For stroke (FAST: Face drooping, Arm weakness, Speech difficulty, Time to call): call emergency services immediately and do not give food/water.',
    firstAidFr: 'Pour crise cardiaque suspectée: appeler les urgences, aider la personne à s\'asseoir, donner aspirine si non allergique. Pour AVC (VITE: Visage, bras, trouble de la parole, Évaluer): appeler immédiatement les urgences.',
    causes: ['Unhealthy diet (high salt, fat, sugar)', 'Physical inactivity', 'Tobacco use and alcohol abuse', 'Genetic predisposition', 'Chronic stress', 'Environmental pollution', 'Overweight and obesity', 'High blood pressure (uncontrolled)'],
    causesFr: ['Alimentation malsaine (sel, graisses, sucres élevés)', 'Inactivité physique', 'Tabac et abus d\'alcool', 'Prédisposition génétique', 'Stress chronique', 'Pollution environnementale'],
    symptoms: ['High blood pressure (hypertension)', 'Persistent fatigue', 'Frequent urination and excessive thirst (diabetes)', 'Chest pain or palpitations (heart disease)', 'Unexplained weight changes', 'Chronic cough (COPD)', 'Difficulty breathing during activity', 'Swollen legs or ankles'],
    symptomsFr: ['Hypertension artérielle', 'Fatigue persistante', 'Urination fréquente et soif excessive (diabète)', 'Douleur thoracique ou palpitations', 'Changements de poids inexpliqués', 'Toux chronique (BPCO)'],
    prevention: ['Maintain a healthy weight and BMI', 'Exercise for at least 30 minutes most days', 'Eat balanced diet rich in fruits and vegetables', 'Limit salt intake to less than 5g per day', 'Avoid smoking and limit alcohol', 'Regular blood pressure and blood sugar screenings', 'Manage stress through relaxation techniques', 'Attend regular medical check-ups'],
    preventionFr: ['Maintenir un poids santé', 'Faire de l\'exercice au moins 30 minutes la plupart des jours', 'Alimentation équilibrée riche en fruits et légumes', 'Limiter le sel, le tabac et l\'alcool', 'Contrôles réguliers de la tension et du sucre'],
    misconceptions: ['MYTH: "NCDs only affect the elderly and wealthy." FACT: NCDs increasingly affect young adults and people in low-income communities in Cameroon.', 'MYTH: "Diabetes can be cured by traditional medicine alone." FACT: Diabetes is a chronic condition managed with medication, diet, and lifestyle changes — traditional remedies cannot replace insulin or metformin.', 'MYTH: "High blood pressure has obvious symptoms." FACT: Hypertension is called the "silent killer" because it often has no symptoms until serious damage occurs.'],
    misconceptionsFr: ['MYTHE: "Les MNT n\'affectent que les personnes âgées et riches." FAIT: Les MNT touchent de plus en plus les jeunes adultes au Cameroun.', 'MYTHE: "Le diabète peut être guéri par la médecine traditionnelle." FAIT: Le diabète est une maladie chronique qui nécessite une gestion médicale.'],
    treatments: ['Antihypertensives for high blood pressure', 'Metformin/insulin for diabetes', 'Statins and antiplatelets for heart disease', 'Bronchodilators for COPD/asthma', 'Lifestyle modifications (diet, exercise)', 'Weight loss and bariatric surgery (for severe obesity)', 'Regular monitoring and medication adherence', 'Cardiac rehabilitation programs'],
    treatmentsFr: ['Antihypertenseurs pour la tension artérielle', 'Metformine/insuline pour le diabète', 'Statines pour les maladies cardiaques', 'Bronchodilatateurs pour BPCO', 'Modifications du mode de vie'],
  },
  {
    id: 4,
    name: 'Substance Abuse',
    nameFr: 'Abus de Substances',
    icon: '⚠️',
    color: '#006064',
    firstAid: 'For overdose: call emergency services immediately. Place unconscious person in recovery position. For stimulant overdose (cocaine, amphetamines): keep person calm, cool environment. For depressant overdose (heroin, alcohol): monitor breathing, give naloxone if available. Never leave the person alone.',
    firstAidFr: 'En cas de surdose: appeler immédiatement les urgences. Placer la personne inconsciente en position latérale. Pour surdose de stimulants: garder la personne calme. Pour surdose de dépresseurs: surveiller la respiration.',
    causes: ['Peer pressure and social environment', 'Mental health disorders (depression, anxiety, trauma)', 'Genetic predisposition to addiction', 'Early exposure to substances', 'Unemployment and poverty', 'Lack of recreational activities', 'Easy accessibility of substances', 'Trauma and abuse history'],
    causesFr: ['Pression des pairs et environnement social', 'Troubles mentaux (dépression, anxiété, traumatisme)', 'Prédisposition génétique', 'Exposition précoce aux substances', 'Chômage et pauvreté'],
    symptoms: ['Bloodshot or glazed eyes', 'Sudden changes in behavior or mood', 'Neglect of personal hygiene', 'Withdrawing from family and friends', 'Unexplained financial problems', 'Poor performance at work or school', 'Tremors, slurred speech, impaired coordination', 'Secretive behavior'],
    symptomsFr: ['Yeux injectés de sang', 'Changements soudains de comportement ou d\'humeur', 'Négligence de l\'hygiène personnelle', 'Retrait de la famille et des amis', 'Problèmes financiers inexpliqués'],
    prevention: ['Education about risks of substance abuse from an early age', 'Strong family bonds and communication', 'Community youth programs and recreational activities', 'Mental health support and early intervention', 'Limiting access to substances', 'Addressing underlying mental health issues', 'Support groups and community outreach', 'Economic empowerment programs'],
    preventionFr: ['Éducation sur les risques dès le jeune âge', 'Liens familiaux solides et communication', 'Programmes jeunesse et activités récréatives', 'Soutien en santé mentale et intervention précoce'],
    misconceptions: ['MYTH: "Addiction is a character weakness or moral failing." FACT: Addiction is a chronic brain disease involving changes in brain structure and function.', 'MYTH: "You can quit anytime with enough willpower." FACT: Quitting addictive substances often requires professional medical and psychological support.', 'MYTH: "Cannabis (marijuana) is completely harmless." FACT: Cannabis can cause addiction, impair brain development in young users, and trigger psychosis in vulnerable individuals.'],
    misconceptionsFr: ['MYTHE: "L\'addiction est une faiblesse de caractère." FAIT: L\'addiction est une maladie chronique du cerveau.', 'MYTHE: "On peut arrêter à tout moment avec assez de volonté." FAIT: L\'arrêt nécessite souvent un soutien médical et psychologique professionnel.'],
    treatments: ['Detoxification under medical supervision', 'Cognitive Behavioral Therapy (CBT)', 'Medication-assisted treatment (methadone, buprenorphine, naltrexone)', 'Support groups (Narcotics Anonymous, Alcoholics Anonymous)', 'Rehabilitation programs', 'Dual-diagnosis treatment for co-occurring mental health conditions', 'Family therapy', 'Long-term aftercare and relapse prevention'],
    treatmentsFr: ['Désintoxication sous supervision médicale', 'Thérapie Cognitivo-Comportementale (TCC)', 'Traitement médicamenteux', 'Groupes de soutien', 'Programmes de réhabilitation', 'Thérapie familiale'],
  },
  {
    id: 5,
    name: 'Malnutrition',
    nameFr: 'Malnutrition',
    icon: '🥗',
    color: '#00796B',
    firstAid: 'For severe acute malnutrition (SAM) with medical complications: seek hospital admission immediately. Do not force-feed. Give rehydration therapy (ORS) for diarrhea. For children: give ready-to-use therapeutic food (RUTF like Plumpy\'Nut) as directed by healthcare workers.',
    firstAidFr: 'Pour la malnutrition aiguë sévère: hospitalisation immédiate. Ne pas forcer l\'alimentation. Donner la réhydratation orale. Pour les enfants: donner des aliments thérapeutiques prêts à l\'emploi selon les indications.',
    causes: ['Food insecurity and poverty', 'Inadequate dietary diversity', 'Poor infant and young child feeding practices', 'Recurrent infections (malaria, diarrhea)', 'Limited access to healthcare', 'Poor sanitation and hygiene', 'Low maternal education', 'Conflict and displacement'],
    causesFr: ['Insécurité alimentaire et pauvreté', 'Diversité alimentaire insuffisante', 'Mauvaises pratiques d\'alimentation du nourrisson', 'Infections récurrentes', 'Accès limité aux soins de santé', 'Mauvais assainissement et hygiène'],
    symptoms: ['Severely low weight for age (underweight)', 'Muscle wasting (marasmus)', 'Bilateral pitting edema (kwashiorkor)', 'Swollen abdomen', 'Dry, flaky skin and brittle hair', 'Frequent infections due to weakened immunity', 'Delayed growth and development', 'Night blindness (Vitamin A deficiency)'],
    symptomsFr: ['Poids très faible pour l\'âge', 'Amaigrissement musculaire (marasme)', 'Œdème bilatéral (kwashiorkor)', 'Ventre gonflé', 'Peau sèche et cheveux cassants', 'Infections fréquentes dues à une immunité affaiblie'],
    prevention: ['Exclusive breastfeeding for first 6 months', 'Timely introduction of diverse complementary foods from 6 months', 'Regular growth monitoring', 'Vaccination to prevent infectious diseases', 'Access to clean water and sanitation', 'Vitamin and mineral supplementation programs', 'Community nutrition education', 'Economic empowerment of families'],
    preventionFr: ['Allaitement exclusif pendant les 6 premiers mois', 'Introduction d\'aliments complémentaires diversifiés dès 6 mois', 'Surveillance régulière de la croissance', 'Vaccination contre les maladies infectieuses', 'Accès à l\'eau propre et à l\'assainissement'],
    misconceptions: ['MYTH: "A fat child is a healthy child." FACT: Overweight children can still be malnourished due to lack of essential micronutrients (hidden hunger).', 'MYTH: "Malnutrition only affects very poor families." FACT: Micronutrient deficiencies affect families at all income levels when diet lacks diversity.', 'MYTH: "Kwashiorkor (swollen belly) is caused by witchcraft." FACT: Kwashiorkor is caused by severe protein deficiency and is a medical emergency.'],
    misconceptionsFr: ['MYTHE: "Un enfant gros est un enfant en bonne santé." FAIT: Les enfants en surpoids peuvent souffrir de malnutrition par manque de micronutriments.', 'MYTHE: "Le kwashiorkor est causé par la sorcellerie." FAIT: Le kwashiorkor est causé par une grave carence en protéines.'],
    treatments: ['Ready-to-Use Therapeutic Food (RUTF/Plumpy\'Nut)', 'F-75 and F-100 therapeutic milk formulas', 'Micronutrient supplementation (iron, zinc, Vitamin A)', 'Treatment of underlying infections', 'Graduated refeeding to avoid refeeding syndrome', 'Community-based management of acute malnutrition (CMAM)', 'Long-term nutrition education and support'],
    treatmentsFr: ['Aliments thérapeutiques prêts à l\'emploi (ATPE)', 'Formules F-75 et F-100', 'Supplémentation en micronutriments', 'Traitement des infections sous-jacentes', 'Réalimentation progressive'],
  },
  {
    id: 6,
    name: 'Clubfoot (Talipes Equinovarus)',
    nameFr: 'Pied Bot (Talipes Equinovarus)',
    icon: '🦶',
    color: '#004D40',
    firstAid: 'Clubfoot is a congenital (birth) condition. It is not a medical emergency but requires early medical assessment. Inform the healthcare provider at birth. Do not attempt home manipulation. Do not delay treatment — early intervention gives the best outcomes.',
    firstAidFr: 'Le pied bot est une affection congénitale. Ce n\'est pas une urgence médicale mais nécessite une évaluation médicale précoce. Informer le prestataire de soins à la naissance. Ne pas tenter de manipulation à domicile.',
    causes: ['Primarily idiopathic (unknown cause — most common)', 'Genetic factors and family history', 'Abnormal positioning in the womb', 'Neuromuscular conditions (spina bifida)', 'Amniotic band syndrome', 'Environmental factors during pregnancy', 'Oligohydramnios (low amniotic fluid)'],
    causesFr: ['Principalement idiopathique (cause inconnue)', 'Facteurs génétiques et antécédents familiaux', 'Positionnement anormal dans l\'utérus', 'Conditions neuromusculaires (spina bifida)', 'Syndrome des brides amniotiques'],
    symptoms: ['Foot turned inward and downward at birth', 'Reduced range of motion of the ankle', 'Calf muscles may be underdeveloped', 'Affected foot/leg may be slightly shorter', 'In untreated cases: difficulty walking normally, developing calluses'],
    symptomsFr: ['Pied tourné vers l\'intérieur et vers le bas à la naissance', 'Amplitude de mouvement réduite de la cheville', 'Muscles du mollet peu développés', 'Pied/jambe affecté légèrement plus court', 'En cas non traité: difficulté à marcher normalement'],
    prevention: ['No known guaranteed prevention (mostly idiopathic)', 'Good prenatal care and folic acid supplementation', 'Avoiding smoking and alcohol during pregnancy', 'Managing maternal diabetes during pregnancy', 'Genetic counseling for families with history of clubfoot'],
    preventionFr: ['Pas de prévention garantie connue (surtout idiopathique)', 'Bons soins prénatals et supplémentation en acide folique', 'Éviter le tabac et l\'alcool pendant la grossesse', 'Conseil génétique pour les familles ayant des antécédents de pied bot'],
    misconceptions: ['MYTH: "Clubfoot is caused by the mother\'s actions or sins during pregnancy." FACT: Clubfoot is a structural birth condition with biological causes — it is not a punishment or spiritual curse.', 'MYTH: "It cannot be treated." FACT: With the Ponseti method (casting + bracing), clubfoot is highly treatable — over 95% success rate when started early.', 'MYTH: "Traditional splinting at home is sufficient." FACT: Home manipulation without proper technique can cause lasting harm. Professional Ponseti casting is essential.'],
    misconceptionsFr: ['MYTHE: "Le pied bot est causé par les actions ou péchés de la mère pendant la grossesse." FAIT: Le pied bot est une condition congénitale avec des causes biologiques.', 'MYTHE: "Il ne peut pas être traité." FAIT: Avec la méthode Ponseti, le pied bot est hautement traitable.'],
    treatments: ['Ponseti Method: serial casting (gradual correction over weeks)', 'Percutaneous Achilles tenotomy (minor procedure)', 'Foot Abduction Brace (FAB/Denis Browne brace) — worn for 3+ years', 'Physiotherapy and stretching exercises', 'Surgical correction for resistant cases', 'Regular follow-up to prevent relapse', 'Community awareness to promote early treatment'],
    treatmentsFr: ['Méthode Ponseti: plâtres en série', 'Ténotomie du tendon d\'Achille', 'Attelle d\'abduction du pied (3+ ans)', 'Physiothérapie et exercices d\'étirement', 'Correction chirurgicale pour les cas résistants'],
  },
  {
    id: 7,
    name: 'Sexually Transmitted Diseases (STDs)',
    nameFr: 'Infections Sexuellement Transmissibles (IST)',
    icon: '🔴',
    color: '#00BCD4',
    firstAid: 'After potential exposure: do not panic. For HIV: Post-Exposure Prophylaxis (PEP) must be started within 72 hours — seek medical care immediately. Abstain from sex until evaluated. Do not douche or attempt to "wash out" infection. Seek testing and counseling promptly.',
    firstAidFr: 'Après exposition possible: ne pas paniquer. Pour le VIH: la Prophylaxie Post-Exposition (PPE) doit être commencée dans les 72 heures. Consulter immédiatement. Ne pas effectuer de douche intime.',
    causes: ['Unprotected sexual intercourse (vaginal, anal, oral)', 'Multiple sexual partners', 'Mother-to-child transmission (HIV, syphilis, herpes)', 'Sharing of needles (HIV, Hepatitis B/C)', 'Blood transfusions with unscreened blood', 'Low condom use', 'Alcohol and drug use impairing judgment', 'Lack of sexual health education'],
    causesFr: ['Rapports sexuels non protégés', 'Partenaires multiples', 'Transmission mère-enfant (VIH, syphilis, herpès)', 'Partage d\'aiguilles', 'Transfusions sanguines non contrôlées', 'Faible utilisation des préservatifs'],
    symptoms: ['Unusual discharge from penis or vagina', 'Sores, ulcers, or blisters on genitals', 'Burning sensation during urination', 'Rash on body, palms, or soles', 'Swollen lymph nodes in groin', 'Pelvic pain in women', 'Many STDs have NO symptoms (especially HIV early stages)', 'Warts around genitals or anus'],
    symptomsFr: ['Écoulement inhabituel du pénis ou du vagin', 'Plaies ou cloques sur les organes génitaux', 'Brûlure pendant la miction', 'Éruption cutanée', 'Ganglions enflés dans l\'aine', 'Beaucoup d\'IST n\'ont PAS de symptômes (surtout VIH)'],
    prevention: ['Consistent and correct use of condoms', 'Mutual monogamy (both partners tested and faithful)', 'Regular HIV and STD testing', 'Vaccination (HPV vaccine, Hepatitis B vaccine)', 'Pre-Exposure Prophylaxis (PrEP) for HIV high-risk individuals', 'Avoid sharing needles or sharp objects', 'Comprehensive sexual health education', 'Screening of pregnant women for syphilis and HIV'],
    preventionFr: ['Utilisation correcte et constante des préservatifs', 'Monogamie mutuelle (les deux partenaires testés)', 'Tests réguliers VIH et IST', 'Vaccination (VPH, Hépatite B)', 'Prophylaxie Pré-Exposition (PrEP) pour les personnes à haut risque'],
    misconceptions: ['MYTH: "You can tell if someone has HIV/STD by their appearance." FACT: Most STDs including HIV have no visible symptoms, especially early on. Only testing can confirm.', 'MYTH: "HIV/AIDS is a death sentence." FACT: With modern Antiretroviral Therapy (ART), people with HIV can live long, healthy lives and have undetectable viral loads (U=U).', 'MYTH: "STDs only affect people who are promiscuous." FACT: Anyone who is sexually active can contract an STD, even in committed relationships.', 'MYTH: "Condoms do not prevent HIV." FACT: Correct and consistent condom use reduces HIV transmission risk by over 85%.'],
    misconceptionsFr: ['MYTHE: "On peut dire si quelqu\'un a le VIH/IST par son apparence." FAIT: La plupart des IST n\'ont pas de symptômes visibles. Seul le dépistage confirme.', 'MYTHE: "Le VIH/SIDA est une condamnation à mort." FAIT: Avec la thérapie antirétrovirale, les personnes vivant avec le VIH peuvent vivre longtemps.', 'MYTHE: "Les préservatifs ne préviennent pas le VIH." FAIT: L\'utilisation correcte du préservatif réduit le risque de transmission de plus de 85%.'],
    treatments: ['HIV: Antiretroviral Therapy (ART) — taken for life', 'Gonorrhea/Chlamydia: Antibiotics (ceftriaxone, azithromycin)', 'Syphilis: Penicillin injections', 'Herpes: Antiviral medication (acyclovir) — manages but not cures', 'Hepatitis B/C: Antiviral medications', 'HPV: Wart removal, management of cervical changes', 'Trichomonas: Metronidazole', 'Partner notification and treatment'],
    treatmentsFr: ['VIH: Thérapie antirétrovirale (TAR) — à vie', 'Gonorrhée/Chlamydia: Antibiotiques', 'Syphilis: Injections de pénicilline', 'Herpès: Médicaments antiviraux', 'Hépatite B/C: Médicaments antiviraux'],
  },
];

await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);

const diseasesCollection = collection(firestore, 'diseases');
for (const disease of DISEASES_DATA) {
  await addDoc(diseasesCollection, { ...disease, createdAt: serverTimestamp() });
  console.log(`Seeded: ${disease.name}`);
}

console.log(`Done. Seeded ${DISEASES_DATA.length} diseases.`);
process.exit(0);

// One-time script: uploads the original misconceptions (previously in
// src/app/data/misconceptions.data.ts) into the Firestore "misconceptions"
// collection. Run once after creating the admin account in
// Firebase Console > Authentication > Users.
//
// Usage:
//   node scripts/seed-misconceptions.mjs <admin-password>

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ADMIN_EMAIL = 'fonyuysamuel57@gmail.com';

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/seed-misconceptions.mjs <admin-password>');
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

const MISCONCEPTIONS_DATA = [
  {
    id: 1,
    myth: '"Malaria is treated by sweating it out with blankets and hot pepper soup."',
    mythFr: '"Le paludisme se traite en transpirant avec des couvertures et de la soupe épicée."',
    truth: 'Wrapping a feverish patient in blankets can dangerously raise body temperature and lead to febrile seizures. Malaria requires proper antimalarial medication (ACT). Use cool (not cold) compresses to manage fever while seeking medical care.',
    truthFr: 'Envelopper un patient fiévreux dans des couvertures peut dangereusement élever la température corporelle et provoquer des convulsions. Le paludisme nécessite des médicaments antipaludéens appropriés (ACT).',
    category: 'Malaria',
    categoryFr: 'Paludisme',
    icon: '🦟',
  },
  {
    id: 2,
    myth: '"HIV/AIDS can be cured by having sex with a virgin."',
    mythFr: '"Le VIH/SIDA peut être guéri en ayant des rapports sexuels avec une vierge."',
    truth: 'This dangerous myth has led to the rape and HIV infection of children. HIV has NO cure at this time. Antiretroviral therapy (ART) manages the virus but does not cure it. This myth destroys lives and must be rejected absolutely.',
    truthFr: 'Ce mythe dangereux a conduit au viol et à l\'infection au VIH d\'enfants. Le VIH n\'a PAS de remède. La thérapie antirétrovirale (TAR) gère le virus mais ne le guérit pas.',
    category: 'HIV/AIDS',
    categoryFr: 'VIH/SIDA',
    icon: '🔴',
  },
  {
    id: 3,
    myth: '"Epilepsy (seizures) is caused by evil spirits and is contagious."',
    mythFr: '"L\'épilepsie est causée par des esprits mauvais et est contagieuse."',
    truth: 'Epilepsy is a neurological disorder caused by abnormal electrical activity in the brain. It is NOT contagious in any way. Touching or helping someone during a seizure does not transmit anything. It is manageable with proper medication.',
    truthFr: 'L\'épilepsie est un trouble neurologique causé par une activité électrique anormale dans le cerveau. Elle n\'est PAS contagieuse. Elle est gérable avec une médication appropriée.',
    category: 'Epilepsy',
    categoryFr: 'Épilepsie',
    icon: '⚡',
  },
  {
    id: 4,
    myth: '"Putting a spoon or stick in the mouth of someone having a seizure prevents them from swallowing their tongue."',
    mythFr: '"Mettre une cuillère dans la bouche d\'une personne en crise l\'empêche d\'avaler sa langue."',
    truth: 'You cannot swallow your tongue during a seizure. Forcing objects into the mouth causes broken teeth, jaw fractures, and can block the airway. NEVER put anything in the mouth of a person having a seizure. Turn them on their side instead.',
    truthFr: 'On ne peut pas avaler sa langue pendant une crise. Forcer des objets dans la bouche cause des dents cassées et peut bloquer les voies respiratoires. Ne jamais mettre quoi que ce soit dans la bouche.',
    category: 'Epilepsy / First Aid',
    categoryFr: 'Épilepsie / Premiers Secours',
    icon: '🚫',
  },
  {
    id: 5,
    myth: '"Snake bite should be treated by sucking out the venom with your mouth."',
    mythFr: '"Une morsure de serpent doit être traitée en aspirant le venin avec la bouche."',
    truth: 'Sucking venom is ineffective and dangerous — venom can enter through any cuts in the mouth, and it wastes critical time. Keep the bitten limb still and below heart level, and get to a hospital immediately for antivenom. Only medical professionals can administer effective treatment.',
    truthFr: 'Aspirer le venin est inefficace et dangereux. Maintenez le membre mordu immobile et en dessous du niveau du cœur, et allez immédiatement à l\'hôpital pour l\'antivenin.',
    category: 'First Aid',
    categoryFr: 'Premiers Secours',
    icon: '🐍',
  },
  {
    id: 6,
    myth: '"Diabetes can be cured by bitter leaf, ginger, or other herbal remedies."',
    mythFr: '"Le diabète peut être guéri par les feuilles amères, le gingembre ou d\'autres remèdes à base de plantes."',
    truth: 'No herb or plant-based remedy has been clinically proven to cure diabetes. While some herbs may have modest blood sugar-lowering effects, they are not a replacement for insulin or metformin. Stopping medication in favor of herbs has caused preventable diabetic comas and deaths in Cameroon.',
    truthFr: 'Aucun remède à base de plantes n\'a été prouvé cliniquement pour guérir le diabète. Arrêter les médicaments en faveur des herbes a causé des comas diabétiques évitables au Cameroun.',
    category: 'Diabetes / NCDs',
    categoryFr: 'Diabète / MNT',
    icon: '🩸',
  },
  {
    id: 7,
    myth: '"A fat baby is a healthy baby — the more the child eats, the healthier they are."',
    mythFr: '"Un bébé gras est un bébé sain — plus l\'enfant mange, plus il est en bonne santé."',
    truth: 'Excess weight in children can indicate overnutrition leading to childhood obesity — a risk factor for early-onset diabetes and heart disease. Health is about balanced nutrition, not just weight. Overfeeding babies, especially with sugar-sweetened porridges, can cause obesity and nutrient imbalances.',
    truthFr: 'L\'excès de poids chez les enfants peut indiquer une surnutrition menant à l\'obésité infantile. La santé concerne la nutrition équilibrée, pas seulement le poids.',
    category: 'Nutrition / Malnutrition',
    categoryFr: 'Nutrition / Malnutrition',
    icon: '👶',
  },
  {
    id: 8,
    myth: '"Hypertension (high blood pressure) always causes headaches and visible symptoms."',
    mythFr: '"L\'hypertension cause toujours des maux de tête et des symptômes visibles."',
    truth: 'Hypertension is called the "silent killer" because it usually causes NO symptoms until it reaches dangerous levels. Many people discover they have hypertension only after a stroke or heart attack. Regular blood pressure checks are essential — especially for anyone over 40 or with a family history.',
    truthFr: 'L\'hypertension est appelée le "tueur silencieux" car elle ne cause généralement PAS de symptômes jusqu\'à ce qu\'elle atteigne des niveaux dangereux. Des contrôles réguliers de la tension artérielle sont essentiels.',
    category: 'NCDs / Cardiovascular',
    categoryFr: 'MNT / Cardiovasculaire',
    icon: '🫀',
  },
  {
    id: 9,
    myth: '"Tuberculosis (TB) is caused by smoking, cold weather, or spiritual attack."',
    mythFr: '"La tuberculose est causée par le tabagisme, le froid ou une attaque spirituelle."',
    truth: 'TB is caused by the bacterium Mycobacterium tuberculosis. It spreads through the air when an infected person coughs or sneezes. TB is curable with a 6-month course of antibiotics. Treating it with spiritual remedies alone causes drug-resistant TB and further spread in the community.',
    truthFr: 'La tuberculose est causée par la bactérie Mycobacterium tuberculosis. Elle se propage par l\'air. La TB est curable avec 6 mois d\'antibiotiques.',
    category: 'Tuberculosis',
    categoryFr: 'Tuberculose',
    icon: '🫁',
  },
  {
    id: 10,
    myth: '"Clubfoot in a baby is a punishment from God or caused by the mother\'s sins."',
    mythFr: '"Le pied bot chez un bébé est une punition de Dieu ou causé par les péchés de la mère."',
    truth: 'Clubfoot is a congenital structural condition with biological origins — not spiritual punishment. With the Ponseti method (early casting and bracing), over 95% of clubfoot cases are fully correctable. Shame and delay in seeking treatment is what cripples children — not the condition itself.',
    truthFr: 'Le pied bot est une condition structurelle congénitale avec des origines biologiques — pas une punition spirituelle. Avec la méthode Ponseti, plus de 95% des cas sont pleinement corrigibles.',
    category: 'Clubfoot',
    categoryFr: 'Pied Bot',
    icon: '🦶',
  },
  {
    id: 11,
    myth: '"Mental illness is caused by witchcraft and can only be treated by traditional healers."',
    mythFr: '"La maladie mentale est causée par la sorcellerie et ne peut être traitée que par des guérisseurs traditionnels."',
    truth: 'Mental illnesses are brain disorders with neurological, genetic, and environmental causes. They are treated with therapy, medication, and support. Chaining mentally ill people or subjecting them to harmful rituals is a human rights violation and causes severe harm.',
    truthFr: 'Les maladies mentales sont des troubles cérébraux avec des causes neurologiques, génétiques et environnementales. Enchaîner les personnes malades mentalement est une violation des droits humains.',
    category: 'Mental Health',
    categoryFr: 'Santé Mentale',
    icon: '🧠',
  },
  {
    id: 12,
    myth: '"Using a condom with your regular partner shows distrust and is unnecessary."',
    mythFr: '"Utiliser un préservatif avec son partenaire régulier montre de la méfiance et est inutile."',
    truth: 'Condoms protect against both STDs and unintended pregnancies regardless of relationship length. Many STD transmissions happen between long-term couples, often where one partner was previously exposed. Mutual trust includes protecting each other\'s health.',
    truthFr: 'Les préservatifs protègent contre les IST et les grossesses non désirées quelle que soit la durée de la relation. La confiance mutuelle inclut la protection de la santé de l\'autre.',
    category: 'STDs / Sexual Health',
    categoryFr: 'IST / Santé Sexuelle',
    icon: '💊',
  },
];

await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);

const itemsCollection = collection(firestore, 'misconceptions');
for (const item of MISCONCEPTIONS_DATA) {
  await addDoc(itemsCollection, { ...item, createdAt: serverTimestamp() });
  console.log(`Seeded: ${item.category}`);
}

console.log(`Done. Seeded ${MISCONCEPTIONS_DATA.length} misconceptions.`);
process.exit(0);

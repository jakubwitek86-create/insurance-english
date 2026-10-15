import type { SpeakingTask } from '../types';

export const speakingTasks: SpeakingTask[] = [
  {
    id: 's01-intro',
    level: 'A2',
    title: 'Introduce yourself',
    prompt: 'Przedstaw się nowemu klientowi: imię, firma, czym się zajmujesz, w czyim imieniu działasz. Zaproponuj spotkanie.',
    required: [
      { label: 'imię', accept: ['my name is', 'i am', 'this is'] },
      { label: 'firma/rola', accept: ['broker', 'i work for', 'i work at'] },
      { label: 'zakres pracy', accept: ['look after', 'responsible for', 'in charge of', 'property insurance', 'handle'] },
      { label: 'w imieniu klienta', accept: ['on behalf of', 'represent', 'work for you', 'for the client'] },
      { label: 'propozycja spotkania', accept: ['shall we', 'could we', 'would you like', 'arrange', 'meeting', 'call'] },
    ],
    model:
      'Good morning. My name is Jakub and I work for an independent insurance broker in Warsaw. I look after property insurance for corporate clients, and we act on behalf of your company, not the insurer. Shall we arrange a short call next week to discuss your renewal?',
  },
  {
    id: 's02-fnol',
    level: 'A2',
    title: 'Ask FNOL questions',
    prompt: 'Klient dzwoni ze zgłoszeniem szkody. Zadaj 4–5 pytań: kiedy, gdzie, co się stało, czy ktoś ucierpiał, szacunkowy koszt.',
    required: [
      { label: 'kiedy', accept: ['when did', 'what time', 'when was'] },
      { label: 'gdzie', accept: ['where', 'which site', 'which location'] },
      { label: 'co się stało', accept: ['what happened', 'what was damaged', 'what exactly'] },
      { label: 'osoby poszkodowane', accept: ['injured', 'hurt', 'anyone'] },
      { label: 'koszt', accept: ['estimate', 'how much', 'cost'] },
    ],
    model:
      'I\'m sorry to hear that. When did the loss happen, and where exactly? What happened and what was damaged? Was anyone injured? Do you have a rough estimate of the cost?',
  },
  {
    id: 's03-reschedule',
    level: 'A2',
    title: 'Reschedule an inspection',
    prompt: 'Zadzwoń do inżyniera ryzyka i przełóż inspekcję ze środy na przyszły wtorek, podaj powód i zaproponuj godzinę.',
    required: [
      { label: 'cel rozmowy', accept: ['calling about', 'calling to', 'about the inspection', 'about the visit', 'about the survey'] },
      { label: 'przełożenie', accept: ['reschedule', 'move', 'postpone', 'change the date'] },
      { label: 'powód', accept: ['because', 'unfortunately', 'is ill', 'is not available', 'is sick'] },
      { label: 'nowy termin', accept: ['tuesday', 'next week'] },
      { label: 'godzina', accept: [' am', ' pm', 'o\'clock', 'at 9', 'at 10', 'at 11', 'at nine', 'at ten', 'at eleven', 'morning', 'afternoon'] },
    ],
    model:
      'Hello, I\'m calling about the inspection on Wednesday. Unfortunately, the plant manager is ill, so could we reschedule it to next Tuesday? Would 11 am work for you?',
  },
  {
    id: 's04-excess',
    level: 'B1',
    title: 'Explain the excess with an example',
    prompt: 'Wyjaśnij klientowi udział własny na przykładzie: szkoda 40 000 EUR, udział własny 5 000 EUR. Użyj ostrożnego języka.',
    required: [
      { label: 'termin', accept: ['excess', 'deductible'] },
      { label: 'kwota szkody', accept: ['40,000', '40000', 'forty thousand', '40 000'] },
      { label: 'wypłata', accept: ['35,000', '35000', 'thirty five thousand', 'thirty-five thousand', '35 000'] },
      { label: 'ostrożność', accept: ['subject to', 'should', 'would', 'we would expect'] },
    ],
    model:
      'The excess is the part of each loss that you pay yourselves. For example, if the loss is EUR 40,000 and the excess is EUR 5,000, the insurer would pay EUR 35,000, subject to the policy wording.',
  },
  {
    id: 's05-exclusion',
    level: 'B1',
    title: 'Deliver bad news about an exclusion',
    prompt: 'Przekaż klientowi, że szkoda prawdopodobnie podlega wyłączeniu zużycia (wear and tear). Okaż zrozumienie, podkreśl, że decyzja należy do ubezpieczyciela, i zaproponuj następny krok.',
    required: [
      { label: 'empatia', accept: ['i\'m afraid', 'i am afraid', 'unfortunately', 'i understand', 'i\'m sorry', 'i am sorry'] },
      { label: 'ostrożny język', accept: ['appears', 'seems', 'based on', 'subject to', 'preliminary', 'at this stage'] },
      { label: 'nazwa wyłączenia', accept: ['wear and tear', 'gradual deterioration', 'corrosion'] },
      { label: 'decyzja ubezpieczyciela', accept: ['final decision', 'insurer decides', 'insurer\'s decision', 'insurer will decide'] },
      { label: 'następny krok', accept: ['could you send', 'i would recommend', 'next step', 'let\'s', 'we can', 'we will'] },
    ],
    model:
      'I\'m afraid I have some difficult news. Based on the adjuster\'s preliminary report, the damage appears to be caused by wear and tear, which is excluded under the policy. The final decision is the insurer\'s, so could you send us the maintenance records? We will review them and challenge the report if the facts support it.',
  },
  {
    id: 's06-update',
    level: 'B1',
    title: 'Give a claim update',
    prompt: 'Przekaż klientowi aktualizację: likwidator był na miejscu, brakuje dwóch dokumentów, wystąpiłeś o zaliczkę. Użyj Present Perfect.',
    required: [
      { label: 'wizyta likwidatora', accept: ['has visited', 'visited', 'has been to', 'came'] },
      { label: 'brakujące dokumenty', accept: ['outstanding', 'still need', 'still missing', 'haven\'t received', 'have not received'] },
      { label: 'zaliczka', accept: ['interim payment', 'payment on account', 'advance'] },
      { label: 'Present Perfect', accept: ['have requested', 'has visited', 'have asked', 'have received', 'has been'] },
    ],
    model:
      'Here is a quick update on the claim. The adjuster has visited the site and has received most of the documents. Two documents are still outstanding: the police report and the stock records. We have requested an interim payment, and I will let you know as soon as the insurer replies.',
  },
  {
    id: 's07-renewal',
    level: 'B1',
    title: 'Justify a premium increase',
    prompt: 'Wyjaśnij klientowi podwyżkę składki o 12%: dwie szkody, wyższe wartości, sytuacja na rynku. Zaproponuj jedną opcję obniżenia składki.',
    required: [
      { label: 'wysokość podwyżki', accept: ['12', 'twelve'] },
      { label: 'szkody', accept: ['claim', 'claims', 'losses', 'loss history'] },
      { label: 'wartości', accept: ['values', 'sums insured'] },
      { label: 'rynek', accept: ['market'] },
      { label: 'opcja', accept: ['if you', 'option', 'could reduce', 'would reduce', 'increase the excess', 'higher excess'] },
    ],
    model:
      'The renewal premium is 12% higher than last year. There are three reasons: the two claims last year, higher stock values, and generally harder market conditions. One option is to increase the excess. If you increased it to EUR 50,000, the premium would go down by around 6%.',
  },
  {
    id: 's08-calm-client',
    level: 'B2',
    title: 'Calm an upset client',
    prompt: 'Klient jest zły z powodu opóźnienia. Uznaj jego emocje, przeproś, wyjaśnij, co robisz, i podaj konkretny termin kolejnego kontaktu.',
    required: [
      { label: 'uznanie emocji', accept: ['understand your frustration', 'i understand', 'i appreciate', 'i can see why'] },
      { label: 'przeprosiny', accept: ['sorry', 'apologise', 'apologize'] },
      { label: 'działanie', accept: ['let me', 'i will', 'i have', 'i\'ve', 'escalate', 'chase'] },
      { label: 'konkretny termin', accept: ['tomorrow', 'today', 'by noon', 'by friday', 'by the end of'] },
    ],
    model:
      'I completely understand your frustration, and I\'m sorry this has taken so long. I have already escalated the claim to the insurer\'s claims manager and asked for an interim payment. I will call you tomorrow by noon with a clear update.',
  },
  {
    id: 's09-underwriter',
    level: 'B2',
    title: 'Negotiate with an underwriter',
    prompt: 'Poproś underwritera o wyższy limit powodziowy w zamian za zainstalowanie barier przeciwpowodziowych przez klienta.',
    required: [
      { label: 'uprzejme pytanie', accept: ['would you be able', 'could you', 'would you consider', 'would it be possible'] },
      { label: 'limit', accept: ['limit'] },
      { label: 'warunek', accept: ['if the client', 'if they', 'provided that', 'once the'] },
      { label: 'zabezpieczenie', accept: ['flood barriers', 'barriers', 'flood defences', 'flood protection'] },
    ],
    model:
      'Would you be able to consider a higher flood limit if the client installs permanent flood barriers? We can send you the specification and the installation timeline this week.',
  },
  {
    id: 's10-programme',
    level: 'B2',
    title: 'Clarify DIC/DIL with a network partner',
    prompt: 'Zapytaj koordynatora programu, czy polisa master zapewnia DIL dla powodzi, które może zadziałać w Polsce, i poproś o potwierdzenie na piśmie.',
    required: [
      { label: 'master', accept: ['master policy', 'master'] },
      { label: 'DIL/DIC', accept: ['dil', 'dic', 'difference in limits', 'difference in conditions'] },
      { label: 'Polska', accept: ['poland', 'polish'] },
      { label: 'potwierdzenie na piśmie', accept: ['in writing', 'by email', 'written confirmation'] },
    ],
    model:
      'Could you confirm whether the master policy provides flood DIL cover that can respond for a loss in Poland? Since the local limit is lower, I would be grateful for a written confirmation from the master insurer.',
  },
];

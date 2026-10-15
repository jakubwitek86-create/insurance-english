import type { EmailTask } from '../types';

export const EMAIL_STRUCTURE = [
  { part: 'Subject', tip: 'Konkretny temat z numerem szkody/polisy: „Claim 24-118: outstanding documents”.' },
  { part: 'Greeting', tip: '„Dear Ms Lindqvist,” (formalnie) albo „Hi Emma,” (gdy już jesteście po imieniu).' },
  { part: 'Purpose', tip: 'Pierwsze zdanie mówi, po co piszesz: „I am writing to…”, „I am following up on…”.' },
  { part: 'Details', tip: 'Krótkie akapity albo lista. Liczby, daty, nazwy dokumentów.' },
  { part: 'Action', tip: 'Czego oczekujesz i do kiedy: „Could you send… by Friday?”.' },
  { part: 'Closing', tip: '„Please let me know if you have any questions.” + „Kind regards,”.' },
];

export const EMAIL_CHECKLIST = [
  'Temat zawiera numer szkody/polisy lub konkretną sprawę',
  'Pierwsze zdanie mówi, po co piszę',
  'Każda prośba ma termin („by Friday”)',
  'Nie obiecuję decyzji ubezpieczyciela (używam „subject to…”, „we would expect…”)',
  'Zdania są krótkie, jedna myśl na zdanie',
  'Sprawdziłem przedimki (a/an/the) i przyimki (by/until, to/for)',
  'Zakończenie zaprasza do kontaktu',
];

export const emails: EmailTask[] = [
  {
    id: 'e01-request-docs',
    level: 'A2',
    title: 'Requesting documents for a claim',
    titlePl: 'Prośba o dokumenty do szkody',
    brief: 'Napisz do Lukasa Weber (kierownik magazynu w Niemczech). Potrzebujesz zdjęć uszkodzonego regału, faktury za naprawę i numeru polisy. Termin: piątek.',
    required: [
      { label: 'cel maila', accept: ['i am writing', 'regarding', 'about the claim', 'in relation to', 'following'] },
      { label: 'prośba o zdjęcia', accept: ['photo', 'photos', 'pictures'] },
      { label: 'prośba o fakturę', accept: ['invoice'] },
      { label: 'numer polisy', accept: ['policy number'] },
      { label: 'termin', accept: ['by friday', 'by the end of the week', 'until friday', 'before friday'] },
      { label: 'zakończenie', accept: ['kind regards', 'best regards', 'let me know', 'any questions'] },
    ],
    model: {
      subject: 'Damaged rack in Hamburg warehouse: documents needed',
      body:
        'Dear Mr Weber,\n\nI am writing regarding the damaged rack in the Hamburg warehouse.\n\nTo report the claim to the insurer, we need the following:\n- photos of the damaged rack,\n- the invoice for the repair,\n- the policy number, if you have it to hand.\n\nCould you send these by Friday?\n\nPlease let me know if you have any questions.\n\nKind regards,\nJakub',
    },
    phrases: [
      { en: 'I am writing regarding…', pl: 'Piszę w sprawie…' },
      { en: 'we need the following:', pl: 'potrzebujemy następujących rzeczy:' },
      { en: 'if you have it to hand', pl: 'jeśli ma go Pan pod ręką' },
      { en: 'Could you send these by Friday?', pl: 'Czy może Pan przesłać je do piątku?' },
    ],
  },
  {
    id: 'e02-claim-update',
    level: 'B1',
    title: 'Claim update to the client',
    titlePl: 'Informacja o postępie szkody',
    brief: 'Poinformuj klienta (David Clarke, CFO) o stanie szkody pożarowej: likwidator był na miejscu, wystąpiłeś o zaliczkę 200 000 EUR, brakuje wyceny towarów. Poproś o wycenę do środy.',
    required: [
      { label: 'odniesienie do szkody', accept: ['claim', 'fire'] },
      { label: 'co już zrobiono (Present Perfect)', accept: ['has visited', 'have requested', 'has been', 'have asked', 'have sent'] },
      { label: 'zaliczka', accept: ['interim payment', 'payment on account', 'advance payment'] },
      { label: 'brakujący dokument', accept: ['stock valuation', 'valuation', 'outstanding', 'still need'] },
      { label: 'termin', accept: ['by wednesday', 'before wednesday'] },
      { label: 'ostrożny język', accept: ['subject to', 'we would expect', 'we expect', 'should', 'likely'] },
    ],
    model: {
      subject: 'Fire claim 24-118: update and next steps',
      body:
        'Dear David,\n\nI am writing to update you on the fire claim at the Tychy plant.\n\nThe loss adjuster has visited the site twice and has received most of the documents. We have also requested an interim payment of EUR 200,000 based on the building damage already agreed. Subject to the insurer\'s approval, we would expect the payment within two to three weeks.\n\nThe only document still outstanding is the stock valuation. Could your team send it by Wednesday? This will allow the adjuster to complete the stock part of the claim.\n\nI will keep you updated and call you as soon as I hear from the insurer.\n\nKind regards,\nJakub',
    },
    phrases: [
      { en: 'I am writing to update you on…', pl: 'Piszę, aby poinformować o…' },
      { en: 'Subject to the insurer\'s approval, we would expect…', pl: 'Z zastrzeżeniem akceptacji ubezpieczyciela spodziewamy się…' },
      { en: 'The only document still outstanding is…', pl: 'Jedyny brakujący dokument to…' },
      { en: 'This will allow the adjuster to…', pl: 'To pozwoli likwidatorowi…' },
    ],
  },
  {
    id: 'e03-next-steps',
    level: 'A2',
    title: 'Explaining next steps after a claim',
    titlePl: 'Wyjaśnienie kolejnych kroków po zgłoszeniu',
    brief: 'Klient zgłosił zalanie biura. Napisz krótko, co będzie dalej: zgłosiłeś szkodę, ubezpieczyciel wyznaczy likwidatora, klient ma zrobić zdjęcia i nie wyrzucać uszkodzonych rzeczy.',
    required: [
      { label: 'potwierdzenie zgłoszenia', accept: ['reported', 'notified', 'have sent the claim'] },
      { label: 'likwidator', accept: ['adjuster', 'claims handler'] },
      { label: 'zdjęcia', accept: ['photo', 'photos', 'pictures'] },
      { label: 'nie wyrzucać uszkodzonych rzeczy', accept: ['do not throw', 'don\'t throw', 'keep the damaged', 'not dispose', 'keep all damaged'] },
      { label: 'kolejność kroków', accept: ['first', 'next', 'then', 'after that'] },
    ],
    model: {
      subject: 'Water damage at your office: next steps',
      body:
        'Dear Mr Jensen,\n\nThank you for letting us know about the water damage. I have reported the claim to the insurer today.\n\nHere are the next steps:\n1. First, please take photos of all damaged items and areas.\n2. Please do not throw away any damaged items until the adjuster has seen them.\n3. Next, the insurer will appoint a loss adjuster, who will contact you to arrange a visit.\n4. After that, we will need the repair quotes and invoices.\n\nPlease let me know if you have any questions.\n\nKind regards,\nJakub',
    },
    phrases: [
      { en: 'Thank you for letting us know about…', pl: 'Dziękuję za poinformowanie o…' },
      { en: 'Here are the next steps:', pl: 'Oto kolejne kroki:' },
      { en: 'Please do not throw away any damaged items until…', pl: 'Proszę nie wyrzucać uszkodzonych rzeczy, dopóki…' },
      { en: 'who will contact you to arrange a visit', pl: 'który skontaktuje się, aby umówić wizytę' },
    ],
  },
  {
    id: 'e04-clarification-underwriter',
    level: 'B1',
    title: 'Asking an underwriter for clarification',
    titlePl: 'Prośba do underwritera o doprecyzowanie',
    brief: 'Napisz do underwritera (James Whitfield). Zapytaj: (1) czy warunek płyt warstwowych dotyczy tylko płyt z rdzeniem EPS, (2) czy limit powodziowy 5 mln EUR jest na zdarzenie czy w agregacie. Potrzebujesz odpowiedzi przed spotkaniem z klientem w czwartek.',
    required: [
      { label: 'podziękowanie za ofertę', accept: ['thank you for', 'thanks for'] },
      { label: 'pytanie o płyty', accept: ['sandwich panel', 'eps'] },
      { label: 'pytanie o limit', accept: ['any one occurrence', 'aggregate', 'flood limit'] },
      { label: 'uprzejma forma pytania', accept: ['could you', 'would you', 'can you confirm', 'could you confirm', 'i would be grateful'] },
      { label: 'termin/powód', accept: ['thursday', 'before our meeting', 'before the meeting'] },
    ],
    model: {
      subject: 'Nordtec Logistics: quote clarification',
      body:
        'Dear James,\n\nThank you for your quote for Nordtec Logistics. Before I present it to the client, I would be grateful if you could clarify two points:\n\n1. Does the sandwich panel condition apply only to buildings with an EPS core? The new hall has mineral wool panels.\n2. Is the flood limit of EUR 5 million any one occurrence or in the annual aggregate?\n\nWe are meeting the client on Thursday, so a reply by Wednesday would be very helpful.\n\nKind regards,\nJakub',
    },
    phrases: [
      { en: 'I would be grateful if you could clarify two points:', pl: 'Byłbym wdzięczny za doprecyzowanie dwóch punktów:' },
      { en: 'Does the condition apply only to…?', pl: 'Czy warunek dotyczy tylko…?' },
      { en: 'a reply by Wednesday would be very helpful', pl: 'odpowiedź do środy bardzo by pomogła' },
    ],
  },
  {
    id: 'e05-comparing-quotes',
    level: 'B2',
    title: 'Comparing quotations for the client',
    titlePl: 'Porównanie ofert dla klienta',
    brief: 'Porównaj dwie oferty: Insurer A (składka 152 000 EUR, udział własny 25 000 EUR, powódź 10 mln EUR) i Insurer B (138 000 EUR, udział własny 100 000 EUR, powódź 5 mln EUR). Przedstaw rekomendację z uzasadnieniem.',
    required: [
      { label: 'porównanie ceny', accept: ['cheaper', 'lower premium', 'more expensive', 'higher premium', 'less expensive'] },
      { label: 'udział własny', accept: ['excess', 'deductible'] },
      { label: 'limit powodziowy', accept: ['flood'] },
      { label: 'rekomendacja', accept: ['recommend', 'recommendation'] },
      { label: 'uzasadnienie', accept: ['because', 'as ', 'since', 'given'] },
      { label: 'decyzja klienta / następny krok', accept: ['let me know', 'please confirm', 'your decision', 'by ', 'instructions'] },
    ],
    model: {
      subject: 'Property renewal: comparison of quotations',
      body:
        'Dear Hannah,\n\nPlease find below a summary of the two quotations for the property renewal.\n\nInsurer A: premium EUR 152,000, excess EUR 25,000, flood limit EUR 10 million.\nInsurer B: premium EUR 138,000, excess EUR 100,000, flood limit EUR 5 million.\n\nInsurer B is EUR 14,000 cheaper. However, its excess is four times higher and the flood limit is half of Insurer A\'s. Given your two water claims in the last three years and the site\'s location in a flood zone, a single loss could easily cost you more than the premium saving.\n\nWe would therefore recommend Insurer A.\n\nCould you please confirm your decision by 20 March so that we can bind cover in time?\n\nKind regards,\nJakub',
    },
    phrases: [
      { en: 'Please find below a summary of…', pl: 'Poniżej przesyłam podsumowanie…' },
      { en: 'However, …', pl: 'Jednak…' },
      { en: 'Given your…, a single loss could…', pl: 'Biorąc pod uwagę…, jedna szkoda mogłaby…' },
      { en: 'We would therefore recommend…', pl: 'W związku z tym rekomendowalibyśmy…' },
    ],
  },
  {
    id: 'e06-exclusion',
    level: 'B2',
    title: 'Explaining an exclusion in writing',
    titlePl: 'Pisemne wyjaśnienie wyłączenia',
    brief: 'Poinformuj klientkę (Sophie Martin), że według wstępnego raportu przyczyną przecieku jest korozja dachu, a zużycie jest wyłączone. Zaznacz, że decyzja należy do ubezpieczyciela, poproś o dokumentację konserwacji i wskaż, że uszkodzony towar może być objęty ochroną.',
    required: [
      { label: 'empatia / zła wiadomość', accept: ['i am afraid', 'unfortunately', 'i understand', 'i appreciate'] },
      { label: 'ostrożny język', accept: ['subject to', 'based on the information', 'appears', 'preliminary'] },
      { label: 'nazwa wyłączenia', accept: ['wear and tear', 'gradual deterioration', 'corrosion'] },
      { label: 'decyzja ubezpieczyciela', accept: ['final decision', 'insurer\'s decision', 'insurer will decide', 'insurer\'s final position'] },
      { label: 'prośba o dokumenty', accept: ['maintenance records', 'maintenance', 'rainfall'] },
      { label: 'pozytywny następny krok', accept: ['stock', 'may still be covered', 'could still be covered'] },
    ],
    model: {
      subject: 'Roof leak claim: adjuster\'s preliminary findings',
      body:
        'Dear Sophie,\n\nI am afraid I have some disappointing news about the roof leak claim.\n\nBased on the adjuster\'s preliminary report, the water appears to have entered through areas of long-term corrosion. The policy excludes wear and tear and gradual deterioration, so the insurer may decline the roof repair costs. Please note that this is not yet the insurer\'s final decision.\n\nTo help us review the findings, could you send us the roof maintenance records and any rainfall data for that day?\n\nEven if the roof repair is excluded, the damaged stock may still be covered, so please keep all stock records and photos.\n\nI am happy to discuss this by phone at any time.\n\nKind regards,\nJakub',
    },
    phrases: [
      { en: 'I am afraid I have some disappointing news about…', pl: 'Obawiam się, że mam niezbyt dobre wieści w sprawie…' },
      { en: 'appears to have entered', pl: 'najwyraźniej dostała się' },
      { en: 'Please note that this is not yet the insurer\'s final decision.', pl: 'Proszę pamiętać, że to jeszcze nie ostateczna decyzja ubezpieczyciela.' },
      { en: 'I am happy to discuss this by phone at any time.', pl: 'Chętnie omówię to telefonicznie w każdej chwili.' },
    ],
  },
  {
    id: 'e07-renewal',
    level: 'B1',
    title: 'Renewal information request',
    titlePl: 'Prośba o informacje do wznowienia',
    brief: 'Do wznowienia 1 kwietnia potrzebujesz: aktualnych sum ubezpieczenia dla każdej lokalizacji, informacji o zmianach w działalności, statusu zaleceń prewencyjnych. Termin: 15 lutego.',
    required: [
      { label: 'odniesienie do wznowienia', accept: ['renewal'] },
      { label: 'sumy ubezpieczenia', accept: ['sums insured', 'values', 'sum insured'] },
      { label: 'zmiany w działalności', accept: ['changes', 'new locations', 'material change', 'any changes'] },
      { label: 'zalecenia prewencyjne', accept: ['recommendations', 'risk improvement'] },
      { label: 'termin', accept: ['by 15 february', 'by february 15', 'by the 15th', '15 february'] },
      { label: 'uzasadnienie terminu', accept: ['so that', 'to allow', 'in order to', 'this will give'] },
    ],
    model: {
      subject: 'Property renewal 1 April: information request',
      body:
        'Dear Emma,\n\nAs the property programme renews on 1 April, we are starting to prepare the market submission.\n\nCould you please send us the following by 15 February?\n- updated sums insured for each location (buildings, machinery and stock),\n- any changes to your operations, such as new locations, new processes or changes in occupancy,\n- the current status of the risk improvement recommendations from last year\'s survey.\n\nThis will give us enough time to present the risk to insurers and negotiate the best terms.\n\nPlease let me know if you would like to discuss any of these points.\n\nKind regards,\nJakub',
    },
    phrases: [
      { en: 'As the programme renews on…', pl: 'Ponieważ program odnawia się…' },
      { en: 'Could you please send us the following by…?', pl: 'Czy mogą Państwo przesłać do… następujące informacje?' },
      { en: 'This will give us enough time to…', pl: 'To da nam wystarczająco czasu, aby…' },
    ],
  },
  {
    id: 'e08-complaint',
    level: 'B2',
    title: 'Responding to a complaint',
    titlePl: 'Odpowiedź na skargę klienta',
    brief: 'Klient skarży się na opóźnienie wypłaty i brak informacji. Odpowiedz: przeproś za brak komunikacji, wyjaśnij przyczynę opóźnienia (brak wyceny towarów), opisz, co już zrobiłeś (wniosek o zaliczkę), zaproponuj cotygodniowe aktualizacje.',
    required: [
      { label: 'podziękowanie/uznanie skargi', accept: ['thank you for', 'i understand', 'i appreciate', 'i fully understand'] },
      { label: 'przeprosiny', accept: ['apologise', 'apologize', 'sorry', 'apologies'] },
      { label: 'przyczyna opóźnienia', accept: ['because', 'due to', 'the reason', 'caused by'] },
      { label: 'działania już podjęte', accept: ['have requested', 'have asked', 'have escalated', 'have contacted'] },
      { label: 'propozycja na przyszłość', accept: ['weekly', 'every week', 'regular update', 'every monday', 'every friday'] },
    ],
    model: {
      subject: 'Your complaint about claim 24-118',
      body:
        'Dear David,\n\nThank you for your email. I fully understand your frustration, and I apologise that we did not keep you better informed about the progress of the claim.\n\nThe delay is mainly due to the stock valuation, which the adjuster needs before the stock part of the claim can be agreed. However, the building damage has already been agreed, so we have requested an interim payment of EUR 200,000 and escalated the request to the insurer\'s claims manager.\n\nFrom now on, I will send you a short written update every Monday, even if there is no change, so that you always know where the claim stands.\n\nI would also be happy to arrange a call this week to go through the next steps.\n\nKind regards,\nJakub',
    },
    phrases: [
      { en: 'I fully understand your frustration, and I apologise that…', pl: 'W pełni rozumiem Pana frustrację i przepraszam, że…' },
      { en: 'The delay is mainly due to…', pl: 'Opóźnienie wynika głównie z…' },
      { en: 'From now on, I will…', pl: 'Od teraz będę…' },
      { en: 'so that you always know where the claim stands', pl: 'żeby zawsze wiedział Pan, na jakim etapie jest szkoda' },
    ],
  },
];

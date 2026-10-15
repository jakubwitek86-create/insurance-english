import type { GrammarTopic } from '../types';

export const grammar: GrammarTopic[] = [
  {
    id: 'g01-present',
    level: 'A2',
    title: 'Present Simple vs Present Continuous',
    explanation:
      'Present Simple: stałe fakty, praca, procedury („I work for a broker”, „The insurer pays within 30 days”).\n' +
      'Present Continuous: coś dzieje się teraz albo tymczasowo („I am checking the wording now”, „We are waiting for the insurer’s response”).\n' +
      'Częsty błąd Polaków: „I am working in insurance for 10 years”. Poprawnie: „I have worked…” (Present Perfect).',
    summaryEn: 'Present Simple for permanent facts and routines; Present Continuous for now and temporary situations.',
    examples: [
      { en: 'I work for an insurance broker.', pl: 'Pracuję u brokera ubezpieczeniowego.' },
      { en: 'We are still waiting for the insurer’s response.', pl: 'Nadal czekamy na odpowiedź ubezpieczyciela.' },
      { en: 'The adjuster usually visits within 48 hours.', pl: 'Likwidator zwykle przyjeżdża w ciągu 48 godzin.' },
    ],
    mistakes: [
      { wrong: 'I am working for this company.', right: 'I work for this company.', why: 'Stała praca: Present Simple.' },
      { wrong: 'We wait for the insurer’s answer now.', right: 'We are waiting for the insurer’s answer.', why: 'Coś trwa w tej chwili: Present Continuous.' },
    ],
    exercises: [
      { type: 'mcq', q: 'Right now I ___ the policy wording.', options: ['check', 'am checking', 'checks'], answer: 1 },
      { type: 'mcq', q: 'The insurer normally ___ claims within 30 days.', options: ['pays', 'is paying', 'pay'], answer: 0 },
      { type: 'gap', q: 'We ___ still waiting for the documents.', answers: ['are'] },
      { type: 'gap', q: 'She ___ after property claims for Central Europe. (zajmuje się, stale)', answers: ['looks'] },
    ],
  },
  {
    id: 'g02-past',
    level: 'A2',
    title: 'Past Simple: asking about a loss',
    explanation:
      'O zakończonych zdarzeniach (szkoda, wizyta) mówimy Past Simple: „The fire started at 2 am”.\n' +
      'Pytania tworzymy z „did” + forma podstawowa: „When did it happen?”, „What did the adjuster say?”. Po „did” nie odmieniamy czasownika („did happen”, nie „did happened”).\n' +
      'Z „was/were” pytamy o stan: „Was anyone injured?”, „Were the doors locked?”.',
    summaryEn: 'Use Past Simple for finished events; questions with did + base verb, or was/were for states.',
    examples: [
      { en: 'When did the fire start?', pl: 'Kiedy zaczął się pożar?' },
      { en: 'Was the alarm switched on?', pl: 'Czy alarm był włączony?' },
      { en: 'The water entered the building through the roof.', pl: 'Woda dostała się do budynku przez dach.' },
    ],
    mistakes: [
      { wrong: 'When did the loss happened?', right: 'When did the loss happen?', why: 'Po „did” forma podstawowa.' },
      { wrong: 'Did anyone was injured?', right: 'Was anyone injured?', why: 'Z „be” nie używamy „did”.' },
    ],
    exercises: [
      { type: 'gap', q: 'When ___ the storm start?', answers: ['did'] },
      { type: 'gap', q: '___ the doors locked? (were/was)', answers: ['were'] },
      { type: 'mcq', q: 'Choose the correct question:', options: ['What did happened?', 'What happened?', 'What did happen yesterday happened?'], answer: 1, explain: 'Gdy pytamy o podmiot (co?), nie używamy „did”.' },
      { type: 'gap', q: 'The adjuster ___ the site yesterday. (visit)', answers: ['visited'] },
    ],
  },
  {
    id: 'g03-articles',
    level: 'A2',
    title: 'Articles: a / an / the / no article',
    explanation:
      'A/an: coś po raz pierwszy, jedno z wielu, zawód („a claim”, „I am a broker”).\n' +
      'The: coś konkretnego, znanego obu stronom („the policy we discussed”, „the insurer”).\n' +
      'Brak przedimka: rzeczowniki niepoliczalne i liczba mnoga w znaczeniu ogólnym („Insurance is important”, „Insurers are cautious”).\n' +
      'Polski nie ma przedimków, więc najczęstszy błąd to ich pomijanie: „I sent you policy” → „I sent you the policy”.',
    summaryEn: 'A/an for one of many or first mention; the for something specific; no article for general plural and uncountable nouns.',
    examples: [
      { en: 'We have received a claim from the Gdańsk site.', pl: 'Otrzymaliśmy zgłoszenie szkody z zakładu w Gdańsku.' },
      { en: 'The claim is now with the adjuster.', pl: 'Szkoda jest teraz u likwidatora.' },
      { en: 'Insurers are cautious about flood risk.', pl: 'Ubezpieczyciele ostrożnie podchodzą do ryzyka powodzi.' },
    ],
    mistakes: [
      { wrong: 'I am broker.', right: 'I am a broker.', why: 'Zawód: a/an.' },
      { wrong: 'Please send me policy.', right: 'Please send me the policy.', why: 'Konkretna polisa znana obu stronom.' },
      { wrong: 'The insurance is expensive these days.', right: 'Insurance is expensive these days.', why: 'Ogólnie o ubezpieczeniach: bez przedimka.' },
    ],
    exercises: [
      { type: 'gap', q: 'I work as ___ broker.', answers: ['a'] },
      { type: 'gap', q: 'Could you send me ___ policy we discussed yesterday?', answers: ['the'] },
      { type: 'mcq', q: 'Choose the correct sentence:', options: ['The risk engineers recommend sprinklers in general.', 'Risk engineers recommend sprinklers.', 'A risk engineers recommend sprinklers.'], answer: 1 },
      { type: 'gap', q: 'We have ___ urgent request from the client.', answers: ['an'] },
    ],
  },
  {
    id: 'g04-prepositions',
    level: 'A2',
    title: 'Prepositions in insurance English',
    explanation:
      'Czas: ON Monday / ON 5 May, AT 10 am, IN April / IN 2026, BY Friday (najpóźniej do), UNTIL Friday (aż do).\n' +
      'Stałe połączenia: covered FOR fire, damage TO the roof, claim FOR stock, claim UNDER the policy, update ON the claim, responsible FOR, in charge OF, insured WITH (u ubezpieczyciela).\n' +
      'Polskie „do piątku” to zwykle „BY Friday” (termin), nie „till Friday”.',
    summaryEn: 'Learn time prepositions and fixed combinations: covered for, damage to, claim under, update on, insured with.',
    examples: [
      { en: 'Please send the documents by Friday.', pl: 'Proszę przesłać dokumenty do piątku.' },
      { en: 'There is damage to the roof and to the stock.', pl: 'Uszkodzony jest dach i towary.' },
      { en: 'The client is insured with Allied Mutual.', pl: 'Klient jest ubezpieczony w Allied Mutual.' },
    ],
    mistakes: [
      { wrong: 'Please send it till Friday.', right: 'Please send it by Friday.', why: 'Termin wykonania: by.' },
      { wrong: 'Damage of the roof.', right: 'Damage to the roof.', why: 'Damage TO something.' },
      { wrong: 'Insured in Allied Mutual.', right: 'Insured with Allied Mutual.', why: 'Ubezpieczony u kogoś: with.' },
    ],
    exercises: [
      { type: 'gap', q: 'Please reply ___ Friday. (najpóźniej do)', answers: ['by'] },
      { type: 'gap', q: 'Is the warehouse covered ___ flood?', answers: ['for'] },
      { type: 'gap', q: 'Could you give me an update ___ the claim?', answers: ['on'] },
      { type: 'gap', q: 'The claim is made ___ the property policy.', answers: ['under'] },
      { type: 'mcq', q: 'There was serious damage ___ the machinery.', options: ['of', 'to', 'for'], answer: 1 },
    ],
  },
  {
    id: 'g05-present-perfect',
    level: 'B1',
    title: 'Present Perfect for updates',
    explanation:
      'Raportując postęp, mówimy o skutku teraz: „The adjuster has visited the site”, „We have not received the report yet”.\n' +
      'ALREADY (już) zwykle w środku zdania, YET (jeszcze/już) na końcu w przeczeniach i pytaniach, JUST (właśnie).\n' +
      'SINCE + punkt w czasie („since March”), FOR + okres („for three weeks”).\n' +
      'Gdy podajesz konkretny czas w przeszłości („yesterday”, „on Monday”), używasz Past Simple.',
    summaryEn: 'Present Perfect reports progress without a finished time: already, yet, just, since, for. With a specific past time use Past Simple.',
    examples: [
      { en: 'We have already sent the FNOL to the insurer.', pl: 'Wysłaliśmy już pierwsze zgłoszenie do ubezpieczyciela.' },
      { en: 'Has the adjuster contacted you yet?', pl: 'Czy likwidator już się z Panem skontaktował?' },
      { en: 'The claim has been open for six weeks.', pl: 'Szkoda jest otwarta od sześciu tygodni.' },
    ],
    mistakes: [
      { wrong: 'The adjuster has visited the site yesterday.', right: 'The adjuster visited the site yesterday.', why: 'Konkretny czas w przeszłości: Past Simple.' },
      { wrong: 'We wait for the report since Monday.', right: 'We have been waiting for the report since Monday.', why: 'Trwa od punktu w przeszłości do teraz.' },
    ],
    exercises: [
      { type: 'gap', q: 'We haven’t received the invoices ___.', answers: ['yet'] },
      { type: 'gap', q: 'The claim has been open ___ March.', answers: ['since'] },
      { type: 'gap', q: 'The claim has been open ___ three weeks.', answers: ['for'] },
      { type: 'mcq', q: 'Choose the correct sentence:', options: ['The insurer has paid the claim last week.', 'The insurer paid the claim last week.', 'The insurer have paid the claim last week.'], answer: 1 },
      { type: 'mcq', q: 'We ___ sent the documents. (już)', options: ['have already', 'already have been', 'did already'], answer: 0 },
    ],
  },
  {
    id: 'g06-polite-requests',
    level: 'B1',
    title: 'Polite requests and softeners',
    explanation:
      'W angielskim biznesowym prośby są łagodniejsze niż w polskim. Zamiast „Send me the invoices” lepiej:\n' +
      '„Could you send me the invoices?”, „Would you mind sending…?” (po „mind” forma -ing), „I would be grateful if you could…”, „Would it be possible to…?”.\n' +
      'Złagodzenia: „just”, „a few”, „when you have a moment”. Zła wiadomość: „I’m afraid…”, „Unfortunately…”.\n' +
      '„Please” na początku polecenia brzmi wciąż jak polecenie. Pytanie z „could” jest bezpieczniejsze.',
    summaryEn: 'Turn instructions into questions (Could you…? Would you mind -ing…?) and soften bad news with "I’m afraid".',
    examples: [
      { en: 'Could you send us the repair invoices by Friday?', pl: 'Czy mogliby Państwo przesłać faktury do piątku?' },
      { en: 'Would you mind checking the stock figures again?', pl: 'Czy mógłby Pan jeszcze raz sprawdzić dane o towarach?' },
      { en: 'I would be grateful if you could confirm the date.', pl: 'Byłbym wdzięczny za potwierdzenie daty.' },
    ],
    mistakes: [
      { wrong: 'Would you mind to send the report?', right: 'Would you mind sending the report?', why: 'Po „mind” forma -ing.' },
      { wrong: 'I would be grateful if you can confirm.', right: 'I would be grateful if you could confirm.', why: 'Po „would be grateful if” używamy „could”.' },
    ],
    exercises: [
      { type: 'gap', q: 'Would you mind ___ the form again? (sign)', answers: ['signing'] },
      { type: 'gap', q: 'I would be grateful if you ___ confirm the address.', answers: ['could'] },
      { type: 'mcq', q: 'Which is the most polite?', options: ['Send me the photos.', 'You must send the photos.', 'Could you send me the photos when you have a moment?'], answer: 2 },
      { type: 'gap', q: 'I’m ___ the insurer has not accepted the claim yet. (obawiam się)', answers: ['afraid'] },
    ],
  },
  {
    id: 'g07-countable',
    level: 'B1',
    title: 'Countable and uncountable nouns',
    explanation:
      'Niepoliczalne w angielskim (choć w polskim policzalne): information, advice, damage, equipment, machinery, feedback, evidence, furniture, stock (towary).\n' +
      'Nie mają liczby mnogiej ani „a”: „some information”, „a piece of advice”, „a lot of damage”. Pytamy „how much”, nie „how many”.\n' +
      'Zawsze w liczbie mnogiej: premises, contents, goods, proceeds.',
    summaryEn: 'Information, advice, damage, equipment, machinery and evidence are uncountable; premises and contents are always plural.',
    examples: [
      { en: 'We need more information about the alarm.', pl: 'Potrzebujemy więcej informacji o alarmie.' },
      { en: 'How much damage was there?', pl: 'Jak duże były uszkodzenia?' },
      { en: 'The premises are protected by security guards.', pl: 'Teren jest chroniony przez ochronę.' },
    ],
    mistakes: [
      { wrong: 'Thank you for the informations.', right: 'Thank you for the information.', why: 'Information jest niepoliczalne.' },
      { wrong: 'Can you give me an advice?', right: 'Can you give me some advice?', why: 'Advice jest niepoliczalne.' },
      { wrong: 'The premise is closed.', right: 'The premises are closed.', why: 'Premises zawsze w liczbie mnogiej.' },
    ],
    exercises: [
      { type: 'mcq', q: 'Thank you for the ___.', options: ['informations', 'information', 'an information'], answer: 1 },
      { type: 'mcq', q: 'How ___ damage was caused?', options: ['many', 'much', 'a lot'], answer: 1 },
      { type: 'gap', q: 'The contents ___ insured for EUR 300,000. (is/are)', answers: ['are'] },
      { type: 'gap', q: 'Can I give you a piece of ___? (rada)', answers: ['advice'] },
    ],
  },
  {
    id: 'g08-false-friends',
    level: 'B1',
    title: 'False friends for Polish speakers',
    explanation:
      'Słowa podobne do polskich, ale o innym znaczeniu:\n' +
      'actual = rzeczywisty (nie „aktualny” → current) · eventually = ostatecznie (nie „ewentualnie” → possibly) · premium = składka (nie premia → bonus) · reclamation ≠ reklamacja (→ complaint) · control ≈ kontrolować w sensie sterowania (sprawdzać → check/inspect) · sympathetic = współczujący (sympatyczny → nice) · protocol ≠ protokół szkody (→ report) · lecture = wykład (lektura → reading).',
    summaryEn: 'Watch for false friends: actual, eventually, premium, reclamation, control, sympathetic, protocol.',
    examples: [
      { en: 'Please send me the current version of the policy.', pl: 'Proszę przesłać aktualną wersję polisy.' },
      { en: 'We could possibly increase the excess.', pl: 'Ewentualnie moglibyśmy podnieść udział własny.' },
      { en: 'The adjuster’s report confirms the cause.', pl: 'Protokół likwidatora potwierdza przyczynę.' },
    ],
    mistakes: [
      { wrong: 'Please send the actual policy schedule.', right: 'Please send the current policy schedule.', why: 'Aktualny = current.' },
      { wrong: 'Eventually we can meet on Monday.', right: 'Alternatively / If needed, we can meet on Monday.', why: 'Ewentualnie ≠ eventually.' },
      { wrong: 'The client made a reclamation.', right: 'The client made a complaint.', why: 'Reklamacja = complaint.' },
    ],
    exercises: [
      { type: 'mcq', q: '„Aktualna polisa” to:', options: ['actual policy', 'current policy', 'eventual policy'], answer: 1 },
      { type: 'mcq', q: '„Eventually the insurer paid” znaczy:', options: ['Ewentualnie ubezpieczyciel zapłacił', 'Ostatecznie ubezpieczyciel zapłacił', 'Aktualnie ubezpieczyciel płaci'], answer: 1 },
      { type: 'gap', q: 'The client has made a ___ about the delay. (reklamacja/skarga)', answers: ['complaint'] },
      { type: 'gap', q: 'The surveyor will ___ the fire alarm. (sprawdzi)', answers: ['check', 'inspect', 'test'] },
    ],
  },
  {
    id: 'g09-passive',
    level: 'B2',
    title: 'The passive in reports and emails',
    explanation:
      'Strona bierna skupia uwagę na tym, co się stało, a nie kto to zrobił. Jest typowa dla raportów, opisów ryzyka i ostrożnej komunikacji.\n' +
      'Budowa: be + III forma. „The building was built in 2015”, „The claim is being reviewed”, „The documents have been sent”, „The recommendations will be implemented”.\n' +
      'Strona bierna pomaga też uniknąć wskazywania winnych: „Mistakes were made in the declaration” zamiast „You made mistakes”.',
    summaryEn: 'Passive (be + past participle) focuses on the action, suits reports and avoids blame.',
    examples: [
      { en: 'The claim is being reviewed by the insurer.', pl: 'Szkoda jest rozpatrywana przez ubezpieczyciela.' },
      { en: 'The recommendations have been implemented.', pl: 'Zalecenia zostały wdrożone.' },
      { en: 'An interim payment will be made next week.', pl: 'Zaliczka zostanie wypłacona w przyszłym tygodniu.' },
    ],
    mistakes: [
      { wrong: 'The report was send yesterday.', right: 'The report was sent yesterday.', why: 'III forma: sent.' },
      { wrong: 'The claim is reviewing.', right: 'The claim is being reviewed.', why: 'Strona bierna w czasie ciągłym: is being + III forma.' },
    ],
    exercises: [
      { type: 'gap', q: 'The documents have ___ sent to the adjuster.', answers: ['been'] },
      { type: 'gap', q: 'The claim is ___ reviewed at the moment.', answers: ['being'] },
      { type: 'gap', q: 'The warehouse was ___ in 2015. (build)', answers: ['built'] },
      { type: 'mcq', q: 'Choose the most neutral sentence:', options: ['You gave us wrong values.', 'Incorrect values were declared.', 'Your team made a big mistake.'], answer: 1 },
    ],
  },
  {
    id: 'g10-conditionals',
    level: 'B2',
    title: 'Conditionals for explaining cover',
    explanation:
      'Pierwszy tryb (realny): „If the alarm is not set, the theft cover will not apply.”\n' +
      'Drugi tryb (hipotetyczny): „If you increased the excess, the premium would fall.”\n' +
      'Przydatne spójniki: UNLESS (chyba że): „Theft is not covered unless there is forced entry.” PROVIDED THAT (pod warunkiem że): „Cover applies provided that the sprinklers are maintained.” AS LONG AS (dopóki/pod warunkiem).\n' +
      'Po „if”, „unless” i „provided that” w zdaniu warunkowym nie używamy „will”.',
    summaryEn: 'Use first and second conditionals, unless and provided that to explain when cover applies. No "will" after if/unless.',
    examples: [
      { en: 'Theft is not covered unless there are signs of forced entry.', pl: 'Kradzież nie jest objęta, chyba że są ślady włamania.' },
      { en: 'Cover applies provided that the sprinklers are maintained.', pl: 'Ochrona obowiązuje pod warunkiem, że tryskacze są serwisowane.' },
      { en: 'If you increased the excess, the premium would go down.', pl: 'Gdybyście podnieśli udział własny, składka by spadła.' },
    ],
    mistakes: [
      { wrong: 'If the insurer will accept, we will inform you.', right: 'If the insurer accepts, we will inform you.', why: 'Bez „will” po „if”.' },
      { wrong: 'Unless there is no forced entry, theft is covered.', right: 'Unless there is forced entry, theft is not covered.', why: '„Unless” już zawiera przeczenie.' },
    ],
    exercises: [
      { type: 'gap', q: 'If the insurer ___ the claim, we will inform you immediately. (accept)', answers: ['accepts'] },
      { type: 'gap', q: 'Theft is not covered ___ there is forced entry. (chyba że)', answers: ['unless'] },
      { type: 'gap', q: 'If you increased the excess, the premium ___ go down.', answers: ['would'] },
      { type: 'mcq', q: 'Cover applies ___ the alarm is connected to a monitoring station.', options: ['unless', 'provided that', 'although'], answer: 1 },
    ],
  },
  {
    id: 'g11-hedging',
    level: 'B2',
    title: 'Hedging: sounding careful and professional',
    explanation:
      'Broker często nie zna jeszcze ostatecznej odpowiedzi. Zamiast obiecywać, „asekuruje się” językowo:\n' +
      'it appears / it seems that… · is likely / unlikely to… · may / might · we would expect… · at this stage · based on the information currently available · subject to…\n' +
      'Porównaj: „The insurer will pay” (obietnica) i „We would expect the insurer to respond positively, subject to the adjuster’s report” (profesjonalna ostrożność).',
    summaryEn: 'Hedge with appear, seem, likely, may, would expect, at this stage and subject to, instead of making promises.',
    examples: [
      { en: 'At this stage, it appears that the cause was an electrical fault.', pl: 'Na tym etapie wydaje się, że przyczyną była usterka elektryczna.' },
      { en: 'The claim is likely to take several months.', pl: 'Likwidacja prawdopodobnie potrwa kilka miesięcy.' },
      { en: 'We would expect a decision by the end of the month.', pl: 'Spodziewamy się decyzji do końca miesiąca.' },
    ],
    mistakes: [
      { wrong: 'The insurer will definitely pay everything.', right: 'We would expect the claim to be covered, subject to the adjuster’s findings.', why: 'Broker nie może obiecywać decyzji ubezpieczyciela.' },
      { wrong: 'It is likely that the claim takes long.', right: 'The claim is likely to take a long time.', why: 'Konstrukcja: be likely TO + czasownik.' },
    ],
    exercises: [
      { type: 'gap', q: 'At this ___, it appears that the cause was a short circuit.', answers: ['stage'] },
      { type: 'gap', q: 'The claim is likely ___ take several months.', answers: ['to'] },
      { type: 'mcq', q: 'Which sentence is the most professional?', options: ['The insurer will pay 100%.', 'We would expect the insurer to accept the claim, subject to the wording.', 'Don’t worry, it’s covered.'], answer: 1 },
      { type: 'gap', q: 'It ___ that the alarm was not set. (wydaje się)', answers: ['appears', 'seems'] },
    ],
  },
];

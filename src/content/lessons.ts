import type { Lesson } from '../types';

export const lessons: Lesson[] = [
  {
    id: 'l01-introductions',
    level: 'A2',
    title: 'Introducing yourself and your role',
    titlePl: 'Przedstawianie siebie i swojej roli',
    objectives: ['Przedstawić się i swoją firmę', 'Wyjaśnić, czym zajmuje się broker', 'Zaproponować następny krok'],
    cardIds: ['v-broker', 'v-on-behalf', 'v-in-charge', 'v-insurer', 'v-policyholder', 'v-arrange-meeting'],
    explanation:
      'W pierwszym kontakcie z klientem zagranicznym ważne są trzy rzeczy: kim jesteś, w czyim imieniu działasz i co proponujesz dalej.\n' +
      'Do opisu roli używamy Present Simple: „I work for…”, „I look after…”, „I am responsible for…”. ' +
      'Nie mów „I am working in…” o stałej pracy, bo Present Continuous sugeruje coś tymczasowego.\n' +
      'Broker reprezentuje klienta, nie ubezpieczyciela. Warto to powiedzieć wprost, bo w wielu krajach klienci mylą brokera z agentem.',
    summaryEn: 'Use Present Simple to describe your job, say whose side you are on, and finish with a clear next step.',
    examples: [
      { en: 'My name is Jakub and I work for an insurance broker in Warsaw.', pl: 'Nazywam się Jakub i pracuję u brokera ubezpieczeniowego w Warszawie.' },
      { en: 'I look after property insurance for our corporate clients.', pl: 'Zajmuję się ubezpieczeniami majątkowymi naszych klientów korporacyjnych.' },
      { en: 'We act on behalf of the client, not the insurer.', pl: 'Działamy w imieniu klienta, a nie ubezpieczyciela.' },
      { en: 'Shall we arrange a short call next week?', pl: 'Czy umówimy krótką rozmowę w przyszłym tygodniu?' },
    ],
    situation: {
      title: 'First call with a new contact',
      text:
        'Jakub calls Ms Lindqvist, the new finance manager at Nordtec Logistics in Sweden. He introduces himself, explains that his company is the local broker in Poland for the group programme, and says he is in charge of the Polish warehouse. He suggests a meeting before the renewal in April.',
      pl: 'Jakub dzwoni do pani Lindqvist, nowej dyrektor finansowej Nordtec Logistics w Szwecji. Przedstawia się, wyjaśnia, że jego firma jest lokalnym brokerem programu grupy w Polsce i że odpowiada za polski magazyn. Proponuje spotkanie przed wznowieniem w kwietniu.',
    },
    comprehension: [
      { type: 'mcq', q: 'What is Jakub responsible for?', options: ['The Swedish head office', 'The Polish warehouse', 'All claims in Europe'], answer: 1 },
      { type: 'mcq', q: 'What does Jakub suggest?', options: ['A meeting before the renewal', 'Cancelling the policy', 'A new insurer'], answer: 0 },
    ],
    exercises: [
      { type: 'gap', q: 'I ___ for an insurance broker in Warsaw. (pracuję)', answers: ['work'], explain: 'Stała praca: Present Simple.' },
      { type: 'gap', q: 'We act on ___ of the client.', answers: ['behalf'] },
      { type: 'gap', q: 'Anna is in charge ___ the claims.', answers: ['of'] },
      { type: 'mcq', q: 'Choose the best way to describe your job:', options: ['I am working as broker since 2016.', 'I have worked as a broker since 2016.', 'I work as broker from 2016.'], answer: 1, explain: '„Since” + czynność trwająca do dziś → Present Perfect. Przed zawodem: „a broker”.' },
      { type: 'order', words: ['Shall', 'we', 'arrange', 'a', 'short', 'call', 'next', 'week?'], pl: 'Czy umówimy krótką rozmowę w przyszłym tygodniu?' },
    ],
  },
  {
    id: 'l02-basics',
    level: 'A2',
    title: 'Policy, premium, cover and excess',
    titlePl: 'Polisa, składka, ochrona i udział własny',
    objectives: ['Nazwać podstawowe elementy polisy', 'Wyjaśnić klientowi udział własny', 'Uniknąć fałszywych przyjaciół (premium, policy)'],
    cardIds: ['v-policy', 'v-premium', 'v-cover', 'v-excess', 'v-renewal', 'v-expiry-date', 'v-policy-number'],
    explanation:
      'Cztery słowa, które padają w każdej rozmowie: policy (polisa), premium (składka), cover (ochrona), excess/deductible (udział własny).\n' +
      'Uwaga na fałszywych przyjaciół: „premium” to składka, nie premia; „policy” to polisa, nie polityka.\n' +
      'Udział własny tłumacz klientowi na liczbach: „If the loss is EUR 50,000 and the excess is EUR 10,000, the insurer pays EUR 40,000.” Konkretny przykład działa lepiej niż definicja.',
    summaryEn: 'Policy, premium, cover and excess are the core words. Explain the excess with a simple numerical example.',
    examples: [
      { en: 'The annual premium is payable in two instalments.', pl: 'Roczna składka jest płatna w dwóch ratach.' },
      { en: 'The policy provides cover for fire and storm.', pl: 'Polisa zapewnia ochronę od ognia i wichury.' },
      { en: 'The excess is EUR 5,000 for each and every loss.', pl: 'Udział własny wynosi 5 000 EUR na każdą szkodę.' },
      { en: 'If the loss is EUR 50,000, the insurer pays EUR 45,000.', pl: 'Jeśli szkoda wynosi 50 000 EUR, ubezpieczyciel płaci 45 000 EUR.' },
    ],
    situation: {
      title: 'A client asks about the excess',
      text:
        'A client\'s office was flooded by a burst pipe. The repair costs are EUR 18,000. The policy has an excess of EUR 2,500. The client asks how much the insurer will pay. The broker explains that, subject to the policy wording, the insurer should pay EUR 15,500.',
      pl: 'Biuro klienta zostało zalane przez pękniętą rurę. Koszty naprawy to 18 000 EUR. W polisie jest udział własny 2 500 EUR. Klient pyta, ile zapłaci ubezpieczyciel. Broker wyjaśnia, że z zastrzeżeniem treści polisy ubezpieczyciel powinien wypłacić 15 500 EUR.',
    },
    comprehension: [
      { type: 'mcq', q: 'How much should the insurer pay?', options: ['EUR 18,000', 'EUR 15,500', 'EUR 2,500'], answer: 1 },
      { type: 'mcq', q: 'Why does the broker say "subject to the policy wording"?', options: ['To be cautious, because the final decision belongs to the insurer', 'Because the claim is rejected', 'Because the premium is unpaid'], answer: 0 },
    ],
    exercises: [
      { type: 'gap', q: 'The annual ___ is EUR 48,000. (składka)', answers: ['premium'] },
      { type: 'gap', q: 'The ___ is EUR 10,000 for each and every loss. (udział własny, BrE)', answers: ['excess', 'deductible'] },
      { type: 'mcq', q: '„Premia dla pracownika” po angielsku to:', options: ['premium', 'bonus', 'prize'], answer: 1 },
      { type: 'gap', q: 'Is the new building covered ___ fire?', answers: ['for'], explain: '„Covered FOR fire”.' },
      { type: 'order', words: ['The', 'policy', 'expires', 'on', '31', 'December.'], pl: 'Polisa wygasa 31 grudnia.' },
    ],
  },
  {
    id: 'l03-reporting',
    level: 'A2',
    title: 'Reporting a claim',
    titlePl: 'Zgłaszanie szkody',
    objectives: ['Zebrać podstawowe informacje o szkodzie', 'Zadawać pytania w czasie przeszłym', 'Poprosić o zdjęcia i dokumenty'],
    cardIds: ['v-report-claim', 'v-make-claim', 'v-damage', 'v-loss', 'v-photos', 'v-repair-costs', 'v-claim'],
    explanation:
      'Przy zgłoszeniu szkody pytasz o przeszłość, więc używasz Past Simple: „When did it happen?”, „What happened?”, „Was anyone injured?”.\n' +
      'Kolejność pytań: kiedy, gdzie, co się stało, co zostało uszkodzone, szacunkowy koszt, osoba kontaktowa.\n' +
      '„Damage” jest niepoliczalne: „a lot of damage”, nie „many damages”. Zdjęcia się „robi” („take photos”), a nie „makes”.',
    summaryEn: 'Use Past Simple questions to collect the facts: when, where, what happened, what was damaged, how much, who to contact.',
    examples: [
      { en: 'When did the loss happen?', pl: 'Kiedy doszło do szkody?' },
      { en: 'What exactly was damaged?', pl: 'Co dokładnie zostało uszkodzone?' },
      { en: 'Please take photos of the damage before any repairs.', pl: 'Proszę zrobić zdjęcia uszkodzeń przed jakimikolwiek naprawami.' },
      { en: 'Do you have a rough estimate of the repair costs?', pl: 'Czy ma Pan wstępny szacunek kosztów naprawy?' },
    ],
    situation: {
      title: 'A storm hits a warehouse',
      text:
        'On Sunday morning a storm damaged part of the roof of a warehouse near Łódź. Rain entered the building and some stock got wet. The site manager calls the broker on Monday. The broker asks when it happened, what was damaged and whether anyone was hurt. He asks for photos and an estimate, and says he will report the claim to the insurer today.',
      pl: 'W niedzielę rano wichura uszkodziła część dachu magazynu pod Łodzią. Deszcz dostał się do budynku i część towaru zamokła. Kierownik zakładu dzwoni do brokera w poniedziałek. Broker pyta, kiedy to się stało, co zostało uszkodzone i czy ktoś ucierpiał. Prosi o zdjęcia i szacunek kosztów oraz mówi, że zgłosi szkodę ubezpieczycielowi jeszcze dziś.',
    },
    comprehension: [
      { type: 'mcq', q: 'What caused the damage?', options: ['Fire', 'A storm', 'Theft'], answer: 1 },
      { type: 'mcq', q: 'What will the broker do today?', options: ['Pay the claim', 'Report the claim to the insurer', 'Visit the site'], answer: 1 },
    ],
    exercises: [
      { type: 'gap', q: 'When ___ the loss happen?', answers: ['did'] },
      { type: 'mcq', q: 'Choose the correct sentence:', options: ['There are many damages on the roof.', 'There is a lot of damage to the roof.', 'There is many damage on the roof.'], answer: 1 },
      { type: 'gap', q: 'Please ___ photos of the damage. (zrób)', answers: ['take'] },
      { type: 'gap', q: 'I will ___ the claim to the insurer today. (zgłoszę)', answers: ['report', 'notify'] },
      { type: 'order', words: ['Was', 'anyone', 'injured?'], pl: 'Czy ktoś został ranny?' },
    ],
  },
  {
    id: 'l04-scheduling',
    level: 'A2',
    title: 'Arranging, confirming and rescheduling',
    titlePl: 'Umawianie, potwierdzanie i przekładanie spotkań',
    objectives: ['Zaproponować termin', 'Potwierdzić i przełożyć spotkanie', 'Poprawnie używać przyimków czasu'],
    cardIds: ['v-arrange-meeting', 'v-confirm-appointment', 'v-reschedule', 'v-available', 'v-call-back', 'v-get-back'],
    explanation:
      'Przyimki czasu: ON + dzień („on Monday”, „on 3 May”), AT + godzina („at 10 am”), IN + miesiąc lub część dnia („in April”, „in the morning”).\n' +
      'Proponując termin, używaj pytań: „Would Tuesday at 10 work for you?”, „Are you available on…?”.\n' +
      'O przyszłych ustaleniach mówimy Present Continuous: „I am meeting the adjuster on Friday”.',
    summaryEn: 'On + day, at + time, in + month. Use questions like "Would Tuesday work for you?" and Present Continuous for fixed plans.',
    examples: [
      { en: 'Would Tuesday at 10 am work for you?', pl: 'Czy pasuje Panu wtorek o 10:00?' },
      { en: 'I would like to confirm our appointment on Thursday.', pl: 'Chciałbym potwierdzić nasze spotkanie w czwartek.' },
      { en: 'Could we reschedule the call to next week?', pl: 'Czy możemy przełożyć rozmowę na przyszły tydzień?' },
      { en: 'The surveyor is visiting the site on 14 May.', pl: 'Inspektor przyjeżdża na miejsce 14 maja.' },
    ],
    situation: {
      title: 'Moving a site inspection',
      text:
        'The risk engineer planned to visit the factory on Wednesday at 9 am. The client\'s production manager is ill, so the broker calls to reschedule. They agree on the following Tuesday at 11 am. The broker promises to confirm the new time by email.',
      pl: 'Inżynier ryzyka miał odwiedzić fabrykę w środę o 9:00. Kierownik produkcji klienta jest chory, więc broker dzwoni, żeby przełożyć wizytę. Ustalają kolejny wtorek o 11:00. Broker obiecuje potwierdzić nowy termin mailem.',
    },
    comprehension: [
      { type: 'mcq', q: 'Why is the visit moved?', options: ['The engineer is busy', 'The production manager is ill', 'The factory is closed'], answer: 1 },
      { type: 'mcq', q: 'What is the new time?', options: ['Wednesday at 9 am', 'Tuesday at 11 am', 'Thursday at 11 am'], answer: 1 },
    ],
    exercises: [
      { type: 'gap', q: 'Let\'s meet ___ Monday.', answers: ['on'] },
      { type: 'gap', q: 'The call is ___ 3 pm.', answers: ['at'] },
      { type: 'gap', q: 'The renewal is ___ April.', answers: ['in'] },
      { type: 'mcq', q: 'Choose the most natural question:', options: ['Do you have time at Tuesday?', 'Are you available on Tuesday?', 'Are you free in Tuesday?'], answer: 1 },
      { type: 'order', words: ['Could', 'you', 'ask', 'her', 'to', 'call', 'me', 'back?'], pl: 'Czy może ją Pani poprosić, żeby oddzwoniła?' },
    ],
  },
  {
    id: 'l05-property-perils',
    level: 'B1',
    title: 'What is insured: property and perils',
    titlePl: 'Co jest ubezpieczone: mienie i ryzyka',
    objectives: ['Opisać przedmiot ubezpieczenia', 'Rozróżnić ryzyka (perils)', 'Odróżnić flood od escape of water'],
    cardIds: ['v-buildings', 'v-contents', 'v-stock', 'v-machinery', 'v-insured-peril', 'v-all-risks', 'v-named-perils', 'v-escape-water'],
    explanation:
      'Przedmiot ubezpieczenia opisujemy kategoriami: buildings, machinery and equipment, contents, stock. W polisach zwykle są w liczbie mnogiej.\n' +
      'Zakres ochrony to albo „named perils” (tylko wymienione ryzyka), albo „all risks” (wszystko, czego nie wyłączono).\n' +
      'Uwaga: „flood” to woda z zewnątrz (rzeka, deszcz), a woda z instalacji wewnątrz budynku to „escape of water”. To rozróżnienie wpływa na limity i wyłączenia.',
    summaryEn: 'Describe insured property by category and know the difference between named perils and all risks, and between flood and escape of water.',
    examples: [
      { en: 'The policy covers buildings, machinery and stock.', pl: 'Polisa obejmuje budynki, maszyny i towary.' },
      { en: 'This is an all risks policy, so theft is covered unless it is excluded.', pl: 'To polisa all risks, więc kradzież jest objęta, chyba że ją wyłączono.' },
      { en: 'The water came from a burst pipe, so it is escape of water, not flood.', pl: 'Woda pochodziła z pękniętej rury, więc to zalanie z instalacji, a nie powódź.' },
    ],
    situation: {
      title: 'Explaining the scope to a new client',
      text:
        'A French logistics group has bought a distribution centre near Poznań. The CFO asks what the local policy covers. The broker explains that it is an all risks policy for buildings, machinery and stock, with separate limits for flood and earthquake. He adds that water from the sprinkler system is covered as sprinkler leakage.',
      pl: 'Francuska grupa logistyczna kupiła centrum dystrybucyjne pod Poznaniem. Dyrektor finansowy pyta, co obejmuje polisa lokalna. Broker wyjaśnia, że to polisa all risks dla budynków, maszyn i towarów, z osobnymi limitami dla powodzi i trzęsienia ziemi. Dodaje, że woda z instalacji tryskaczowej jest objęta jako wyciek z tryskaczy.',
    },
    comprehension: [
      { type: 'mcq', q: 'What type of policy is it?', options: ['Named perils', 'All risks', 'Liability'], answer: 1 },
      { type: 'mcq', q: 'Which perils have separate limits?', options: ['Fire and theft', 'Flood and earthquake', 'Storm and hail'], answer: 1 },
    ],
    exercises: [
      { type: 'mcq', q: 'A pipe bursts inside the office. This is:', options: ['flood', 'escape of water', 'storm'], answer: 1 },
      { type: 'gap', q: 'The contents ___ insured for EUR 2 million. (are/is)', answers: ['are'], explain: '„Contents” zawsze w liczbie mnogiej.' },
      { type: 'gap', q: 'The ___ is old, but it still works well. (maszyny – niepoliczalne)', answers: ['machinery'] },
      { type: 'mcq', q: 'In an all risks policy…', options: ['only listed perils are covered', 'everything is covered unless excluded', 'nothing is excluded'], answer: 1 },
      { type: 'order', words: ['Storm', 'is', 'an', 'insured', 'peril', 'under', 'this', 'policy.'], pl: 'Wichura jest ryzykiem objętym tą polisą.' },
    ],
  },
  {
    id: 'l06-limits',
    level: 'B1',
    title: 'Sums insured, limits and sublimits',
    titlePl: 'Sumy ubezpieczenia, limity i podlimity',
    objectives: ['Odróżnić sumę ubezpieczenia od limitu', 'Czytać zapis limitów', 'Mówić o liczbach i walutach'],
    cardIds: ['v-sum-insured', 'v-limit', 'v-sublimit', 'v-aggregate', 'v-excess', 'v-schedule'],
    explanation:
      'Suma ubezpieczenia (sum insured) to wartość mienia. Limit (limit of indemnity) to maksymalna wypłata i może być niższy niż suma ubezpieczenia.\n' +
      'Podlimit (sublimit) dotyczy konkretnego rodzaju szkody i mieści się w limicie ogólnym.\n' +
      'Liczby: „EUR 5 million” czytamy „five million euros”. Tysiące oddzielamy przecinkiem: 48,000. „Any one occurrence” to „na jedno zdarzenie”, a „in the aggregate” to „łącznie w okresie”.',
    summaryEn: 'Sum insured is the value; the limit is the maximum payment; a sublimit is a smaller limit inside it. Know "any one occurrence" vs "in the aggregate".',
    examples: [
      { en: 'The total sum insured is EUR 85 million.', pl: 'Łączna suma ubezpieczenia to 85 mln EUR.' },
      { en: 'Flood is limited to EUR 10 million in the aggregate.', pl: 'Powódź ma limit 10 mln EUR w agregacie.' },
      { en: 'There is a sublimit of EUR 250,000 for debris removal.', pl: 'Na usunięcie pozostałości jest podlimit 250 000 EUR.' },
    ],
    situation: {
      title: 'Reading the schedule with the client',
      text:
        'The client\'s CFO reads the policy schedule: total sum insured EUR 60 million, limit of indemnity EUR 40 million any one occurrence, flood EUR 5 million in the aggregate, theft EUR 500,000. She asks why the limit is lower than the sum insured. The broker explains that the EML study shows a maximum realistic loss of about EUR 35 million, so a EUR 40 million limit was considered sufficient and reduced the premium.',
      pl: 'Dyrektor finansowa klienta czyta specyfikację polisy: łączna suma ubezpieczenia 60 mln EUR, limit 40 mln EUR na zdarzenie, powódź 5 mln EUR w agregacie, kradzież 500 000 EUR. Pyta, dlaczego limit jest niższy niż suma ubezpieczenia. Broker wyjaśnia, że analiza EML wskazała maksymalną realną szkodę ok. 35 mln EUR, więc limit 40 mln EUR uznano za wystarczający, a składka była niższa.',
    },
    comprehension: [
      { type: 'mcq', q: 'What is the flood limit?', options: ['EUR 40 million any one occurrence', 'EUR 5 million in the aggregate', 'EUR 500,000'], answer: 1 },
      { type: 'mcq', q: 'Why is the limit lower than the sum insured?', options: ['The EML is about EUR 35 million', 'The insurer made a mistake', 'Flood is excluded'], answer: 0 },
    ],
    exercises: [
      { type: 'mcq', q: '„Limit of indemnity” to:', options: ['wartość mienia', 'maksymalna wypłata', 'składka'], answer: 1 },
      { type: 'gap', q: 'The limit is EUR 40 million any one ___. (zdarzenie)', answers: ['occurrence', 'event', 'loss'] },
      { type: 'gap', q: 'Flood is limited to EUR 5 million in the ___.', answers: ['aggregate'] },
      { type: 'gap', q: 'Please confirm the sums ___ for each location.', answers: ['insured'] },
      { type: 'order', words: ['There', 'is', 'a', 'sublimit', 'for', 'stock', 'in', 'the', 'open.'], pl: 'Dla towarów składowanych na zewnątrz jest podlimit.' },
    ],
  },
  {
    id: 'l07-exclusions',
    level: 'B1',
    title: 'Exclusions and cautious language',
    titlePl: 'Wyłączenia i ostrożny język brokera',
    objectives: ['Przekazać złą wiadomość bez obiecywania decyzji ubezpieczyciela', 'Używać zwrotów ostrożności', 'Zaproponować kolejny krok'],
    cardIds: ['v-exclusion', 'v-policy-wording', 'v-subject-to', 'v-wear-tear', 'v-cause-of-loss'],
    explanation:
      'Broker nie podejmuje decyzji o pokryciu szkody, robi to ubezpieczyciel. Dlatego mówimy ostrożnie:\n' +
      '„Based on the information currently available…”, „Subject to the relevant policy wording…”, „It appears that…”, „I would recommend confirming this with the insurer.”\n' +
      'Złą wiadomość buduj tak: empatia, fakt, powód, następny krok. Unikaj „It is not covered, sorry”. Lepiej: „I\'m afraid that, subject to the insurer\'s final position, this appears to fall within the wear and tear exclusion. Let me explain what we can do next.”',
    summaryEn: 'The insurer decides on cover, so brokers use cautious phrases and structure bad news as empathy, fact, reason, next step.',
    examples: [
      { en: 'Based on the information currently available, the damage appears to be caused by wear and tear.', pl: 'Na podstawie dostępnych obecnie informacji uszkodzenie wydaje się wynikać ze zużycia.' },
      { en: 'Subject to the relevant policy wording, this should be covered.', pl: 'Z zastrzeżeniem odpowiednich warunków polisy powinno to być objęte ochroną.' },
      { en: 'I would recommend confirming this with the insurer before you start repairs.', pl: 'Rekomendowałbym potwierdzić to z ubezpieczycielem przed rozpoczęciem napraw.' },
    ],
    situation: {
      title: 'A roof leak after years of corrosion',
      text:
        'Water entered a warehouse through an old, corroded roof during normal rain. The adjuster\'s first report says the cause is long-term corrosion. The broker calls the client. He shows understanding, explains that gradual deterioration and wear and tear are excluded, makes clear that the final decision is the insurer\'s, and suggests checking whether the damaged stock could still be covered.',
      pl: 'Woda dostała się do magazynu przez stary, skorodowany dach podczas zwykłego deszczu. Wstępny raport likwidatora wskazuje jako przyczynę wieloletnią korozję. Broker dzwoni do klienta. Okazuje zrozumienie, wyjaśnia, że stopniowe pogorszenie stanu i zużycie są wyłączone, zaznacza, że ostateczna decyzja należy do ubezpieczyciela, i proponuje sprawdzić, czy uszkodzony towar może być jednak objęty ochroną.',
    },
    comprehension: [
      { type: 'mcq', q: 'What does the adjuster think caused the loss?', options: ['A storm', 'Long-term corrosion', 'A burst pipe'], answer: 1 },
      { type: 'mcq', q: 'Who makes the final decision?', options: ['The broker', 'The client', 'The insurer'], answer: 2 },
    ],
    exercises: [
      { type: 'mcq', q: 'Which sentence is the most professional?', options: ['This is not covered, sorry.', 'I\'m afraid this appears to fall within the exclusion, subject to the insurer\'s final position.', 'The insurer will never pay this.'], answer: 1 },
      { type: 'gap', q: '___ to the relevant policy wording, this should be covered.', answers: ['subject'] },
      { type: 'gap', q: 'Based on the information currently ___, …', answers: ['available'] },
      { type: 'gap', q: 'Wear and ___ is excluded.', answers: ['tear'] },
      { type: 'order', words: ['I', 'would', 'recommend', 'confirming', 'this', 'with', 'the', 'insurer.'], pl: 'Rekomendowałbym potwierdzenie tego z ubezpieczycielem.' },
    ],
  },
  {
    id: 'l08-claims-process',
    level: 'B1',
    title: 'The claims process: adjusters, documents, settlement',
    titlePl: 'Proces likwidacji: likwidator, dokumenty, wypłata',
    objectives: ['Opisać etapy likwidacji', 'Poprosić o brakujące dokumenty', 'Mówić o postępie (Present Perfect)'],
    cardIds: ['v-loss-adjuster', 'v-claims-handler', 'v-supporting-docs', 'v-interim-payment', 'v-settlement', 'v-outstanding', 'v-mitigation'],
    explanation:
      'Etapy: FNOL → wyznaczenie likwidatora (appoint an adjuster) → oględziny (site visit) → dokumenty (supporting documents) → raport → zaliczka (interim payment) → wypłata (settlement).\n' +
      'O postępie mówimy Present Perfect: „The adjuster has visited the site”, „We have not received the invoices yet”. „Yet” stawiamy na końcu zdania przeczącego lub pytania.\n' +
      'O brakach mówimy „still outstanding”: „Two documents are still outstanding.”',
    summaryEn: 'Know the stages of a claim and use Present Perfect to report progress ("has visited", "haven\'t received yet").',
    examples: [
      { en: 'The insurer has appointed a loss adjuster.', pl: 'Ubezpieczyciel wyznaczył likwidatora.' },
      { en: 'We have not received the stock records yet.', pl: 'Nie otrzymaliśmy jeszcze ewidencji towarów.' },
      { en: 'Two documents are still outstanding.', pl: 'Nadal brakuje dwóch dokumentów.' },
      { en: 'We have requested an interim payment of EUR 150,000.', pl: 'Wystąpiliśmy o zaliczkę 150 000 EUR.' },
    ],
    situation: {
      title: 'Update on a fire claim',
      text:
        'Three weeks after a fire at a packaging plant, the broker updates the client\'s group risk manager in Amsterdam. The adjuster has visited the site twice and has received most documents. The fire brigade report and the stock valuation are still outstanding. The broker has requested an interim payment to help the client restart production.',
      pl: 'Trzy tygodnie po pożarze w zakładzie produkującym opakowania broker informuje risk managera grupy w Amsterdamie o postępach. Likwidator był na miejscu dwa razy i otrzymał większość dokumentów. Nadal brakuje raportu straży pożarnej i wyceny towarów. Broker wystąpił o zaliczkę, aby pomóc klientowi wznowić produkcję.',
    },
    comprehension: [
      { type: 'mcq', q: 'Which documents are still outstanding?', options: ['Photos and invoices', 'Fire brigade report and stock valuation', 'The claim form'], answer: 1 },
      { type: 'mcq', q: 'Why did the broker request an interim payment?', options: ['To help the client restart production', 'To close the claim', 'To pay the adjuster'], answer: 0 },
    ],
    exercises: [
      { type: 'gap', q: 'The adjuster ___ visited the site twice.', answers: ['has'] },
      { type: 'gap', q: 'We haven\'t received the report ___.', answers: ['yet'] },
      { type: 'mcq', q: 'Pracownik ubezpieczyciela prowadzący szkodę to:', options: ['loss adjuster', 'claims handler', 'loss assessor'], answer: 1 },
      { type: 'gap', q: 'Two documents are still ___. (brakujące)', answers: ['outstanding'] },
      { type: 'order', words: ['We', 'have', 'requested', 'an', 'interim', 'payment.'], pl: 'Wystąpiliśmy o zaliczkę.' },
    ],
  },
  {
    id: 'l09-renewal',
    level: 'B1',
    title: 'Renewals and premium increases',
    titlePl: 'Wznowienia i podwyżki składki',
    objectives: ['Uzasadnić podwyżkę składki', 'Używać porównań (higher, more expensive)', 'Przedstawić opcje klientowi'],
    cardIds: ['v-renewal', 'v-premium-increase', 'v-renew', 'v-rate', 'v-claims-history', 'v-hard-market', 'v-quote'],
    explanation:
      'Podwyżkę uzasadniamy faktami: claims history, higher values, market conditions, outstanding risk improvements.\n' +
      'Porównania: „higher than last year”, „more expensive”, „the best option”. Unikaj „more higher”.\n' +
      'Przedstawiaj opcje: „Option A is to accept the terms. Option B is to increase the excess, which would reduce the premium by about 8%.” Zawsze wskaż, co rekomendujesz i dlaczego.',
    summaryEn: 'Explain an increase with facts, use comparatives correctly and present clear options with a recommendation.',
    examples: [
      { en: 'The renewal premium is 12% higher than last year.', pl: 'Składka przy wznowieniu jest o 12% wyższa niż w zeszłym roku.' },
      { en: 'The increase reflects two large claims and higher values.', pl: 'Podwyżka odzwierciedla dwie duże szkody i wyższe wartości.' },
      { en: 'If you increase the excess, the premium would go down by about 8%.', pl: 'Jeśli podniesiecie udział własny, składka spadłaby o około 8%.' },
    ],
    situation: {
      title: 'Presenting renewal terms',
      text:
        'The lead insurer has offered renewal terms with a 15% premium increase. Reasons: two water damage claims, a 10% increase in stock values and three outstanding risk improvement recommendations. The broker obtained an alternative quote 9% higher than expiring, but with a higher excess. He recommends staying with the current insurer if the client implements the recommendations, because the insurer has agreed to review the rate mid-term.',
      pl: 'Ubezpieczyciel prowadzący zaproponował wznowienie z podwyżką składki o 15%. Powody: dwie szkody wodne, wzrost wartości towarów o 10% i trzy niezrealizowane zalecenia prewencyjne. Broker uzyskał alternatywną ofertę droższą o 9% od dotychczasowej, ale z wyższym udziałem własnym. Rekomenduje pozostanie przy obecnym ubezpieczycielu, jeśli klient wdroży zalecenia, ponieważ ubezpieczyciel zgodził się zrewidować stawkę w trakcie roku.',
    },
    comprehension: [
      { type: 'mcq', q: 'How much is the lead insurer\'s increase?', options: ['9%', '10%', '15%'], answer: 2 },
      { type: 'mcq', q: 'What is the condition of the broker\'s recommendation?', options: ['The client implements the recommendations', 'The client changes the broker', 'The client reduces the stock'], answer: 0 },
    ],
    exercises: [
      { type: 'mcq', q: 'Choose the correct sentence:', options: ['The premium is more higher.', 'The premium is higher than last year.', 'The premium is higher that last year.'], answer: 1 },
      { type: 'gap', q: 'The increase ___ the claims history. (odzwierciedla)', answers: ['reflects'] },
      { type: 'gap', q: 'The insurer is willing to renew ___ expiring terms. (na dotychczasowych)', answers: ['on', 'as per'] },
      { type: 'gap', q: 'The renewal premium is 12% higher ___ last year.', answers: ['than'] },
      { type: 'order', words: ['We', 'would', 'recommend', 'staying', 'with', 'the', 'current', 'insurer.'], pl: 'Rekomendowalibyśmy pozostanie przy obecnym ubezpieczycielu.' },
    ],
  },
  {
    id: 'l10-valuation',
    level: 'B2',
    title: 'Valuation, underinsurance and average',
    titlePl: 'Wycena, niedoubezpieczenie i zasada proporcji',
    objectives: ['Wyjaśnić podstawy wyceny', 'Pokazać skutek niedoubezpieczenia na liczbach', 'Używać zdań warunkowych'],
    cardIds: ['v-replacement-cost', 'v-acv', 'v-depreciation', 'v-underinsurance', 'v-average', 'v-betterment'],
    explanation:
      'Wartość odtworzeniowa (reinstatement/replacement cost) to koszt nowego mienia tego samego rodzaju. Wartość rzeczywista (actual cash value) to wartość odtworzeniowa minus zużycie.\n' +
      'Zasada proporcji (average): jeśli suma ubezpieczenia to 80% wartości, ubezpieczyciel wypłaci ok. 80% szkody.\n' +
      'Do wyjaśniania skutków używaj drugiego trybu warunkowego: „If the building were insured for its full value, the claim would be paid in full.”',
    summaryEn: 'Reinstatement vs actual cash value; underinsurance can trigger average. Use second conditionals to explain consequences.',
    examples: [
      { en: 'The building is insured for EUR 8 million, but its reinstatement value is EUR 10 million.', pl: 'Budynek jest ubezpieczony na 8 mln EUR, a jego wartość odtworzeniowa to 10 mln EUR.' },
      { en: 'If average applied, a EUR 1 million loss would be paid at EUR 800,000.', pl: 'Gdyby zastosowano zasadę proporcji, szkoda 1 mln EUR zostałaby wypłacona w kwocie 800 000 EUR.' },
      { en: 'We recommend a professional valuation every three to five years.', pl: 'Rekomendujemy profesjonalną wycenę co trzy–pięć lat.' },
    ],
    situation: {
      title: 'Why the sums insured matter',
      text:
        'Before renewal, the broker reviews the values of a manufacturing client. Construction costs have risen by around 20% in three years, but the sums insured have not changed. The broker explains the risk of underinsurance and average with a numerical example and recommends a valuation by an independent surveyor.',
      pl: 'Przed wznowieniem broker przegląda wartości klienta produkcyjnego. Koszty budowy wzrosły o ok. 20% w trzy lata, a sumy ubezpieczenia się nie zmieniły. Broker wyjaśnia ryzyko niedoubezpieczenia i zasady proporcji na przykładzie liczbowym oraz rekomenduje wycenę przez niezależnego rzeczoznawcę.',
    },
    comprehension: [
      { type: 'mcq', q: 'What has changed in three years?', options: ['The sums insured', 'Construction costs', 'The insurer'], answer: 1 },
      { type: 'mcq', q: 'What does the broker recommend?', options: ['An independent valuation', 'Cancelling the policy', 'Reducing the limit'], answer: 0 },
    ],
    exercises: [
      { type: 'mcq', q: 'Actual cash value =', options: ['replacement cost + depreciation', 'replacement cost − depreciation', 'market value of land'], answer: 1 },
      { type: 'gap', q: 'If the building ___ insured for its full value, the claim would be paid in full.', answers: ['were', 'was'] },
      { type: 'gap', q: 'Because of underinsurance, ___ was applied. (zasada proporcji)', answers: ['average'] },
      { type: 'mcq', q: 'Sum insured 80% of value, loss EUR 500,000. With average the payment is about:', options: ['EUR 500,000', 'EUR 400,000', 'EUR 100,000'], answer: 1 },
      { type: 'order', words: ['We', 'recommend', 'an', 'independent', 'valuation', 'before', 'renewal.'], pl: 'Rekomendujemy niezależną wycenę przed wznowieniem.' },
    ],
  },
  {
    id: 'l11-underwriting',
    level: 'B2',
    title: 'Underwriting and the market submission',
    titlePl: 'Underwriting i prezentacja ryzyka do rynku',
    objectives: ['Zebrać informacje do zgłoszenia', 'Opisać ryzyko underwriterowi', 'Używać strony biernej'],
    cardIds: ['v-underwriting', 'v-market-submission', 'v-fair-presentation', 'v-risk-survey', 'v-risk-improvement', 'v-occupancy', 'v-construction'],
    explanation:
      'Dobra prezentacja ryzyka (market submission) zawiera: opis działalności (occupancy), konstrukcję (construction), zabezpieczenia (protection), wartości (values), historię szkodową (loss record), raporty z inspekcji i status zaleceń.\n' +
      'Opisując ryzyko, często używamy strony biernej: „The building was constructed in 2015”, „The warehouse is protected by sprinklers”, „Hot work is controlled by a permit system.”\n' +
      'Klient musi ujawnić okoliczności istotne (material facts). Broker powinien o to aktywnie pytać.',
    summaryEn: 'A good submission covers occupancy, construction, protection, values and loss history. Use the passive to describe the risk.',
    examples: [
      { en: 'The warehouse was built in 2015 with non-combustible construction.', pl: 'Magazyn zbudowano w 2015 r. w konstrukcji niepalnej.' },
      { en: 'The site is protected by sprinklers and a monitored fire alarm.', pl: 'Zakład jest chroniony tryskaczami i monitorowanym systemem sygnalizacji pożaru.' },
      { en: 'All risk improvement recommendations have been implemented.', pl: 'Wszystkie zalecenia prewencyjne zostały wdrożone.' },
    ],
    situation: {
      title: 'Preparing a submission for a new client',
      text:
        'A Polish client wants quotes for a new cold storage facility. The broker prepares a market submission: occupancy (cold storage of food), construction (steel frame, sandwich panels with mineral wool core), protection (sprinklers, fire detection, 24/7 security), values (EUR 42 million) and a five-year loss record with one small claim. He also asks the client whether there are any other material facts.',
      pl: 'Polski klient chce ofert dla nowej chłodni. Broker przygotowuje prezentację ryzyka: działalność (chłodnia spożywcza), konstrukcja (stalowa, płyty warstwowe z rdzeniem z wełny mineralnej), zabezpieczenia (tryskacze, sygnalizacja pożaru, ochrona 24/7), wartości (42 mln EUR) i pięcioletnia historia szkodowa z jedną drobną szkodą. Pyta też klienta o inne okoliczności istotne.',
    },
    comprehension: [
      { type: 'mcq', q: 'What is the core of the sandwich panels?', options: ['EPS', 'Mineral wool', 'Wood'], answer: 1 },
      { type: 'mcq', q: 'What does the broker ask at the end?', options: ['About other material facts', 'About the premium budget only', 'About the CEO\'s holiday'], answer: 0 },
    ],
    exercises: [
      { type: 'gap', q: 'The building ___ constructed in 2015. (strona bierna)', answers: ['was'] },
      { type: 'gap', q: 'The site is protected ___ sprinklers.', answers: ['by'] },
      { type: 'mcq', q: '„Occupancy” in a survey report means:', options: ['how full the building is', 'what the building is used for', 'the number of employees'], answer: 1 },
      { type: 'gap', q: 'The client must disclose all material ___.', answers: ['facts'] },
      { type: 'order', words: ['All', 'recommendations', 'have', 'been', 'implemented.'], pl: 'Wszystkie zalecenia zostały wdrożone.' },
    ],
  },
  {
    id: 'l12-programmes',
    level: 'B2',
    title: 'International programmes',
    titlePl: 'Programy międzynarodowe',
    objectives: ['Wyjaśnić strukturę master + polisy lokalne', 'Opisać DIC/DIL i fronting', 'Komunikować się z partnerem sieciowym'],
    cardIds: ['v-global-programme', 'v-master-policy', 'v-local-policy', 'v-dic', 'v-dil', 'v-fronting', 'v-admitted', 'v-premium-allocation'],
    explanation:
      'Program międzynarodowy to polisa główna (master) w kraju spółki matki plus polisy lokalne w krajach spółek zależnych.\n' +
      'Master może dawać DIC (szerszy zakres niż lokalny) i DIL (wyższe limity niż lokalne). To, czy master może bezpośrednio wypłacić odszkodowanie w danym kraju, zależy od lokalnych przepisów. Zawsze to potwierdzaj.\n' +
      'Jako broker lokalny w sieci odpowiadasz często za: wystawienie polisy lokalnej, poprawną alokację składki i podatki oraz obsługę szkód lokalnie. W kontaktach z partnerem sieciowym precyzuj, kto, co i do kiedy robi.',
    summaryEn: 'A programme combines a master policy with local policies; DIC/DIL fill gaps, and local rules decide what the master can pay directly.',
    examples: [
      { en: 'The local policy follows the master policy wording as closely as local law allows.', pl: 'Polisa lokalna odzwierciedla treść polisy głównej na tyle, na ile pozwala lokalne prawo.' },
      { en: 'Could you confirm whether DIC/DIL cover can respond in Poland?', pl: 'Czy może Pan potwierdzić, czy ochrona DIC/DIL może zadziałać w Polsce?' },
      { en: 'The local premium must be allocated and taxed correctly.', pl: 'Składka lokalna musi być prawidłowo zaalokowana i opodatkowana.' },
    ],
    situation: {
      title: 'Instructions from the coordinating broker',
      text:
        'A network broker in Paris coordinates the programme of a French food group. They send instructions to the Polish local broker: issue the local policy by 1 January, follow the master wording where possible, apply the allocated premium of EUR 64,000 and report any claim above EUR 25,000 to Paris within 48 hours. The Polish broker asks for clarification on whether flood DIL from the master can respond in Poland.',
      pl: 'Broker sieciowy w Paryżu koordynuje program francuskiej grupy spożywczej. Przesyła instrukcje polskiemu brokerowi lokalnemu: wystawić polisę lokalną do 1 stycznia, odzwierciedlić treść mastera tam, gdzie to możliwe, zastosować zaalokowaną składkę 64 000 EUR i zgłaszać do Paryża każdą szkodę powyżej 25 000 EUR w ciągu 48 godzin. Polski broker prosi o doprecyzowanie, czy DIL powodziowy z mastera może zadziałać w Polsce.',
    },
    comprehension: [
      { type: 'mcq', q: 'When must claims above EUR 25,000 be reported to Paris?', options: ['Within 48 hours', 'Within 14 days', 'At renewal'], answer: 0 },
      { type: 'mcq', q: 'What does the Polish broker ask about?', options: ['The allocated premium', 'Flood DIL in Poland', 'The inception date'], answer: 1 },
    ],
    exercises: [
      { type: 'mcq', q: 'DIL means the master policy…', options: ['provides broader conditions', 'pays above the local limit', 'replaces the local policy'], answer: 1 },
      { type: 'mcq', q: 'In fronting, the local insurer…', options: ['keeps all the risk', 'issues the policy but passes the risk on', 'refuses to issue a policy'], answer: 1 },
      { type: 'gap', q: 'The local policy follows the master wording as closely as local law ___. (pozwala)', answers: ['allows', 'permits'] },
      { type: 'gap', q: 'Could you ___ whether DIC cover can respond in Poland?', answers: ['confirm', 'clarify', 'check'] },
      { type: 'order', words: ['The', 'premium', 'must', 'be', 'allocated', 'correctly.'], pl: 'Składka musi być prawidłowo zaalokowana.' },
    ],
  },
  {
    id: 'l13-bi',
    level: 'B2',
    title: 'Business interruption',
    titlePl: 'Utrata zysku (business interruption)',
    objectives: ['Wyjaśnić, jak działa BI', 'Rozróżnić okres ubezpieczenia i okres odszkodowawczy', 'Omówić CBI i dostawców'],
    cardIds: ['v-bi', 'v-indemnity-period', 'v-gross-profit', 'v-cbi', 'v-loss-ratio'],
    explanation:
      'BI pokrywa utracony zysk i koszty stałe po szkodzie materialnej objętej polisą. Kluczowe pojęcia: gross profit w rozumieniu polisy, indemnity period, increased cost of working.\n' +
      'Okres odszkodowawczy liczy się od daty szkody i powinien uwzględniać realny czas odbudowy, np. dostawy specjalistycznych maszyn.\n' +
      'CBI dotyczy szkód u dostawców lub odbiorców. Ubezpieczyciele pytają o kluczowych dostawców i plany awaryjne (business continuity plan).',
    summaryEn: 'BI pays lost gross profit after insured damage; set a realistic indemnity period and consider supplier risk (CBI).',
    examples: [
      { en: 'The indemnity period starts on the date of the damage.', pl: 'Okres odszkodowawczy biegnie od daty szkody.' },
      { en: 'Replacing the extrusion line could take 14 months.', pl: 'Wymiana linii do ekstruzji może potrwać 14 miesięcy.' },
      { en: 'Do you have alternative suppliers for this component?', pl: 'Czy macie alternatywnych dostawców tego komponentu?' },
    ],
    situation: {
      title: 'Is 12 months enough?',
      text:
        'A plastics manufacturer has a 12-month indemnity period. The key extrusion line is made to order in Germany, and delivery and installation take about 14 months. The broker explains that a 12-month indemnity period could leave two months of lost profit uninsured and recommends 18 or 24 months. He also asks about the main resin supplier, as a fire there could stop production.',
      pl: 'Producent tworzyw ma 12-miesięczny okres odszkodowawczy. Kluczowa linia do ekstruzji jest wykonywana na zamówienie w Niemczech, a dostawa i montaż trwają ok. 14 miesięcy. Broker wyjaśnia, że przy 12 miesiącach dwa miesiące utraconego zysku mogą pozostać bez ochrony, i rekomenduje 18 lub 24 miesiące. Pyta też o głównego dostawcę granulatu, bo pożar u niego mógłby zatrzymać produkcję.',
    },
    comprehension: [
      { type: 'mcq', q: 'How long does it take to replace the line?', options: ['12 months', 'About 14 months', '24 months'], answer: 1 },
      { type: 'mcq', q: 'Why does the broker ask about the resin supplier?', options: ['For CBI exposure', 'To change the insurer', 'For the liability policy'], answer: 0 },
    ],
    exercises: [
      { type: 'mcq', q: 'The indemnity period starts…', options: ['at inception', 'on the date of the damage', 'at renewal'], answer: 1 },
      { type: 'gap', q: 'A fire at a key supplier could trigger a ___ claim. (skrót)', answers: ['cbi', 'contingent business interruption'] },
      { type: 'gap', q: 'We recommend ___ the indemnity period to 24 months. (zwiększenie)', answers: ['increasing', 'extending'] },
      { type: 'mcq', q: 'BI usually requires…', options: ['insured physical damage', 'a liability claim', 'a police report'], answer: 0 },
      { type: 'order', words: ['Do', 'you', 'have', 'alternative', 'suppliers?'], pl: 'Czy macie alternatywnych dostawców?' },
    ],
  },
];

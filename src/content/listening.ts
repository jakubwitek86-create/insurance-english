import type { ListeningItem, PlacementQuestion } from '../types';

export const listeningItems: ListeningItem[] = [
  {
    id: 'li01-voicemail-adjuster',
    level: 'A2',
    title: 'Voicemail from a loss adjuster',
    intro: 'Wiadomość głosowa od likwidatora. Posłuchaj bez transkrypcji i odpowiedz na pytania.',
    text:
      'Hello, this is Peter Hall from Hall and Partners, the loss adjusters. I\'m calling about the storm damage at the Łódź warehouse. I would like to visit the site on Thursday at ten o\'clock. Could you please confirm the time and send me the photos of the roof? My number is oh seven seven, four five two, nine one eight. Thank you.',
    questions: [
      { type: 'mcq', q: 'Why is Peter calling?', options: ['About a fire', 'About storm damage', 'About a renewal'], answer: 1 },
      { type: 'mcq', q: 'When does he want to visit?', options: ['Tuesday at 10', 'Thursday at 10', 'Thursday at 2'], answer: 1 },
      { type: 'mcq', q: 'What does he ask for?', options: ['Photos of the roof', 'The invoice', 'The police report'], answer: 0 },
    ],
  },
  {
    id: 'li02-client-call',
    level: 'A2',
    title: 'Message from a client',
    intro: 'Klient zostawia wiadomość z prośbą o oddzwonienie.',
    text:
      'Hi Jakub, it\'s Anna from Baltic Foods. We have a new cold store in Gdańsk and we need insurance from the first of next month. The value is about three million euros. Can you call me back today or tomorrow morning? Thanks, bye.',
    questions: [
      { type: 'mcq', q: 'What is new?', options: ['A cold store', 'An office', 'A truck'], answer: 0 },
      { type: 'mcq', q: 'What is the value?', options: ['EUR 300,000', 'EUR 3 million', 'EUR 13 million'], answer: 1 },
      { type: 'mcq', q: 'When should Jakub call back?', options: ['Next week', 'Today or tomorrow morning', 'At the end of the month'], answer: 1 },
    ],
  },
  {
    id: 'li03-underwriter-update',
    level: 'B1',
    title: 'Underwriter\'s update on renewal',
    intro: 'Underwriter informuje o warunkach wznowienia.',
    text:
      'Hi, it\'s Sarah from Allied Mutual. I\'ve looked at the renewal information for Nordtec. We can renew, but because of the two water claims, we need a ten percent rate increase and the escape of water excess will go up to twenty-five thousand euros. If the client completes the sprinkler recommendations before June, we are happy to review the terms mid-term. Let me know if you\'d like to discuss.',
    questions: [
      { type: 'mcq', q: 'How much is the rate increase?', options: ['5%', '10%', '25%'], answer: 1 },
      { type: 'mcq', q: 'Which excess will increase?', options: ['Theft', 'Escape of water', 'Flood'], answer: 1 },
      { type: 'mcq', q: 'What could lead to a mid-term review?', options: ['Completing sprinkler recommendations', 'Changing the broker', 'Paying in advance'], answer: 0 },
    ],
  },
  {
    id: 'li04-claims-handler',
    level: 'B1',
    title: 'Claims handler on missing documents',
    intro: 'Likwidator ubezpieczyciela informuje o brakach w dokumentacji.',
    text:
      'Good afternoon, this is Marco from the claims team. I\'m following up on the theft claim from the Gliwice yard. We have received the police report, thank you. However, we still need the stock records showing the quantity before the theft, and confirmation that the gate was locked. Once we have these, we should be able to make a decision within ten working days.',
    questions: [
      { type: 'mcq', q: 'Which document has been received?', options: ['Stock records', 'Police report', 'Gate confirmation'], answer: 1 },
      { type: 'mcq', q: 'What else is needed besides stock records?', options: ['Confirmation that the gate was locked', 'A new claim form', 'Photos of the truck'], answer: 0 },
      { type: 'mcq', q: 'When can they decide?', options: ['Within ten working days of receiving the documents', 'Tomorrow', 'At renewal'], answer: 0 },
    ],
  },
  {
    id: 'li05-risk-engineer',
    level: 'B2',
    title: 'Risk engineer\'s debrief',
    intro: 'Inżynier ryzyka podsumowuje inspekcję.',
    text:
      'Overall, the site is well managed and housekeeping is good. However, I have three recommendations. First, the hot work permit system is not always followed by contractors, so this needs to be enforced. Second, the EPS sandwich panels in the old hall should be replaced or protected with sprinklers. Third, the sprinkler pump should be tested weekly, not monthly. The first one is a priority because most warehouse fires we see start with hot work.',
    questions: [
      { type: 'mcq', q: 'How many recommendations are there?', options: ['Two', 'Three', 'Four'], answer: 1 },
      { type: 'mcq', q: 'Which recommendation is the priority?', options: ['Sandwich panels', 'Hot work permits', 'Sprinkler pump testing'], answer: 1 },
      { type: 'mcq', q: 'How often should the pump be tested?', options: ['Daily', 'Weekly', 'Monthly'], answer: 1 },
    ],
  },
  {
    id: 'li06-network',
    level: 'B2',
    title: 'Network coordinator\'s instructions',
    intro: 'Koordynator programu międzynarodowego przekazuje instrukcje.',
    text:
      'Hi, it\'s Claire from Paris. Just a quick reminder about the programme renewal. Local policies must be issued by the fifteenth of January, and the premium must be collected locally, net of tax. Please send us the local policy and the tax confirmation within thirty days of inception. For Poland, the master insurer has confirmed that DIL cover can respond via the financial interest clause, but please check with your local insurer that this is acceptable.',
    questions: [
      { type: 'mcq', q: 'By when must local policies be issued?', options: ['1 January', '15 January', '30 January'], answer: 1 },
      { type: 'mcq', q: 'What must be sent within 30 days of inception?', options: ['Claims data', 'Local policy and tax confirmation', 'Survey reports'], answer: 1 },
      { type: 'mcq', q: 'How can DIL respond for Poland, according to Claire?', options: ['Via the financial interest clause', 'Via fronting', 'It cannot respond'], answer: 0 },
    ],
  },
];

/** 12 questions: 4 per level. Used once to choose the starting level for new cards. */
export const placement: PlacementQuestion[] = [
  { level: 'A2', q: 'I ___ for an insurance broker.', options: ['work', 'am work', 'working'], answer: 0 },
  { level: 'A2', q: 'When ___ the fire start?', options: ['did', 'was', 'does'], answer: 0 },
  { level: 'A2', q: 'The money the client pays for insurance is the…', options: ['claim', 'premium', 'excess'], answer: 1 },
  { level: 'A2', q: 'Please send the documents ___ Friday.', options: ['until', 'by', 'in'], answer: 1 },
  { level: 'B1', q: 'We haven\'t received the invoice ___.', options: ['already', 'yet', 'still'], answer: 1 },
  { level: 'B1', q: 'A written change to a policy is an…', options: ['endorsement', 'exclusion', 'estimate'], answer: 0 },
  { level: 'B1', q: 'Thank you for the ___.', options: ['informations', 'information', 'an information'], answer: 1 },
  { level: 'B1', q: 'The independent expert who investigates a claim is the…', options: ['underwriter', 'loss adjuster', 'policyholder'], answer: 1 },
  { level: 'B2', q: 'Theft is not covered ___ there is forced entry.', options: ['unless', 'if', 'provided'], answer: 0 },
  { level: 'B2', q: 'The claim is ___ reviewed by the insurer.', options: ['been', 'being', 'be'], answer: 1 },
  { level: 'B2', q: 'Master policy cover that pays above the local limit is…', options: ['DIC', 'DIL', 'BI'], answer: 1 },
  { level: 'B2', q: 'The insurer\'s right to recover a paid claim from a third party is…', options: ['subrogation', 'average', 'betterment'], answer: 0 },
];

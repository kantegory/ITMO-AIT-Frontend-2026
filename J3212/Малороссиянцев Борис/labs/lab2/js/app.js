'use strict';
const Store = {
  get(k, fb = null) {
    try { const r = localStorage.getItem('wl_' + k); return r !== null ? JSON.parse(r) : fb; }
    catch { return fb; }
  },
  set(k, v) { try { localStorage.setItem('wl_' + k, JSON.stringify(v)); } catch {} },
  push(k, item, fb = []) { const a = this.get(k, fb); a.unshift(item); this.set(k, a); return a; },
  remove(k, pred) { const a = this.get(k, []).filter(x => !pred(x)); this.set(k, a); return a; },
};
const UNS = 'https://images.unsplash.com/photo-';
const DESTINATIONS = [
  { id: 'paris',      emoji: '🗼', name: 'Париж',      country: 'Франция',          continent: 'Европа',  type: 'city',   typeLabel: 'Город',   days: '7 дней',  daysNum: 7,  price: '€80/д',  priceNum: 8000,  rating: 4.9, reviews: 2341, photo: UNS + '1502602898657-3e91760cbb34?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Культура', 'Романтика'],       weatherCity: 'Paris',        countryEn: 'France'    },
  { id: 'tokyo',      emoji: '🗾', name: 'Токио',       country: 'Япония',           continent: 'Азия',    type: 'city',   typeLabel: 'Город',   days: '9 дней',  daysNum: 9,  price: '€85/д',  priceNum: 8500,  rating: 4.9, reviews: 3654, photo: UNS + '1540959733332-eab4deabeeaf?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Технологии', 'Кухня'],         weatherCity: 'Tokyo',        countryEn: 'Japan'     },
  { id: 'maldives',   emoji: '🌊', name: 'Мальдивы',    country: 'Мальдивы',         continent: 'Азия',    type: 'beach',  typeLabel: 'Пляж',    days: '8 дней',  daysNum: 8,  price: '€200/д', priceNum: 20000, rating: 5.0, reviews: 3201, photo: UNS + '1514282401047-d79a71a590e8?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Пляж', 'Дайвинг'],             weatherCity: 'Male',         countryEn: 'Maldives'  },
  { id: 'patagonia',  emoji: '🏔', name: 'Патагония',   country: 'Чили / Аргентина', continent: 'Америка', type: 'nature', typeLabel: 'Природа', days: '14 дней', daysNum: 14, price: '€50/д',  priceNum: 5000,  rating: 4.9, reviews: 934,  photo: UNS + '1501854140801-50d01698950b?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Трекинг', 'Горы'],             weatherCity: 'Punta Arenas', countryEn: 'Chile'     },
  { id: 'bali',       emoji: '🏖', name: 'Бали',         country: 'Индонезия',        continent: 'Азия',    type: 'beach',  typeLabel: 'Пляж',    days: '12 дней', daysNum: 12, price: '€40/д',  priceNum: 4000,  rating: 4.8, reviews: 4201, photo: UNS + '1537996194471-e657df975ab4?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Пляж', 'Серфинг'],             weatherCity: 'Denpasar',     countryEn: 'Indonesia' },
  { id: 'iceland',    emoji: '🌋', name: 'Исландия',     country: 'Исландия',         continent: 'Европа',  type: 'nature', typeLabel: 'Природа', days: '7 дней',  daysNum: 7,  price: '€120/д', priceNum: 12000, rating: 4.9, reviews: 1543, photo: UNS + '1476610182048-b716b8518aae?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Северное сияние', 'Природа'],  weatherCity: 'Reykjavik',    countryEn: 'Iceland'   },
  { id: 'rome',       emoji: '🏛', name: 'Рим',           country: 'Италия',           continent: 'Европа',  type: 'city',   typeLabel: 'Город',   days: '5 дней',  daysNum: 5,  price: '€90/д',  priceNum: 9000,  rating: 4.7, reviews: 2109, photo: UNS + '1552832230-c0197dd311b5?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['История', 'Кухня'],            weatherCity: 'Rome',         countryEn: 'Italy'     },
  { id: 'kenya',      emoji: '🦁', name: 'Кения',         country: 'Кения',            continent: 'Африка',  type: 'nature', typeLabel: 'Природа', days: '10 дней', daysNum: 10, price: '€150/д', priceNum: 15000, rating: 4.9, reviews: 876,  photo: UNS + '1516426122078-c23e76319801?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Сафари', 'Животные'],          weatherCity: 'Nairobi',      countryEn: 'Kenya'     },
  { id: 'santorini',  emoji: '🌅', name: 'Санторини',     country: 'Греция',           continent: 'Европа',  type: 'beach',  typeLabel: 'Пляж',    days: '6 дней',  daysNum: 6,  price: '€100/д', priceNum: 10000, rating: 4.8, reviews: 2987, photo: UNS + '1533105079780-92b9be482077?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Пляж', 'Романтика'],           weatherCity: 'Santorini',    countryEn: 'Greece'    },
  { id: 'cappadocia', emoji: '🎈', name: 'Каппадокия',    country: 'Турция',           continent: 'Азия',    type: 'nature', typeLabel: 'Природа', days: '4 дня',   daysNum: 4,  price: '€50/д',  priceNum: 5000,  rating: 4.9, reviews: 2234, photo: UNS + '1541432901042-2d8bd64b4a9b?w=600&h=400&fit=crop&auto=format&q=80',  tags: ['Воздушные шары', 'Фото'],      weatherCity: 'Goreme',       countryEn: 'Turkey'    },
];

const DEST_EXTRA = {
  paris:      { season: 'Апрель–Октябрь', visa: 'Шенген ✓',    budget: '€80–150',  flight: '~4 ч. от Москвы'  },
  tokyo:      { season: 'Март–Май, Октябрь', visa: 'Безвизово', budget: '€85–160',  flight: '~9 ч. от Москвы'  },
  maldives:   { season: 'Ноябрь–Апрель', visa: 'По прилёту',   budget: '€150–300', flight: '~6 ч. от Москвы'  },
  patagonia:  { season: 'Ноябрь–Март',   visa: 'Безвизово',    budget: '€50–100',  flight: '~18 ч. от Москвы' },
  bali:       { season: 'Апрель–Октябрь', visa: 'По прилёту',  budget: '€40–80',   flight: '~11 ч. от Москвы' },
  iceland:    { season: 'Июнь–Август',   visa: 'Шенген ✓',     budget: '€120–200', flight: '~5 ч. от Москвы'  },
  rome:       { season: 'Апрель–Июнь',   visa: 'Шенген ✓',     budget: '€90–150',  flight: '~3 ч. от Москвы'  },
  kenya:      { season: 'Июль–Октябрь',  visa: 'По прилёту',   budget: '€100–200', flight: '~8 ч. от Москвы'  },
  santorini:  { season: 'Май–Октябрь',   visa: 'Шенген ✓',     budget: '€100–180', flight: '~3 ч. от Москвы'  },
  cappadocia: { season: 'Апрель–Июнь',   visa: 'Безвизово',    budget: '€50–100',  flight: '~3 ч. от Москвы'  },
};


const DEST_MAP = {
  paris:     { city: 'Париж', query: 'Paris,France', pins: [
    { name: 'eiffel',     top: '38%', left: '40%', label: 'Эйфелева башня', icon: '🗼', district: '7-й округ' },
    { name: 'louvre',     top: '28%', left: '52%', label: 'Лувр',           icon: '🏛', district: '1-й округ' },
    { name: 'notredame',  top: '44%', left: '55%', label: 'Нотр-Дам',       icon: '⛪', district: 'Île de la Cité' },
    { name: 'montmartre', top: '16%', left: '47%', label: 'Монмартр',       icon: '🎨', district: '18-й округ' },
    { name: 'luxembourg', top: '54%', left: '48%', label: 'Люксембургский сад', icon: '🌿', district: '6-й округ' },
  ]},
  tokyo:     { city: 'Токио', query: 'Tokyo,Japan', pins: [
    { name: 'sensoji',   top: '22%', left: '62%', label: 'Сэнсо-дзи',      icon: '⛩', district: 'Асакуса' },
    { name: 'tower',     top: '48%', left: '44%', label: 'Токийская башня', icon: '🗼', district: 'Минато' },
    { name: 'shibuya',   top: '58%', left: '38%', label: 'Сибуя',          icon: '🏙', district: 'Сибуя' },
    { name: 'ueno',      top: '28%', left: '50%', label: 'Парк Уэно',      icon: '🌸', district: 'Тайто' },
  ]},
  maldives:  { city: 'Мальдивы', query: 'Male,Maldives', pins: [
    { name: 'reef',      top: '35%', left: '45%', label: 'Риф',             icon: '🤿', district: 'Атолл Мале' },
    { name: 'beach',     top: '55%', left: '55%', label: 'Пляж',            icon: '🏖', district: 'Северный Мале' },
    { name: 'bungalow',  top: '42%', left: '35%', label: 'Бунгало над водой', icon: '🌅', district: 'Центральный атолл' },
  ]},
  patagonia: { city: 'Патагония', query: 'Torres del Paine,Chile', pins: [
    { name: 'torres',    top: '30%', left: '42%', label: 'Торрес-дель-Пайне', icon: '🏔', district: 'Чили' },
    { name: 'perito',    top: '50%', left: '55%', label: 'Ледник Перито-Морено', icon: '🧊', district: 'Аргентина' },
    { name: 'magellan',  top: '68%', left: '45%', label: 'Пролив Магеллана',  icon: '🐧', district: 'Пунта-Аренас' },
  ]},
  bali:      { city: 'Бали', query: 'Bali,Indonesia', pins: [
    { name: 'tanah',     top: '62%', left: '35%', label: 'Храм Танах Лот',   icon: '🛕', district: 'Табанан' },
    { name: 'tegallalang', top: '32%', left: '55%', label: 'Террасы Тегаллаланг', icon: '🌾', district: 'Убуд' },
    { name: 'kuta',      top: '70%', left: '48%', label: 'Пляж Куты',        icon: '🏄', district: 'Кута' },
    { name: 'monkeys',   top: '28%', left: '48%', label: 'Лес обезьян',      icon: '🐒', district: 'Убуд' },
  ]},
  iceland:   { city: 'Исландия', query: 'Reykjavik,Iceland', pins: [
    { name: 'aurora',    top: '25%', left: '42%', label: 'Северное сияние',  icon: '🌌', district: 'Север Исландии' },
    { name: 'lagoon',    top: '62%', left: '58%', label: 'Голубая лагуна',   icon: '♨️', district: 'Гриндавик' },
    { name: 'volcano',   top: '48%', left: '38%', label: 'Вулканы',          icon: '🌋', district: 'Центральная Исландия' },
    { name: 'thingvellir', top: '40%', left: '50%', label: 'Тингвеллир',    icon: '🏞', district: 'Юго-запад' },
  ]},
  rome:      { city: 'Рим', query: 'Rome,Italy', pins: [
    { name: 'colosseum', top: '52%', left: '54%', label: 'Колизей',         icon: '🏛', district: 'Исторический центр' },
    { name: 'trevi',     top: '38%', left: '48%', label: 'Фонтан Треви',    icon: '⛲', district: 'Треви' },
    { name: 'vatican',   top: '32%', left: '36%', label: 'Ватикан',         icon: '🕍', district: 'Ватикан' },
    { name: 'forum',     top: '56%', left: '50%', label: 'Римский форум',   icon: '🏟', district: 'Исторический центр' },
  ]},
  kenya:     { city: 'Кения', query: 'Nairobi,Kenya', pins: [
    { name: 'masai',     top: '42%', left: '45%', label: 'Масаи-Мара',      icon: '🦁', district: 'Юго-запад' },
    { name: 'amboseli',  top: '60%', left: '55%', label: 'Амбосели',        icon: '🐘', district: 'У горы Килиманджаро' },
    { name: 'nairobi',   top: '35%', left: '52%', label: 'Найроби',         icon: '🦒', district: 'Столица' },
    { name: 'mombasa',   top: '68%', left: '60%', label: 'Момбаса',         icon: '🌊', district: 'Побережье' },
  ]},
  santorini: { city: 'Санторини', query: 'Santorini,Greece', pins: [
    { name: 'oia',       top: '20%', left: '35%', label: 'Деревня Oia',     icon: '🔵', district: 'Oia' },
    { name: 'caldera',   top: '45%', left: '45%', label: 'Кальдера',        icon: '🌋', district: 'Центр острова' },
    { name: 'redbeach',  top: '68%', left: '55%', label: 'Красный пляж',    icon: '🏖', district: 'Акротири' },
  ]},
  cappadocia: { city: 'Каппадокия', query: 'Cappadocia,Turkey', pins: [
    { name: 'balloon',   top: '30%', left: '45%', label: 'Полёт на шаре',   icon: '🎈', district: 'Гёреме' },
    { name: 'underground', top: '55%', left: '52%', label: 'Подземный город', icon: '🏰', district: 'Деринкую' },
    { name: 'goreme',    top: '40%', left: '38%', label: 'Долина Гёреме',   icon: '🗿', district: 'Гёреме' },
  ]},
};

const DEST_TIPS = {
  paris:     { food: [['Лучшие круассаны', 'Boulangerie Utopie (11-й округ) — с 7 утра, стоит очереди'],['Рынок Бастилии','Чт и вс — лучший уличный завтрак в городе'],['Café de Flore','История Парижа за чашкой кофе — Belle Époque с 1887 года']], transport: [['Карта Navigo','Недельный безлимит €30 — берите сразу в аэропорту'],['CDG → Центр','RER B до Châtelet — 35 мин., €11'],['Vélib велосипеды','30 мин. бесплатно с абонементом €5/день']], hints: [['⏰','Лувр утром','Бронируйте онлайн за 2+ дня, приходите к 9:00'],['🌅','Рассвет Трокадеро','Лучший вид на башню, к 6:30 — никаких толп'],['💳','Бесплатные музеи','1-е воскресенье месяца — все национальные музеи бесплатно']]},
  tokyo:     { food: [['Рамэн Ippudo','Лучший тонкоцу рамэн — очереди с утра, оно того стоит'],['Рыбный рынок Цукидзи','Свежайшее суши прямо у прилавка, с 5 утра'],['Конбини','7-Eleven и Lawson — японский фастфуд на уровне ресторана']], transport: [['Суйка-карта','Пополни в автомате и забудь про наличные в метро'],['Автобус ночью','Метро закрывается в полночь — ночные автобусы спасут'],['JR Pass','Если едешь в Киото — окупится за первые 2 поездки']], hints: [['🌸','Сакура в Уэно','Конец марта–начало апреля, приходи в будний день'],['🎑','Меню на картинках','В большинстве кафе есть пластиковые витрины с едой'],['💴','Наличные','Многие маленькие заведения до сих пор не принимают карты']]},
  maldives:  { food: [['Рыба и кокос','Традиционный Mas Huni на завтрак — тунец с кокосом'],['Сет на закате','Каждый риф-ресторан делает ужин прямо над водой'],['Снэкбары','На острове Мале — уличная еда дешевле ресторанов в 5 раз']], transport: [['Гидросамолёт','Самый живописный трансфер в мире — 20 мин. над атоллами'],['Скоростной катер','Дешевле гидросамолёта, но дольше — до 2 часов'],['Велосипед','На каждом острове-курорте — бесплатно для гостей']], hints: [['☀️','Солнцезащита','SPF 50+ минимум — экватор не прощает'],['🤿','Своя маска','Качество снаряжения на курортах разное — лучше своё'],['💊','Dramamine','Волны при переезде на катере бывают сильными']]},
  patagonia: { food: [['Асадо','Аргентинский гриль — национальный ритуал, лучший в мире'],['Кордеро','Патагонский ягнёнок на вертеле — деликатес региона'],['Мате','Горький, но согревает в ветреной Патагонии']], transport: [['Аренда авто','Единственный способ увидеть всё — дороги пустые и красивые'],['Автобус FEDA','Пуэрто-Наталес ↔ Торрес-дель-Пайне, расписание онлайн'],['Хорошая обувь','Треккинговые ботинки — не совет, а необходимость']], hints: [['🌦','Погода каждые 10 мин','Слои одежды — базовый слой, флис, мембрана обязательны'],['🗺','Скачай офлайн-карты','Сигнала в парке почти нет'],['🎒','Лёгкий рюкзак','Ветер в Патагонии буквально сдувает тяжёлый рюкзак']]},
  bali:      { food: [['Наси горенг','Жареный рис с яйцом — национальное блюдо, везде вкусно'],['Варунг','Местные едальни у дороги — аутентично и дёшево'],['Коппи Лувак','Самый дорогой кофе в мире — попробуй хоть раз']], transport: [['Скутер','€5/день — самый удобный транспорт, права нужны'],['Годжек и Грэб','Такси-приложения дешевле, чем договариваться на месте'],['Паром на Яву','Из Гилиманук — 30 мин, €1, если хочется приключений']], hints: [['🙏','Храмовый этикет','Саронг обязателен при входе в любой храм — дадут бесплатно'],['💧','Только бутилированная','Водопроводную не пить и зубы чистить тоже'],['🌊','Сезон','Апрель–октябрь — сухой сезон, лучшее время для серфинга']]},
  iceland:   { food: [['Скир','Исландский йогурт — попробуй в любом супермаркете'],['Хот-доги у Bæjarins Beztu','Прославленный ларёк в Рейкьявике — очередь всегда'],['Ягнятина','Пасутся на воле круглый год — мясо исключительное']], transport: [['Аренда авто','4WD если едешь в горы — F-дороги открыты только летом'],['Ring Road №1','Объезжает весь остров — 1322 км, минимум 7 дней'],['Заправки','В Европе самый дорогой бензин — заправляй до полного']], hints: [['🌌','Северное сияние','Тёмное небо + солнечная активность — приложение Space Weather'],['☁️','Нет гарантий','Погода меняется за 5 минут — план Б всегда нужен'],['🛁','Голубая лагуна','Бронируй за 2–3 месяца — разлетается мгновенно']]},
  rome:      { food: [['Карбонара','Только в Риме — никаких сливок, только гуанчале'],['Трастевере','Лучший район для ужина — подальше от туристских мест'],['Джелато','Ищи artigianale — настоящее, не из ведра с горкой']], transport: [['Автобус 40/64','Ватикан ↔ Центральный вокзал — 20 мин., €1.50'],['Метро 2 линии','Достаточно для основных точек, но быстрее ходить пешком'],['Такси только официальное','Белые машины с таксометром — другие обманут']], hints: [['🗓','Бронируй заранее','Колизей и Ватикан — минимум за 2 недели'],['☀️','Сиеста реальна','С 13 до 16 многие закрыто — планируй обед'],['👟','Удобная обувь','Брусчатка везде — каблуки оставь дома']]},
  kenya:     { food: [['Нyama Choma','Жареное мясо на углях — национальная традиция'],['Угали','Кукурузная каша — основа кенийской кухни'],['Чай масала','Сладкий с молоком — пьют на завтрак и ужин']], transport: [['Сафари-джип','Только с лицензированным гидом — самостоятельно нельзя'],['Внутренние рейсы','Safarilink и AirKenya — экономят дни, летят над саванной'],['Матату','Местные маршрутки — дёшево, аутентично, немного хаотично']], hints: [['💉','Прививки','Жёлтая лихорадка обязательна, малярийные таблетки — рекомендованы'],['📷','200мм+ объектив','Животные далеко — длиннофокусный незаменим'],['🌅','Выезд на рассвете','Хищники активны утром — лучшие фото в 6–8 утра']]},
  santorini: { food: [['Фава','Жёлтый горох с Санторини — местный деликатес'],['Томаты-черри','Вулканическая почва — самые сладкие в Греции'],['Вино Ассиртико','Автохтонный сорт — сухое белое, идеально с морепродуктами']], transport: [['Атобус КTEL','Дёшево и охватывает основные точки — по расписанию'],['Квадроцикл','€25/день — идеально для узких дорожек между деревнями'],['Паром из Афин','7 часов ночью — экономит день и деньги на отель']], hints: [['🌅','Закат в Oia','Приходи за 2 часа — места у края занимают с запасом'],['🚫','Не в июль-август','Толпы невыносимы — май, июнь, сентябрь гораздо лучше'],['💧','Покупай воду','На острове мало пресной воды — привозная, дорогая']]},
  cappadocia:{ food: [['Тести-кебаб','Мясо в глиняном горшке — разбивают перед тобой за столом'],['Гёзлеме','Лепёшка с начинкой — готовят местные бабушки на рынке'],['Турецкий чай','Стаканчик чай везде бесплатно — традиция гостеприимства']], transport: [['Трансфер из Кайсери','60 км от аэропорта — шаттл €10, такси €30'],['Ренткар','Для Долины Голубятен и дальних точек — самое удобное'],['Пешком','Долина Гёреме обходится за 2–3 часа — карта у отеля']], hints: [['⏰','Шар на рассвете','4:30 подъём — но это лучший час жизни'],['🎈','Бронируй заранее','Полёты раскупают за 2–3 месяца в сезон'],['🌡','Перепад температур','Ночью -5°C даже летом — тёплая куртка обязательна']]},
};

const DEST_REVIEWS = {
  paris:     { rating: 4.9, reviews: 2341, items: [['МО','Мария О.','Июнь 2024','7 дней','★★★★★','Париж превзошёл все ожидания! Особенно Версаль в будний день и рестораны в 11-м округе.','Романтика','warm'],['АС','Андрей С.','Апрель 2024','5 дней','★★★★☆','Дорогой, но того стоит. Берите Navigo и ходите пешком — так открывается настоящий Париж.','Соло',''],['КВ','Катя В.','Сентябрь 2024','10 дней','★★★★★','Четвёртый раз — и снова влюблена! Открыла квартал Belleville с уличной едой.','Повторное посещение','warm']]},
  tokyo:     { rating: 4.9, reviews: 3654, items: [['ДК','Дмитрий К.','Март 2024','9 дней','★★★★★','Токио — это другая планета. Чистота, порядок, еда на каждом углу лучше ресторана.','Соло',''],['АН','Анна Н.','Октябрь 2024','12 дней','★★★★★','Весенняя сакура в Уэно — плакала от красоты. Везде вежливые люди.','Пара','warm'],['ИВ','Илья В.','Май 2024','7 дней','★★★★☆','Языковой барьер есть, но приложение Google Translate с камерой спасает везде.','Друзья','']]},
  maldives:  { rating: 5.0, reviews: 3201, items: [['ОП','Ольга П.','Февраль 2024','8 дней','★★★★★','Мечта сбылась. Вода настолько прозрачная, что не веришь глазам.','Медовый месяц','warm'],['СЛ','Сергей Л.','Январь 2024','10 дней','★★★★★','Дорого? Да. Стоит каждого рубля? Однозначно да.','Пара',''],['МД','Мила Д.','Декабрь 2024','6 дней','★★★★★','Бунгало над водой — лучшее что я видела. Засыпаешь под звук волн.','Романтика','warm']]},
  patagonia: { rating: 4.9, reviews: 934, items: [['РА','Роман А.','Декабрь 2023','14 дней','★★★★★','Самое дикое место на Земле. Торрес на рассвете изменил моё отношение к природе.','Трекинг',''],['НС','Наташа С.','Январь 2024','10 дней','★★★★☆','Погода непредсказуема, но если повезёт — видов нигде больше нет.','Соло','warm'],['ПВ','Павел В.','Ноябрь 2023','18 дней','★★★★★','Ледник Перито-Морено — слышишь как откалываются куски льда. Невероятно.','Пара','']]},
  bali:      { rating: 4.8, reviews: 4201, items: [['ЕК','Елена К.','Апрель 2024','12 дней','★★★★★','Бали — это духовность, красота и лучший массаж в жизни. Вернусь точно.','Соло','warm'],['АМ','Алекс М.','Июнь 2024','10 дней','★★★★☆','Рисовые террасы Тегаллаланг — фото ни передаёт и 10% реальной красоты.','Друзья',''],['ТБ','Тanya Б.','Март 2024','15 дней','★★★★★','Жила в Убуде месяц — самое продуктивное и красивое время в жизни.','Соло','warm']]},
  iceland:   { rating: 4.9, reviews: 1543, items: [['ДН','Денис Н.','Февраль 2024','7 дней','★★★★★','Северное сияние над ледником. Один из тех моментов, которые меняют жизнь.','Пара','warm'],['ВС','Вера С.','Август 2024','10 дней','★★★★★','Летом белые ночи — не спишь, просто едешь и смотришь. Феерия.','Соло',''],['КГ','Кирилл Г.','Январь 2024','5 дней','★★★★☆','Голубая лагуна переоценена, но всё остальное — нет. Природа нереальная.','Друзья','']]},
  rome:      { rating: 4.7, reviews: 2109, items: [['ЛМ','Лена М.','Май 2024','5 дней','★★★★★','Рим — вечный город. Каждый переулок — это история. Карбонара — откровение.','Пара','warm'],['ФД','Фёдор Д.','Сентябрь 2024','7 дней','★★★★☆','Жарко и туристов много, но атмосфера неповторимая. Трастевере вечером — лучшее.','Соло',''],['ИК','Ирина К.','Апрель 2024','4 дней','★★★★★','Ватикан — обязательно с аудиогидом. Без него половину упустишь.','Семья','']]},
  kenya:     { rating: 4.9, reviews: 876, items: [['ПТ','Пётр Т.','Июль 2024','10 дней','★★★★★','Миграция гну в Масаи-Мара — миллионы животных. Это нельзя забыть.','Пара','warm'],['СВ','Света В.','Август 2024','12 дней','★★★★★','Лев в трёх метрах от джипа. Сердце остановилось. Лучший день жизни.','Друзья',''],['МГ','Михаил Г.','Октябрь 2023','8 дней','★★★★☆','Дороговато, но сафари с хорошим гидом — это совсем другой опыт.','Соло','']]},
  santorini: { rating: 4.8, reviews: 2987, items: [['АЛ','Алина Л.','Июнь 2024','6 дней','★★★★★','Закат в Oia — лучшее что я видела в жизни. Фотографии не передают.','Медовый месяц','warm'],['ВП','Виктор П.','Сентябрь 2024','8 дней','★★★★★','Сентябрь — идеальное время. Нет толп, цены упали, вода тёплая.','Пара',''],['НВ','Нина В.','Май 2024','5 дней','★★★★☆','Дорогой остров, но вино Ассиртико и рыба с видом на кальдеру — бесценно.','Друзья','warm']]},
  cappadocia:{ rating: 4.9, reviews: 2234, items: [['АК','Артём К.','Май 2024','4 дней','★★★★★','Полёт на шаре на рассвете — мурашки до сих пор. Это must-do в жизни.','Пара','warm'],['ЮН','Юля Н.','Октябрь 2024','5 дней','★★★★★','Сказочный пейзаж — как будто попал на другую планету. Подземный город жутковат.','Друзья',''],['ВМ','Вася М.','Апрель 2024','4 дней','★★★★☆','Отличное место, но туристов много. Езди в мае или октябре.','Соло','']]},
};

const DEST_ATTRACTIONS = {
  paris: [
    { icon: '🗼', name: 'Эйфелева башня',        type: 'architecture', desc: 'Символ Парижа · Высота 330 м · 1889 год',              tags: ['Архитектура', 'Must-see'], rating: 5 },
    { icon: '🏛', name: 'Лувр',                   type: 'museum',       desc: 'Крупнейший музей мира · 35 000 экспонатов',            tags: ['Музей', 'Must-see'],       rating: 5 },
    { icon: '⛪', name: 'Нотр-Дам де Пари',       type: 'architecture', desc: 'Готический собор XII в. · Реставрация завершена 2024', tags: ['Архитектура'],             rating: 4 },
    { icon: '🎨', name: 'Монмартр и Сакре-Кёр',  type: 'architecture', desc: 'Богемный квартал · Лучший вид на Париж',              tags: ['Атмосфера'],               rating: 5 },
    { icon: '🌿', name: 'Люксембургский сад',     type: 'park',         desc: 'Французский парк · Фонтан · Идеален для пикника',     tags: ['Природа'],                 rating: 4 },
  ],
  tokyo: [
    { icon: '⛩', name: 'Храм Сэнсо-дзи',         type: 'architecture', desc: 'Древнейший храм Токио · Район Асакуса',               tags: ['Архитектура', 'Must-see'], rating: 5 },
    { icon: '🗼', name: 'Токийская башня',         type: 'architecture', desc: 'Символ Токио · Высота 333 м · Вид на Фудзи',          tags: ['Архитектура'],             rating: 5 },
    { icon: '🌸', name: 'Парк Уэно',              type: 'park',         desc: 'Сакура весной · Зоопарк · Несколько музеев',          tags: ['Природа', 'Музей'],        rating: 4 },
    { icon: '🏙', name: 'Сибуя',                  type: 'architecture', desc: 'Знаменитый перекрёсток · Шоппинг · Ночная жизнь',    tags: ['Атмосфера', 'Must-see'],   rating: 5 },
  ],
  maldives: [
    { icon: '🤿', name: 'Дайвинг у рифа',         type: 'nature',       desc: 'Кристальная вода · Черепахи и манты',                 tags: ['Природа', 'Must-see'],     rating: 5 },
    { icon: '🌅', name: 'Бунгало над водой',       type: 'nature',       desc: 'Закат прямо с террасы · Романтика',                   tags: ['Романтика'],               rating: 5 },
    { icon: '🏖', name: 'Пляж Мале',              type: 'park',         desc: 'Белый песок · Бирюзовая вода',                        tags: ['Пляж'],                    rating: 5 },
    { icon: '🐠', name: 'Снорклинг',              type: 'nature',       desc: 'Коралловые рифы · Тропические рыбы',                  tags: ['Природа'],                 rating: 5 },
  ],
  patagonia: [
    { icon: '🏔', name: 'Торрес-дель-Пайне',      type: 'nature',       desc: 'Национальный парк · Знаменитые гранитные башни',      tags: ['Природа', 'Must-see'],     rating: 5 },
    { icon: '🧊', name: 'Ледник Перито-Морено',   type: 'nature',       desc: 'Один из немногих растущих ледников мира',             tags: ['Природа', 'Must-see'],     rating: 5 },
    { icon: '🦅', name: 'Трекинг W',              type: 'park',         desc: 'Культовый маршрут 5 дней · Потрясающие виды',        tags: ['Трекинг'],                 rating: 5 },
    { icon: '🐧', name: 'Пролив Магеллана',        type: 'nature',       desc: 'Исторический водный путь · Колония пингвинов',        tags: ['Природа'],                 rating: 4 },
  ],
  bali: [
    { icon: '🛕', name: 'Храм Танах Лот',          type: 'architecture', desc: 'Храм на скале в море · Лучший закат',                 tags: ['Архитектура', 'Must-see'], rating: 5 },
    { icon: '🌾', name: 'Террасы Тегаллаланг',    type: 'park',         desc: 'Рисовые террасы · Уникальный пейзаж',                tags: ['Природа', 'Must-see'],     rating: 5 },
    { icon: '🏄', name: 'Пляж Куты',              type: 'nature',       desc: 'Серфинг · Закаты · Ночная жизнь',                    tags: ['Пляж', 'Серфинг'],         rating: 4 },
    { icon: '🐒', name: 'Лес обезьян Убуд',       type: 'park',         desc: 'Священный лес · 700+ макак',                          tags: ['Природа'],                 rating: 4 },
  ],
  iceland: [
    { icon: '🌌', name: 'Северное сияние',         type: 'nature',       desc: 'Лучшее время: сентябрь–март',                         tags: ['Природа', 'Must-see'],     rating: 5 },
    { icon: '♨️', name: 'Голубая лагуна',          type: 'park',         desc: 'Геотермальный курорт · Голубая вода · Релакс',        tags: ['Природа', 'Must-see'],     rating: 5 },
    { icon: '🌋', name: 'Вулканы и лавовые поля', type: 'nature',       desc: 'Активные вулканы · Ледяные шапки',                   tags: ['Природа'],                 rating: 5 },
    { icon: '🏞', name: 'Тингвеллир',             type: 'park',         desc: 'ЮНЕСКО · Разлом тектонических плит',                 tags: ['Природа'],                 rating: 5 },
  ],
  rome: [
    { icon: '🏛', name: 'Колизей',                 type: 'architecture', desc: 'Амфитеатр I в. н.э. · 50 000 зрителей',              tags: ['Архитектура', 'Must-see'], rating: 5 },
    { icon: '⛲', name: 'Фонтан Треви',            type: 'architecture', desc: 'Самый известный фонтан мира · Загадай желание',       tags: ['Архитектура', 'Must-see'], rating: 5 },
    { icon: '🕍', name: 'Ватикан',                 type: 'museum',       desc: 'Государство в городе · Сикстинская капелла',         tags: ['Музей', 'Архитектура'],    rating: 5 },
    { icon: '🏟', name: 'Римский форум',           type: 'architecture', desc: 'Центр древнего Рима · Руины республики',              tags: ['История'],                 rating: 4 },
  ],
  kenya: [
    { icon: '🦁', name: 'Масаи-Мара',             type: 'nature',       desc: 'Лучший сафари-парк Африки · Большая пятёрка',        tags: ['Природа', 'Must-see'],     rating: 5 },
    { icon: '🐘', name: 'Амбосели',               type: 'nature',       desc: 'Слоны на фоне Килиманджаро',                          tags: ['Природа', 'Must-see'],     rating: 5 },
    { icon: '🦒', name: 'Центр жирафов',           type: 'park',         desc: 'Покормить жирафа с руки · Найроби',                   tags: ['Животные'],                rating: 4 },
    { icon: '🌊', name: 'Момбаса',                type: 'nature',       desc: 'Пляжи Индийского океана · Исторический порт',         tags: ['Пляж'],                    rating: 4 },
  ],
  santorini: [
    { icon: '🔵', name: 'Деревня Oia',             type: 'architecture', desc: 'Белые домики · Самый красивый закат в мире',          tags: ['Архитектура', 'Must-see'], rating: 5 },
    { icon: '🌋', name: 'Кальдера',               type: 'nature',       desc: 'Вулканический кратер · Вид с обрыва',                 tags: ['Природа'],                 rating: 5 },
    { icon: '🏖', name: 'Красный пляж',           type: 'park',         desc: 'Уникальный красный вулканический песок',              tags: ['Пляж'],                    rating: 4 },
    { icon: '🍷', name: 'Виноградники',           type: 'park',         desc: 'Вулканическое вино · Дегустации',                     tags: ['Кухня'],                   rating: 4 },
  ],
  cappadocia: [
    { icon: '🎈', name: 'Полёт на шаре',           type: 'nature',       desc: 'На рассвете над долинами · Must-do',                  tags: ['Must-see', 'Фото'],        rating: 5 },
    { icon: '🏰', name: 'Подземный город',         type: 'museum',       desc: 'Деринкую · Древний город · 8 уровней',                tags: ['История', 'Must-see'],     rating: 5 },
    { icon: '🗿', name: 'Долина Гёреме',           type: 'nature',       desc: 'Скальные церкви · Каменные грибы',                    tags: ['Природа'],                 rating: 5 },
    { icon: '🐎', name: 'Верхом на лошади',        type: 'park',         desc: 'Прогулка по долинам на закате',                       tags: ['Природа'],                 rating: 4 },
  ],
};

const filters = { type: 'all', query: '', maxBudget: 50000, sort: 'popular' };
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
const MON = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
function todayShort() { const d = new Date(); return `${d.getDate()} ${MON[d.getMonth()]}`; }
function fmtDate(s) { if (!s) return ''; return new Date(s).toLocaleDateString('ru', {day:'numeric',month:'short'}); }
function showToast(msg, type = 'success') {
  let box = document.getElementById('toastBox');
  if (!box) {
    box = document.createElement('div'); box.id = 'toastBox';
    box.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:.5rem;';
    document.body.appendChild(box);
  }
  const C = {
    success: { bg:'#f0fdf4', brd:'#bbf7d0', ic:'✓', col:'#16a34a' },
    error:   { bg:'#fef2f2', brd:'#fecaca', ic:'✕', col:'#dc2626' },
    info:    { bg:'#f0f9ff', brd:'#bae6fd', ic:'i', col:'#0284c7' },
  };
  const c = C[type] || C.info;
  if (!document.getElementById('toastCSS')) {
    const s = document.createElement('style'); s.id = 'toastCSS';
    s.textContent = '@keyframes tIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes tOut{to{opacity:0;transform:translateY(8px)}}';
    document.head.appendChild(s);
  }
  const t = document.createElement('div');
  t.style.cssText = `background:${c.bg};border:1px solid ${c.brd};color:${c.col};padding:.6rem 1rem;border-radius:10px;font-size:.875rem;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:.5rem;min-width:200px;box-shadow:0 4px 16px rgba(0,0,0,.08);animation:tIn .22s ease forwards;`;
  t.innerHTML = `<span style="font-weight:700;">${c.ic}</span>${msg}`;
  box.appendChild(t);
  setTimeout(() => { t.style.animation = 'tOut .22s ease forwards'; setTimeout(() => t.remove(), 230); }, 2600);
}
function setLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.dataset.orig = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Загрузка...';
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.orig || 'Готово';
  }
}
function togglePassword(id, btn) {
  const el = document.getElementById(id); if (!el) return;
  const s = el.type === 'password'; el.type = s ? 'text' : 'password';
  const i = btn.querySelector('i') || btn;
  i.className = s ? i.className.replace('bi-eye','bi-eye-slash') : i.className.replace('bi-eye-slash','bi-eye');
}
function updateStrength(input, barId, labelId) {
  const bar = document.getElementById(barId), lbl = document.getElementById(labelId); if (!bar || !lbl) return;
  const v = input.value; let s = 0;
  if (v.length >= 8) s++; if (/[A-Z]/.test(v)) s++; if (/[0-9]/.test(v)) s++; if (/[^A-Za-z0-9]/.test(v)) s++;
  const L = [{w:'0%',c:'transparent',t:''},{w:'25%',c:'#ef4444',t:'Слабый'},{w:'50%',c:'#f97316',t:'Средний'},{w:'75%',c:'#eab308',t:'Хороший'},{w:'100%',c:'#22c55e',t:'Отличный'}];
  bar.style.width = L[s].w; bar.style.background = L[s].c; lbl.textContent = L[s].t;
}
function initStarRating(id) {
  const box = document.getElementById(id); if (!box) return;
  const stars = [...box.querySelectorAll('span')]; let sel = 0;
  const hl = u => stars.forEach((s,i) => { s.textContent = i <= u ? '★' : '☆'; s.style.color = i <= u ? '#f59e0b' : '#d1d5db'; });
  stars.forEach((s, i) => { s.addEventListener('mouseover', () => hl(i)); s.addEventListener('mouseout', () => hl(sel-1)); s.addEventListener('click', () => { sel = i+1; hl(i); box.dataset.rating = sel; }); });
}
function initTooltips() { document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el)); }
function initChips() {
  document.querySelectorAll('[data-chips-group]').forEach(g => {
    const multi = g.dataset.chipsGroup === 'multi';
    g.querySelectorAll('.filter-chip').forEach(c => c.addEventListener('click', () => {
      if (!multi) g.querySelectorAll('.filter-chip').forEach(x => x.classList.remove('active','selected'));
      c.classList.toggle('active'); c.classList.toggle('selected');
    }));
  });
}
function copyToClipboard(text, btn) {
  navigator.clipboard?.writeText(text).then(() => {
    const o = btn.innerHTML; btn.innerHTML = '<i class="bi bi-check2"></i>';
    setTimeout(() => btn.innerHTML = o, 2000); showToast('Ссылка скопирована!');
  });
}
function fillUserUI() {
  const initials = Auth.getInitials();
  const fullName = Auth.getFullName();
  document.querySelectorAll('.nav-avatar').forEach(el => el.textContent = initials);
  const nameEl = document.getElementById('userName');
  if (nameEl) nameEl.textContent = fullName;
  const initEl = document.getElementById('userInitial');
  if (initEl) initEl.textContent = initials;
}
function initLoginPage() {
  Auth.requireGuest();
  document.querySelectorAll('.password-toggle').forEach(btn =>
    btn.addEventListener('click', () => togglePassword(btn.dataset.target, btn))
  );
  const form = document.getElementById('loginForm');
  const submitBtn = form?.querySelector('[type="submit"]');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) { showToast('Заполните email и пароль', 'error'); return; }
    setLoading(submitBtn, true);
    try {
      const { token, user } = await API.login(email, password);
      Auth.saveSession(token, user);
      showToast(`Добро пожаловать, ${user.firstName}!`);
      setTimeout(() => window.location.replace('dashboard.html'), 500);
    } catch (err) {
      showToast(err.error || 'Неверный email или пароль', 'error');
      setLoading(submitBtn, false);
    }
  });
}
function initRegisterPage() {
  Auth.requireGuest();
  document.querySelectorAll('.password-toggle').forEach(btn =>
    btn.addEventListener('click', () => togglePassword(btn.dataset.target, btn))
  );
  const pi = document.getElementById('regPassword');
  pi?.addEventListener('input', () => updateStrength(pi, 'strengthBar', 'strengthLabel'));
  const form = document.getElementById('registerForm');
  const submitBtn = form?.querySelector('[type="submit"]');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName  = document.getElementById('lastName').value.trim();
    const email     = document.getElementById('regEmail').value.trim();
    const password  = document.getElementById('regPassword').value;
    if (!firstName || !email || !password) { showToast('Заполните все поля', 'error'); return; }
    if (password.length < 8) { showToast('Пароль — минимум 8 символов', 'error'); return; }
    setLoading(submitBtn, true);
    try {
      const { token, user } = await API.register({ firstName, lastName, email, password });
      Auth.saveSession(token, user);
      showToast(`Аккаунт создан! Добро пожаловать, ${user.firstName}!`);
      setTimeout(() => window.location.replace('dashboard.html'), 500);
    } catch (err) {
      showToast(err.error || 'Ошибка регистрации', 'error');
      setLoading(submitBtn, false);
    }
  });
}
function initDashboardPage() {
  Auth.requireAuth();
  fillUserUI();
  loadNotesFromAPI();
  document.getElementById('saveNoteBtn')?.addEventListener('click', async () => {
    const title = document.getElementById('noteTitle')?.value.trim();
    const text  = document.getElementById('noteText')?.value.trim();
    const dest  = document.getElementById('noteDestination')?.value || '';
    if (!title) { showToast('Введите заголовок', 'error'); return; }
    const btn = document.getElementById('saveNoteBtn');
    setLoading(btn, true);
    try {
      await API.createNote({ title, text, dest });
      showToast('Заметка сохранена!');
      document.getElementById('noteTitle').value = '';
      document.getElementById('noteText').value  = '';
      bootstrap.Modal.getInstance(document.getElementById('noteModal'))?.hide();
      loadNotesFromAPI();
    } catch {
      showToast('Не удалось сохранить заметку', 'error');
    } finally {
      setLoading(btn, false);
    }
  });
}
async function loadNotesFromAPI() {
  const list = document.getElementById('notesList'); if (!list) return;
  list.innerHTML = '<div style="color:var(--text-muted);font-size:.85rem;padding:.5rem 0;">Загрузка...</div>';
  try {
    const notes = await API.getNotes();
    renderNotes(notes);
  } catch {
    renderNotes([]); 
  }
}
const DEMO_NOTES_HTML = `
  <div class="note-item">
    <div class="d-flex justify-content-between mb-1">
      <strong style="font-size:.875rem;">🗼 Лучший вид на Эйфелеву башню</strong>
      <span style="font-size:.75rem;color:var(--text-light);">12 июня</span>
    </div>
    <p style="font-size:.82rem;color:var(--text-muted);margin:0;">Трокадеро на рассвете — никаких толп, золотой свет...</p>
  </div>
  <div class="note-item" style="border-left-color:var(--warm);">
    <div class="d-flex justify-content-between mb-1">
      <strong style="font-size:.875rem;">🍜 Рамэн в Киото</strong>
      <span style="font-size:.75rem;color:var(--text-light);">15 сент.</span>
    </div>
    <p style="font-size:.82rem;color:var(--text-muted);margin:0;">Ippudo на Каварамати — тонкоцу рамэн, топ...</p>
  </div>
  <div class="note-item">
    <div class="d-flex justify-content-between mb-1">
      <strong style="font-size:.875rem;">💡 Лайфхак: аэропорт CDG</strong>
      <span style="font-size:.75rem;color:var(--text-light);">10 июня</span>
    </div>
    <p style="font-size:.82rem;color:var(--text-muted);margin:0;">Терминал 2E зал L — тихий, есть душевые...</p>
  </div>`;
function renderNotes(notes) {
  const list = document.getElementById('notesList'); if (!list) return;
  if (!notes || !notes.length) { list.innerHTML = DEMO_NOTES_HTML; return; }
  list.innerHTML = notes.map(n => `
    <div class="note-item">
      <div class="d-flex justify-content-between align-items-start mb-1">
        <strong style="font-size:.875rem;">✏️ ${esc(n.title)}</strong>
        <div class="d-flex align-items-center gap-2">
          <span style="font-size:.75rem;color:var(--text-light);">${n.date || ''}</span>
          <button onclick="deleteNoteAPI(${n.id})" style="background:none;border:none;color:var(--text-light);cursor:pointer;padding:0;font-size:.9rem;line-height:1;"><i class="bi bi-x"></i></button>
        </div>
      </div>
      ${n.dest ? `<div style="font-size:.75rem;color:var(--accent);margin-bottom:.2rem;">${esc(n.dest)}</div>` : ''}
      ${n.text ? `<p style="font-size:.82rem;color:var(--text-muted);margin:0;">${esc(n.text)}</p>` : ''}
    </div>`).join('') +
    `<button class="btn-ghost-custom w-100 mt-2" style="font-size:.8rem;justify-content:center;">Все заметки (${notes.length})</button>`;
}
async function deleteNoteAPI(id) {
  try {
    await API.deleteNote(id);
    showToast('Заметка удалена', 'info');
    loadNotesFromAPI();
  } catch {
    showToast('Не удалось удалить', 'error');
  }
}
function initSearchPage() {
  Auth.requireAuth();
  fillUserUI();
  renderDestinations();
  const inp = document.getElementById('mainSearch');
  inp?.addEventListener('input', () => { filters.query = inp.value.toLowerCase().trim(); renderDestinations(); });
  const sl = document.getElementById('budgetSlider'), ve = document.getElementById('budgetVal');
  sl?.addEventListener('input', () => { filters.maxBudget = +sl.value; if (ve) ve.textContent = Number(sl.value).toLocaleString('ru') + ' ₽'; renderDestinations(); });
  document.querySelectorAll('[data-type-chip]').forEach(c => c.addEventListener('click', () => {
    document.querySelectorAll('[data-type-chip]').forEach(x => x.classList.remove('active','selected'));
    c.classList.add('active','selected'); filters.type = c.dataset.typeChip; renderDestinations();
  }));
  document.getElementById('sortSelect')?.addEventListener('change', function() { filters.sort = this.value; renderDestinations(); });
  document.getElementById('resetFilters')?.addEventListener('click', () => {
    filters.type = 'all'; filters.query = ''; filters.maxBudget = 50000; filters.sort = 'popular';
    if (inp) inp.value = ''; if (sl) { sl.value = 50000; if (ve) ve.textContent = '50 000 ₽'; }
    const ss = document.getElementById('sortSelect'); if (ss) ss.value = 'popular';
    document.querySelectorAll('[data-type-chip]').forEach((c,i) => { c.classList.toggle('active',i===0); c.classList.toggle('selected',i===0); });
    renderDestinations(); showToast('Фильтры сброшены', 'info');
  });
}
function renderDestinations() {
  const grid = document.getElementById('destGrid'), countEl = document.getElementById('destCount'); if (!grid) return;
  let list = DESTINATIONS.filter(d => {
    const effectiveType = d.type === 'beach' ? 'nature' : d.type;
    if (filters.type !== 'all' && effectiveType !== filters.type) return false;
    if (filters.query) { const q = filters.query; if (![d.name,d.country,d.continent||'',...d.tags].some(x => x.toLowerCase().includes(q))) return false; }
    if (d.priceNum > filters.maxBudget) return false;
    return true;
  });
  switch (filters.sort) {
    case 'price_asc':     list = [...list].sort((a,b) => a.priceNum - b.priceNum); break;
    case 'price_desc':    list = [...list].sort((a,b) => b.priceNum - a.priceNum); break;
    case 'rating':        list = [...list].sort((a,b) => b.rating   - a.rating);   break;
    case 'duration_asc':  list = [...list].sort((a,b) => a.daysNum  - b.daysNum);  break;
    case 'duration_desc': list = [...list].sort((a,b) => b.daysNum  - a.daysNum);  break;
    default: list = [...list].sort((a,b) => b.reviews - a.reviews);
  }
  if (countEl) countEl.textContent = list.length;
  if (!list.length) {
    grid.innerHTML = `<div class="col-12 text-center py-5" style="color:var(--text-muted);"><div style="font-size:2.5rem;margin-bottom:1rem;opacity:.3;">🔍</div><p>Ничего не найдено — попробуйте изменить фильтры</p><button class="btn-ghost-custom mt-2" style="margin:auto;" onclick="document.getElementById('resetFilters').click()">Сбросить</button></div>`;
    return;
  }
  const saved = Store.get('savedRoutes', []);
  grid.innerHTML = list.map(d => {
    const sv = saved.includes(d.id);
    return `<div class="col-sm-6 col-xl-4">
      <div class="dest-card" onclick="location.href='destination.html?id=${d.id}'">
        <div class="dest-card-img">
          <img src="${d.photo}" alt="${d.name}" loading="lazy" onerror="this.style.display='none'" />
          <div class="dest-card-overlay"></div>
          <div class="dest-card-badge"><span class="tag tag-dark" style="font-size:.72rem;">★ ${d.rating.toFixed(1)}</span></div>
        </div>
        <div class="dest-card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div><strong style="font-size:.95rem;">${d.name}</strong><div style="font-size:.78rem;color:var(--text-muted);">${d.country}</div></div>
            <div style="text-align:right;flex-shrink:0;">
              <div style="font-size:.82rem;color:var(--accent);font-weight:600;">${d.price}</div>
              <div style="font-size:.72rem;color:var(--text-light);">${d.days}</div>
            </div>
          </div>
          <div class="d-flex gap-1 flex-wrap">${[d.typeLabel,...d.tags].map(t => `<span class="tag" style="font-size:.7rem;">${t}</span>`).join('')}</div>
          <div class="d-flex gap-2 mt-1">
            <button class="btn-primary-custom flex-1" style="font-size:.78rem;padding:.35rem .5rem;justify-content:center;" onclick="event.stopPropagation();location.href='destination.html?id=${d.id}'">Открыть</button>
            <button class="${sv ? 'btn-primary-custom' : 'btn-outline-custom'}" style="font-size:.78rem;padding:.35rem .6rem;" onclick="event.stopPropagation();toggleSave(this,'${d.id}','${d.name}')" title="${sv ? 'Убрать' : 'Сохранить'}"><i class="bi bi-bookmark${sv ? '-fill' : ''}"></i></button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}
function toggleSave(btn, id, name) {
  let saved = Store.get('savedRoutes', []);
  if (saved.includes(id)) {
    saved = saved.filter(x => x !== id); btn.className = 'btn-outline-custom'; btn.innerHTML = '<i class="bi bi-bookmark"></i>';
    showToast(`${name} убран`, 'info'); API.unsaveRoute(id).catch(() => {});
  } else {
    saved.push(id); btn.className = 'btn-primary-custom'; btn.innerHTML = '<i class="bi bi-bookmark-fill"></i>';
    showToast(`${name} сохранён!`); API.saveRoute(id).catch(() => {});
  }
  Store.set('savedRoutes', saved);
}
function searchByTag(tag) { const i = document.getElementById('mainSearch'); if (i) { i.value = tag; filters.query = tag.toLowerCase(); } renderDestinations(); document.getElementById('destGrid')?.scrollIntoView({behavior:'smooth',block:'start'}); }
function initDestinationPage() {
  Auth.requireAuth();
  fillUserUI();
  const params = new URLSearchParams(window.location.search);
  const destId = params.get('id') || 'paris';
  const dest   = DESTINATIONS.find(d => d.id === destId) || DESTINATIONS[0];
  populateDestination(dest);
  document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active'); document.getElementById(btn.dataset.tab)?.classList.add('active');
  }));
  document.querySelectorAll('[data-attr-filter]').forEach(c => c.addEventListener('click', () => {
    document.querySelectorAll('[data-attr-filter]').forEach(x => x.classList.remove('active','selected'));
    c.classList.add('active','selected');
    document.querySelectorAll('.attraction-item').forEach(i =>
      i.style.display = (c.dataset.attrFilter === 'all' || i.dataset.type === c.dataset.attrFilter) ? '' : 'none'
    );
  }));
  initStarRating('starRatingModal');
  loadWeather(dest.weatherCity);
  loadCountryInfo(dest.countryEn);
}
function populateDestination(dest) {
  const extra = DEST_EXTRA[dest.id] || {};
  const typeIcons = { city: '🌍', nature: '🌿', beach: '🏖' };
  document.title = `Wanderlust — ${dest.name}`;
  const heroImg = document.getElementById('destHeroImg');
  if (heroImg) { heroImg.src = dest.photo.replace('w=600&h=400', 'w=1200&h=500'); heroImg.alt = dest.name; }
  const breadcrumb = document.getElementById('destBreadcrumb');
  if (breadcrumb) breadcrumb.innerHTML = `<a href="search.html" style="color:rgba(255,255,255,.75);">← Поиск</a> / ${dest.continent} / ${dest.country}`;
  const nameEl = document.getElementById('destName');
  if (nameEl) nameEl.textContent = dest.name;
  const ratingEl = document.getElementById('destRatingText');
  if (ratingEl) ratingEl.textContent = `${dest.rating} · ${dest.reviews.toLocaleString('ru')} отзывов`;
  const typeTag = document.getElementById('destTypeTag');
  if (typeTag) typeTag.textContent = `${typeIcons[dest.type] || '🌍'} ${dest.typeLabel}`;
  const flightTag = document.getElementById('destFlightTag');
  if (flightTag && extra.flight) flightTag.textContent = `✈ ${extra.flight}`;
  if (extra.season) { const el = document.getElementById('destInfoSeason'); if (el) el.textContent = extra.season; }
  if (extra.visa)   { const el = document.getElementById('destInfoVisa');   if (el) { el.textContent = extra.visa; el.style.color = extra.visa.includes('✓') ? 'var(--accent)' : 'inherit'; } }
  if (extra.budget) { const el = document.getElementById('destInfoBudget'); if (el) el.textContent = extra.budget; }
  const attrList = document.getElementById('attractionsList');
  if (attrList) {
    const attractions = DEST_ATTRACTIONS[dest.id] || [];
    attrList.innerHTML = attractions.map(a => `
      <div class="attraction-item" data-type="${a.type}">
        <div class="attraction-icon">${a.icon}</div>
        <div class="flex-1">
          <div class="d-flex justify-content-between align-items-start">
            <strong style="font-size:.9rem;">${esc(a.name)}</strong>
            <div class="stars" style="font-size:.78rem;">${'★'.repeat(a.rating)}${'☆'.repeat(5-a.rating)}</div>
          </div>
          <p style="font-size:.8rem;color:var(--text-muted);margin:.2rem 0 .4rem;">${esc(a.desc)}</p>
          <div class="d-flex gap-1 flex-wrap">${a.tags.map(t => `<span class="tag${t==='Must-see'?' tag-warm':''}" style="font-size:.7rem;">${t}</span>`).join('')}</div>
        </div>
      </div>`).join('');
  }
  renderMapTab(dest);
  renderTipsTab(dest);
  renderReviewsTab(dest);
}

function renderMapTab(dest) {
  const block = document.getElementById('mapTabContent'); if (!block) return;
  const m = DEST_MAP[dest.id]; if (!m) return;
  const pinsHtml = m.pins.map(p =>
    `<div class="map-pin" data-name="${p.name}" style="position:absolute;top:${p.top};left:${p.left};font-size:1.5rem;cursor:pointer;z-index:2;transition:all .3s;" data-bs-toggle="tooltip" title="${p.label}">📍</div>`
  ).join('');
  const listHtml = m.pins.map(p =>
    `<div class="attraction-item" style="padding:.7rem;cursor:pointer;" onclick="highlightMapPin('${p.name}')">
      <span style="font-size:1.2rem;">${p.icon}</span>
      <div><strong style="font-size:.85rem;">${esc(p.label)}</strong><div style="font-size:.75rem;color:var(--text-muted);">${esc(p.district)}</div></div>
    </div>`
  ).join('');
  block.innerHTML = `
    <div class="row g-4">
      <div class="col-lg-8">
        <div class="map-placeholder">
          <div class="map-grid-line" style="top:0;left:33%;width:1px;height:100%;"></div>
          <div class="map-grid-line" style="top:0;left:66%;width:1px;height:100%;"></div>
          <div class="map-grid-line" style="top:25%;left:0;width:100%;height:1px;"></div>
          <div class="map-grid-line" style="top:50%;left:0;width:100%;height:1px;"></div>
          <div class="map-grid-line" style="top:75%;left:0;width:100%;height:1px;"></div>
          ${pinsHtml}
          <div style="text-align:center;position:relative;z-index:1;">
            <div style="font-size:2.5rem;opacity:.2;margin-bottom:.5rem;">🗺</div>
            <p style="color:var(--text-muted);font-size:.9rem;margin:0;">Карта — ${esc(m.city)}</p>
            <p style="font-size:.78rem;color:var(--text-light);margin:.3rem 0 1rem;">Нажмите на маркер</p>
            <a href="https://maps.google.com/?q=${encodeURIComponent(m.query)}" target="_blank" class="btn-outline-custom" style="font-size:.82rem;padding:.4rem 1rem;"><i class="bi bi-map me-1"></i>Google Maps</a>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <h3 class="serif mb-3" style="font-size:1rem;">Точки на карте</h3>
        <div class="d-flex flex-column gap-2">${listHtml}</div>
      </div>
    </div>`;
  initTooltips();
}

function renderTipsTab(dest) {
  const block = document.getElementById('tipsTabContent'); if (!block) return;
  const t = DEST_TIPS[dest.id]; if (!t) return;
  const foodHtml = t.food.map((f,i) =>
    `<div class="note-item ${i===1?'mb-2" style="border-left-color:var(--warm)':'" '}mb-2"><strong style="font-size:.875rem;">${esc(f[0])}</strong><p style="font-size:.82rem;color:var(--text-muted);margin:.3rem 0 0;">${esc(f[1])}</p></div>`
  ).join('');
  const transHtml = t.transport.map(tr =>
    `<div class="note-item mb-2"><strong style="font-size:.875rem;">${esc(tr[0])}</strong><p style="font-size:.82rem;color:var(--text-muted);margin:.3rem 0 0;">${esc(tr[1])}</p></div>`
  ).join('');
  const hintsHtml = t.hints.map(h =>
    `<div class="col-sm-6 col-md-4"><div class="card p-3"><div style="font-size:1.3rem;margin-bottom:.4rem;">${h[0]}</div><strong style="font-size:.85rem;">${esc(h[1])}</strong><p style="font-size:.78rem;color:var(--text-muted);margin:.3rem 0 0;">${esc(h[2])}</p></div></div>`
  ).join('');
  block.innerHTML = `
    <div class="row g-4">
      <div class="col-md-6">
        <h3 class="serif mb-3" style="font-size:1rem;color:var(--accent);">🍽 Еда</h3>${foodHtml}
      </div>
      <div class="col-md-6">
        <h3 class="serif mb-3" style="font-size:1rem;color:var(--accent);">🚇 Транспорт</h3>${transHtml}
      </div>
      <div class="col-12">
        <h3 class="serif mb-3" style="font-size:1rem;color:var(--accent);">💡 Советы</h3>
        <div class="row g-3">${hintsHtml}</div>
      </div>
    </div>`;
}

function renderReviewsTab(dest) {
  const block = document.getElementById('reviewsTabContent'); if (!block) return;
  const r = DEST_REVIEWS[dest.id]; if (!r) return;
  const colors = ['var(--accent-light);color:var(--accent)', 'var(--warm-light);color:var(--warm)', '#f0f9ff;color:#0284c7'];
  const reviewsHtml = r.items.map((rv, i) => `
    <div class="review-item">
      <div class="d-flex gap-3 mb-2">
        <div class="review-avatar" style="background:${colors[i % colors.length]};">${rv[0]}</div>
        <div><strong style="font-size:.875rem;">${esc(rv[1])}</strong><div style="font-size:.75rem;color:var(--text-light);">${rv[2]} · ${rv[3]}</div></div>
        <div class="stars ms-auto" style="font-size:.82rem;">${rv[4]}</div>
      </div>
      <p style="font-size:.85rem;color:var(--text-muted);margin:0;">${esc(rv[5])}</p>
      <div class="d-flex gap-1 mt-2"><span class="tag${rv[7]==='warm'?' tag-warm':''}" style="font-size:.7rem;">${rv[6]}</span></div>
    </div>`).join('');
  const starsCount = Math.round(r.rating);
  block.innerHTML = `
    <div class="row g-4">
      <div class="col-lg-8">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="serif mb-0" style="font-size:1.1rem;">Отзывы</h2>
          <button class="btn-primary-custom" style="font-size:.82rem;padding:.4rem 1rem;" data-bs-toggle="modal" data-bs-target="#reviewModal"><i class="bi bi-pencil me-1"></i>Написать</button>
        </div>
        ${reviewsHtml}
      </div>
      <div class="col-lg-4">
        <div class="card p-4">
          <h3 class="serif mb-3 text-center" style="font-size:.95rem;">Общая оценка</h3>
          <div class="text-center mb-3">
            <div class="serif" style="font-size:3rem;color:var(--accent);line-height:1;font-weight:700;">${r.rating}</div>
            <div class="stars" style="font-size:1.1rem;">${'★'.repeat(starsCount)}${'☆'.repeat(5-starsCount)}</div>
            <div style="font-size:.78rem;color:var(--text-light);margin-top:.3rem;">${r.reviews.toLocaleString('ru')} отзывов</div>
          </div>
        </div>
      </div>
    </div>`;
}
async function loadWeather(city) {
  const block = document.getElementById('weatherBlock'); if (!block) return;
  block.innerHTML = `<div class="d-flex align-items-center gap-2" style="color:var(--text-muted);font-size:.85rem;"><span class="spinner-border spinner-border-sm"></span> Загрузка погоды...</div>`;
  try {
    const data  = await API.getWeather(city);
    const temp  = Math.round(data.main.temp);
    const feels = Math.round(data.main.feels_like);
    const desc  = data.weather[0].description;
    const icon  = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    block.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <img src="${icon}" width="56" height="56" alt="${desc}" style="flex-shrink:0;"/>
        <div>
          <div class="serif" style="font-size:1.6rem;color:var(--accent);line-height:1;">${temp > 0 ? '+' : ''}${temp}°C</div>
          <div style="font-size:.82rem;color:var(--text-muted);text-transform:capitalize;">${desc}</div>
          <div style="font-size:.75rem;color:var(--text-light);margin-top:.2rem;">
            Ощущается ${feels}°C · Влажность ${data.main.humidity}% · Ветер ${data.wind.speed} м/с
          </div>
        </div>
      </div>`;
  } catch {
    block.innerHTML = `<div style="color:var(--text-light);font-size:.82rem;"><i class="bi bi-cloud-slash me-1"></i>Погода временно недоступна</div>`;
  }
}
async function loadCountryInfo(countryName) {
  const block = document.getElementById('countryInfoBlock'); if (!block) return;
  try {
    const data  = await API.getCountryInfo(countryName);
    const cap   = data.capital?.[0] || '—';
    const pop   = (data.population / 1_000_000).toFixed(1);
    const curr  = Object.values(data.currencies || {}).map(c => `${c.name} (${c.symbol || '?'})`).join(', ') || '—';
    const lang  = Object.values(data.languages || {}).slice(0, 2).join(', ') || '—';
    block.innerHTML = `
      <div style="font-size:.82rem;display:flex;flex-direction:column;gap:.5rem;">
        <div class="d-flex justify-content-between"><span style="color:var(--text-muted);">Столица</span><strong>${esc(cap)}</strong></div>
        <div class="d-flex justify-content-between"><span style="color:var(--text-muted);">Регион</span><strong>${esc(data.region || '—')}</strong></div>
        <div class="d-flex justify-content-between"><span style="color:var(--text-muted);">Население</span><strong>${pop} млн</strong></div>
        <div class="d-flex justify-content-between"><span style="color:var(--text-muted);">Валюта</span><strong>${esc(curr)}</strong></div>
        <div class="d-flex justify-content-between"><span style="color:var(--text-muted);">Язык</span><strong>${esc(lang)}</strong></div>
      </div>`;
  } catch {  }
}
function highlightMapPin(name) { document.querySelectorAll('.map-pin').forEach(p => { const a = p.dataset.name === name; p.style.fontSize = a ? '2rem' : '1.5rem'; p.style.filter = a ? 'drop-shadow(0 0 6px #2c5f4a)' : ''; p.style.transition = 'all .3s'; }); }
const DEFAULT_TASKS = [
  {id:1,text:'Купить авиабилеты',done:true},{id:2,text:'Забронировать отель',done:false},
  {id:3,text:'Организовать трансфер',done:false},{id:4,text:'Оформить страховку',done:true},{id:5,text:'Записаться на дайвинг',done:false},
];
function initCollabPage() {
  Auth.requireAuth();
  fillUserUI();
  const ci = document.getElementById('chatInput');
  document.getElementById('sendChatBtn')?.addEventListener('click', sendChat);
  ci?.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } });
  loadTasks();
  document.getElementById('taskList')?.addEventListener('change', e => { if (e.target.classList.contains('task-checkbox')) { saveTasks(); updateTaskProgress(); } });
  document.getElementById('addTaskBtn')?.addEventListener('click', () => {
    const inp = document.getElementById('newTaskInput'); if (!inp?.value.trim()) { showToast('Введите название задачи', 'error'); return; }
    addTask(inp.value.trim()); inp.value = ''; bootstrap.Modal.getInstance(document.getElementById('addTaskModal'))?.hide(); showToast('Задача добавлена!');
  });
  document.getElementById('saveStopBtn')?.addEventListener('click', () => {
    const name = document.getElementById('stopName')?.value.trim(); if (!name) { showToast('Введите название точки', 'error'); return; }
    addStop({ name, date: document.getElementById('stopDate')?.value, note: document.getElementById('stopNote')?.value });
    ['stopName','stopDate','stopNote'].forEach(id => { if (document.getElementById(id)) document.getElementById(id).value = ''; });
    bootstrap.Modal.getInstance(document.getElementById('addStopModal'))?.hide(); showToast('Точка добавлена!');
  });
  document.getElementById('copyLinkBtn')?.addEventListener('click', function() { copyToClipboard('wanderlust.app/trip/maldives-2025-x7k', this); });
}
function loadTasks() {
  const tasks = Store.get('collab_tasks', DEFAULT_TASKS), list = document.getElementById('taskList'); if (!list) return;
  list.innerHTML = ''; tasks.forEach(t => appendTask(list, t)); updateTaskProgress();
}
function saveTasks() {
  const list = document.getElementById('taskList'); if (!list) return;
  Store.set('collab_tasks', [...list.querySelectorAll('[data-tid]')].map(el => ({ id: +el.dataset.tid, text: el.querySelector('.task-text').textContent, done: el.querySelector('input').checked })));
}
function addTask(text) {
  const tasks = Store.get('collab_tasks', DEFAULT_TASKS); const t = {id:Date.now(),text,done:false}; tasks.push(t); Store.set('collab_tasks', tasks);
  const list = document.getElementById('taskList'); if (list) { appendTask(list, t); updateTaskProgress(); }
}
function appendTask(list, task) {
  const w = document.createElement('label'); w.dataset.tid = task.id; w.style.cssText = 'display:flex;align-items:center;gap:.5rem;cursor:pointer;font-size:.875rem;padding:.25rem 0;';
  w.innerHTML = `<input type="checkbox" class="task-checkbox" ${task.done ? 'checked' : ''}><span class="task-text" style="${task.done ? 'text-decoration:line-through;color:var(--text-light);' : ''}">${esc(task.text)}</span><button onclick="removeTask(${task.id},this)" style="margin-left:auto;background:none;border:none;color:var(--text-light);cursor:pointer;padding:0;font-size:.9rem;" title="Удалить"><i class="bi bi-x"></i></button>`;
  w.querySelector('input').addEventListener('change', function() { const s = w.querySelector('.task-text'); s.style.textDecoration = this.checked ? 'line-through' : ''; s.style.color = this.checked ? 'var(--text-light)' : ''; });
  list.appendChild(w);
}
function removeTask(id, btn) { Store.remove('collab_tasks', t => t.id === id); btn.closest('[data-tid]')?.remove(); updateTaskProgress(); showToast('Задача удалена', 'info'); }
function updateTaskProgress() {
  const all = document.querySelectorAll('.task-checkbox'), done = document.querySelectorAll('.task-checkbox:checked');
  const bar = document.getElementById('taskProgressBar'), lbl = document.getElementById('taskProgressLabel'); if (!bar || !all.length) return;
  bar.style.width = Math.round(done.length / all.length * 100) + '%'; if (lbl) lbl.textContent = `${done.length} / ${all.length} выполнено`;
}
function sendChat() {
  const inp = document.getElementById('chatInput'), area = document.getElementById('chatMessages'); if (!inp?.value.trim()) return;
  const d = document.createElement('div'); d.className = 'd-flex flex-column gap-1 mt-2'; d.style.alignItems = 'flex-end';
  d.innerHTML = `<div style="font-size:.72rem;color:var(--text-light);">Вы · сейчас</div><div class="chat-msg chat-msg-out">${esc(inp.value)}</div>`;
  area.appendChild(d); inp.value = ''; area.scrollTop = area.scrollHeight;
}
function addStop({name, date, note}) {
  const tl = document.getElementById('timeline'); if (!tl) return;
  const item = document.createElement('div'); item.className = 'timeline-item';
  item.innerHTML = `<div class="timeline-dot-wrap"><div class="timeline-dot"></div><div class="timeline-line"></div></div><div><div style="font-size:.75rem;color:var(--text-light);">${date ? fmtDate(date) : 'Дата не указана'}</div><strong style="font-size:.875rem;">📍 ${esc(name)}</strong>${note ? `<p style="font-size:.8rem;color:var(--text-muted);margin:.2rem 0 0;">${esc(note)}</p>` : ''}<span class="tag tag-green mt-1" style="font-size:.7rem;">Добавлено ✓</span></div>`;
  tl.appendChild(item);
}
document.addEventListener('DOMContentLoaded', () => {
  initTooltips(); initChips();
  document.querySelectorAll('[data-action="logout"]').forEach(el =>
    el.addEventListener('click', (e) => { e.preventDefault(); Auth.logout(); })
  );
  const p = document.body.dataset.page;
  if      (p === 'login')       initLoginPage();
  else if (p === 'register')    initRegisterPage();
  else if (p === 'dashboard')   initDashboardPage();
  else if (p === 'search')      initSearchPage();
  else if (p === 'destination') initDestinationPage();
  else if (p === 'collab')      initCollabPage();
});
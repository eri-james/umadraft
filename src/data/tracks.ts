import { Track } from '../types/draft';

export const ALL_TRACKS: Track[] = [
  // TOKYO
  {
    id: 'tokyo-1400-turf',
    name: 'Tokyo 1400m (Turf)',
    nameJp: '東京 芝 1400m',
    course: 'Tokyo Racecourse',
    prefecture: 'Tokyo',
    surface: 'Turf',
    distance: 'Sprint',
    lengthMeters: 1400,
    direction: 'Counter-clockwise',
    description: 'Keio Hai Spring Cup layout with long home stretch uphill climb.'
  },
  {
    id: 'tokyo-1600-turf',
    name: 'Tokyo 1600m (Turf)',
    nameJp: '東京 芝 1600m',
    course: 'Tokyo Racecourse',
    prefecture: 'Tokyo',
    surface: 'Turf',
    distance: 'Mile',
    lengthMeters: 1600,
    direction: 'Counter-clockwise',
    description: 'Yasuda Kinen & NHK Mile Cup course. High-pace mile with demanding stretch.'
  },
  {
    id: 'tokyo-1600-dirt',
    name: 'Tokyo 1600m (Dirt)',
    nameJp: '東京 ダート 1600m',
    course: 'Tokyo Racecourse',
    prefecture: 'Tokyo',
    surface: 'Dirt',
    distance: 'Mile',
    lengthMeters: 1600,
    direction: 'Counter-clockwise',
    description: 'February Stakes course. Rare turf-start transition into dirt.'
  },
  {
    id: 'tokyo-2000-turf',
    name: 'Tokyo 2000m (Turf)',
    nameJp: '東京 芝 2000m',
    course: 'Tokyo Racecourse',
    prefecture: 'Tokyo',
    surface: 'Turf',
    distance: 'Medium',
    lengthMeters: 2000,
    direction: 'Counter-clockwise',
    description: 'Tenno Sho (Autumn) course. Starts on chute with an immediate sharp turn.'
  },
  {
    id: 'tokyo-2400-turf',
    name: 'Tokyo 2400m (Turf)',
    nameJp: '東京 芝 2400m',
    course: 'Tokyo Racecourse',
    prefecture: 'Tokyo',
    surface: 'Turf',
    distance: 'Medium',
    lengthMeters: 2400,
    direction: 'Counter-clockwise',
    description: 'Japan Cup & Tokyo Yushun (Japan Derby). The ultimate classic test of champion thoroughbreds.'
  },
  {
    id: 'tokyo-2500-turf',
    name: 'Tokyo 2500m (Turf)',
    nameJp: '東京 芝 2500m',
    course: 'Tokyo Racecourse',
    prefecture: 'Tokyo',
    surface: 'Turf',
    distance: 'Long',
    lengthMeters: 2500,
    direction: 'Counter-clockwise',
    description: 'Meguro Kinen course. Demands stamina with double passes on the uphill.'
  },

  // NAKAYAMA
  {
    id: 'nakayama-1200-turf',
    name: 'Nakayama 1200m (Turf)',
    nameJp: '中山 芝 1200m',
    course: 'Nakayama Racecourse',
    prefecture: 'Chiba',
    surface: 'Turf',
    distance: 'Sprint',
    lengthMeters: 1200,
    direction: 'Clockwise',
    description: 'Sprinters Stakes course. Lightning downhill start into a brutally steep final uphill rise.'
  },
  {
    id: 'nakayama-1200-dirt',
    name: 'Nakayama 1200m (Dirt)',
    nameJp: '中山 ダート 1200m',
    course: 'Nakayama Racecourse',
    prefecture: 'Chiba',
    surface: 'Dirt',
    distance: 'Sprint',
    lengthMeters: 1200,
    direction: 'Clockwise',
    description: 'Capella Stakes track. Fierce sprint battle on deep sandy dirt.'
  },
  {
    id: 'nakayama-1600-turf',
    name: 'Nakayama 1600m (Turf)',
    nameJp: '中山 芝 1600m',
    course: 'Nakayama Racecourse',
    prefecture: 'Chiba',
    surface: 'Turf',
    distance: 'Mile',
    lengthMeters: 1600,
    direction: 'Clockwise',
    description: 'Lord Derby Challenge Trophy. Tight outer loop favoring front-runners.'
  },
  {
    id: 'nakayama-1800-dirt',
    name: 'Nakayama 1800m (Dirt)',
    nameJp: '中山 ダート 1800m',
    course: 'Nakayama Racecourse',
    prefecture: 'Chiba',
    surface: 'Dirt',
    distance: 'Mile',
    lengthMeters: 1800,
    direction: 'Clockwise',
    description: 'March Stakes layout. High physical endurance dirt mile.'
  },
  {
    id: 'nakayama-2000-turf',
    name: 'Nakayama 2000m (Turf)',
    nameJp: '中山 芝 2000m',
    course: 'Nakayama Racecourse',
    prefecture: 'Chiba',
    surface: 'Turf',
    distance: 'Medium',
    lengthMeters: 2000,
    direction: 'Clockwise',
    description: 'Satsuki Sho (Japanese 2000 Guineas) & Hopeful Stakes. Heart-stopping uphill finish.'
  },
  {
    id: 'nakayama-2500-turf',
    name: 'Nakayama 2500m (Turf)',
    nameJp: '中山 芝 2500m',
    course: 'Nakayama Racecourse',
    prefecture: 'Chiba',
    surface: 'Turf',
    distance: 'Long',
    lengthMeters: 2500,
    direction: 'Clockwise',
    description: 'Arima Kinen Grand Prix course. 6 corners, immense strategic positioning requirement.'
  },
  {
    id: 'nakayama-3600-turf',
    name: 'Nakayama 3600m (Turf)',
    nameJp: '中山 芝 3600m',
    course: 'Nakayama Racecourse',
    prefecture: 'Chiba',
    surface: 'Turf',
    distance: 'Long',
    lengthMeters: 3600,
    direction: 'Clockwise',
    description: 'Stayers Stakes. The longest flat race in JRA, testing sheer cardiac willpower.'
  },

  // HANSHIN
  {
    id: 'hanshin-1200-turf',
    name: 'Hanshin 1200m (Turf)',
    nameJp: '阪神 芝 1200m',
    course: 'Hanshin Racecourse',
    prefecture: 'Hyogo',
    surface: 'Turf',
    distance: 'Sprint',
    lengthMeters: 1200,
    direction: 'Clockwise',
    description: 'Centaur Stakes course. Fast inner loop with intense homestretch slope.'
  },
  {
    id: 'hanshin-1600-turf',
    name: 'Hanshin 1600m (Turf)',
    nameJp: '阪神 芝 1600m',
    course: 'Hanshin Racecourse',
    prefecture: 'Hyogo',
    surface: 'Turf',
    distance: 'Mile',
    lengthMeters: 1600,
    direction: 'Clockwise',
    description: 'Oka Sho (Japanese 1000 Guineas) & Hanshin JF. Wide outer turf curve.'
  },
  {
    id: 'hanshin-1800-dirt',
    name: 'Hanshin 1800m (Dirt)',
    nameJp: '阪神 ダート 1800m',
    course: 'Hanshin Racecourse',
    prefecture: 'Hyogo',
    surface: 'Dirt',
    distance: 'Mile',
    lengthMeters: 1800,
    direction: 'Clockwise',
    description: 'Antares Stakes course. Heavy power requirement through the dirt turns.'
  },
  {
    id: 'hanshin-2000-turf',
    name: 'Hanshin 2000m (Turf)',
    nameJp: '阪神 芝 2000m',
    course: 'Hanshin Racecourse',
    prefecture: 'Hyogo',
    surface: 'Turf',
    distance: 'Medium',
    lengthMeters: 2000,
    direction: 'Clockwise',
    description: 'Osaka Hai G1 course. Demands explosive acceleration out of the final bend.'
  },
  {
    id: 'hanshin-2200-turf',
    name: 'Hanshin 2200m (Turf)',
    nameJp: '阪神 芝 2200m',
    course: 'Hanshin Racecourse',
    prefecture: 'Hyogo',
    surface: 'Turf',
    distance: 'Medium',
    lengthMeters: 2200,
    direction: 'Clockwise',
    description: 'Takarazuka Kinen Grand Prix course. Famous for dramatic clashes and stamina duels.'
  },
  {
    id: 'hanshin-3000-turf',
    name: 'Hanshin 3000m (Turf)',
    nameJp: '阪神 芝 3000m',
    course: 'Hanshin Racecourse',
    prefecture: 'Hyogo',
    surface: 'Turf',
    distance: 'Long',
    lengthMeters: 3000,
    direction: 'Clockwise',
    description: 'Hanshin Daishoten. Classic spring stayers trial.'
  },

  // KYOTO
  {
    id: 'kyoto-1200-turf',
    name: 'Kyoto 1200m (Turf)',
    nameJp: '京都 芝 1200m',
    course: 'Kyoto Racecourse',
    prefecture: 'Kyoto',
    surface: 'Turf',
    distance: 'Sprint',
    lengthMeters: 1200,
    direction: 'Clockwise',
    description: 'Keihan Hai course. Downhill sprint curving onto flat final stretch.'
  },
  {
    id: 'kyoto-1600-turf',
    name: 'Kyoto 1600m (Turf)',
    nameJp: '京都 芝 1600m',
    course: 'Kyoto Racecourse',
    prefecture: 'Kyoto',
    surface: 'Turf',
    distance: 'Mile',
    lengthMeters: 1600,
    direction: 'Clockwise',
    description: 'Mile Championship course. Iconic hill on the backstretch sets up sweeping speed.'
  },
  {
    id: 'kyoto-1800-dirt',
    name: 'Kyoto 1800m (Dirt)',
    nameJp: '京都 ダート 1800m',
    course: 'Kyoto Racecourse',
    prefecture: 'Kyoto',
    surface: 'Dirt',
    distance: 'Mile',
    lengthMeters: 1800,
    direction: 'Clockwise',
    description: 'Miyako Stakes dirt route. High-speed dirt with flat finish.'
  },
  {
    id: 'kyoto-2000-turf',
    name: 'Kyoto 2000m (Turf)',
    nameJp: '京都 芝 2000m',
    course: 'Kyoto Racecourse',
    prefecture: 'Kyoto',
    surface: 'Turf',
    distance: 'Medium',
    lengthMeters: 2000,
    direction: 'Clockwise',
    description: 'Shuka Sho course. 3-year-old fillies crown race over the inner track.'
  },
  {
    id: 'kyoto-2200-turf',
    name: 'Kyoto 2200m (Turf)',
    nameJp: '京都 芝 2200m',
    course: 'Kyoto Racecourse',
    prefecture: 'Kyoto',
    surface: 'Turf',
    distance: 'Medium',
    lengthMeters: 2200,
    direction: 'Clockwise',
    description: 'Queen Elizabeth II Cup. Autumn clash of top mares and fillies.'
  },
  {
    id: 'kyoto-3000-turf',
    name: 'Kyoto 3000m (Turf)',
    nameJp: '京都 芝 3000m',
    course: 'Kyoto Racecourse',
    prefecture: 'Kyoto',
    surface: 'Turf',
    distance: 'Long',
    lengthMeters: 3000,
    direction: 'Clockwise',
    description: 'Kikuka Sho (Japanese St. Leger). Triple Crown stamina test climbing the hill twice.'
  },
  {
    id: 'kyoto-3200-turf',
    name: 'Kyoto 3200m (Turf)',
    nameJp: '京都 芝 3200m',
    course: 'Kyoto Racecourse',
    prefecture: 'Kyoto',
    surface: 'Turf',
    distance: 'Long',
    lengthMeters: 3200,
    direction: 'Clockwise',
    description: 'Tenno Sho (Spring). Prestigious 2-mile marathon demanding supreme pace management.'
  },

  // CHUKYO
  {
    id: 'chukyo-1200-turf',
    name: 'Chukyo 1200m (Turf)',
    nameJp: '中京 芝 1200m',
    course: 'Chukyo Racecourse',
    prefecture: 'Aichi',
    surface: 'Turf',
    distance: 'Sprint',
    lengthMeters: 1200,
    direction: 'Counter-clockwise',
    description: 'Takamatsunomiya Kinen sprint G1. Long straight and steep uphill climb.'
  },
  {
    id: 'chukyo-1800-dirt',
    name: 'Chukyo 1800m (Dirt)',
    nameJp: '中京 ダート 1800m',
    course: 'Chukyo Racecourse',
    prefecture: 'Aichi',
    surface: 'Dirt',
    distance: 'Mile',
    lengthMeters: 1800,
    direction: 'Counter-clockwise',
    description: 'Champions Cup G1 dirt championship. Grueling finish requiring power.'
  },
  {
    id: 'chukyo-2000-turf',
    name: 'Chukyo 2000m (Turf)',
    nameJp: '中京 芝 2000m',
    course: 'Chukyo Racecourse',
    prefecture: 'Aichi',
    surface: 'Turf',
    distance: 'Medium',
    lengthMeters: 2000,
    direction: 'Counter-clockwise',
    description: 'Kinko Sho course. Wide galloping track with testing gradient.'
  },

  // SAPPORO
  {
    id: 'sapporo-1200-turf',
    name: 'Sapporo 1200m (Turf)',
    nameJp: '札幌 芝 1200m',
    course: 'Sapporo Racecourse',
    prefecture: 'Hokkaido',
    surface: 'Turf',
    distance: 'Sprint',
    lengthMeters: 1200,
    direction: 'Clockwise',
    description: 'Keeneland Cup. European-style cool-season grass with flat corners.'
  },
  {
    id: 'sapporo-1700-dirt',
    name: 'Sapporo 1700m (Dirt)',
    nameJp: '札幌 ダート 1700m',
    course: 'Sapporo Racecourse',
    prefecture: 'Hokkaido',
    surface: 'Dirt',
    distance: 'Mile',
    lengthMeters: 1700,
    direction: 'Clockwise',
    description: 'Elm Stakes dirt battle. Round oval track with quick acceleration.'
  },
  {
    id: 'sapporo-2000-turf',
    name: 'Sapporo 2000m (Turf)',
    nameJp: '札幌 芝 2000m',
    course: 'Sapporo Racecourse',
    prefecture: 'Hokkaido',
    surface: 'Turf',
    distance: 'Medium',
    lengthMeters: 2000,
    direction: 'Clockwise',
    description: 'Sapporo Kinen G2 super-clash. Tight flat track favoring consistent cruising speed.'
  },

  // HAKODATE
  {
    id: 'hakodate-1200-turf',
    name: 'Hakodate 1200m (Turf)',
    nameJp: '函館 芝 1200m',
    course: 'Hakodate Racecourse',
    prefecture: 'Hokkaido',
    surface: 'Turf',
    distance: 'Sprint',
    lengthMeters: 1200,
    direction: 'Clockwise',
    description: 'Hakodate Sprint Stakes. The opening sprint of summer racing.'
  },
  {
    id: 'hakodate-2000-turf',
    name: 'Hakodate 2000m (Turf)',
    nameJp: '函館 芝 2000m',
    course: 'Hakodate Racecourse',
    prefecture: 'Hokkaido',
    surface: 'Turf',
    distance: 'Medium',
    lengthMeters: 2000,
    direction: 'Clockwise',
    description: 'Hakodate Kinen. Unforgiving undulating seaside turf course.'
  },

  // NIIGATA
  {
    id: 'niigata-1000-turf',
    name: 'Niigata 1000m (Straight Turf)',
    nameJp: '新潟 芝 1000m 直線',
    course: 'Niigata Racecourse',
    prefecture: 'Niigata',
    surface: 'Turf',
    distance: 'Sprint',
    lengthMeters: 1000,
    direction: 'Straight',
    description: 'Ibis Summer Dash. The legendary straight course where runners hug the outer rail!'
  },
  {
    id: 'niigata-1600-turf',
    name: 'Niigata 1600m (Turf)',
    nameJp: '新潟 芝 1600m',
    course: 'Niigata Racecourse',
    prefecture: 'Niigata',
    surface: 'Turf',
    distance: 'Mile',
    lengthMeters: 1600,
    direction: 'Counter-clockwise',
    description: 'Niigata 2-Year-Old Stakes. Longest home straight in Japan (659m)!'
  },
  {
    id: 'niigata-2000-turf',
    name: 'Niigata 2000m (Turf)',
    nameJp: '新潟 芝 2000m',
    course: 'Niigata Racecourse',
    prefecture: 'Niigata',
    surface: 'Turf',
    distance: 'Medium',
    lengthMeters: 2000,
    direction: 'Counter-clockwise',
    description: 'Niigata Kinen. High-speed galloping showdown down the massive straight.'
  },

  // FUKUSHIMA
  {
    id: 'fukushima-1200-turf',
    name: 'Fukushima 1200m (Turf)',
    nameJp: '福島 芝 1200m',
    course: 'Fukushima Racecourse',
    prefecture: 'Fukushima',
    surface: 'Turf',
    distance: 'Sprint',
    lengthMeters: 1200,
    direction: 'Clockwise',
    description: 'Fukushima Minyu Cup sprint. Small tight circuit with undulating terrain.'
  },
  {
    id: 'fukushima-2000-turf',
    name: 'Fukushima 2000m (Turf)',
    nameJp: '福島 芝 2000m',
    course: 'Fukushima Racecourse',
    prefecture: 'Fukushima',
    surface: 'Turf',
    distance: 'Medium',
    lengthMeters: 2000,
    direction: 'Clockwise',
    description: 'Fukushima Kinen & Tanabata Sho. High tempo early corners.'
  },

  // KOKURA
  {
    id: 'kokura-1200-turf',
    name: 'Kokura 1200m (Turf)',
    nameJp: '小倉 芝 1200m',
    course: 'Kokura Racecourse',
    prefecture: 'Fukuoka',
    surface: 'Turf',
    distance: 'Sprint',
    lengthMeters: 1200,
    direction: 'Clockwise',
    description: 'Kitakyushu Kinen. Downhill launch with lightning course record times.'
  },
  {
    id: 'kokura-1800-turf',
    name: 'Kokura 1800m (Turf)',
    nameJp: '小倉 芝 1800m',
    course: 'Kokura Racecourse',
    prefecture: 'Fukuoka',
    surface: 'Turf',
    distance: 'Mile',
    lengthMeters: 1800,
    direction: 'Clockwise',
    description: 'Kokura Daishoten. Flat, high-speed pace battle.'
  },
  {
    id: 'kokura-2000-turf',
    name: 'Kokura 2000m (Turf)',
    nameJp: '小倉 芝 2000m',
    course: 'Kokura Racecourse',
    prefecture: 'Fukuoka',
    surface: 'Turf',
    distance: 'Medium',
    lengthMeters: 2000,
    direction: 'Clockwise',
    description: 'Kokura Kinen. Summer championship test over Kyushu grass.'
  },
  {
    id: 'kokura-2600-turf',
    name: 'Kokura 2600m (Turf)',
    nameJp: '小倉 芝 2600m',
    course: 'Kokura Racecourse',
    prefecture: 'Fukuoka',
    surface: 'Turf',
    distance: 'Long',
    lengthMeters: 2600,
    direction: 'Clockwise',
    description: 'Kokura Nikkei Open Long. Multi-lap stayer race.'
  },

  // OI (Tokyo City Keiba - NAR Dirt Mecca)
  {
    id: 'oi-1200-dirt',
    name: 'Oi 1200m (Dirt)',
    nameJp: '大井 ダート 1200m',
    course: 'Oi Racecourse',
    prefecture: 'Tokyo',
    surface: 'Dirt',
    distance: 'Sprint',
    lengthMeters: 1200,
    direction: 'Clockwise',
    description: 'Tokyo Sprint & JBC Sprint. Floodlit night racing mecca on thick sand.'
  },
  {
    id: 'oi-2000-dirt',
    name: 'Oi 2000m (Dirt)',
    nameJp: '大井 ダート 2000m',
    course: 'Oi Racecourse',
    prefecture: 'Tokyo',
    surface: 'Dirt',
    distance: 'Medium',
    lengthMeters: 2000,
    direction: 'Clockwise',
    description: 'Tokyo Daishoten & Teio Sho. Premier dirt classic under the night lights.'
  }
];

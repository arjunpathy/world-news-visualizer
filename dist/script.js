//
// Configuration
//

// ms to wait after dragging before auto-rotating
var rotationDelay = 3000
// scale of the globe (not the canvas element)
var scaleFactor = 0.9
// autorotation speed
var degPerSec = 6
// start angles
var angles = { x: -20, y: 40, z: 0}
// colors
var colorWater = '#3D3EBD' //'#fff'
var colorLand = '#65A172' //'#111'
var colorGraticule = 'black'
var colorCountry = '#FF875B'


//
// Handler
//

function enter(country,countryWiseNews) {
  var country = countryList.find(function(c) {
    currentCountyName =  c.name.toLowerCase() ;
    return parseInt(c.id, 10) === parseInt(country.id, 10)
  })

  let countryNewsCount = countryWiseNews.find(function (c){
    return c.name.toLowerCase() === country.name.toLowerCase() 
  });

  current.text(country && country.name || '')
  currentNewsCount.text(country && countryNewsCount.news.length || 'N/A')
}

function leave(country) {
  current.text('')
  currentNewsCount.text('')
}

//
// Variables
//

var current = d3.select('#current')
var currentNewsCount = d3.select('#currentNewsCount')
var canvas = d3.select('#globe')
var context = canvas.node().getContext('2d')
var water = {type: 'Sphere'}
var projection = d3.geoOrthographic().precision(0.1)
var graticule = d3.geoGraticule10()
var path = d3.geoPath(projection).context(context)
var v0 // Mouse position in Cartesian coordinates at start of drag gesture.
var r0 // Projection rotation as Euler angles at start.
var q0 // Projection rotation as versor at start.
var lastTime = d3.now()
var degPerMs = degPerSec / 1000
var width, height
var land, countries
var countryList
var autorotate, now, diff, roation
var currentCountry
let newsUrl = 'https://newsdata.io/api/1/news?apikey=pub_146771e0735f5f4377074d605a5e83befe95c';
let countryWiseNews;
let newsData;
let currentCountyName;
//
// Functions
//

function setAngles() {
  var rotation = projection.rotate()
  rotation[0] = angles.y
  rotation[1] = angles.x
  rotation[2] = angles.z
  projection.rotate(rotation)
}

function scale() {
  width = document.documentElement.clientWidth
  height = document.documentElement.clientHeight
  canvas.attr('width', width).attr('height', height)
  projection
    .scale((scaleFactor * Math.min(width, height)) / 2)
    .translate([width / 2, height / 2])
  render()
}

function startRotation(delay) {
  autorotate.restart(rotate, delay || 0)
}

function stopRotation() {
  autorotate.stop()
}

function dragstarted() {
  v0 = versor.cartesian(projection.invert(d3.mouse(this)))
  r0 = projection.rotate()
  q0 = versor(r0)
  stopRotation()
}

function dragged() {
  var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this)))
  var q1 = versor.multiply(q0, versor.delta(v0, v1))
  var r1 = versor.rotation(q1)
  projection.rotate(r1)
  render()
}

function dragended() {
  startRotation(rotationDelay)
}

function render() {
  context.clearRect(0, 0, width, height)
  fill(water, colorWater)
  stroke(graticule, colorGraticule)
  fill(land, colorLand)
  if (currentCountry) {
    fill(currentCountry, colorCountry)
  }
}

function fill(obj, color) {
  context.beginPath()
  path(obj)
  context.fillStyle = color
  context.fill()
}

function stroke(obj, color) {
  context.beginPath()
  path(obj)
  context.strokeStyle = color
  context.stroke()
}

function rotate(elapsed) {
  now = d3.now()
  diff = now - lastTime
  if (diff < elapsed) {
    rotation = projection.rotate()
    rotation[0] += diff * degPerMs
    projection.rotate(rotation)
    render()
  }
  lastTime = now
}

function loadData(cb) {
  d3.json('https://unpkg.com/world-atlas@1/world/110m.json', function(error, world) {
    if (error) throw error
    d3.tsv('https://gist.githubusercontent.com/mbostock/4090846/raw/07e73f3c2d21558489604a0bc434b3a5cf41a867/world-country-names.tsv', function(error, countries) {
      if (error) throw error
      cb(world, countries)
    })
  })
  newsData = [
    {
        "title": "Variaciones sobre el fútbol",
        "link": "https://www.crhoy.com/opinion/el-lector-opina/variaciones-sobre-el-futbol/",
        "keywords": [
            "El Lector Opina",
            "Opinión"
        ],
        "creator": [
            "Agencia"
        ],
        "video_url": null,
        "description": "Uno de los mejores campeonatos del mundo del fútbol que he visto a lo largo de estos años, se desarrolla mágicamente a través de la nítida imagen digital de la pantalla del televisor. Desde la bella ciudad firulística de Qatar, vivimos una fiesta deportiva donde participan 35 representaciones de todo el mundo y que ningún […]",
        "content": null,
        "pubDate": "2022-12-16 10:12:09",
        "image_url": null,
        "source_id": "crhoy",
        "country": [
            "costa Rica"
        ],
        "category": [
            "top"
        ],
        "language": "spanish"
    },
    {
        "title": "Arsenal \"can still win the Premier League\" without Gabriel Jesus, claims ex-England boss",
        "link": "https://www.irishmirror.ie/sport/soccer/arsenal-premier-league-jesus-arteta-28747611",
        "keywords": [
            "Sport"
        ],
        "creator": [
            "news@irishmirror.ie (Josh O'Brien)"
        ],
        "video_url": null,
        "description": "Arsenal saw their title hopes dented after Gabriel Jesus underwent knee surgery but Sven Goran Eriksson has claimed they can still end their long wait for a league title",
        "content": null,
        "pubDate": "2022-12-16 10:12:03",
        "image_url": "https://i2-prod.mirror.co.uk/incoming/article28325593.ece/ALTERNATES/s98/1_Gabriel-Jesus-18.jpg",
        "source_id": "irishmirror",
        "country": [
            "ireland"
        ],
        "category": [
            "sports"
        ],
        "language": "english"
    },
    {
        "title": "الركراكي: صعب أن تخسر نصف النهائي وتلعب بعدها بيومين مباراة للترتيب",
        "link": "https://www.maghress.com/kech24/838874",
        "keywords": null,
        "creator": [
            "كش24"
        ],
        "video_url": null,
        "description": "قال الناخب الوطني وليد الركراكي، إنه لأمر صعب أن تخسر نصف نهائي كأس العالم وتلعب بعدها بيومين مباراة للترتيب، مضيفا كنت أرغب في لعب النهائي والفوز باللقب لأن التاريخ يتذكر فقط الفائزين. وأضاف الركراكي في الندوة التي تسبق المباراة، \"كنا نحس بأننا أقرب إلى بلوغ النهائي، لكن الواقع هو أننا أقصينا، وهو (...)",
        "content": null,
        "pubDate": "2022-12-16 10:11:39",
        "image_url": "https://images2.maghress.com/kech24/838874/thumb",
        "source_id": "maghress",
        "country": [
            "morocco"
        ],
        "category": [
            "top"
        ],
        "language": "arabic"
    },
    {
        "title": "CLIA Winter Dinner at The Dean",
        "link": "https://ittn.ie/news/clia-winter-dinner-at-the-dean/",
        "keywords": [
            "News",
            "Andy Harmer",
            "Avalon",
            "Celebrity",
            "CLIA",
            "msc",
            "Oceania",
            "princess",
            "RCCL",
            "Winter Dinner"
        ],
        "creator": [
            "Emer Roche"
        ],
        "video_url": null,
        "description": "The CLIA Winter Dinner took place on Monday evening in The Dean on Harcourt Street. It was an elegant evening celebrating the success of the 2022 market. Representatives from MSC, […] The post CLIA Winter Dinner at The Dean appeared first on ittn.ie.",
        "content": "The CLIA Winter Dinner took place on Monday evening in The Dean on Harcourt Street. It was an elegant evening celebrating the success of the 2022 market. Representatives from MSC, RCCL, Celebrity, Avalon, Princess and Oceania said a few words between courses. Speaking at the event, Andy Harmer, managing director for CLIA UK & Ireland, said: “The Ireland market and its trade partners are of critical importance to the cruise industry.  “We previously saw a steep increase in Irish holidaymakers taking a holiday at sea, and are already well on the way to those numbers being surpassed in future. Thanks to the large deployment of ships offering a choice of itineraries in Europe and the Caribbean, these destinations remain the most popular options.  “Major cruise lines continue to demonstrate their confidence in the local market by calling at ports in Dublin and beyond, which is key for inbound tourism too. “We have always had fantastic support from Irish agents and the opportunity to further grow their businesses through selling cruises is clear.   “We’re looking forward to seeing the positive momentum continue into 2023. Huge thanks to everyone in the trade who has contributed to this success.” The post CLIA Winter Dinner at The Dean appeared first on ittn.ie.",
        "pubDate": "2022-12-16 10:11:34",
        "image_url": null,
        "source_id": "ittn",
        "country": [
            "ireland"
        ],
        "category": [
            "world"
        ],
        "language": "english"
    },
    {
        "title": "وليد: مباراتنا ضد منتخب كرواتيا ستكون معقدة ومهمة بالنسبة لنا لندخل التاريخ مجددا",
        "link": "https://www.almountakhab.com/node/1177845",
        "keywords": null,
        "creator": [
            "الدوحة: جلول التويجر"
        ],
        "video_url": null,
        "description": "قال الناخب الوطني وليد",
        "content": "قال الناخب الوطني وليد",
        "pubDate": "2022-12-16 10:11:05",
        "image_url": "https://cdn.almountakhab.com/uploads/node/images/2022/12/FiRdw-nWAAAgBf7.jpeg",
        "source_id": "almountakhab",
        "country": [
            "morocco"
        ],
        "category": [
            "sports"
        ],
        "language": "arabic"
    },
    {
        "title": "Number of UK sectors with falling output highest since May 2020",
        "link": "https://www.manufacturing-supply-chain.com/number-of-uk-sectors-with-falling-output-highest-since-may-2020-2/",
        "keywords": [
            "Business",
            "Economy",
            "Industrial",
            "Manufacturing",
            "Research",
            "Trade"
        ],
        "creator": [
            "mike"
        ],
        "video_url": null,
        "description": "Hospitality and tourism businesses saw the fastest operating cost rises of any UK sector in November, as firms faced sharp increases in the price of energy, food, and drink, according The post Number of UK sectors with falling output highest since May 2020 first appeared on Manufacturing & Supply Chain.",
        "content": "Hospitality and tourism businesses saw the fastest operating cost rises of any UK sector in November, as firms faced sharp increases in the price of energy, food, and drink, according to the latest Lloyds Bank UK Sector Tracker. The sector – which includes pubs, hotels and restaurants – faced higher inflationary pressures than any of the other 13 UK sectors monitored, registering 86.1 on the Tracker’s measure of cost inflation. British car makers (82.7) and technology manufacturers (83.0) also faced significant price rises between October and November, driven by ongoing supply chain problems, particularly for key electrical items such as semiconductors. The Tracker’s Composite Input Cost Index – which measures cost rises across both manufacturing and services sectors – showed that, overall, cost inflation across the economy accelerated month-on-month (76.7 vs. 75.7 in October). In November, the UK had the sharpest rate of cost inflation of all 13 countries monitored by the Tracker – a position it has held more times (six) than any of its global counterparts over the past 12 months. However, the number of sectors recording a rise in output rose to three out of the 14 sectors monitored by the Tracker, up from two in October. Jeavon Lolay, Head of Economics and Market Insight, Lloyds Bank Commercial Banking. Food and drink manufacturing posted the fastest rate of output growth (56.5), although the pace of growth slowed marginally compared to October (58.4). Healthcare (54.4 in November vs. 48.1 in October) and industrial services (51.3 vs. 49.9) also saw output grow. A reading above 50.0 on the Tracker indicates expansion, while a reading below 50.0 indicates contraction. Meanwhile, 12 of the 14 UK sectors saw demand fall in November due to the impact of the rising cost of living on households and businesses. In response to the panel survey, the number of firms reporting falling sales due to price increases rose sharply reaching 15 times the long-term average, up from 10 times higher in October. November’s result was the second highest level for this measure on record and only marginally below the high registered in April 2022, in the immediate aftermath of the start of the war in Ukraine. Businesses were, overall, still growing their workforces with seven of 14 sectors showing a rise in staffing levels. However, rising costs and weaker demand meant the rate that companies are adding staff fell to its slowest pace since February 2021, when the UK was in lockdown. Against this backdrop, the number of UK companies that said they were facing challenges to retain staff in November rose to 1.90 times the long-term average – the highest level since March 2009 – up from 0.97 times the average in October. Jeavon Lolay, Head of Economics and Market Insight at Lloyds Bank Corporate and Institutional Banking, said: “While silver linings can be found within the latest official GDP, employment and inflation data, the broader UK backdrop remains one of slowing economic activity amid elevated price pressures and low confidence. Our report highlights that demand and price conditions remain very challenging across almost all sectors of the economy. “This poses major challenges for policymakers, particularly the Bank of England as it considers how much higher borrowing costs need to rise to get inflation back to two per cent on a sustainable basis, with some members fearing more persistent price pressures and others the risks of over-tightening. However, voting for another sizeable rate hike appears the most likely course of action.” Scott Barton, Managing Director, Lloyds Bank Corporate and Institutional Banking, added:“Confidence is low among businesses, with firms understandably concerned about future economic conditions. Last month’s Autumn Statement will have given management teams some reassurance when it comes to future fiscal direction. However, the wider economic landscape makes it difficult for them to accurately plan and allocate resources. “In such uncertain times, it will be critical to regularly review the factors that are fundamental to resilience and performance to deliver a firm base for long-term success.”The post Number of UK sectors with falling output highest since May 2020 first appeared on Manufacturing & Supply Chain.",
        "pubDate": "2022-12-16 10:10:54",
        "image_url": null,
        "source_id": "manufacturing",
        "country": [
            "ireland"
        ],
        "category": [
            "top"
        ],
        "language": "hindi"
    },
    {
        "title": "Snøft … Studie giver forklaring på, hvorfor du bliver lettere syg i kulden",
        "link": "https://www.berlingske.dk/samfund/snoeft-...-studie-giver-forklaring-paa-hvorfor-du-bliver-lettere-syg-i?referrer=RSS",
        "keywords": [
            "Samfund"
        ],
        "creator": null,
        "video_url": null,
        "description": "I 15 minutter blev undersøgelsens deltagere udsat for lave temperaturer. Nu mener forskerne bag at have en forklaringen på, hvorfor vi er mere plaget af sygdom på denne tid af året.",
        "content": null,
        "pubDate": "2022-12-16 10:10:53",
        "image_url": "https://berlingske.bmcdn.dk/media/cache/resolve/image_200x112/image/162/1626001/24290232-.jpg",
        "source_id": "berlingske",
        "country": [
            "denmark"
        ],
        "category": [
            "top"
        ],
        "language": "danish"
    },
    {
        "title": "CAMEROUN :: Les chefs traditionnels ADIÈ d’Edéa militent pour la pacification de leur communauté. :: CAMEROON",
        "link": "https://www.camer.be/93404/11:1/cameroun-les-chefs-traditionnels-adie-dedea-militent-pour-la-pacification-de-leur-communaute-cameroon.html",
        "keywords": [
            "SOCIETE"
        ],
        "creator": [
            "TMP"
        ],
        "video_url": null,
        "description": "L'APPEL DES CHEFS \"ADIE\" POUR LA PACIFICATION DE L'ENVIRONNEMENT SOCIAL, LA REDYNAMISATION DES ACQUIS SOCIAUX, TRADITIONNELS ET CULTURELS POUR UNE MEILLEURE INT...",
        "content": "L'APPEL DES CHEFS \"ADIE\" POUR LA PACIFICATION DE L'ENVIRONNEMENT SOCIAL, LA REDYNAMISATION DES ACQUIS SOCIAUX, TRADITIONNELS ET CULTURELS POUR UNE MEILLEURE INTÉGRATION DES COMMUNAUTÉS VIVANT À EDÉA C'est le message de la rencontre qui les  a réunis, ce 09 décembre 2022, dans le cadre  de l'Amicale des Chefs traditionnels des Villages ADIE ( ACTRAVIA) dans le village APOUH, situé à une vingtaine de kilomètres de la ville d'Édéa, département de la Sanaga-Maritime. Il s'est agi au cours de cette réunion de présenter le rapport diagnostic de la tournée des chefs auprès des différentes communautés et en particulier, celles des vingt-deux (22) villages du canton ADIE, et lancer l'appel  pour la restitution dudit rapport le 17 décembre 2022 dans le village LOM EDEA, auprès du peuple ADIE, dans ses diverses couches sociales. La finalité de cette action citoyenne des Chefs ADIE est de rassembler ce qui est épars et regarder dans la même direction pour reconstruire une dynamique du vivre ensemble entre toutes les communautés vivant dans la ville lumière et les autres villages environnants. Il faut la paix à Edéa pour corroborer avec la pensée du Le Dalai Lama  « La paix dans le monde doit trouver son origine et se développer depuis la paix intérieure. La paix n’est pas l’absence de violence. La paix est la manifestation de la compassion humaine. » ",
        "pubDate": "2022-12-16 10:10:46",
        "image_url": "https://www.camer.be/storage/photos/26/camEroun/Chefs-traditionnels161222500.jpg",
        "source_id": "camer_be",
        "country": [
            "cameroon"
        ],
        "category": [
            "top"
        ],
        "language": "french"
    },
    {
        "title": "ALLEMAGNE :: Merkel devient un symbole de l’hypocrisie de l’Occident :: GERMANY",
        "link": "https://www.camer.be/93405/6:1/allemagne-merkel-devient-un-symbole-de-lhypocrisie-de-loccident-germany.html",
        "keywords": [
            "POLITIQUE"
        ],
        "creator": [
            "Alexandre Lemoine"
        ],
        "video_url": null,
        "description": "Les révélations de Angela Merkel concernant les accords de Minsk ont connu un nouveau développement. Elle a été critiquée d’Autriche à la Chine. Que reproche-t-...",
        "content": "Les révélations de Angela Merkel concernant les accords de Minsk ont connu un nouveau développement. Elle a été critiquée d’Autriche à la Chine. Que reproche-t-on à l’ancienne chancelière allemande et pourquoi sa déclaration aura des conséquences non seulement pour l’Europe, mais également pour le monde entier?  L’ancien vice-chancelier autrichien Heinz-Christian Strache a déclaré cette semaine que les propos  d’Angela Merkel sur les véritables objectifs des accords de Minsk étaient effrayants et sapaient la confiance envers les déclarations des politiques européens. « C’es effrayant la franchise avec laquelle Mme Merkel en parle. De cette manière, nous détruisons toute base de confiance », a indiqué l’homme politique autrichien.  De son côté, le journal chinois Global Times fait remarquer que les déclarations de Angela Merkel sur les accords de Minsk témoignent de l’attitude hypocrite de l’Occident envers la Russie. Cette situation a montré également que certains pays occidentaux, notamment les États-Unis, ne respectaient pas du tout leurs engagements et pouvaient très facilement se rétracter.  Sachant que le président russe Vladimir Poutine avait précédemment noté que la déclaration de l’ancienne chancelière était décevante et ne faisait que confirmer le bien-fondé de l’opération spéciale. Angela Merkel estime que plus tôt les pays de l’Otan n’auraient pas été capables d’apporter à l’Ukraine leur soutien au même niveau qu’aujourd’hui.  « De cette manière, Merkel a dévoilé au monde entier des preuves directes que l’Occident a saboté les accords de Minsk. Certains le comprenaient déjà, mais à présent il est possible de se référer à la source, car Merkel était complice de ce sabotage », a déclaré le sénateur russe Andreï Klimov.  « Certes, à présent elle s’explique en disant qu’on lui avait empêché de mener à terme le processus de paix en Ukraine. Mais de facto, en démissionnant, Merkel a reconnu que dans l’ensemble les accords étaient considérés comme une couverture pour préparer l’Ukraine à une guerre contre la Russie », a-t-il ajouté.  En même temps, le politologue allemand Alexander Rahr pense qu’il faudrait préciser la véracité des propos de Mme Merkel auprès du président français Emmanuel Macron, « mais Paris garde obstinément le silence ».  D’après l’expert, l’ancienne chancelière tente de justifier sa politique vis-à-vis de la Russie car Mme Merkel continue de se faire critiquer pour sa politique trop souple envers Moscou.  « Mais en réalité, Merkel a simplement tout remis à sa place. L’objectif de l’Occident en 2014 était d’empêcher la Russie de remporter une victoire géopolitique dans la bataille pour l’Ukraine. L’Europe n’avait aucune intention de reconnaître l’autonomie du Donbass, même si elle percevait avec compréhension l’histoire concernant la Crimée », a déclaré Alexander Rahr.  « En cas d’une confirmation réelle que les accords de Minsk étaient nécessaires pour armer Kiev en douce, ce n’est pas seulement la Russie qui regarderait l’Allemagne de travers, mais aussi la Chine, l’Inde et d’autres pays. Cela confirmerait la perfidie de la diplomatie européenne », affirme le politologue.  D’un autre côté, estiment les experts, les révélations de Mme Merkel inciteront les pays d’Asie à changer d’approche dans les pourparlers avec les dirigeants occidentaux. Premièrement, c’est dû au risque de fuites indésirables d’informations dans les médias, comme cela fut le cas notamment avec le président français Emmanuel Macron et le premier ministre canadien Justin Trudeau. Deuxièmement, l’arrogance en soi de l’Occident fatigue non seulement la Russie, mais également la Chine.  La crise de confiance envers les pays occidentaux existe depuis longtemps. Nous voyons à présent qu’elle est parfaitement réelle. De telle « révélations » se reflèteront sur l’interactions d’autres pays avec l’Occident. Certes, les affaires sont menées par nécessité et non en fonction des qualités morales de l’autre partie. Mais désormais les négociations seront menées avec une plus grande prudence.",
        "pubDate": "2022-12-16 10:10:46",
        "image_url": "https://www.camer.be/uploads/photos/MoNde/Angela_Merkel22032020.jpg",
        "source_id": "camer_be",
        "country": [
            "cameroon"
        ],
        "category": [
            "top"
        ],
        "language": "french"
    },
    {
        "title": "مجلس النواب ينعى الشهيد العقيد الدلابيح",
        "link": "https://s.alwakeelnews.com/607230",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "الوكيل الاخباري - نعى رئيس وأعضاء مجلس النواب الشهيد العقيد عبدالرزاق عبدالحافظ الدلابيح نائب مدير شرطة محافظة معان، والذي استشهد في منطقة الحسينية في محافظة معان.",
        "content": null,
        "pubDate": "2022-12-16 10:10:44",
        "image_url": null,
        "source_id": "alwakeelnews",
        "country": [
            "jordan"
        ],
        "category": [
            "top"
        ],
        "language": "arabic"
    },
    {
        "title": "إقامة صلاة الغائب في جميع مساجد المملكة على روح الشهيد الدلابيح",
        "link": "https://s.alwakeelnews.com/607231",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "الوكيل الإخباري - قررت وزارة الأوقاف إقامة صلاة الغائب في جميع مساجد المملكة على روح الشهيد العقيد عبدالرزاق الدلابيح بعد صلاة الجمعة.",
        "content": null,
        "pubDate": "2022-12-16 10:10:44",
        "image_url": null,
        "source_id": "alwakeelnews",
        "country": [
            "jordan"
        ],
        "category": [
            "top"
        ],
        "language": "arabic"
    },
    {
        "title": "إقامة صلاة الغائب على الشهيد الدلابيح بمساجد الأردن",
        "link": "https://www.khaberni.com/news/557174",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "خبرني – قررت وزارة الأوقاف اقامة صلاة الغائب في جميع مساجد المملكة على روح العقيد الشهيد عبدالرزاق الدلابيح بعد صلاة الجمعة.",
        "content": null,
        "pubDate": "2022-12-16 10:10:44",
        "image_url": null,
        "source_id": "khaberni",
        "country": [
            "jordan"
        ],
        "category": [
            "top"
        ],
        "language": "arabic"
    },
    {
        "title": "Irish Government launches Construct Innovate",
        "link": "https://www.manufacturing-supply-chain.com/irish-government-launches-construct-innovate/",
        "keywords": [
            "Business",
            "Construction",
            "Development",
            "Digital",
            "Economy",
            "Industrial",
            "Innovation",
            "Research",
            "Sustainability",
            "Technology"
        ],
        "creator": [
            "mike"
        ],
        "video_url": null,
        "description": "Construct Innovate, a new Enterprise Ireland Technology Centre hosted at University of Galway, has been officially launched. The Centre has been established with funding of €5 million, over 5 years, The post Irish Government launches Construct Innovate first appeared on Manufacturing & Supply Chain.",
        "content": "Construct Innovate, a new Enterprise Ireland Technology Centre hosted at University of Galway, has been officially launched. The Centre has been established with funding of €5 million, over 5 years, to accelerate research and innovation in the construction sector and put the built environment industry at the cutting-edge of developments by utilising the strengths of a network of government, industry and academia. Construct Innovate will be at the forefront of initiatives to meet the demands of major building and investment programmes as part of Project Ireland 2040 and the National Development Plan 2021-2030; Housing for All; and the Climate Action Plan. Construct Innovate is the ninth Enterprise Ireland Technology Centre. The establishment of a Construction Technology Centre to support the technology transformation of the entire construction and built environment sector will build on the successful experience of EI/IDA supported Technology Centres and their proven ability to solve sector wide technology and innovation challenges and deliver timely economic impact. A team of researchers from across the Construction Innovate consortium will offer expertise in digital adoption, modern methods of construction and sustainability, providing recommendations to industry on best practice. Their work will be organised under five pillars to address the following urgent areas – productivity; affordability and cost; quality and safety; sustainability; skills and training; and collaboration. It will be built around industry-led, open innovation and collaborative research, with the construction sector using Construct Innovate to access the best available expertise. This approach will enable the construction sector to tap into the innovative responses which are needed to support rapid transformation to meet demand, in terms of scale, quality, speed and efficiency. Construct Innovate will also provide secondment opportunities for innovative research and academics across the consortium. In line with the Government’s Housing for All strategy, Construct Innovate has been tasked with prioritising research and innovation in the housing sector in its first three years. Part of this will allow for testing; trial builds; building systems analysis; workforce upskilling and developing capacity with all of these opportunities being combined with the need to pursue the highest environmentally-friendly standards in materials and building systems. Professor Jamie Goggins and Dr Magdalena Hajdukiewicz, University of Galway academics and Directors of Construct Innovate, said: “Our vision for Construct Innovate is to provide a platform for collaboration to all stakeholders in the construction industry. A platform that empowers industry to take ownership of research and innovation and supports a modernised, resilient and sustainable sector. A key part of our work will be listening to industry – as they identify challenges and we will work together on this innovation journey.” Joe Healy, Divisional Manager, Research and Innovation Enterprise Ireland, said: “Research, development and innovation are key components of thriving businesses and are essential to maintaining a competitive edge in the market. Technology Centres are making a measurable impact to companies in sectors like food, pharmaceuticals and microelectronics, manufacturing, data analytics and learning technologies. Today’s launch comes at a crucial time when the ask on the industry to ramp up on build quality, quantity and delivery times is a top priority, all the while supporting a strict sustainability and carbon neutral agenda. A world class model of knowledge sharing and collaboration through this hub will offer innovative solutions to support the technology transformation of the construction and built environment sector.” Ireland’s Construction Sector In 2021, Ireland’s population reached 5 million mark for the first time since the 1850s. Some estimates, including Project Ireland 2040, predict that we will have an extra million people within the next 20 years. To service the current population and the projected 20% increase, the Government is investing billions (€165bn National Development Plan) – substantially above the EU average – building new homes, roads, public transport, schools, hospitals and other vital infrastructure. The Irish construction sector employs over 171,000 people which is 6.7% of total employed in the economy and represents 2% of GDP. The Irish construction sector is a major driver of economic activity. It provides the social, economic, and productive infrastructure required to sustain economic growth and competitiveness and attract foreign direct investment. Enterprise Ireland’s High-Tech Construction and Housing team works with a portfolio of 450 client companies that achieved exports of €2.89bn in 2021, up 24% on the previous year. Enterprise Ireland’s Agency Mandate has been expanded to allow a suite of existing research, innovation, lean, digitalisation and green offers to be available to domestic residential construction sector. This ‘Built To Innovate’ campaign was launched on March 21st 2022. Despite having some high performing companies, the construction industry overall has major challenges including fragmentation, boom-bust cycles and comparatively low productivity compared to other sectors and other countries. Working with the Government’s Construction Sector Group, and supporting the implementation of Housing for All, Enterprise Ireland is leading the drive for productivity and innovation through the establishment of the Construction Technology Centre which will sit alongside a Build Digital Centre (est. 2021), the forthcoming Demonstration Park at Mount Lucas, and other related initiatives. Further information Enterprise Ireland Technology Centres and https://www.constructinnovate.ie/ CAPTION: Pictured (from left): Prof Jamie Goggins, Co-Director of Construct Innovate; Joe Healy Divisional Manager Enterprise Ireland; and Dr Magdalena Hajdukiewicz, Co-Director of Construct Innovate.The post Irish Government launches Construct Innovate first appeared on Manufacturing & Supply Chain.",
        "pubDate": "2022-12-16 10:10:31",
        "image_url": null,
        "source_id": "manufacturing",
        "country": [
            "ireland"
        ],
        "category": [
            "top"
        ],
        "language": "hindi"
    },
    {
        "title": "Kazakhstan, China to launch new flight route",
        "link": "https://en.trend.az/casia/kazakhstan/3682742.html",
        "keywords": [
            "Kazakhstan"
        ],
        "creator": null,
        "video_url": null,
        "description": null,
        "content": null,
        "pubDate": "2022-12-16 10:10:01",
        "image_url": null,
        "source_id": "trendaz",
        "country": [
            "azerbaijan"
        ],
        "category": [
            "top"
        ],
        "language": "Azerbaijani"
    },
    {
        "title": "Швейцарская компания Holcim Azerbaijan выпустила свой первый зеленый цемент.",
        "link": "https://news.day.az/society/1520116.html",
        "keywords": [
            "Общество"
        ],
        "creator": null,
        "video_url": null,
        "description": null,
        "content": null,
        "pubDate": "2022-12-16 10:10:00",
        "image_url": null,
        "source_id": "day",
        "country": [
            "azerbaijan"
        ],
        "category": [
            "top"
        ],
        "language": "russian"
    },
    {
        "title": "\"Tərtər işi\" - işgəncə əmri verənlər cəzalandırılmalıdır! - MM-də TƏLƏB",
        "link": "https://publika.az/news/sosial/426715.html",
        "keywords": [
            "Sosial"
        ],
        "creator": null,
        "video_url": null,
        "description": null,
        "content": null,
        "pubDate": "2022-12-16 10:10:00",
        "image_url": null,
        "source_id": "publika",
        "country": [
            "azerbaijan"
        ],
        "category": [
            "top"
        ],
        "language": "Azerbaijani"
    },
    {
        "title": "With MoU, Anwar set to have 148 MPs on his side for confidence vote",
        "link": "https://www.theborneopost.com/2022/12/16/with-mou-anwar-set-to-have-148-mps-on-his-side-for-confidence-vote/",
        "keywords": [
            "Nation",
            "anwar ibrahim",
            "MoU",
            "support",
            "agreement"
        ],
        "creator": null,
        "video_url": null,
        "description": "PUTRAJAYA (Dec 16): The memorandum of understanding for the unity government should allow Prime Minister Datuk Seri Anwar Ibrahim to establish supermajority support during the confidence vote in Parliament next week. According to the MoU, all the signatory coalitions and parties must support Anwar in all matters of confidence and supply as well as those [...] The post With MoU, Anwar set to have 148 MPs on his side for confidence vote appeared first on Borneo Post Online.",
        "content": "According to the MoU, all the signatory coalitions and parties must support Anwar in all matters of confidence and supply as well as those that could have a bearing on the legitimacy of his administration. – Bernama photo PUTRAJAYA (Dec 16): The memorandum of understanding for the unity government should allow Prime Minister Datuk Seri Anwar Ibrahim to establish supermajority support during the confidence vote in Parliament next week. According to the MoU, all the signatory coalitions and parties must support Anwar in all matters of confidence and supply as well as those that could have a bearing on the legitimacy of his administration. The coalitions and parties were responsible for ensuring their federal lawmakers abided by the MoU, and any MP who did not comply would be considered as having resigned from his party, effectively triggering the anti-hopping law. According to the agreement, the supporting lawmakers included all those except from the parties in Perikatan Nasional and Pejuang, which amounted to 148 out of the 222 in Parliament. After he was appointed as the prime minister, Anwar pledged to table a motion of confidence during the December 19 parliamentary meeting to establish his majority to lead the government. Anwar was named the prime minister of a national unity government after his Pakatan Harapan coalition won 82 seats in the 15th general election, which was the most by any single group or party but still short of the 112 needed for a simple majority. – Malay Mail Facebook Messenger Twitter WhatsApp Email Print The post With MoU, Anwar set to have 148 MPs on his side for confidence vote appeared first on Borneo Post Online.",
        "pubDate": "2022-12-16 10:09:53",
        "image_url": null,
        "source_id": "theborneopost",
        "country": [
            "malaysia"
        ],
        "category": [
            "top"
        ],
        "language": "malay"
    },
    {
        "title": "Enchanting festive lights & Christmas decor at Fort Canning Park till Jan. 9, 2023",
        "link": "https://mothership.sg/2022/12/fort-canning-park-christmas-lights/",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "Good vibes.",
        "content": null,
        "pubDate": "2022-12-16 10:09:53",
        "image_url": null,
        "source_id": "mothership",
        "country": [
            "singapore"
        ],
        "category": [
            "top"
        ],
        "language": "english"
    },
    {
        "title": "S’pore games company Play Nation set sights on being a household brand in S’pore and beyond",
        "link": "https://mothership.sg/2022/12/play-nation/",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "Uniquely Singaporean games and toys.",
        "content": null,
        "pubDate": "2022-12-16 10:09:53",
        "image_url": null,
        "source_id": "mothership",
        "country": [
            "singapore"
        ],
        "category": [
            "top"
        ],
        "language": "english"
    },
    {
        "title": "Финпомощь будет выделяться и партиям, не представленным в парламенте Азербайджана",
        "link": "https://news.day.az/politics/1520121.html",
        "keywords": [
            "Политика"
        ],
        "creator": null,
        "video_url": null,
        "description": null,
        "content": null,
        "pubDate": "2022-12-16 10:09:00",
        "image_url": null,
        "source_id": "day",
        "country": [
            "azerbaijan"
        ],
        "category": [
            "top"
        ],
        "language": "russian"
    },
    {
        "title": "Binance to support CBA in regulation of crypto assets - CIS Director",
        "link": "https://en.trend.az/business/it/3682680.html",
        "keywords": [
            "ICT"
        ],
        "creator": null,
        "video_url": null,
        "description": null,
        "content": null,
        "pubDate": "2022-12-16 10:08:33",
        "image_url": null,
        "source_id": "trendaz",
        "country": [
            "azerbaijan"
        ],
        "category": [
            "top"
        ],
        "language": "Azerbaijani"
    },
    {
        "title": "Hele verden venter: FIFA-præsident voldsomt forsinket",
        "link": "https://ekstrabladet.dk/sport/fodbold/landsholdsfodbold/VM2022/hele-verden-venter-fifa-praesident-voldsomt-forsinket/9553310",
        "keywords": [
            "VM2022"
        ],
        "creator": null,
        "video_url": null,
        "description": "FIFA-præsidenten, Gianni Infantino, er over 40 minutter forsinket til det afsluttende pressemøde ved VM i Qatar",
        "content": null,
        "pubDate": "2022-12-16 10:08:29",
        "image_url": "https://ekstrabladet.dk/incoming/q7da4x/9553313/IMAGE_ALTERNATES/relationBig_300/dcx-88423044-20221216110435",
        "source_id": "ekstrabladet",
        "country": [
            "denmark"
        ],
        "category": [
            "top"
        ],
        "language": "danish"
    },
    {
        "title": "Dansk gigant laver greenwashing",
        "link": "https://ekstrabladet.dk/nyheder/samfund/dansk-gigant-laver-greenwashing/9553187",
        "keywords": [
            "Samfund"
        ],
        "creator": null,
        "video_url": null,
        "description": "Fem virksomheder er kritiseret for greenwashing af Forbrugerombudsmanden, og en af dem er Føtex",
        "content": null,
        "pubDate": "2022-12-16 10:08:21",
        "image_url": "https://ekstrabladet.dk/incoming/xeeb5s/9553191/IMAGE_ALTERNATES/relationBig_300/dcx-74497063-20221216095454",
        "source_id": "ekstrabladet",
        "country": [
            "denmark"
        ],
        "category": [
            "top"
        ],
        "language": "danish"
    },
    {
        "title": "بوريطة يستقبل اليوم وزيرة الخارجية الفرنسية وندوة صحافية منتظرة بين الجانبين",
        "link": "https://rue20.com/669908.html",
        "keywords": [
            "دولية"
        ],
        "creator": [
            "Khalid Arbai"
        ],
        "video_url": null,
        "description": "زنقة 20 | الرباط حلت وزيرة الخارجية الفرنسية كاترين كولونا منذ مساء أمس الخميس بالرباط، بهدف إعادة الدفئ للعلاقات بين البلدين، والتي يسودها الفتور منذ أشهر. وتدخل هذه الزيارة أيضا في إطار التحضير لزيارة الرئيس إيمانويل ماكرون إلى المملكة المغربية مطلع العام المقبل، حسب ما أوردت وكالة الأنباء الفرنسية. وأوضحت الناطقة باسم الخارجية الفرنسية آن […] الخبر بوريطة يستقبل اليوم وزيرة الخارجية الفرنسية وندوة صحافية منتظرة بين الجانبين ظهر أولاً على زنقة 20.",
        "content": null,
        "pubDate": "2022-12-16 10:08:08",
        "image_url": null,
        "source_id": "rue20",
        "country": [
            "morocco"
        ],
        "category": [
            "top"
        ],
        "language": "arabic"
    },
    {
        "title": "Tikinti obyektlərinin elektrik şəbəkəsinə qoşulma qaydası müəyyənləşir",
        "link": "https://apa.az/az/infrastructure/tikinti-obyektlerinin-elektrik-sebekesine-qosulma-qaydasi-mueyyenlesir-737745/",
        "keywords": [
            "İnfrastruktur"
        ],
        "creator": null,
        "video_url": null,
        "description": null,
        "content": null,
        "pubDate": "2022-12-16 10:07:43",
        "image_url": null,
        "source_id": "apa",
        "country": [
            "azerbaijan"
        ],
        "category": [
            "top"
        ],
        "language": "Azerbaijani"
    },
    {
        "title": "Avrupa Adalet Mahkemesi, Avrupa Süper Ligi ile ilgili bir rapor açıkladı! \"İzin almadan..\"",
        "link": "https://www.star.com.tr/spor/avrupa-adalet-mahkemesi-avrupa-super-ligi-ile-ilgili-bir-rapor-acikladi-izin-almadan-haber-1755075/",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "2021 yılında 12 büyük Avrupa kulübünün Avrupa Süper Ligi olarak açıkladığı yeni formata birçok tepki gelmişti. Avrupa Adalet Mahkemesi ise bu olay ile ilgili henüz bağlayıcı olmayan bir rapor yayınladı. İşte detaylar...",
        "content": null,
        "pubDate": "2022-12-16 10:07:26",
        "image_url": "https://imgs.star.com.tr/imgsdisk/2022/12/16/avrupa-adalet-mahkemesi-a-271.jpg",
        "source_id": "star_tr",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "AK Parti'den 'seçim tarihi' ve 'EYT' açıklaması",
        "link": "https://www.star.com.tr/politika/basortusune-anayasal-guvence-zengin-muhalefetle-bir-gorusme-daha-dusunuyoruz-haber-1755076/",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "AK Parti Grup Başkanvekili Özlem Zengin, \"EYT Meclis'e Aralık'ta kesin gelecek. Görüşmeler Ocak ayına kalabilir.\" dedi. Seçim tarihiyle ilgili de açıklamalarda bulunan Zengin, \"Seçim nisandan sonra olacak. Mayıs ayında olursa buna erken seçim denmez. Seçim öne gelirse de 1-2 hafta gelebilir.\" ifadelerini kullandı.",
        "content": null,
        "pubDate": "2022-12-16 10:07:26",
        "image_url": "https://imgs.star.com.tr/imgsdisk/2022/12/16/basortusune-anayasal-guve-653.jpg",
        "source_id": "star_tr",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "Türkmen Milletvekili Bilal, rest çekti: Herhangi bir pazarlığı kabul etmedik, etmiyoruz",
        "link": "https://www.star.com.tr/dunya/turkmen-milletvekili-bilal-rest-cekti-herhangi-bir-pazarligi-kabul-etmedik-etmiyoruz-haber-1755077/",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "Irak Türkmen Cephesi (ITC) Erbil Milletvekili İmdat Bilal, Kerkük'ün geleceğine Kerkük halkının karar vermesi gerektiğini belirterek, \"Biz Kerkük'te Türkmenlerin içinde olmadığı herhangi bir pazarlığı kabul etmedik, etmiyoruz.\" dedi.",
        "content": null,
        "pubDate": "2022-12-16 10:07:26",
        "image_url": "https://imgs.star.com.tr/imgsdisk/2022/12/16/turkmen-milletvekili-bila-805.jpg",
        "source_id": "star_tr",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "İstanbul'da korku dolu anlar! Levent'te AVM yangını",
        "link": "https://www.star.com.tr/guncel/istanbulda-leventte-bir-avmde-yangin-cikti-haber-1755078/",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "İstanbul, Levent'te bir alışveriş merkezinde yangın çıktı. Çatı kısmında başlayan yangına, itfaiye ekiplerinin müdahalesi sürüyor.",
        "content": null,
        "pubDate": "2022-12-16 10:07:26",
        "image_url": "https://imgs.star.com.tr/imgsdisk/2022/12/16/istanbulda-leventte-bir-a-151.jpg",
        "source_id": "star_tr",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "Türkiye'nin füze başarısı örnek oldu! Eskimiş teknolojiyle rakip olmayı planlıyorlar",
        "link": "https://www.star.com.tr/savunma/turkiyenin-fuze-basarisi-ornek-oldu-eskimis-teknolojiyle-rakip-olmayi-planliyorlar-haber-1755079/",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "Yunanistan, Türkiye'nin füze sistemlerinde ortaya koyduğu başarıyı örnek aldı. \"Yunanistan füze sistemleri üretebilir mi?\" sorusunu gündeme getiren Yunan basını, Atina'nın yabancı şirketlerden eskimiş teknolojiyi transfer ederek işe başlayabileceğini yazdı.",
        "content": null,
        "pubDate": "2022-12-16 10:07:26",
        "image_url": "https://imgs.star.com.tr/imgsdisk/2022/12/16/turkiyenin-fuze-basarisi--254.jpg",
        "source_id": "star_tr",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "Erzurum'un 5 asırlık geleneği \"1001 Hatim\"ler başladı",
        "link": "https://www.bursadabugun.com/haber/erzurum-un-5-asirlik-gelenegi-1001-hatim-ler-basladi-1571182.html",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "Erzurum'un yaklaşık 500 yıllık Kur'an okuma geleneği olan \"1001 Hatim\"ler başladı.",
        "content": null,
        "pubDate": "2022-12-16 10:07:18",
        "image_url": null,
        "source_id": "bursadabugun",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "İstanbul'da AVM yangını",
        "link": "https://www.bursadabugun.com/haber/istanbul-da-avm-yangini-1571183.html",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "İstanbul Levent'te bir AVM'de yangın meydana geldi.",
        "content": null,
        "pubDate": "2022-12-16 10:07:18",
        "image_url": null,
        "source_id": "bursadabugun",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "KESK-BES Bursa'dan açıklama: Toplum yoksullukla mücadele ediyor",
        "link": "https://www.bursadabugun.com/haber/kesk-bes-bursa-dan-aciklama-toplum-yoksullukla-mucadele-ediyor-1571184.html",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "Kamu Emekçileri Sendikaları Konfederasyonu ve Bursa Emekçileri Sendikası Bursa Şubesi, tüm çalışan ücretlerinin enflasyonun gerisinde kalmasını protesto etmek amacıyla Bursa Vergi Dairesi Başkanlığı önünde basın açıklaması yaptı.",
        "content": null,
        "pubDate": "2022-12-16 10:07:18",
        "image_url": null,
        "source_id": "bursadabugun",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "Asgari ücret ne zaman açıklanacak? 5 soruda asgari ücret süreci",
        "link": "https://www.aksam.com.tr/ekonomi/asgari-ucret-ne-zaman-aciklanacak-5-soruda-asgari-ucret-sureci/haber-1327480",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "Doğrudan 7 milyona yakın çalışanı, dolaylı olarak ise tüm vatandaşları ilgilendiren yeni asgari ücreti belirleme çalışmalarında süreç devam ediyor.",
        "content": null,
        "pubDate": "2022-12-16 10:07:16",
        "image_url": "https://img3.aksam.com.tr/imgsdisk/2022/12/16/asgari-ucret-ne-zaman-aci-408_2.jpg",
        "source_id": "aksam",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "TikTok'tan dikkat çeken hamle! YouTube'u tahtından edebilir",
        "link": "https://www.aksam.com.tr/trend/tiktoktan-dikkat-ceken-hamle-youtubeu-tahtindan-edebilir/haber-1327481",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "Son yılların parlayan sosyal medya ağlarından TikTok yeni bir özelliğe kavuşuyor. TikTok test ettiği özellikte yatay videoları denemeye başladı. Bu özelliğin en büyük rakibi YouTube ile rekabetti oldukça önemli bir rol oynayacağı düşünülüyor.",
        "content": null,
        "pubDate": "2022-12-16 10:07:16",
        "image_url": "https://img3.aksam.com.tr/imgsdisk/2022/12/16/tiktoktan-dikkat-ceken-ha-990_2.jpg",
        "source_id": "aksam",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "Asgari ücrette 3'üncü toplantı tarihi belli oldu",
        "link": "https://www.aksam.com.tr/ekonomi/asgari-ucrette-3uncu-toplanti-tarihi-belli-oldu/haber-1327482",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "Asgari Ücret Tespit Komisyonu'nun 3'üncü toplantısı, 20 Aralık'ta Çalışma ve Sosyal Güvenlik Bakanlığı'nda yapılacak.",
        "content": null,
        "pubDate": "2022-12-16 10:07:16",
        "image_url": "https://img3.aksam.com.tr/imgsdisk/2022/12/16/asgari-ucrette-3uncu-topl-413_2.jpg",
        "source_id": "aksam",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "Maç bitti, deplasman ekibi ev sahibinin yedek kulübesine saldırdı! Tam 4 kırmızı kart",
        "link": "https://www.aksam.com.tr/sporplus/mac-bitti-deplasman-ekibi-ev-sahibinin-yedek-kulubesine-saldirdi-tam-4-kirmizi-kart/haber-1327483",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "U16 Ligi 2. Grup'ta oynanan Muratpaşa Belediyespor-Park Antalya Gençlik Spor maçının son düdüğüyle birlikte olay çıktı. Deplasman ekibinin futbolcuları, teknik heyeti ve taraftarları sahaya girip ev sahibi takımın yedek kulübesine saldırdı.",
        "content": null,
        "pubDate": "2022-12-16 10:07:16",
        "image_url": "https://img3.aksam.com.tr/imgsdisk/2022/12/16/mac-bitti-deplasman-ekibi-610_2.jpg",
        "source_id": "aksam",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "Final yapması beklenen TRT 1 dizisine nefes verecek karar! Süreyi uzattılar!",
        "link": "https://www.aksam.com.tr/magazin/final-yapmasi-beklenen-trt-1-dizisine-nefes-verecek-karar-sureyi-uzattilar/haber-1327484",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "Şu sıralar TRT 1 ekranlarında Alparslan Büyük Selçuklu, Yürek Çıkmazı, Balkan Ninnisi, Kasaba Doktoru ve Teşkilat dizileri yayınlanıyor. Bu hafta hem Balkan Ninnisi hem de Kasaba Doktoru için final kararı verildiği konuşulmuştu. Bir süre önce final yapacağı konuşulan TRT 1 dizisi için son saniyede önemli bir değişiklik yapıldı. Ancak son anda bir değişiklik yaşandı ve iki dizinin yoluna devam etmesine karar verildi.",
        "content": null,
        "pubDate": "2022-12-16 10:07:16",
        "image_url": "https://img3.aksam.com.tr/imgsdisk/2022/12/16/final-yapmasi-beklenen-tr-300_2.jpg",
        "source_id": "aksam",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "Londra'da konser salonuna girmeyen çalışırken ezilen 4 kişinin durumunun kritik olduğu bildirildi",
        "link": "https://www.aksam.com.tr/dunya/londrada-konser-salonuna-girmeyen-calisirken-ezilen-4-kisinin-durumunun-kritik-oldugu-bildirildi/haber-1327485",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "İngiltere'nin başkenti Londra'da dün \"O2 Academy Brixton\" adlı konser salonuna zorla girmeye çalışırken ezilen 4 kişinin durumunun kritik olduğu belirtildi.",
        "content": null,
        "pubDate": "2022-12-16 10:07:16",
        "image_url": "https://img3.aksam.com.tr/imgsdisk/2022/12/16/londrada-konser-salonuna--853_2.jpg",
        "source_id": "aksam",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "Beşiktaş Levent'te bulunan AVM'de yangın çıktı",
        "link": "https://www.aksam.com.tr/guncel/besiktas-leventte-bulunan-avmde-yangin-cikti/haber-1327486",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "İstanbul, Levent'te bir alışveriş merkezinde yangın çıktı. Çatı kısmında başlayan yangına, ekiplerin müdahalesi sürüyor.",
        "content": null,
        "pubDate": "2022-12-16 10:07:16",
        "image_url": "https://img3.aksam.com.tr/imgsdisk/2022/12/16/besiktas-leventte-bulunan-990_2.jpg",
        "source_id": "aksam",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "AP'deki yolsuzluk şüphesi nedeniyle Yunan milletvekilinin parti üyeliği askıya alındı",
        "link": "https://www.aksam.com.tr/dunya/apdeki-yolsuzluk-suphesi-nedeniyle-yunan-milletvekilinin-parti-uyeligi-askiya-alindi/haber-1327487",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "Avrupa Birliği Başsavcılığının, Avrupa Parlamentosu (AP) bağlantılı yolsuzluk şüphesiyle dokunulmazlığının kaldırılmasını istediği iki Yunan milletvekilinden biri olan Maria Spiraki'nin Yeni Demokrasi parti üyeliğinin askıya alındığı bildirildi.",
        "content": null,
        "pubDate": "2022-12-16 10:07:16",
        "image_url": "https://img3.aksam.com.tr/imgsdisk/2022/12/16/apdeki-yolsuzluk-suphesi--990_2.jpg",
        "source_id": "aksam",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "Kuzey Marmara Otoyolu'nda tır devrildi!",
        "link": "https://www.aksam.com.tr/guncel/kuzey-marmara-otoyolunda-tir-devrildi/haber-1327488",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "Sakarya'nın Adapazarı ilçesi Kuzey Marmara bağlantı yolunda tır kazası meydana geldi. Sürücünün direksiyon hakimiyetini kaybetmesi üzerine şarampole devrilen tırın sürücüsü olay yerinde tadavi edildi.",
        "content": null,
        "pubDate": "2022-12-16 10:07:16",
        "image_url": "https://img3.aksam.com.tr/imgsdisk/2022/12/16/kuzey-marmara-otoyolunda--864_2.jpg",
        "source_id": "aksam",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "Mehmet Büyükekşi'den itiraf: Cüneyt Çakır'a haksızlık yapıldı",
        "link": "https://www.aksam.com.tr/spor/mehmet-buyukeksiden-itiraf-cuneyt-cakira-haksizlik-yapildi/haber-1327489",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "TFF Başkanı Mehmet Büyükekşi, FIFA kokartlı eski hakem Cüneyt Çakır'a haksızlık yapıldığını belirtti. Mehmet Büyükekşi, Cüneyt Çakır'a jübile yaparak bir mesajı da UEFA'ya verdiklerini belirtti.",
        "content": null,
        "pubDate": "2022-12-16 10:07:16",
        "image_url": "https://img3.aksam.com.tr/imgsdisk/2022/12/16/mehmet-buyukeksiden-itira-753_2.jpg",
        "source_id": "aksam",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "Melike Şahin Bursalı hayranlarını coşturdu! Beyaz elbisesi konsere damga vurdu",
        "link": "https://www.aksam.com.tr/magazin/melike-sahin-bursali-hayranlarini-costurdu-beyaz-elbisesi-konsere-damga-vurdu/haber-1327490",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "Geçtiğimiz akşam Bursa'da sahne alan Melike Şahin, sevilen şarkılarını seslendirdi. Son dönemin en popüler isimlerinden olan Melike Şahin, beyaz sahne kıyafeti ile hayranlarından tam not aldı.",
        "content": null,
        "pubDate": "2022-12-16 10:07:16",
        "image_url": "https://img3.aksam.com.tr/imgsdisk/2022/12/16/melike-sahin-bursali-hayr-225_2.jpg",
        "source_id": "aksam",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "Tek bir damlası iştahı keserek zayıflatıyor! Ölümden başka her derde deva mucize yağ...",
        "link": "https://www.aksam.com.tr/mor-papatya/tek-bir-damlasi-istahi-keserek-zayiflatiyor-olumden-baska-her-derde-deva-mucize-yag/haber-1327491",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "Bilimsel araştırmalarda bu yağı, zayıflama da etkili olan besinlerin birinci sırasında gelir. Bir damlası iştahı keserek kilo vermeyi kolaylaştırır. Merak edilen yağı sizler için araştırdık. İşte iştahı keserek zayıflamaya yardımcı olan o yağ...",
        "content": null,
        "pubDate": "2022-12-16 10:07:16",
        "image_url": "https://img3.aksam.com.tr/imgsdisk/2022/12/16/tek-bir-damlasi-istahi-ke-717_2.jpg",
        "source_id": "aksam",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "İstanbul Levent yangın son dakika haberi! AVM yangını söndürüldü mü, ölü yaralı var mı?",
        "link": "https://www.aksam.com.tr/trend/istanbul-levent-yangin-son-dakika-avm-yangini-sonduruldu-mu/haber-1327492",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "İstanbul Levent yangın son dakika haberi vatandaşlar tarafından yakından takip ediliyor. Levent'teki AVM'nin çatısı alevlere teslim oldu. Yangının neden çıktığına ilişkin herhangi bir açıklama yapılmadı. İtfaiye ekipleri yangına müdahale ediyor...",
        "content": null,
        "pubDate": "2022-12-16 10:07:16",
        "image_url": "https://img3.aksam.com.tr/imgsdisk/2022/12/16/istanbul-levent-yangin-so-778_2.jpg",
        "source_id": "aksam",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "Atletico Madrid'in teklifi reddedildi, Manchester City sırada bekliyor! Efe Sarıkaya bombası",
        "link": "https://www.aksam.com.tr/sporplus/atletico-madridin-teklifi-reddedildi-manchester-city-sirada-bekliyor-efe-sarikaya-bombasi/haber-1327493",
        "keywords": null,
        "creator": null,
        "video_url": null,
        "description": "Altay'ın 17 yaşındaki stoperi Efe Sarıkaya, Atletico Madrid ve Manchester City'nin yakın takibinde. Efe Sarıkaya'yı iki maçta takip eden kulüplerden Atletico Madrid, Altay'a resmi teklifi sundu. İzmir temsilcisi ise La Liga devinin teklifini düşük buldu.",
        "content": null,
        "pubDate": "2022-12-16 10:07:16",
        "image_url": "https://img3.aksam.com.tr/imgsdisk/2022/12/16/atletico-madridin-teklifi-395_2.jpg",
        "source_id": "aksam",
        "country": [
            "turkey"
        ],
        "category": [
            "top"
        ],
        "language": "turkish"
    },
    {
        "title": "Lidegaard: Jeg blev ikke gennet på plads om regeringsdeltagelse",
        "link": "https://www.berlingske.dk/politik/lidegaard-jeg-blev-ikke-gennet-paa-plads-om-regeringsdeltagelse?referrer=RSS",
        "keywords": [
            "Politik"
        ],
        "creator": null,
        "video_url": null,
        "description": "De Radikales politiske leder siger, at der var flere tvivlere i folketingsgruppen om at gå med i regering.",
        "content": null,
        "pubDate": "2022-12-16 10:07:00",
        "image_url": "https://berlingske.bmcdn.dk/media/cache/resolve/image_200x112/image/162/1627437/24293821-fv22-regeringsforhandlingerne.jpeg",
        "source_id": "berlingske",
        "country": [
            "denmark"
        ],
        "category": [
            "top"
        ],
        "language": "danish"
    },
    {
        "title": "В Азербайджане разрабатывается нацстратегия искусственного интеллекта",
        "link": "https://news.day.az/economy/1520120.html",
        "keywords": [
            "Экономика"
        ],
        "creator": null,
        "video_url": null,
        "description": null,
        "content": null,
        "pubDate": "2022-12-16 10:07:00",
        "image_url": null,
        "source_id": "day",
        "country": [
            "azerbaijan"
        ],
        "category": [
            "top"
        ],
        "language": "russian"
    },
    {
        "title": "الركراكي: بعد ضياع حلم التأهل نريد العودة إلى الوطن ونحن متوجون بميدالية",
        "link": "https://www.nadorcity.com/الركراكي-بعد-ضياع-حلم-التأهل-نريد-العودة-إلى-الوطن-ونحن-متوجون_a120199.html",
        "keywords": null,
        "creator": [
            "Mariam Mahou"
        ],
        "video_url": null,
        "description": "ناظور سيتي: متابعة قال وليد الركراكي، مدرب المنتخب الوطني المغربي، في ندوة صحفية، الجمعة 16 دجنبر 2022، \"إن التركيز الآن منصب على أخذ المركز الثالث وصعود منصة التتويج\". وأضاف الركراكي، أنه بعدما ضاع حلم التأهل إلى نهائي المونديال، فإن جميع اللاعبين مستعدون ويريدون العودة إلى المغرب وهم متوجون بميدالية. وأكد الناخب الوطني، على أن أسود الأطلس جاهزون لمقابلة منتخب كرواتيا، من أجل تحديد من سيكون في المركز الثالث في نهائيات كأس العالم قطر 2022. (adsbygoogle = window.adsbygoogle || []).push({}); وتابع المتحدث ذاته، أنه بعد التعافي من الإقصاء إلى المباراة النهائية للمونديال، فإنه في الوقت الحالي يوجه كل تركيزه على التتويج واحتلال المركز الثالث، وذلك بالانتصار على المنتخب الكرواتي في مباراة الترتيب التي ستكون يوم غد السبت على أرضية ملعب خليفة الدولي. مردفا، أن المهمة ليست بالأمر السهل لكون أن الأسود سيواجهون منتخب كرواتيا، الذي يرغب هو أيضا بالفوز بهذه الميدالية، لتتويج جيل كبير من لاعبيه البارزين وعلى رأسهم \"مودريتش\". وأورد مدرب الفريق الوطني، أن الانتصار الذي حققه المنتخب المغربي في نهائيات المونديال ووصوله إلى دور نصف النهائي، وفي حالة فوزه بميدالية المركز الثالث، فإنه سيقترب من المنافسة على التتويج بكأس العالم في الدورات المقبلة. ومن المرتقب أن يواجه المنتخب الوطني المغربي، يوم غد السبت، 17 دجنبر 2022، نظيره الكرواتي، وذلك ضمن مقابلة الترتيب برسم فعاليات كأس العالم قطر 2022. وخسر المنتخب المغربي أمام فرنسا، في مباراة نصف نهائي المونديال التي جرت يوم الأربعاء المنصرم في ملعب البيت.",
        "content": null,
        "pubDate": "2022-12-16 10:07:00",
        "image_url": null,
        "source_id": "nadorcity",
        "country": [
            "morocco"
        ],
        "category": [
            "top"
        ],
        "language": "arabic"
    }
  ]

   // loading News
  
  //   setTimeout(() => {  
  //   fetch(newsUrl).then(function (response) {
  //     // The API call was successful!
  //     return response.json();
  //   }).then(function (data) {
  //     // This is the JSON from our response
      
  //     newsData = data.results
  //     console.log(newsData); 


  //   }).catch(function (err) {
  //     // There was an error
  //     console.warn('Something went wrong.', err);
  //   })
  // }, 500)

} 





// https://github.com/d3/d3-polygon
function polygonContains(polygon, point) {
  var n = polygon.length
  var p = polygon[n - 1]
  var x = point[0], y = point[1]
  var x0 = p[0], y0 = p[1]
  var x1, y1
  var inside = false
  for (var i = 0; i < n; ++i) {
    p = polygon[i], x1 = p[0], y1 = p[1]
    if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) inside = !inside
    x0 = x1, y0 = y1
  }
  return inside
}

function mousemove() {
  countryWiseNews = getCountryWiseNews(countryList,newsData);
  var c = getCountry(this)
  if (!c) {
    if (currentCountry) {
      leave(currentCountry)
      currentCountry = undefined
      render()
    }
    return
  }
  if (c === currentCountry) {
    return
  }
  currentCountry = c
  render()
  enter(c,countryWiseNews)
}

let mouseclick = () =>{
  console.log(currentCountyName);
  let data = countryWiseNews.filter(function (selectedCountry){
    return  selectedCountry.name.toLowerCase() === currentCountyName
  })
  let news = (data.length !== 0) ? data[0]['news'] : []
  console.log(news);

 
  let  slides=[], indicators=[], html='', activeClass ;
  activeClass = news.length == 0 ? "active" : '' ; 
  news.forEach((item,index) => {
    img_url = (item.image_url != null) ? item.image_url : 'https://nogalss.org/admin/assets/images/no-image2.png'

    html = `<div class="carousel-item ${activeClass}">`
    html += `<div style="width: 60%;">`
    html += `<img src="${img_url}" class="d-block carImg" alt="..."></div>`
    html += `<div style="width: 40%;"class="caption">`
    html += `<h5> ${item['title']}</h5>`
    html += `<p> ${item['description']}</p>`
    html += `</div></div>`
    slides.push(html);
    
     // set up the indicator
     activeClass = indicators.length == 0 ? "active" : '' ; // see note about the active slide above- same goes for the indicators
     let isCurrent = (index == 0);
     html = `<button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to=${index}  aria-current="${isCurrent}" aria-label="Slide ${index}" class="${activeClass}"></button>`;
     
     indicators.push(html);
  });


  document.getElementById('carousel-indicators').innerHTML = indicators.join('');
  document.getElementById('carousel-items').innerHTML = slides.join('');
  var myCarousel = document.querySelector('#myCarousel')
  var carousel = new bootstrap.Carousel(myCarousel, {
    wrap: true
  })
}

function getCountry(event) {
  var pos = projection.invert(d3.mouse(event))
  return countries.features.find(function(f) {
    return f.geometry.coordinates.find(function(c1) {
      return polygonContains(c1, pos) || c1.find(function(c2) {
        return polygonContains(c2, pos)
      })
    })
  })
}

let getCountryWiseNews = (countryList, newsData)=> {
let countryWiseNews = countryList.map((obj, i) => (  
  {
    ...obj,
    news: newsData.filter(function (el) {
      return el.country[0].toLowerCase() === obj.name.toLowerCase()
    })
  }
));
return countryWiseNews
}

//
// Initialization
//

setAngles()

canvas
  .call(d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
   )
  .on('mousemove', mousemove)
  .on('click', mouseclick)

loadData(function(world, cList) {
  land = topojson.feature(world, world.objects.land)
  countries = topojson.feature(world, world.objects.countries)
  countryList = cList
  // console.log(countryList)


 
  window.addEventListener('resize', scale)
  scale()
  autorotate = d3.timer(rotate)
})
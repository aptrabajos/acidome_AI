/**
 * Internationalization utility
 * Manages multilingual text resources - All 11 ACIDOME languages
 */

import { LanguageOption } from '../types/config'
import { LANGUAGE_OPTIONS } from './config'

/**
 * Translation database for all 11 supported languages
 * en, ru, es, ua, fr, bg, pl, gr, nl, de, ro
 */
const translations: Record<string, Record<string, string>> = {
  // ===== UI Labels =====
  'Geodesic dome constructor': {
    en: 'Geodesic dome constructor',
    ru: 'Конструктор геодезического купола',
    es: 'Constructor de cúpula geodésica',
    ua: 'Конструктор геодезичного купола',
    fr: 'Constructeur de dôme géodésique',
    bg: 'Конструктор на геодезична куполка',
    pl: 'Konstruktor kopuły geodezyjnej',
    gr: 'Κατασκευαστής γεωδεσικής θόλου',
    nl: 'Constructeur van geodetische koepel',
    de: 'Geodätischer Kuppelkonstruktor',
    ro: 'Constructor de cupolă geodezică'
  },

  // ===== Figure Options =====
  'Polyhedron': {
    en: 'Polyhedron',
    ru: 'Многогранник',
    es: 'Poliedro',
    ua: 'Многогранник',
    fr: 'Polyèdre',
    bg: 'Полиедър',
    pl: 'Wielościan',
    gr: 'Πολύεδρο',
    nl: 'Veelvlak',
    de: 'Polyeder',
    ro: 'Poliedru'
  },
  'Icosahedron': {
    en: 'Icosahedron',
    ru: 'Икосаэдр',
    es: 'Icosaedro',
    ua: 'Ікосаедр',
    fr: 'Icosaèdre',
    bg: 'Икосаедър',
    pl: 'Dwudziestościan',
    gr: 'Εικοσάεδρο',
    nl: 'Icosaëder',
    de: 'Ikosaeder',
    ro: 'Icosahedron'
  },
  'Octohedron': {
    en: 'Octohedron',
    ru: 'Октаэдр',
    es: 'Octaedro',
    ua: 'Октаедр',
    fr: 'Octaèdre',
    bg: 'Октаедър',
    pl: 'Ośmiościan',
    gr: 'Οκτάεδρο',
    nl: 'Octaëder',
    de: 'Oktaeder',
    ro: 'Octaedru'
  },

  'Level of detail, V': {
    en: 'Level of detail, V',
    ru: 'Частота, V',
    es: 'Frecuencia, V',
    ua: 'Частота, V',
    fr: 'Fréquence, V',
    bg: 'Честота V',
    pl: 'Stopień aproksymacji, V',
    gr: 'Επίπεδο λεπτομέρειας, V',
    nl: 'Aantal deelstukken, V',
    de: 'Frequenz (Detaillevel)',
    ro: 'Acuratețe formă, V'
  },

  'Subdivision class': {
    en: 'Subdivision class',
    ru: 'Класс разбиения',
    es: 'Tipo de subdivisión',
    ua: 'Клас розбивки',
    fr: 'Classe de subdivision',
    bg: 'Делови клас',
    pl: 'Klasa podziału',
    gr: 'Κλάση υποδιαίρεσης',
    nl: 'Onderverdelings klasse',
    de: 'Unterteilungsklasse',
    ro: 'Clasă de subdiviziune'
  },

  'Subdivision method': {
    en: 'Subdivision method',
    ru: 'Метод разбиения',
    es: 'Método de subdivisión',
    ua: 'Метод розбивки',
    fr: 'Méthode de subdivision',
    bg: 'Метод на делене',
    pl: 'Metoda podziału',
    gr: 'Μέθοδος υποδιαίρεσης',
    nl: 'Onderverdelings wijze',
    de: 'Unterteilungsmethode',
    ro: 'Metodă de divizare'
  },

  'Equal Chords': {
    en: 'Equal Chords',
    ru: 'Равные хорды',
    es: 'Cuerdas iguales',
    ua: 'Рівні хорди',
    fr: 'Cordes égales',
    bg: 'Равни Хорди',
    pl: 'Równych cięciw',
    gr: 'Ίσες χορδές',
    nl: 'Gelijke Staken',
    de: 'gleiche Abstände',
    ro: 'Laturi egale'
  },

  'Equal Arcs': {
    en: 'Equal Arcs',
    ru: 'Равные дуги',
    es: 'Arcos iguales',
    ua: 'Рівні дуги',
    fr: 'Arcs égaux',
    bg: 'Равни дъги',
    pl: 'Równych łuków',
    gr: 'Ίσα τόξα',
    nl: 'Gelijke Hoeken',
    de: 'gleiche Winkel',
    ro: 'Unghiuri egale'
  },

  'Mexican': {
    en: 'Mexican',
    ru: 'Мексиканец',
    es: 'Mexicano',
    ua: 'Мексиканський',
    fr: 'Mexicaine',
    bg: 'Мексикански',
    pl: 'Meksykańska',
    gr: 'Μεξικάνικη',
    nl: 'Меxicaans',
    de: 'mexikanisch',
    ro: 'Mexican'
  },

  'Kruschke': {
    en: 'Kruschke (NEW)',
    ru: 'Kruschke',
    es: 'Kruschke',
    ua: 'Kruschke',
    fr: 'Kruschke',
    bg: 'Kruschke',
    pl: 'Kruschke',
    gr: 'Kruschke',
    nl: 'Kruschke',
    de: 'Kruschke',
    ro: 'Kruschke'
  },

  'Rotational symmetry': {
    en: 'Rotational symmetry',
    ru: 'Осевая симметрия',
    es: 'Simetría rotacional',
    ua: 'Осьова симетрія',
    fr: 'Axe de symétrie',
    bg: 'Осева симетрия',
    pl: 'Оś symetrii',
    gr: 'Συμμετρία περιστροφής',
    nl: 'Circulaire Symmetrie',
    de: 'Rotationssymmetrie',
    ro: 'Simetrie de rotație'
  },

  'Fullerene': {
    en: 'Fullerene',
    ru: 'Фуллерен',
    es: 'Circunscripción',
    ua: 'Фуллерен',
    fr: 'Fullerène',
    bg: 'Фулерен',
    pl: 'Wzór fulerenu',
    gr: 'Fullerene',
    nl: 'Fullereen (Buckyball)',
    de: 'Fullerene',
    ro: 'Poziție laturi construcție'
  },

  'None': {
    en: 'None',
    ru: 'Нет',
    es: 'Ninguna',
    ua: 'Немає',
    fr: 'Aucune',
    bg: 'Не',
    pl: 'Nie',
    gr: 'Όχι',
    nl: 'Geen',
    de: 'nein',
    ro: 'Nimic'
  },

  'Inscribed in': {
    en: 'Inscribed in',
    ru: 'Вписанный',
    es: 'Inscrita dentro',
    ua: 'Вписаний',
    fr: 'Intérieur',
    bg: 'Вписан',
    pl: 'Wpisany',
    gr: 'Εγγραφή σε',
    nl: 'Ingeschreven',
    de: 'einbeschrieben',
    ro: 'interiorul Sferei'
  },

  'Described around': {
    en: 'Described around',
    ru: 'Описанный',
    es: 'Descrita alrededor',
    ua: 'Описаний',
    fr: 'Extérieur',
    bg: 'Описан',
    pl: 'Opisany',
    gr: 'Περιγράφεται γύρω',
    nl: 'Omschreven',
    de: 'umbeschrieben',
    ro: 'exteriorul Sferei'
  },

  'Part of full sphere': {
    en: 'Part of full sphere',
    ru: 'Часть сферы',
    es: 'Porción de la esfera',
    ua: 'Частина сфери',
    fr: 'Découpage de la sphère',
    bg: 'Част от сферата',
    pl: 'Część sfery',
    gr: 'Μέρος της σφαίρας',
    nl: 'Deel van hele bol',
    de: 'Teil einer vollen Kugel',
    ro: 'Parte din sferă'
  },

  'Align the base': {
    en: 'Flat base',
    ru: 'Плоское основание',
    es: 'Alinear la base',
    ua: 'Вирівнювати основу',
    fr: 'Aligner le bas',
    bg: 'Изравни на основата',
    pl: 'Wyrównaj do podstawy',
    gr: 'Ευθυγράμμιση της βάσης',
    nl: 'De basis uitvlakken',
    de: 'Standfläche anpassen',
    ro: 'Bază plată'
  },

  // ===== Product Options =====
  'Sphere radius, m': {
    en: 'Sphere radius, m',
    ru: 'Радиус сферы, м',
    es: 'Radio de la esfera, m',
    ua: 'Радіус сфери, м',
    fr: 'Rayon de la sphère, m',
    bg: 'Радиус на сферата, м',
    pl: 'Promień sfery, m',
    gr: 'Ακτίνα σφαίρας, м',
    nl: 'Straal van de bol, м',
    de: 'Kugelradius, m',
    ro: 'Raza Sferei, m'
  },

  'Connection type': {
    en: 'Connection type',
    ru: 'Способ соединения',
    es: 'Tipo de conexión',
    ua: 'Спосіб з\'єднаня',
    fr: 'Type de connecteur',
    bg: 'Тип връзки',
    pl: 'Typ łączenia',
    gr: 'Μέθοδος σύνδεσης',
    nl: 'Verbindings type',
    de: 'Verbindungstyp',
    ro: 'Tip de îmbinare'
  },

  'Pipe diameter, mm': {
    en: 'Pipe diameter, mm',
    ru: 'Диаметр трубы, мм',
    es: 'Diámetro del tubo, mm',
    ua: 'Діаметр труби, мм',
    fr: 'Diamètre du tube, mm',
    bg: 'Диаметър на тръбата, мм',
    pl: 'Średnica rury, mm',
    gr: 'Διάμετρος σωλήνα, mm',
    nl: 'Buis diameter, мм',
    de: 'Rohrdurchmesser, mm',
    ro: 'Diametru țeavă îmbinare'
  },

  'Spinning clockwise': {
    en: 'Clockwise',
    ru: 'По-часовой',
    es: 'Girando en sentido horario',
    ua: 'За-годинниковою',
    fr: 'Sens horaire',
    bg: 'По часовата стрелка',
    pl: 'Obrót w prawo',
    gr: 'Περιστροφή κατά τη φορά των δεικτών του ρολογιού',
    nl: 'Draait kloksgewijs',
    de: 'im Uhrzeigersinn gedreht',
    ro: 'Sens orar'
  },

  'else counter': {
    en: 'Counter-clockwise',
    ru: 'или против',
    es: 'sentido contrario',
    ua: 'або проти',
    fr: 'antihoraire',
    bg: 'Обратно на ч.с.',
    pl: 'lub w lewo',
    gr: 'Περιστροφή αντί τη φορά των δεικτών του ρολογιού',
    nl: 'Anders draaiend',
    de: 'sonst dagegen',
    ro: 'Sens antiorar'
  },

  'Timber size': {
    en: 'Beam dimensions',
    ru: 'Материал ребер',
    es: 'Tamaño de las piezas',
    ua: 'Матеріал ребер',
    fr: 'Taille des montants',
    bg: 'Материал на ребрата',
    pl: 'Rozmiar belki',
    gr: 'Διαστάσεις ξύλου',
    nl: 'Balkmaat',
    de: 'Balken Abmessungen',
    ro: 'Dimensiune cherestea'
  },

  'Width, mm': {
    en: 'Width, mm',
    ru: 'Ширина, мм',
    es: 'Anchura, mm',
    ua: 'Ширина, мм',
    fr: 'Largeur, mm',
    bg: 'Ширина, мм',
    pl: 'Szerokość, mm',
    gr: 'Πλάτος, mm',
    nl: 'Breedte, мм',
    de: 'Breite, mm',
    ro: 'Lățime, mm'
  },

  'Thickness, mm': {
    en: 'Thickness, mm',
    ru: 'Толщина, мм',
    es: 'Grosor, mm',
    ua: 'Товщина, мм',
    fr: 'Epaisseur, mm',
    bg: 'Дебелина, мм',
    pl: 'Grubość, mm',
    gr: 'Πάχος, mm',
    nl: 'Dikte, mm',
    de: 'Stärke, mm',
    ro: 'Grosime,mm'
  },

  // ===== Results =====
  'Resulting': {
    en: 'Results',
    ru: 'В результате',
    es: 'Resultados',
    ua: 'В результаті маємо',
    fr: 'Résultats',
    bg: 'Резултат',
    pl: 'W wyniku otrzymujemy',
    gr: 'Ως αποτέλεσμα έχουμε',
    nl: 'Resultaat',
    de: 'Zusammenfassung',
    ro: 'Dimensiuni calcul Sferă'
  },

  'Height from base, m': {
    en: 'Height from base, m',
    ru: 'Высота от основания, м',
    es: 'Altura desde la base, m',
    ua: 'Висота від основи, м',
    fr: 'Hauteur au sol, m',
    bg: 'Височина от основата, м',
    pl: 'Wysokość od podstawy, m',
    gr: 'Ύψος από τη βάση, m',
    nl: 'Hoogte vanaf de basis, m',
    de: 'Höhe von der Grundfläche, m',
    ro: 'Înaltimea sferei de la bază, m'
  },

  'Base radius, m': {
    en: 'Base radius, m',
    ru: 'Радиус основания, м',
    es: 'Radio de la base, m',
    ua: 'Радіус основи, м',
    fr: 'Rayon au sol, m',
    bg: 'Радиус на основата, м',
    pl: 'Promień podstawy, m',
    gr: 'Ακτίνα βάσης, m',
    nl: 'Straal van de basis, m',
    de: 'Radius Grundfläche, m',
    ro: 'Raza bazei Sferei, m'
  },

  'Sizes (units)': {
    en: 'Sizes',
    ru: 'Типоразмеры (всего)',
    es: 'Tamaños (unidades)',
    ua: 'Разміри',
    fr: 'Quantités',
    bg: 'Размери (бройки)',
    pl: 'Elementy',
    gr: 'Διαστάσεις',
    nl: 'Maten (eenheden)',
    de: 'verschiedene Größen (Gesamtanzahl)',
    ro: 'Cantități'
  },

  'Faces': {
    en: 'Faces',
    ru: 'Граней',
    es: 'Caras',
    ua: 'Граней',
    fr: 'Faces',
    bg: 'Многоъгълници',
    pl: 'Ścianki',
    gr: 'Σύνορα',
    nl: 'Vlakken',
    de: 'Flächen',
    ro: 'Nr. fețe'
  },

  'Edges': {
    en: 'Edges',
    ru: 'Ребер',
    es: 'Aristas',
    ua: 'Ребер',
    fr: 'Montants',
    bg: 'Греди',
    pl: 'Krawędzie',
    gr: 'Ακόνες',
    nl: 'Randen',
    de: 'Kanten',
    ro: 'Nr. Grinzi'
  },

  'Vertices': {
    en: 'Vertices',
    ru: 'Вершин',
    es: 'Vértices',
    ua: 'Вершин',
    fr: 'Nœuds',
    bg: 'Връзки',
    pl: 'Wierzchołki',
    gr: 'Κορυφές',
    nl: 'Hoekpunten',
    de: 'Eckpunkte',
    ro: 'nr. piese verticale'
  },

  'Beams': {
    en: 'Beams',
    ru: 'Балки (ребра)',
    es: 'Travesaños',
    ua: 'Балки (ребра)',
    fr: 'Montants',
    bg: 'Греди',
    pl: 'Belki',
    gr: 'Δοκοί (νευρώσεις)',
    nl: 'Balken (Ribben)',
    de: 'Balken',
    ro: 'Grindă'
  },

  'Total length of beams, m': {
    en: 'Total length of beams, m',
    ru: 'Суммарная длина, м',
    es: 'Longitud total de los travesaños, m',
    ua: 'Сумарна довжина, м',
    fr: 'Longueur totale des montants, м',
    bg: 'Обща дължина греди, м',
    pl: 'Całkowita długość belek, m',
    gr: 'Συνολικό μήκος δοκών, m',
    nl: 'Lengte van de balken, m',
    de: 'Gesamtlänge der Balken, m',
    ro: 'Lungimea totală a grindei, m'
  },

  'Total volume of beams, m3': {
    en: 'Total volume of beams, m³',
    ru: 'Объем ребер, м3',
    es: 'Volumen total de los travesaños, m3',
    ua: 'Об\'єм ребер, м3',
    fr: 'Volume total des montants, м3',
    bg: 'Обем греди, м3',
    pl: 'Całkowita objętość belek, m3',
    gr: 'Συνολικός όγκος δοκών, m3',
    nl: 'Volume van de balken, m3',
    de: 'Gesamtvolumen der Balken, m³',
    ro: 'Volumul total al grindei, m3'
  },

  'Beam length, mm': {
    en: 'Beam length, mm',
    ru: 'Длина ребра, мм',
    es: 'Longitud del travesaño, mm',
    ua: 'Довжина ребра, мм',
    fr: 'Montant le plus, mm',
    bg: 'Дължина греда, мм',
    pl: 'Długość belki, mm',
    gr: 'Μέγιστο μήκος δέσμης, mm',
    nl: 'Balklengte, mm',
    de: 'Balkenlänge, mm',
    ro: 'Lungimea a unei grinzi, mm'
  },

  'Max. beam length, mm': {
    en: 'Max. beam length, mm',
    ru: 'Макс. длина ребра, мм',
    es: 'Longitud máx. del travesaño, mm',
    ua: 'Макс. довжина ребра, мм',
    fr: 'Montant le plus grand, mm',
    bg: 'Максимална дължина греда, мм',
    pl: 'Maksymalna długość belki, mm',
    gr: 'Μέγιστο μήκος δέσμης, mm',
    nl: 'Max. balklengte, mm',
    de: 'Maximale Balkenlänge, mm',
    ro: 'Lungimea max. a unei grinzi, mm'
  },

  'Angle between faces, °': {
    en: 'Angle between faces, °',
    ru: 'Угол смежных граней, °',
    es: 'Ángulo entre caras, °',
    ua: 'Кут суміжних граней, °',
    fr: 'Angle entre les faces, °',
    bg: 'Ъгъл между съседни повърхности',
    pl: 'Kąt pomiędzy ściankami, °',
    gr: 'Γωνία μεταξύ γειτονικών προσώπων, °',
    nl: 'oek tussen de vlakken, °',
    de: 'Winkel zwischen Flächen, °',
    ro: 'Unghi îmbinare fețe, °'
  },

  'Base area, m2': {
    en: 'Base area, m²',
    ru: 'Площадь основания, м2',
    es: 'Área de la base, m2',
    ua: 'Площа основи, м2',
    fr: 'Surface au sol, m2',
    bg: 'Площ на основата, м2',
    pl: 'Powierzchnia podstawy, m2',
    gr: 'Εμβαδόν Βάσης, m2',
    nl: 'Oppervlak van de basis, m2',
    de: 'Grundfläche, m²',
    ro: 'Suprafață bază sferă, m2'
  },

  'Coverage area, m2': {
    en: 'Coverage area, m²',
    ru: 'Площадь покрытия, м2',
    es: 'Área de la cubierta, m2',
    ua: 'Площа покриття, м2',
    fr: 'Surface de la couverture, m2',
    bg: 'Покривна площ, м2',
    pl: 'Powierzchnia pokrycia, m2',
    gr: 'Εμβαδόν κάλυψης, m2',
    nl: 'Bestrijkingsgebied, m2',
    de: 'Oberfläche, m²',
    ro: 'Suprafață de acoperit, m2'
  },

  'Triangles': {
    en: 'Triangles',
    ru: 'Треугольники',
    es: 'Triángulos',
    ua: 'Трикутники',
    fr: 'Triangles',
    bg: 'Триъгълници',
    pl: 'Тrójkąty',
    gr: 'Τρίγωνα',
    nl: 'Driehoeken',
    de: 'Dreiecke',
    ro: 'Triunghiuri'
  },

  'Min. height, mm': {
    en: 'Min. height, mm',
    ru: 'Мин. высота, мм',
    es: 'Altura mín., mm',
    ua: 'Мін. висота, мм',
    fr: 'Hauteur mini, mm',
    bg: 'Мин. Височина, мм',
    pl: 'Maksymalna wysokość, mm',
    gr: 'Ελάχιστο ύψος, mm',
    nl: 'Min. Hoogte, mm',
    de: 'kleinste Höhen, mm',
    ro: 'Înălțime min., mm'
  },

  'Max. side, mm': {
    en: 'Max. side, mm',
    ru: 'Макс. сторона, mm',
    es: 'Longitud máx. del lado, mm',
    ua: 'Макс. сторона, mm',
    fr: 'Côté maxi, mm',
    bg: 'Минимална страна, мм',
    pl: 'Maksymalna długość boku, mm',
    gr: 'Μέγιστη πλευρά, mm',
    nl: 'Max. breedte, mm',
    de: 'längste Seiten, mm',
    ro: 'Lungime max. latură, mm'
  },

  // ===== Units =====
  'mm': {
    en: 'mm',
    ru: 'мм',
    es: 'mm',
    ua: 'мм',
    fr: 'mm',
    bg: 'мм',
    pl: 'mm',
    gr: 'mm',
    nl: 'mm',
    de: 'mm',
    ro: 'mm'
  },

  'pcs': {
    en: 'pcs',
    ru: 'шт.',
    es: 'piezas',
    ua: 'шт.',
    fr: 'pcs',
    bg: 'бр.',
    pl: 'szt.',
    gr: 'τεμ.',
    nl: 'stuks.',
    de: 'Stk.',
    ro: 'buc.'
  },

  // ===== Display modes =====
  'Carcass': {
    en: 'Framework',
    ru: 'Каркас',
    es: 'Carcasa',
    ua: 'Каркас',
    fr: 'Squelette',
    bg: 'Конструкция',
    pl: 'Konstrukcja',
    gr: 'Πλαίσιο',
    nl: 'Skelet',
    de: 'Rahmen',
    ro: 'Cadru'
  },

  'Schema': {
    en: 'Scheme',
    ru: 'Схема',
    es: 'Esquema',
    ua: 'Схема',
    fr: 'Schéma',
    bg: 'Схема',
    pl: 'Schemat',
    gr: 'Σχέδιο',
    nl: 'Schema',
    de: 'Schema',
    ro: 'Schemă'
  },

  'Cover': {
    en: 'Coverage',
    ru: 'Кровля',
    es: 'Cubierta',
    ua: 'Покрівля',
    fr: 'Couverture',
    bg: 'Покрив',
    pl: 'Pokrycie',
    gr: 'Κάλυψη',
    nl: 'Bedekking',
    de: 'Abdeckung',
    ro: 'Acoperire'
  },

  'Base': {
    en: 'Base',
    ru: 'План',
    es: 'Base',
    ua: 'План',
    fr: 'Sol',
    bg: 'Основа',
    pl: 'Podstawa',
    gr: 'Σχέδιο Βάσης',
    nl: 'Basis',
    de: 'Grundfläche',
    ro: 'Bază'
  }
}

let currentLanguage: string = 'en'

/**
 * Set current language
 */
export function setLanguage(lang: string): void {
  if (LANGUAGE_OPTIONS.some(l => l.id === lang)) {
    currentLanguage = lang
  }
}

/**
 * Get current language
 */
export function getLanguage(): string {
  return currentLanguage
}

/**
 * Translate text
 */
export function i18n(text: string, lang?: string): string {
  const language = lang || currentLanguage
  const key = text.includes(':') ? text : `${text}`

  return translations[key]?.[language] || translations[key]?.en || text
}

/**
 * Get all language options
 */
export function getLanguageOptions() {
  return LANGUAGE_OPTIONS
}

/**
 * Translate with fallback
 */
export function __(text: string): string {
  return i18n(text)
}

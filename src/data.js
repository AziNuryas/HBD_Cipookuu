// ============================================================
// DATA — Supports LocalStorage for Admin Panel
// ============================================================

const DEFAULT_DIARY = [
  {
    num: '01', date: 'Hari Paling Spesial',
    title: 'Selamat Ulang Tahun! My Girl My Cipoo My Binii 😖',
    body: `Selamat ulang tahun yaaa ayanggg g kerasa skrg kamu udh smpe di titik inii yaa udh mulai kerjaa udh punya kesibukan sendiri jugaa 🥹 aku senengg bgt bisa liat kamu smpe sejauh inii apalagi setelah semua yg udh kamu lewatin. Skrg kita jg lg mulai ngerasain LDR dan sama² punya kesibukan masing² tapi semogaa kita tetep bisa saling nyempetin dan ga jadi makin jauhh yaa 🫶🏻 pokoknyaa di umur kamu yg baruu ini semogaa banyak hal baikk yg dateng ke kamu dan apa yg kamu usahain selama ini bisa satu² tercapaii 🤍 jangan lupa jaga diri, jangan terlalu capekk dan tetep jadi bubub aku yg aku kenall. Selamat ulang tahun lagii ayangggg aku sayanggg bgt sama kamuuu, lopyuuu sejutaaa miliyaaarrr muachhh 😚`,
    photos: [
      { img: 'https://i.postimg.cc/cJCQLqQG/20dcb442f1480db2c5cd2abd0cef02c9-0.jpg', c: 'Make a wish' },
      { img: 'https://i.postimg.cc/g2DD0qQR/b2f295b986f4266ae705d66c0caddf94-0.jpg', c: 'Celebrate you' },
    ],
  },
  {
    num: '02', date: 'Mengenang Masa Lalu',
    title: 'Jejak Langkah Kita',
    body: `Klo ngeliat perjalanan kita smpe skrg, ternyata udh bnyakk bgt yg kita lewatin barengg. Bkn cuma momen seneng² ajaa, tp ada jg masalah, salah paham, kecewaa, sampe beberapa kali kita hampir kehilangan satu sama lain 🥹

Tp dari semua itu, aku harap kita bisa sama² belajar buat lebih ngerti satu sama lain, lebih bisa maafin, dan ga terus kebawa sama hal² yg udh lewat. Semogaa kedepannya kita bisa sama² jadi lebih baik, terus maju, dan tetep jadi kitaa 🤍

Makasih yaa ayanggg udh bertahan sejauh iniii, udh nemenin aku sampe sekarangg. Aku sayanggg bgt sama kamuuu 🫶🏻❤️`,
    photos: [
      { img: 'https://i.postimg.cc/s2MhRYrK/2027e6929a7f31d908ce58d0f3ee1424-0.jpg', c: 'Summer breeze' },
      { img: 'https://i.postimg.cc/QdtBpQV0/IMG-20260605-WA0037.jpg', c: 'Quiet moments' },
    ],
  },
  {
    num: '03', date: 'Momen Spesial 🤍',
    title: 'Cayang Kamu Hebat! 🤍',
    body: `Sayanggg, kamu hebatt bgt udh bisa sampee di titik iniii 🥹 Dari awal kita ketemu pas kamu masih maba, sampe sekarang kamu udh lulus, udh punya kerjaan sendiri, dan mulai ngejalanin hidup kamu sendirii.

Aku tauu pasti ga gampang buat sampe sini. Banyak capeknyaa, banyak hal yg harus kamu lewatin sendirian, apalagi kadang aku jg ga bisa ada pas kamu lagi butuh aku. Tapi kamu tetep bisa lewatin semuanya dan terus majuu.

Aku bener² bangga sama kamu, bububbb Jangan lupa liat sejauh apa kamu udh berjalan yaa, kamu udh sejauh iniii bukan karena kebetulan, tapi karena kamu emg sekuat ituuu 🫂`,
    photos: [
      { img: 'https://i.postimg.cc/Wb9zbdS0/IMG-20260704-WA0020.jpg', c: 'Keep walking' },
    ],
  },
  {
    num: '04', date: 'Doa Untukmu ✨',
    title: 'Harapan ke Depan',
    body: `Semogaa di umur kamu yg baruu ini banyak hal baik yg dateng ke kamu yaa ayanggg semoga kerjaan kamu lancarr, apa yg kamu pengen pelan² bisa kecapaii dan kamu bisa nikmatin hasil dari semua yg udh kamu usahain selama inii

Pokoknya semogaa kedepannya kamu makin bahagiaa, makin banyak hal seru yg bisa kamu rasain dan jangan lupa nikmatin prosesnyaa jugaa semoga tahun ini jadi tahun yg lebih baikk buat kamu dan buat kitaa 🫶🏻`,
    photos: [
      { img: 'https://i.postimg.cc/Bv2JDb5h/IMG-20260514-WA0027.webp', c: 'New horizons' },
      { img: 'https://i.postimg.cc/qqvr9Lf4/IMG-20260514-WA0029.webp', c: 'Reach the stars' },
    ],
  },
  {
    num: '05', date: 'Babak Baru 🥂',
    title: 'Spesial Untukmu 💖',
    body: `Pokoknyaa hari ini nikmatin duluu hari kamu yaa ayanggg makan yg enakk, jangan mikirin yg berat² duluu dan semogaa di umur yg baruu ini lebih banyak hal yg bikin kamu senengg

Sekali lagii selamat ulang tahun bububbb semogaa tahun ini jadi tahun yg lebih baikk buat kamu, buat aku dan buat kitaa 🫶🏻

maaf ngk bisa nemenin langsung ayangg ...I loveee youuu sejutaa milyyraann for yuu ❤️❤️`,
    photos: [
      { img: 'https://i.postimg.cc/k5Pmn9rK/IMG-20260818-WA0014.webp', c: 'To a new chapter' },
    ],
  }
];

export function getDiaryPages() {
  const stored = localStorage.getItem('birthday_diary_data');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse diary data', e);
    }
  }
  return JSON.parse(JSON.stringify(DEFAULT_DIARY));
}

export function saveDiaryPages(data) {
  localStorage.setItem('birthday_diary_data', JSON.stringify(data));
}

const DEFAULT_BG_PHOTOS = [
  'https://i.postimg.cc/W3CRHP7q/IMG-20260717-213439-526.webp',
  'https://i.postimg.cc/Pfw05943/5e85c224a5fabaa10c6ecb16f394491d-0.webp',
  'https://i.postimg.cc/t45KH659/e86721832bc88532cc034d8cfca936cd-0.webp',
  'https://i.postimg.cc/3xThhYQZ/IMG-20260717-213431-607.webp'
];

export function getBgPhotos() {
  const stored = localStorage.getItem('birthday_bg_photos');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { }
  }
  return [...DEFAULT_BG_PHOTOS];
}

export function saveBgPhotos(data) {
  localStorage.setItem('birthday_bg_photos', JSON.stringify(data));
}

const DEFAULT_MUSIC_URL = '/Lagu.mp3';

export function getMusicUrl() {
  const stored = localStorage.getItem('birthday_music_url');
  if (stored) return stored;
  return DEFAULT_MUSIC_URL;
}

export function saveMusicUrl(url) {
  localStorage.setItem('birthday_music_url', url);
}

const DEFAULT_PHOTOBOOTH_STRIPS = [
  [
    'https://i.postimg.cc/7YC80bwK/IMG-20260721-WA0006.webp',
    'https://i.postimg.cc/fbf6D9fV/IMG-20260713-WA0002.webp',
    'https://i.postimg.cc/T1pSVHMG/IMG-20260709-WA0019.jpg',
  ],
  [
    'https://i.postimg.cc/ZKmsKR09/1750010649164.webp',
    'https://i.postimg.cc/Pfw05943/5e85c224a5fabaa10c6ecb16f394491d-0.webp',
    'https://i.postimg.cc/ZKmsKR09/1750010649164.webp'
  ],
  [
    'https://i.postimg.cc/Nj9H38YL/1a39f3a6451ec82d07c0e3bda7f633c7-0.jpg',
    'https://i.postimg.cc/MHpcdVdj/62b33f61579ee6c93d37ac3bec9d4f0a-0.jpg',
    'https://i.postimg.cc/5tW6DZsx/0abe74f8a6f87dee963828e25deb388a-0.jpg'
  ]
];

export function getPhotoboothStrips() {
  const stored = localStorage.getItem('birthday_photobooth_strips');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { }
  }
  return JSON.parse(JSON.stringify(DEFAULT_PHOTOBOOTH_STRIPS));
}

export function savePhotoboothStrips(data) {
  localStorage.setItem('birthday_photobooth_strips', JSON.stringify(data));
}

export const TIMELINE_DATA = [
  { year: 'Awal Mula', event: 'Sesuatu yang Besar Dimulai', desc: 'Dunia mungkin belum tahu, tapi hari itu lahir seseorang dengan potensi luar biasa yang kelak akan menyentuh banyak hati.', dotColor: '#000' },
  { year: 'Proses', event: 'Belajar dan Bertumbuh', desc: 'Masa-masa eksplorasi, jatuh, lalu bangkit lagi. Setiap luka jadi pelajaran, setiap tawa jadi bekal untuk hari esok.', dotColor: '#555' },
  { year: 'Hari Ini', event: 'Versi Terbaik Dirimu', desc: 'Inilah kamu sekarang. Lebih kuat, lebih dewasa, dan siap menaklukkan apapun yang dunia lempar ke arahmu.', dotColor: '#000' },
  { year: 'Masa Depan', event: 'Langit Bukanlah Batas', desc: 'Perjalananmu masih sangat panjang. Teruslah berjalan, terbang lebih tinggi, dan ciptakan ceritamu sendiri.', dotColor: '#aaa' },
];

export const WISHES_DATA = [
  { avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=e2e8f0', name: 'Sahabat Lama', msg: 'Happy birthday ya! Semoga tahun ini lo makin sukses, kurang-kurangin overthinking, dan selalu dikelilingi vibe positif. I will always be here to support you! 🎉', time: 'Just now', alt: false },
  { avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Avery&backgroundColor=fcd34d', name: 'Partner In Crime', msg: 'Selamat bertambah umur manusia paling aneh tapi ngangenin! Jangan lupa traktirannya, mari kita buat kekacauan (yang baik) lebih banyak lagi tahun ini 🎂', time: '2 mins ago', alt: true },
  { avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Riley&backgroundColor=fbcfe8', name: 'Soul Sister', msg: 'Semoga semua air mata tahun lalu terganti dengan tawa tiada henti tahun ini. Keep shining, queen! Dunia butuh cahaya lo ✨', time: '5 mins ago', alt: false },
];

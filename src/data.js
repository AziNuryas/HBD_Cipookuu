// ============================================================
// DATA — Supports LocalStorage for Admin Panel
// ============================================================

const DEFAULT_DIARY = [
  {
    num: '01', date: 'Hari Paling Spesial',
    title: 'Selamat Ulang Tahun! ✨',
    body: 'Hari ini adalah hari di mana dunia menjadi tempat yang lebih baik karena kamu lahir. Mungkin bagi dunia ini hanyalah tanggal biasa, tapi bagiku, ini adalah perayaan atas eksistensi seseorang yang luar biasa. Harapanku di hari ulang tahunmu ini sederhana: semoga kamu dikelilingi oleh cinta yang tulus, kedamaian hati yang tak pernah putus, dan alasan untuk tersenyum setiap harinya. Kamu sangat berharga, jangan pernah lupakan itu.',
    photos: [
      { img: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&h=400&fit=crop', c: 'Make a wish' },
      { img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop', c: 'Celebrate you' },
    ],
  },
  {
    num: '02', date: 'Mengenang Masa Lalu',
    title: 'Jejak Langkah Kita',
    body: 'Kalau kita menengok ke belakang, rasanya gila melihat seberapa jauh kita sudah melangkah. Dari sekadar obrolan receh, tawa sampai perut sakit, hingga momen-momen di mana kita cuma bisa diam dan saling menguatkan. Setiap detik yang kita bagi adalah kenangan yang diam-diam aku simpan rapi di memori paling berharga. Terima kasih sudah menjadi partner cerita yang nggak pernah menghakimi.',
    photos: [
      { img: 'https://images.unsplash.com/photo-1473496169904-658ba37448eb?w=400&h=400&fit=crop', c: 'Summer breeze' },
      { img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop', c: 'Quiet moments' },
    ],
  },
  {
    num: '03', date: 'Momen Spesial 🤍',
    title: 'Kamu Hebat!',
    body: 'Aku tahu tahun lalu mungkin nggak selalu mulus. Ada tangis, ada kecewa, ada malam-malam panjang di mana kamu merasa sendirian. Tapi lihatlah dirimu sekarang, kamu berhasil melewatinya! Keberanianmu untuk terus bangun setiap pagi dan mencoba lagi adalah hal yang paling menginspirasi darimu. Berbanggalah pada dirimu sendiri, karena aku pun sangat bangga padamu.',
    photos: [
      { img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=400&fit=crop', c: 'Keep walking' },
    ],
  },
  {
    num: '04', date: 'Doa Untukmu ✨',
    title: 'Harapan ke Depan',
    body: 'Semoga di usiamu yang baru ini, langkahmu semakin mantap. Semoga pintu-pintu kesempatan yang selama ini tertutup perlahan terbuka. Jangan takut bermimpi besar, karena kamu punya segala potensi untuk mewujudkannya. Dan apapun rintangan yang datang nanti, ingatlah bahwa kamu punya orang-orang yang akan selalu pasang badan mendukungmu dari belakang.',
    photos: [
      { img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop', c: 'New horizons' },
      { img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop', c: 'Reach the stars' },
    ],
  },
  {
    num: '05', date: 'Babak Baru 🥂',
    title: 'Cheers to You!',
    body: 'Ini bukan akhir cerita, melainkan awal dari babak baru yang jauh lebih seru. Mari rayakan hari ini dengan sukacita. Makan makanan enak, istirahat dari beban pikiran, dan nikmati waktu untuk dirimu sendiri. Happy Birthday, may this year treat you so much better than the last!',
    photos: [
      { img: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&h=400&fit=crop', c: 'To a new chapter' },
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
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1473496169904-658ba37448eb?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop'
];

export function getBgPhotos() {
  const stored = localStorage.getItem('birthday_bg_photos');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  return [...DEFAULT_BG_PHOTOS];
}

export function saveBgPhotos(data) {
  localStorage.setItem('birthday_bg_photos', JSON.stringify(data));
}

const DEFAULT_MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=happy-birthday-113840.mp3';

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
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300&h=400&fit=crop'
  ],
  [
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1530103862676-de889221dd1d?w=300&h=400&fit=crop'
  ],
  [
    'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=400&fit=crop'
  ]
];

export function getPhotoboothStrips() {
  const stored = localStorage.getItem('birthday_photobooth_strips');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
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

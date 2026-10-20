// CENTRAL PHOTO MANIFEST
// Maps semantic aliases to public WebP and JPG assets with captions and metadata.

export interface PhotoAsset {
  id: string;
  src: string;      // WebP optimized version
  srcJpg: string;   // High-fidelity JPG fallback
  altVi: string;
  altEn: string;
  category: 'garden' | 'editorial' | 'celebration';
  captionVi: string;
  captionEn: string;
  width: number;
  height: number;
  aspectRatio?: string;
  objectPosition?: string;
  editorialSpanDesktop?: number; // 1 or 2 columns in editorial 3-col grid
}

export interface GalleryCategoryMeta {
  id: 'all' | 'garden' | 'editorial' | 'celebration';
  labelVi: string;
  labelEn: string;
}

export const GALLERY_CATEGORIES: GalleryCategoryMeta[] = [
  { id: 'all', labelVi: 'Tất Cả', labelEn: 'All Moments' },
  { id: 'editorial', labelVi: 'Studio Cổ Điển', labelEn: 'Classic Studio' },
  { id: 'garden', labelVi: 'Sân Vườn Lãng Mạn', labelEn: 'Romantic Garden' },
  { id: 'celebration', labelVi: 'Cổ Phục Truyền Thống', labelEn: 'Vietnamese Heritage' },
];

export const PHOTO_REGISTRY = {
  cover: {
    src: '/assets/photos/cover.webp',
    srcJpg: '/assets/photos/cover.jpg',
    altVi: 'Khoảnh khắc chạm nhẹ làn khăn voan',
    altEn: 'Tender veil moment',
    width: 640,
    height: 960,
  },
  hero: {
    src: '/assets/photos/story-02.webp',
    srcJpg: '/assets/photos/story-02.jpg',
    altVi: 'Nam & Hiệp — Ánh mắt trìu mến và nụ cười rạng rỡ',
    altEn: 'Nam & Hiep — Loving gaze wedding portrait',
    width: 640,
    height: 960,
  },
  bride: {
    src: '/assets/photos/bride_chihiep.webp',
    srcJpg: '/assets/photos/bride_chihiep.jpg',
    altVi: 'Cô dâu Hiệp kiêu sa trong váy cưới trắng tinh khôi',
    altEn: 'Bride Hiep in couture white bridal gown',
    width: 640,
    height: 960,
  },
  groom: {
    src: '/assets/photos/groom_anhnam.webp',
    srcJpg: '/assets/photos/groom_anhnam.jpg',
    altVi: 'Chú rể Nam lịch lãm trong âu phục tuxedo cổ điển',
    altEn: 'Groom Nam in classic black tuxedo',
    width: 640,
    height: 960,
  },
  coupleFormal: {
    src: '/assets/photos/album-01.webp',
    srcJpg: '/assets/photos/album-01.jpg',
    altVi: 'Ảnh cưới chân dung chính thức của Nam & Hiệp',
    altEn: 'Formal wedding portrait of Nam & Hiep',
    width: 640,
    height: 960,
  },
  story01: {
    src: '/assets/photos/album-05.webp',
    srcJpg: '/assets/photos/album-05.jpg',
    altVi: 'Lễ thành hôn trước cổng hoa sân vườn',
    altEn: 'Garden ceremony altar',
    width: 640,
    height: 960,
  },
  story02: {
    src: '/assets/photos/story-02.webp',
    srcJpg: '/assets/photos/story-02.jpg',
    altVi: 'Ánh mắt trìu mến dành cho người bạn đời',
    altEn: 'Affectionate gaze of love',
    width: 640,
    height: 960,
  },
  story03: {
    src: '/assets/photos/album-03.webp',
    srcJpg: '/assets/photos/album-03.jpg',
    altVi: 'Khoảnh khắc trao gửi yêu thương',
    altEn: 'Tender romantic close-up',
    width: 640,
    height: 960,
  },
  story04: {
    src: '/assets/photos/album-06.webp',
    srcJpg: '/assets/photos/album-06.jpg',
    altVi: 'Rót ly rượu mừng chung đôi',
    altEn: 'Champagne toast celebration',
    width: 640,
    height: 960,
  },
  closing: {
    src: '/assets/photos/album-01.webp',
    srcJpg: '/assets/photos/album-01.jpg',
    altVi: 'Nụ cười ngập tràn hạnh phúc của đôi uyên ương',
    altEn: 'Joyful radiant smiles',
    width: 640,
    height: 960,
  },
} as const;

// 10 Unique Curated Wedding Photographs configured with Editorial Layout Rhythms
export const GALLERY_PHOTOS: PhotoAsset[] = [
  // Block 1: Studio Couture Classic Pair
  {
    id: 'g-01',
    src: '/assets/photos/album-01.webp',
    srcJpg: '/assets/photos/album-01.jpg',
    altVi: 'Ảnh cưới chân dung kinh điển — Nam & Hiệp sánh bước bên nhau',
    altEn: 'Classic timeless portrait of Nam & Hiep together',
    category: 'editorial',
    captionVi: 'Trang trọng và thiêng liêng — Giây phút sánh bước bên nhau',
    captionEn: 'Dignified and sacred — Standing proudly beside you',
    width: 640,
    height: 960,
    objectPosition: 'center 15%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },
  {
    id: 'g-02',
    src: '/assets/photos/album-02.webp',
    srcJpg: '/assets/photos/album-02.jpg',
    altVi: 'Nụ cười rạng rỡ và làn khăn voan cô dâu',
    altEn: 'Radiant smile of the bride with veil and bouquet',
    category: 'editorial',
    captionVi: 'Nụ cười rạng rỡ của người con gái anh yêu nhất',
    captionEn: 'The radiant smile of the love of my life',
    width: 640,
    height: 960,
    objectPosition: 'center 15%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },
  {
    id: 'g-03',
    src: '/assets/photos/album-03.webp',
    srcJpg: '/assets/photos/album-03.jpg',
    altVi: 'Khoảnh khắc ngọt ngào — Bàn tay siết chặt bàn tay',
    altEn: 'Intimate romance — Hand in hand loving gaze',
    category: 'editorial',
    captionVi: 'Chỉ cần bên em, mọi khoảnh khắc đều trở nên diệu kỳ',
    captionEn: 'Beside you, every moment is pure magic',
    width: 640,
    height: 960,
    objectPosition: 'center 20%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },

  // Block 2: Modern Studio & Romantic Garden
  {
    id: 'g-04',
    src: '/assets/photos/album-04.webp',
    srcJpg: '/assets/photos/album-04.jpg',
    altVi: 'Không gian studio hiện đại — Phút giây bình yên của đôi uyên ương',
    altEn: 'Modern architectural studio — Peaceful intimate embrace',
    category: 'editorial',
    captionVi: 'Bình yên là khi tìm thấy một nửa của đời mình',
    captionEn: 'Peace is finding your soulmate for life',
    width: 640,
    height: 960,
    objectPosition: 'center 20%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },
  {
    id: 'g-05',
    src: '/assets/photos/album-05.webp',
    srcJpg: '/assets/photos/album-05.jpg',
    altVi: 'Khoảnh khắc nâng khăn voan trước cổng hoa sân vườn',
    altEn: 'Romantic garden ceremony — Lifting the bridal veil',
    category: 'garden',
    captionVi: 'Nguyện che chở và yêu thương em suốt cuộc đời này',
    captionEn: 'Promising to protect and love you for a lifetime',
    width: 640,
    height: 960,
    objectPosition: 'center 20%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },
  {
    id: 'g-06',
    src: '/assets/photos/album-06.webp',
    srcJpg: '/assets/photos/album-06.jpg',
    altVi: 'Tháp ly pha lê và nụ cười rạng rỡ ngày trọng đại',
    altEn: 'Champagne toast celebration and bridal blooms',
    category: 'garden',
    captionVi: 'Rót đầy yêu thương và niềm hân hoan trong ngày chung đôi',
    captionEn: 'Pouring joy and eternal love on our wedding day',
    width: 640,
    height: 960,
    objectPosition: 'center 20%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },

  // Block 3: Traditional Vietnamese Cổ Phục Heritage
  {
    id: 'g-07',
    src: '/assets/photos/album-07.webp',
    srcJpg: '/assets/photos/album-07.jpg',
    altVi: 'Cổ phục Việt Nam — Quạt trầm và tà áo Nhật Bình truyền thống',
    altEn: 'Traditional Vietnamese wedding attire with ceremonial fans',
    category: 'celebration',
    captionVi: 'Nét đẹp truyền thống — Hạnh phúc trăm năm hòa quyện',
    captionEn: 'Heritage elegance — Blending timeless tradition and love',
    width: 640,
    height: 960,
    objectPosition: 'center 20%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },
  {
    id: 'g-08',
    src: '/assets/photos/album-08.webp',
    srcJpg: '/assets/photos/album-08.jpg',
    altVi: 'Nghi lễ trầu cau — Tình nồng thắm duyên lứa đôi',
    altEn: 'Betel nuts ceremony — Warm gaze of deep affection',
    category: 'celebration',
    captionVi: 'Miếng trầu nên nghĩa phu thê, trăm năm tình vẹn tròn',
    captionEn: 'Betel nut tradition sealing husband and wife bond',
    width: 640,
    height: 960,
    objectPosition: 'center 15%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },
  {
    id: 'g-09',
    src: '/assets/photos/album-09.webp',
    srcJpg: '/assets/photos/album-09.jpg',
    altVi: 'Nón quai thao duyên dáng và mâm quả trầu cau cưới',
    altEn: 'Graceful bride with Non Quai Thao conical hat',
    category: 'celebration',
    captionVi: 'Duyên dáng nàng dâu Việt trong sắc đỏ cát tường',
    captionEn: 'The grace of a Vietnamese bride in auspicious red',
    width: 640,
    height: 960,
    objectPosition: 'center 20%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },
  {
    id: 'g-10',
    src: '/assets/photos/album-10.webp',
    srcJpg: '/assets/photos/album-10.jpg',
    altVi: 'Cổ phục cưới trang nghiêm và lời chúc phúc viên mãn',
    altEn: 'Ceremonial heritage devotion and joyful union',
    category: 'celebration',
    captionVi: 'Nguyện ước trăm năm son sắt, gia đình thuận hòa',
    captionEn: 'A vow of lifelong devotion and harmonious bliss',
    width: 640,
    height: 960,
    objectPosition: 'center 20%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },
];

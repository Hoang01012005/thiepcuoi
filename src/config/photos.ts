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
  { id: 'garden', labelVi: 'Sân Vườn Lãng Mạn', labelEn: 'Romantic Garden' },
  { id: 'editorial', labelVi: 'Studio Cổ Điển', labelEn: 'Classic Studio' },
  { id: 'celebration', labelVi: 'Tiệc & Nhẫn Cưới', labelEn: 'Wedding & Rings' },
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
    src: '/assets/photos/bride.webp',
    srcJpg: '/assets/photos/bride.jpg',
    altVi: 'Cô dâu Hiệp rạng rỡ cùng bó hoa cưới',
    altEn: 'Bride Hiep with bridal bouquet',
    width: 640,
    height: 960,
  },
  groom: {
    src: '/assets/photos/groom.webp',
    srcJpg: '/assets/photos/groom.jpg',
    altVi: 'Chú rể Nam trong âu phục lịch lãm',
    altEn: 'Groom Nam in formal tuxedo',
    width: 640,
    height: 960,
  },
  coupleFormal: {
    src: '/assets/photos/couple-formal.webp',
    srcJpg: '/assets/photos/couple-formal.jpg',
    altVi: 'Ảnh cưới chân dung chính thức của cô dâu chú rể',
    altEn: 'Formal wedding portrait of the couple',
    width: 640,
    height: 960,
  },
  story01: {
    src: '/assets/photos/story-01.webp',
    srcJpg: '/assets/photos/story-01.jpg',
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
    src: '/assets/photos/story-03.webp',
    srcJpg: '/assets/photos/story-03.jpg',
    altVi: 'Khoảnh khắc trao nhẫn cầu hôn đầy hạnh phúc',
    altEn: 'Proposal ring moment',
    width: 640,
    height: 960,
  },
  story04: {
    src: '/assets/photos/story-04.webp',
    srcJpg: '/assets/photos/story-04.jpg',
    altVi: 'Lời ước hẹn trăm năm bên nhau',
    altEn: 'Promise of a lifetime',
    width: 640,
    height: 960,
  },
  closing: {
    src: '/assets/photos/closing.webp',
    srcJpg: '/assets/photos/closing.jpg',
    altVi: 'Cái ôm nồng ấm và nụ cười ngập tràn hạnh phúc',
    altEn: 'Warm joyful embrace',
    width: 640,
    height: 960,
  },
} as const;

// 10 Unique Curated Wedding Photographs configured with Editorial Layout Rhythms
export const GALLERY_PHOTOS: PhotoAsset[] = [
  // Block 1: Featured Parisian Editorial + Companion Garden Portrait (3 cols)
  {
    id: 'g-05',
    src: '/assets/photos/gallery-05.webp',
    srcJpg: '/assets/photos/gallery-05.jpg',
    altVi: 'Kiêu sa bên người thương — Không gian Paris cổ điển',
    altEn: 'Poise and elegance beside my love — Parisian Salon',
    category: 'editorial',
    captionVi: 'Sánh bước bên anh trong ngày trọng đại nhất',
    captionEn: 'Standing proud beside you on our special day',
    width: 640,
    height: 960,
    objectPosition: 'center 15%',
    editorialSpanDesktop: 2,
    aspectRatio: '16/11',
  },
  {
    id: 'g-03',
    src: '/assets/photos/gallery-03.webp',
    srcJpg: '/assets/photos/gallery-03.jpg',
    altVi: 'Nụ cười rạng rỡ của cô dâu cùng hoa cưới',
    altEn: 'Radiant smile of the bride with wedding bouquet',
    category: 'garden',
    captionVi: 'Mỗi nụ cười của em là một ngày nắng đẹp',
    captionEn: 'Every smile of yours brightens my world',
    width: 640,
    height: 960,
    objectPosition: 'center 15%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },

  // Block 2: Triptych of 3 complementary moments (3 cols)
  {
    id: 'g-06',
    src: '/assets/photos/gallery-06.webp',
    srcJpg: '/assets/photos/gallery-06.jpg',
    altVi: 'Chạm nhẹ làn khăn voan mỏng manh',
    altEn: 'Gentle touch of the bridal veil',
    category: 'garden',
    captionVi: 'Dịu dàng nâng niu từng giấc mơ hạnh phúc',
    captionEn: 'Tenderly cherishing every dream of ours',
    width: 640,
    height: 960,
    objectPosition: 'center 20%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },
  {
    id: 'g-01',
    src: '/assets/photos/gallery-01.webp',
    srcJpg: '/assets/photos/gallery-01.jpg',
    altVi: 'Khu vườn tình yêu và dải lụa thơ',
    altEn: 'Love garden with poetic scroll',
    category: 'garden',
    captionVi: 'Nắm tay em đi qua mọi thăng trầm của cuộc đời',
    captionEn: 'Walking hand in hand through all walks of life',
    width: 640,
    height: 960,
    objectPosition: 'center 20%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },
  {
    id: 'g-04',
    src: '/assets/photos/gallery-04.webp',
    srcJpg: '/assets/photos/gallery-04.jpg',
    altVi: 'Niềm vui khoảnh khắc đính hôn và ly rượu mừng',
    altEn: 'Joy of the engagement celebration and champagne',
    category: 'celebration',
    captionVi: 'Chiếc nhẫn xinh minh chứng cho lời hứa trọn đời',
    captionEn: 'The ring that seals our lifetime promise',
    width: 640,
    height: 960,
    objectPosition: 'center 25%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },

  // Block 3: Companion Garden Hug + Featured Window Sofa Silhouette (3 cols)
  {
    id: 'g-08',
    src: '/assets/photos/gallery-08.webp',
    srcJpg: '/assets/photos/gallery-08.jpg',
    altVi: 'Vòng tay siết chặt yêu thương',
    altEn: 'Loving embrace filled with joy',
    category: 'garden',
    captionVi: 'Hạnh phúc giản đơn là luôn có nhau kề cận',
    captionEn: 'Simple joy is having you forever close',
    width: 640,
    height: 960,
    objectPosition: 'center 15%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },
  {
    id: 'g-02',
    src: '/assets/photos/gallery-02.webp',
    srcJpg: '/assets/photos/gallery-02.jpg',
    altVi: 'Góc tĩnh lặng ngập tràn ánh sáng bên khung cửa',
    altEn: 'Quiet sunlight corner by the studio window',
    category: 'editorial',
    captionVi: 'Nốt lặng bình yên của tình yêu chân thành',
    captionEn: 'A tranquil interlude of true devotion',
    width: 640,
    height: 960,
    objectPosition: 'center 25%',
    editorialSpanDesktop: 2,
    aspectRatio: '16/11',
  },

  // Block 4: Triptych finale of formal elegance, deep connection & joyous smiles (3 cols)
  {
    id: 'g-07',
    src: '/assets/photos/gallery-07.webp',
    srcJpg: '/assets/photos/gallery-07.jpg',
    altVi: 'Bức chân dung cưới kinh điển nền trắng tinh khôi',
    altEn: 'Classic timeless portrait on pure white backdrop',
    category: 'editorial',
    captionVi: 'Trang trọng, thiêng liêng và vĩnh cửu',
    captionEn: 'Dignified, sacred, and everlasting',
    width: 640,
    height: 960,
    objectPosition: 'center 20%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },
  {
    id: 'g-09',
    src: '/assets/photos/gallery-09.webp',
    srcJpg: '/assets/photos/gallery-09.jpg',
    altVi: 'Ánh mắt trao gửi trọn niềm tin',
    altEn: 'Eyes reflecting trust and passion',
    category: 'garden',
    captionVi: 'Chỉ cần nhìn vào mắt anh, em biết mình đã về nhà',
    captionEn: 'In your eyes, I find where my heart belongs',
    width: 640,
    height: 960,
    objectPosition: 'center 20%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },
  {
    id: 'g-10',
    src: '/assets/photos/gallery-10.webp',
    srcJpg: '/assets/photos/gallery-10.jpg',
    altVi: 'Nụ cười ngập tràn niềm hân hoan bên bàn tiệc',
    altEn: 'Smiles of celebratory radiance by the banquet table',
    category: 'celebration',
    captionVi: 'Nguyện cùng nhau sẻ chia mọi hương vị cuộc đời',
    captionEn: 'Ready to share every flavor of life together',
    width: 640,
    height: 960,
    objectPosition: 'center 20%',
    editorialSpanDesktop: 1,
    aspectRatio: '2/3',
  },
];

// CENTRAL WEDDING CONFIGURATION
// All details can be customized here in one single place.

export interface StoryMilestone {
  id: string;
  year: string;
  dateKey: string;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  photoKey: 'story01' | 'story02' | 'story03' | 'story04';
}

export interface WeddingConfig {
  couple: {
    groom: {
      fullName: string;
      shortName: string;
      titleVi: string;
      titleEn: string;
      hometownVi: string;
      hometownEn: string;
      bioVi: string;
      bioEn: string;
      parentsVi: string;
      parentsEn: string;
    };
    bride: {
      fullName: string;
      shortName: string;
      titleVi: string;
      titleEn: string;
      hometownVi: string;
      hometownEn: string;
      bioVi: string;
      bioEn: string;
      parentsVi: string;
      parentsEn: string;
    };
    monogram: string;
  };
  event: {
    weddingDateISO: string; // ISO 8601 with explicit timezone
    timezone: string;
    lunarDateVi: string;
    lunarDateEn: string;
    ceremony: {
      time: string;
      nameVi: string;
      nameEn: string;
      venueVi: string;
      venueEn: string;
      addressVi: string;
      addressEn: string;
    };
    reception: {
      time: string;
      nameVi: string;
      nameEn: string;
      venueVi: string;
      venueEn: string;
      addressVi: string;
      addressEn: string;
      mapUrl: string;
      embedMapQuery: string;
    };
    dressCode: {
      vi: string;
      en: string;
      colors: string[];
    };
  };
  story: StoryMilestone[];
  gift: {
    enabled: boolean;
    groomBank: {
      bankName: string;
      bankCode?: string;
      accountNumber: string;
      accountHolder: string;
      qrUrl?: string;
    };
    brideBank: {
      bankName: string;
      bankCode?: string;
      accountNumber: string;
      accountHolder: string;
      qrUrl?: string;
    };
    qrCodeImage?: string;
  };
  audio: {
    enabled: boolean;
    src: string;
    title: string;
  };
  rsvp: {
    googleSheetUrl: string;
    googleSheetId: string;
    scriptUrl?: string;
  };
}

export const weddingConfig: WeddingConfig = {
  couple: {
    groom: {
      fullName: 'Hoàng Nam',
      shortName: 'Hoàng Nam',
      titleVi: 'Chú Rể',
      titleEn: 'The Groom',
      hometownVi: 'Bảo Lộc 5, Phúc Lộc, Hà Nội',
      hometownEn: 'Bao Loc 5, Phuc Loc, Hanoi',
      bioVi: 'Quê quán: Thôn Bảo Lộc 5, xã Phúc Lộc, Hà Nội. Một chàng trai luôn vững vàng, ấm áp và dành trọn niềm tin yêu vào tổ ấm tương lai.',
      bioEn: 'Hometown: Bao Loc 5, Phuc Loc, Hanoi. A steady and warm-hearted soul devoted to creating a loving lifetime together.',
      parentsVi: 'Đại diện Nhà Trai (Bảo Lộc 5, Phúc Lộc, Hà Nội)',
      parentsEn: 'Groom\'s Parents (Bao Loc 5, Phuc Loc, Hanoi)',
    },
    bride: {
      fullName: 'Ngọc Hiệp',
      shortName: 'Ngọc Hiệp',
      titleVi: 'Cô Dâu',
      titleEn: 'The Bride',
      hometownVi: 'Bảo Lộc 4, Phúc Lộc, Hà Nội',
      hometownEn: 'Bao Loc 4, Phuc Loc, Hanoi',
      bioVi: 'Quê quán: Thôn Bảo Lộc 4, xã Phúc Lộc, Hà Nội. Một cô gái dịu dàng, nụ cười rạng rỡ, người mang đến sự an yên và niềm vui cho từng khoảnh khắc.',
      bioEn: 'Hometown: Bao Loc 4, Phuc Loc, Hanoi. A gentle spirit with a radiant smile who brings peace and joy to every single day.',
      parentsVi: 'Đại diện Nhà Gái (Bảo Lộc 4, Phúc Lộc, Hà Nội)',
      parentsEn: 'Bride\'s Parents (Bao Loc 4, Phuc Loc, Hanoi)',
    },
    monogram: 'N & H',
  },
  event: {
    weddingDateISO: '2026-12-28T18:00:00+07:00',
    timezone: 'Asia/Ho_Chi_Minh',
    lunarDateVi: 'Ngày 20 tháng 11 năm Bính Ngọ',
    lunarDateEn: '20th day of the 11th Lunar Month',
    ceremony: {
      time: '11:00 AM',
      nameVi: 'Lễ Vu Quy & Thành Hôn',
      nameEn: 'Traditional Marriage Ceremony',
      venueVi: 'Tư Gia Nhà Gái & Nhà Trai',
      venueEn: 'Private Family Residences',
      addressVi: 'Nhà Trai: Thôn Bảo Lộc 5, Phúc Lộc, Hà Nội • Nhà Gái: Thôn Bảo Lộc 4, Phúc Lộc, Hà Nội',
      addressEn: 'Groom: Bao Loc 5, Phuc Loc, Hanoi • Bride: Bao Loc 4, Phuc Loc, Hanoi',
    },
    reception: {
      time: '18:00 PM',
      nameVi: 'Tiệc Cưới Chung Vui',
      nameEn: 'Wedding Banquet Celebration',
      venueVi: 'Melia Grand Ballroom — Khách Sạn Melia',
      venueEn: 'Melia Grand Ballroom — Melia Hotel',
      addressVi: '44B Lý Thường Kiệt, Phường Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội',
      addressEn: '44B Ly Thuong Kiet Street, Hoan Kiem District, Hanoi',
      mapUrl: 'https://maps.google.com/?q=Melia+Hanoi+Hotel',
      embedMapQuery: 'Melia Hanoi',
    },
    dressCode: {
      vi: 'Trang phục trang nhã (Pastel, Hồng phấn, Be, Trắng ngà, Đen lịch lãm)',
      en: 'Elegant Formal (Pastel, Blush Pink, Beige, Ivory, Black Tie)',
      colors: ['#F3D5DA', '#C98291', '#F7EFE9', '#D5B58C', '#49343A'],
    },
  },
  story: [
    {
      id: 'encounter',
      year: '2021',
      dateKey: '14.02.2021',
      titleVi: 'Ngày Đầu Gặp Gỡ',
      titleEn: 'The First Spark',
      descriptionVi: 'Vào một buổi chiều thu dịu mát, ánh mắt chạm nhau giữa dòng người tấp nập đã gieo mầm cho câu chuyện tình yêu diệu kỳ.',
      descriptionEn: 'On a gentle autumn afternoon, our paths crossed in the bustling city, planting the seed of a beautiful love story.',
      photoKey: 'story01',
    },
    {
      id: 'growing',
      year: '2023',
      dateKey: '24.12.2023',
      titleVi: 'Những Ngày Chung Bước',
      titleEn: 'Walking Hand in Hand',
      descriptionVi: 'Cùng nhau đi qua những miền đất mới, sẻ chia những vui buồn và nhận ra đối phương chính là bến đỗ bình yên nhất.',
      descriptionEn: 'Exploring new destinations together, sharing life’s joys and quiet moments, discovering home in each other’s presence.',
      photoKey: 'story02',
    },
    {
      id: 'proposal',
      year: '2025',
      dateKey: '20.10.2025',
      titleVi: 'Lời Cầu Hôn Ngọt Ngào',
      titleEn: 'She Said Yes',
      descriptionVi: 'Dưới ánh nến lung linh và giai điệu tình ca, chiếc nhẫn trao tay cùng lời ước hẹn trọn đời đã được đáp lại bằng nụ cười hạnh phúc.',
      descriptionEn: 'Under romantic candlelight and our favorite melody, the question was asked and answered with joyful tears and a forever promise.',
      photoKey: 'story03',
    },
    {
      id: 'wedding',
      year: '2026',
      dateKey: '28.12.2026',
      titleVi: 'Ngày Hạnh Phúc Trọn Vẹn',
      titleEn: 'Our Forever Begins',
      descriptionVi: 'Khoảnh khắc thiêng liêng khi hai trái tim chính thức hòa làm một trước sự chứng kiến và chúc phúc của những người thân yêu.',
      descriptionEn: 'The blessed day when two hearts become one forever, surrounded by the love and blessings of our dearest family and friends.',
      photoKey: 'story04',
    },
  ],
  gift: {
    enabled: true,
    groomBank: {
      bankName: 'Techcombank (Ngân hàng TMCP Kỹ Thương)',
      bankCode: 'TCB',
      accountNumber: '19036888999999',
      accountHolder: 'HOANG NAM',
      qrUrl: 'https://img.vietqr.io/image/TCB-19036888999999-compact2.png?amount=0&addInfo=Mung%20Cuoi%20Hoang%20Nam%20Ngoc%20Hiep&accountName=HOANG%20NAM',
    },
    brideBank: {
      bankName: 'Vietcombank (Ngân hàng TMCP Ngoại Thương)',
      bankCode: 'VCB',
      accountNumber: '0011004567890',
      accountHolder: 'NGOC HIEP',
      qrUrl: 'https://img.vietqr.io/image/VCB-0011004567890-compact2.png?amount=0&addInfo=Mung%20Cuoi%20Hoang%20Nam%20Ngoc%20Hiep&accountName=NGOC%20HIEP',
    },
  },
  audio: {
    enabled: true,
    src: '/assets/audio/nhacnencuoidi.mp3',
    title: 'Cưới Đi — Nhạc Lễ Cưới Hoàng Nam & Ngọc Hiệp',
  },
  rsvp: {
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/18ZRmmnf7wJhgfRVMqxJewOLsps4IPV9J--CqG1lPtLo/edit?gid=0#gid=0',
    googleSheetId: '18ZRmmnf7wJhgfRVMqxJewOLsps4IPV9J--CqG1lPtLo',
    scriptUrl: '',
  },
};

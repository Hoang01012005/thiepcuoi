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
    logo: {
      src: string;
      srcPng: string;
      badgeSrc: string;
      alt: string;
    };
  };
  event: {
    weddingDateISO: string; // ISO 8601 with explicit timezone
    banquetDateISO?: string;
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
      hometownVi: 'Số 22, ngõ 11, Bảo Lộc 2, Phúc Lộc, Hà Nội',
      hometownEn: 'No. 22, Alley 11, Bao Loc 2, Phuc Loc, Hanoi',
      bioVi: 'Quê quán: Số 22, ngõ 11, Bảo Lộc 2, Phúc Lộc, Hà Nội. Một chàng trai luôn vững vàng, ấm áp và dành trọn niềm tin yêu vào tổ ấm tương lai.',
      bioEn: 'Hometown: No. 22, Alley 11, Bao Loc 2, Phuc Loc, Hanoi. A steady and warm-hearted soul devoted to creating a loving lifetime together.',
      parentsVi: 'Nguyễn Văn Tỉnh — Đoàn Thị Nga',
      parentsEn: 'Mr. Nguyen Van Tinh — Mrs. Doan Thi Nga',
    },
    bride: {
      fullName: 'Ngọc Hiệp',
      shortName: 'Ngọc Hiệp',
      titleVi: 'Cô Dâu',
      titleEn: 'The Bride',
      hometownVi: 'Số 11, Bảo Lộc 2, Phúc Lộc, Hà Nội',
      hometownEn: 'No. 11, Bao Loc 2, Phuc Loc, Hanoi',
      bioVi: 'Quê quán: Số 11, Bảo Lộc 2, Phúc Lộc, Hà Nội. Một cô gái dịu dàng, nụ cười rạng rỡ, người mang đến sự an yên và niềm vui cho từng khoảnh khắc.',
      bioEn: 'Hometown: No. 11, Bao Loc 2, Phuc Loc, Hanoi. A gentle spirit with a radiant smile who brings peace and joy to every single day.',
      parentsVi: 'Đoàn Văn Hùng — Đoàn Thị Huyền',
      parentsEn: 'Mr. Doan Van Hung — Mrs. Doan Thi Huyen',
    },
    monogram: 'N & H',
    logo: {
      src: '/assets/photos/wedding-logo.webp',
      srcPng: '/assets/photos/wedding-logo.png',
      badgeSrc: '/assets/photos/wedding-logo-badge.webp',
      alt: 'Logo cưới Hoàng Nam & Ngọc Hiệp (N & H)',
    },
  },
  event: {
    weddingDateISO: '2026-11-29T09:00:00+07:00',
    banquetDateISO: '2026-11-28T15:00:00+07:00',
    timezone: 'Asia/Ho_Chi_Minh',
    lunarDateVi: 'Ngày 21 tháng 10 năm Bính Ngọ',
    lunarDateEn: '21st day of the 10th Lunar Month',
    ceremony: {
      time: '09:00 AM — Chủ Nhật, 29/11/2026',
      nameVi: 'Lễ Vu Quy',
      nameEn: 'Traditional Marriage Ceremony',
      venueVi: 'Tư Gia Nhà Gái & Nhà Trai',
      venueEn: 'Private Family Residences',
      addressVi: 'Nhà Gái: Số 11, Bảo Lộc 2, Phúc Lộc, Hà Nội • Nhà Trai: Số 22, ngõ 11, Bảo Lộc 2, Phúc Lộc, Hà Nội',
      addressEn: 'Bride: No. 11, Bao Loc 2, Phuc Loc, Hanoi • Groom: No. 22, Alley 11, Bao Loc 2, Phuc Loc, Hanoi',
    },
    reception: {
      time: '15:00 PM — Thứ Bảy, 28/11/2026',
      nameVi: 'Tiệc Cưới Chung Vui',
      nameEn: 'Wedding Banquet Celebration',
      venueVi: 'Tư Gia Nhà Gái',
      venueEn: 'Bride Residence',
      addressVi: 'Số 11, Bảo Lộc 2, Phúc Lộc, Hà Nội',
      addressEn: 'No. 11, Bao Loc 2, Phuc Loc, Hanoi',
      mapUrl: 'https://maps.google.com/?q=S%E1%BB%91%2011,%20B%E1%BA%A3o%20L%E1%BB%99c%202,%20Ph%C3%BAc%20L%E1%BB%99c,%20H%C3%A0%20N%E1%BB%99i',
      embedMapQuery: 'Số 11, Bảo Lộc 2, Phúc Lộc, Hà Nội',
    },
    dressCode: {
      vi: 'Be · Kem · Nâu nhạt · Xanh pastel · Ghi xám',
      en: 'Beige · Cream · Soft Brown · Pastel Sage · Warm Grey',
      colors: ['#EEDBC5', '#FFF9ED', '#C2A68C', '#B8C9C4', '#A7A6A6'],
    },
  },
  story: [
    {
      id: 'encounter',
      year: '2024',
      dateKey: 'Tháng 8/2024',
      titleVi: 'CHƯƠNG 1: NGÀY ĐẦU GẶP GỠ',
      titleEn: 'Chapter 1: The First Encounter',
      descriptionVi: 'Tháng 8/2024, chúng mình bắt đầu làm quen nhau qua những dòng tin nhắn giản đơn. Từ hai người xa lạ, những câu chuyện nhỏ dần trở nên thân quen, những lời hỏi han dần trở thành một phần trong cuộc sống của nhau. Khi ấy, chúng mình chẳng thể ngờ rằng, cuộc trò chuyện bình thường ngày hôm đó lại chính là khởi đầu cho một hành trình yêu thương thật đẹp.',
      descriptionEn: 'In August 2024, we started connecting through simple messages. From strangers, daily conversations became warmly familiar and an indispensable part of our lives, marking the start of a beautiful journey.',
      photoKey: 'story01',
    },
    {
      id: 'growing',
      year: '2025',
      dateKey: '08.02.2025',
      titleVi: 'CHƯƠNG 2: NGÀY BƯỚC CHUNG ĐÔI',
      titleEn: 'Chapter 2: Walking Together',
      descriptionVi: 'Ngày 08/02/2025, chúng mình chính thức đồng ý bước vào hành trình yêu thương. Từ những bó hoa mang nét lãng mạn của thế hệ 9x đến những bó hoa đầy màu sắc của Gen Z, tình yêu cứ thế lớn dần qua từng điều giản dị. Chúng mình cùng chia sẻ cảm xúc, cùng trải qua những niềm vui, đôi lần giận hờn và cả những cuộc cãi vã. Nhưng chính những điều ấy đã giúp cả hai học cách lắng nghe, thấu hiểu và yêu thương nhau nhiều hơn. Cứ thế, từng kỷ niệm nhỏ được góp nhặt, tạo nên câu chuyện tình yêu mang dấu ấn riêng của hai đứa.',
      descriptionEn: 'On February 8, 2025, we officially began our shared journey. Through joy, heartfelt talks, and growing together, we learned to listen, understand, and cherish each other deeply every day.',
      photoKey: 'story02',
    },
    {
      id: 'proposal',
      year: '2026',
      dateKey: '25.09.2026',
      titleVi: 'CHƯƠNG 3: LỜI CẦU HÔN',
      titleEn: 'Chapter 3: The Proposal',
      descriptionVi: 'Ngày 25/09/2026, một dấu mốc đặc biệt đã đến trong hành trình của chúng mình. Không có sự cầu kỳ hay xa hoa, buổi cầu hôn diễn ra thật giản dị và mộc mạc. Chiếc nhẫn em tự tay lựa chọn cùng lời cầu hôn ngọt ngào từ anh đã khiến khoảnh khắc ấy trở nên đáng nhớ hơn bao giờ hết. Và em đã gật đầu đồng ý, đồng ý cùng anh viết tiếp câu chuyện tình yêu, cùng hướng về một tương lai chung và một mái ấm nhỏ mang tên gia đình.',
      descriptionEn: 'On September 25, 2026, a simple yet unforgettable proposal touched our hearts. With sweet promises and joyful smiles, she said Yes to building a warm family and forever together.',
      photoKey: 'story03',
    },
    {
      id: 'wedding',
      year: '2026',
      dateKey: '29.11.2026',
      titleVi: 'CHƯƠNG 4: CHUNG BƯỚC – TRỌN ĐỜI HẠNH PHÚC',
      titleEn: 'Chapter 4: Together Forever',
      descriptionVi: 'Ngày 29/11/2026, chúng mình chính thức về chung một nhà, bắt đầu một hành trình mới với hai chữ “gia đình”. Từ nay, chúng mình không chỉ là người yêu mà còn là bạn đời, là người cùng nhau sẻ chia mọi niềm vui, nỗi buồn và những điều bình dị nhất trong cuộc sống. Chặng đường phía trước có thể còn nhiều thử thách, nhưng chỉ cần luôn nắm tay nhau, cùng thấu hiểu, bao dung và vun đắp yêu thương, chúng mình tin rằng hạnh phúc sẽ luôn đong đầy. Câu chuyện tình yêu không khép lại ở ngày cưới, mà từ đây sẽ mở ra một chương mới – chương của sự đồng hành, của mái ấm nhỏ và của lời hứa cùng nhau đi đến cuối con đường.',
      descriptionEn: 'On November 29, 2026, we officially unite as husband and wife. Hand in hand with mutual devotion and love, a beautiful lifelong chapter of family and companionship begins.',
      photoKey: 'story04',
    },
  ],
  gift: {
    enabled: true,
    groomBank: {
      bankName: 'TPBank (Ngân hàng TMCP Tiên Phong)',
      bankCode: 'TPB',
      accountNumber: '0019 0019 202',
      accountHolder: 'NGUYEN VAN NAM',
      qrUrl: '/assets/photos/qr-groom.png',
    },
    brideBank: {
      bankName: 'Techcombank (Ngân hàng TMCP Kỹ Thương)',
      bankCode: 'TCB',
      accountNumber: '7620 0022 22',
      accountHolder: 'DOAN THI HIEP',
      qrUrl: '/assets/photos/qr-bride.png',
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

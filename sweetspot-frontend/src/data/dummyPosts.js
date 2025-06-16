// 더미 게시글 데이터
export const dummyPosts = [
  {
    postId: 1,
    pinId: 101,
    title: "충북대 근처 맛집 추천!",
    nickname: "맛집탐험가",
    content: "충북대 정문 근처에 있는 파스타 전문점이에요. 크림파스타가 정말 맛있고 분위기도 좋아서 데이트하기 딱 좋은 곳입니다. 가격도 합리적이고 직원분들도 친절해요!",
    updatedAt: "2025-06-14T10:30:00",
    likes: 15,
    userId: 1,
    comments: [
      {
        commentId: 1,
        userId: 2,
        nickname: "음식러버",
        content: "저도 가봤는데 정말 맛있더라구요! 추천합니다 👍",
        updatedAt: "2025-06-14T11:15:00",
        likes: 3
      },
      {
        commentId: 2,
        userId: 3,
        nickname: "대학생A",
        content: "가격이 어느 정도 되나요?",
        updatedAt: "2025-06-14T12:20:00",
        likes: 1
      }
    ],
    images: [
      {
        imageId: 1,
        imageUrl: "https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=파스타+맛집"
      }
    ]
  },
  {
    postId: 2,
    pinId: 102,
    title: "도서관 공부하기 좋은 카페",
    nickname: "공부벌레",
    content: "시험기간에 도서관이 너무 붐빌 때 가면 좋은 카페입니다. 24시간 운영하고 와이파이도 빠르고 콘센트도 많아서 노트북 작업하기 좋아요. 음료도 맛있고 조용해서 집중도 잘 됩니다.",
    updatedAt: "2025-06-13T14:45:00",
    likes: 8,
    userId: 2,
    comments: [
      {
        commentId: 3,
        userId: 1,
        nickname: "맛집탐험가",
        content: "정보 감사합니다! 다음 시험기간에 가봐야겠어요",
        updatedAt: "2025-06-13T15:30:00",
        likes: 2
      }
    ],
    images: [
      {
        imageId: 2,
        imageUrl: "https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=스터디+카페"
      }
    ]
  },
  {
    postId: 3,
    pinId: 103,
    title: "야경 맛집 산책로",
    nickname: "야경사진가",
    content: "충북대 뒤쪽 산책로인데 밤에 가면 야경이 정말 예뻐요. 특히 일몰 후 한 시간 정도가 가장 좋은 것 같습니다. 커플들이나 사진 찍기 좋아하는 분들께 추천드려요!",
    updatedAt: "2025-06-12T19:20:00",
    likes: 22,
    userId: 3,
    comments: [
      {
        commentId: 4,
        userId: 2,
        nickname: "공부벌레",
        content: "사진이 정말 이뻐요! 위치 좀 더 자세히 알 수 있을까요?",
        updatedAt: "2025-06-12T20:10:00",
        likes: 1
      },
      {
        commentId: 5,
        userId: 4,
        nickname: "사진초보",
        content: "저도 사진 찍으러 가고 싶네요. 어떤 카메라 쓰시나요?",
        updatedAt: "2025-06-13T09:15:00",
        likes: 0
      }
    ],
    images: [
      {
        imageId: 3,
        imageUrl: "https://via.placeholder.com/400x300/1A535C/FFFFFF?text=야경+산책로"
      },
      {
        imageId: 4,
        imageUrl: "https://via.placeholder.com/400x300/FFE66D/000000?text=산책로+전경"
      }    ]
  },
  {
    postId: 4,
    pinId: 101,
    title: "충북대 도서관 스터디룸 예약 꿀팁",
    nickname: "도서관마스터",
    content: "충북대 중앙도서관 스터디룸 예약하기 힘드시죠? 제가 3년간 써본 꿀팁들을 공유합니다. 새벽 12시에 정확히 예약하면 잡을 확률이 높아요. 그리고 취소표가 자주 나오니까 수시로 체크해보세요!",
    updatedAt: "2025-06-11T08:30:00",
    likes: 32,
    userId: 4,
    comments: [
      {
        commentId: 6,
        userId: 1,
        nickname: "맛집탐험가",
        content: "꿀팁 정말 감사합니다! 덕분에 스터디룸 잡았어요 ㅠㅠ",
        updatedAt: "2025-06-11T12:45:00",
        likes: 5
      }
    ],
    images: [
      {
        imageId: 5,
        imageUrl: "https://via.placeholder.com/400x300/6C5CE7/FFFFFF?text=도서관+스터디룸"
      }
    ]
  },
  {
    postId: 5,
    pinId: 102,
    title: "충북대 근처 저렴한 점심 맛집 모음",
    nickname: "학생밥집탐험가",
    content: "한 달 동안 충북대 근처 식당들을 돌아다니며 가성비 좋은 곳들만 정리했습니다. 7천원 이하로 배부르게 먹을 수 있는 곳들 위주로 소개드려요. 특히 개신동 쪽에 숨은 맛집들이 많아요!",
    updatedAt: "2025-06-10T13:20:00",
    likes: 28,
    userId: 5,
    comments: [
      {
        commentId: 7,
        userId: 2,
        nickname: "공부벌레",
        content: "학생한테 정말 유용한 정보네요! 내일 바로 가봐야겠어요",
        updatedAt: "2025-06-10T14:30:00",
        likes: 2
      },
      {
        commentId: 8,
        userId: 3,
        nickname: "야경사진가",
        content: "개신동 맛집 정보 더 알려주세요!",
        updatedAt: "2025-06-10T16:10:00",
        likes: 1
      }
    ],
    images: [
      {
        imageId: 6,
        imageUrl: "https://via.placeholder.com/400x300/00B894/FFFFFF?text=가성비+맛집"
      }
    ]
  },
  {
    postId: 6,
    pinId: 103,
    title: "충북대 벚꽃 명소 사진 스팟",
    nickname: "사진작가지망생",
    content: "벚꽃철이 지나긴 했지만 내년을 위해 미리 공유해요! 충북대 캠퍼스 내에서 벚꽃 사진 찍기 좋은 숨은 명소들을 정리했습니다. 특히 후문 쪽 언덕길이 정말 예뻐요. 골든아워 때 가시면 인생샷 건집니다!",
    updatedAt: "2025-06-09T17:45:00",
    likes: 19,
    userId: 6,
    comments: [
      {
        commentId: 9,
        userId: 3,
        nickname: "야경사진가",
        content: "와 정말 좋은 정보네요! 내년 벚꽃철에 꼭 가봐야겠어요",
        updatedAt: "2025-06-09T18:30:00",
        likes: 1
      }
    ],
    images: [
      {
        imageId: 7,
        imageUrl: "https://via.placeholder.com/400x300/FD79A8/FFFFFF?text=벚꽃+명소"
      },
      {
        imageId: 8,
        imageUrl: "https://via.placeholder.com/400x300/FDCB6E/000000?text=후문+언덕길"
      }
    ]
  }
];

// 더미 핀 위치 정보
export const dummyPins = [
  {
    pinId: 101,
    latitude: 36.6287,
    longitude: 127.4560,
    title: "충북대 정문 근처 파스타집",
    address: "충청북도 청주시 서원구 충대로 1"
  },
  {
    pinId: 102,
    latitude: 36.6295,
    longitude: 127.4570,
    title: "24시간 스터디 카페",
    address: "충청북도 청주시 서원구 개신동"
  },
  {
    pinId: 103,
    latitude: 36.6310,
    longitude: 127.4545,
    title: "야경 명소 산책로",
    address: "충청북도 청주시 서원구 충대로 뒷산"
  }
];

// 더미 사용자 정보
export const dummyUsers = [
  { userId: 1, nickname: "맛집탐험가" },
  { userId: 2, nickname: "공부벌레" },
  { userId: 3, nickname: "야경사진가" },
  { userId: 4, nickname: "도서관마스터" },
  { userId: 5, nickname: "학생밥집탐험가" },
  { userId: 6, nickname: "사진작가지망생" },
  { userId: 7, nickname: "현재사용자" }
];

export default dummyPosts;

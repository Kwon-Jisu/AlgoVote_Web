import { Candidate, Pledge, Statement, QnA } from '@/types';

/**
 * 후보자 데이터
 * 모든 페이지에서 재사용 가능한 후보자 정보입니다.
 * 추후 Supabase에서 데이터를 가져오는 것으로 대체될 예정입니다.
 */
export const candidates: Candidate[] = [
  {
    id: 'lee-jaemyung',
    name: '이재명',
    party: '더불어민주당',
    age: 58,
    birthplace: '경기도 안양시',
    education: ['중앙대학교 법학과 졸업'],
    career: ['제20대 더불어민주당 대선 후보', '전 경기도지사', '전 성남시장'],
    slogan: '지속 가능한 미래를 위한 혁신',
    profileImage: '/images/candidates/lee-jaemyung.jpg',
    websiteUrl: 'https://www.candidate-website.kr',
  },
  {
    id: 'kim-moonsoo',
    name: '김문수',
    party: '국민의힘',
    age: 67,
    birthplace: '경상남도 창녕군',
    education: ['서울대학교 법학과 졸업'],
    career: ['제20대 국민의힘 대선 경선 후보', '전 자유한국당 대표', '전 경상남도지사'],
    slogan: '국민과 함께하는 새로운 정치',
    profileImage: '/images/candidates/kim-moonsoo.jpg',
    websiteUrl: 'https://www.candidate-website.kr',
  },
  {
    id: 'lee-junseok',
    name: '이준석',
    party: '국민의힘',
    age: 36,
    birthplace: '서울특별시',
    education: ['서울대학교 컴퓨터공학과 졸업'],
    career: ['제20대 국민의힘 대표', '전 미래통합당 최고위원', '전 한국미래연합 공동대표'],
    slogan: '경제 성장과 사회 안정을 위해',
    profileImage: '/images/candidates/lee-junseok.jpg',
    websiteUrl: 'https://www.candidate-website.kr',
  },
];

/**
 * 후보자 공약 데이터
 * 각 후보별 공약 정보를 담고 있습니다.
 */
export const pledges: Pledge[] = [
  // 이재명 후보 공약
  {
    id: 'lee-jaemyung-pledge-1',
    candidateId: 'lee-jaemyung',
    title: '청년 일자리 창출 및 주거 안정 지원',
    summary: '청년 창업 지원금 확대 및 청년 전용 임대주택 공급 확대로 청년 세대의 경제적 자립 지원',
    category: '청년/일자리',
    background: '청년 실업률 증가와 주거비 부담 증가로 인한 청년 세대의 경제적 어려움을 해소하고, 청년들의 사회 진출과 자립을 지원하기 위함',
    content: [
      '청년 창업 지원금 연간 3천만원까지 확대 및 창업 인큐베이팅 센터 확충',
      '청년 전용 임대주택 5년간 10만호 공급 및 청년 주거비 지원 확대',
      '청년 일자리 창출을 위한 기업 인센티브 제도 도입',
      '청년 디지털 역량 강화 교육 프로그램 확대'
    ],
    implementation: '청년기본법 개정을 통한 청년 지원 확대, 주택법 개정을 통한 청년 주택 공급 확대, 조세특례제한법 개정을 통한 청년 고용 기업 세제 혜택 확대',
    period: '취임 즉시 추진, 임기 내 단계적 확대',
    funding: '청년 지원 특별 예산 편성(연간 5천억원), 주택도시기금 활용, 민간 투자 유치를 통한 청년 창업 지원 펀드 조성',
    order: 1
  },
  {
    id: 'lee-jaemyung-pledge-2',
    candidateId: 'lee-jaemyung',
    title: '중소기업 및 소상공인 지원 강화',
    summary: '디지털 전환 지원 및 세제 혜택 확대를 통한 지역 경제 활성화',
    category: '경제/산업',
    background: '코로나19 이후 어려움을 겪고 있는 중소기업과 소상공인의 경영 안정과 경쟁력 강화를 통한 지역 경제 활성화',
    content: [
      '중소기업 디지털 전환 지원 사업 확대(연간 지원 기업 1만개)',
      '소상공인 온라인 판로 지원 및 배달 앱 수수료 인하 지원',
      '중소기업 및 소상공인 세제 혜택 확대',
      '지역 화폐, 활성화를 통한 지역 경제 순환 강화'
    ],
    implementation: '중소기업기본법 및 소상공인 보호법 개정, 지역 화폐 활성화를 위한 조례 제정, 중소기업 디지털 전환 지원 특별법 제정',
    period: '취임 후 6개월 내 관련 법안 발의, 임기 내 단계적 확대',
    funding: '중소기업 지원 특별 예산 편성(연간 1조원), 디지털 전환 지원 기금 조성, 민간 투자 유치',
    order: 2
  },
  {
    id: 'lee-jaemyung-pledge-3',
    candidateId: 'lee-jaemyung',
    title: '교육 격차 해소 및 공교육 강화',
    summary: '지역 간 교육 격차 해소를 위한 교육 인프라 확충 및 디지털 교육 환경 개선',
    category: '교육',
    background: '지역 간, 계층 간 교육 격차 심화로 인한 교육 불평등 해소 및 공교육 경쟁력 강화',
    content: [
      '교육 취약 지역 학교 시설 및 교육 환경 개선',
      '디지털 교육 인프라 확충 및 교육 콘텐츠 개발',
      '교육 소외계층 맞춤형 교육 지원 확대',
      '교사 역량 강화 및 처우 개선'
    ],
    implementation: '교육기본법 및 초중등교육법 개정, 교육 격차 해소를 위한 특별법 제정, 교육 예산 확대',
    period: '취임 후 1년 내 관련 법안 발의, 임기 내 단계적 확대',
    funding: '교육 예산 확대(GDP 대비 5% 이상), 교육 격차 해소 특별 기금 조성, 민간 기업의 교육 기부 활성화',
    order: 3
  },
  
  // 김문수 후보 공약
  {
    id: 'kim-moonsoo-pledge-1',
    candidateId: 'kim-moonsoo',
    title: '기업 중심 경제 활성화',
    summary: '기업 규제 완화, 세금 감면, 투자 활성화를 통한 기업 중심 경제 회복',
    category: '경제/산업',
    background: '과도한 규제와 세금 부담으로 인한 기업 경쟁력 약화와 투자 감소를 극복하고, 기업이 경제 성장을 이끌 수 있는 환경 조성',
    content: [
      '대기업 규제 완화 및 기업 경영 환경 개선',
      '법인세 인하 및 투자 세액 공제 확대',
      '기업 투자 활성화를 위한 규제 개혁',
      '혁신 기업 지원을 통한 신산업 육성'
    ],
    implementation: '경제활력특별법 제정, 조세특례제한법 개정, 규제개혁기본법 제정',
    period: '취임 즉시 추진, 임기 내 단계적 확대',
    funding: '세제 개편을 통한 재정 확보, 기업 투자 확대를 통한 경제 성장',
    order: 1
  },
  {
    id: 'kim-moonsoo-pledge-2',
    candidateId: 'kim-moonsoo',
    title: '교육 자율성 확대 및 경쟁력 강화',
    summary: '교육 자율성 확대, 경쟁력 강화, 수월성 교육 강화를 통한 글로벌 인재 양성',
    category: '교육',
    background: '교육의 자율성 약화와 글로벌 경쟁력 저하를 극복하고, 우수 인재 양성을 위한 교육 시스템 개혁',
    content: [
      '학교 운영의 자율성 확대 및 다양한 교육 모델 도입',
      '영재교육 및 수월성 교육 강화',
      '입시제도 안정화 및 대학 자율성 확대',
      '글로벌 교육 협력 강화를 통한 국제 경쟁력 향상'
    ],
    implementation: '교육기본법 개정, 교육자치법 개정, 고등교육법 개정, 영재교육진흥법 개정',
    period: '취임 후 1년 내 관련 법안 발의, 임기 내 단계적 확대',
    funding: '교육 예산 효율화, 민간 참여 확대를 통한 교육 투자 증대',
    order: 2
  },
  {
    id: 'kim-moonsoo-pledge-3',
    candidateId: 'kim-moonsoo',
    title: '국방력 강화 및 한미동맹 강화',
    summary: '국방력 강화, 한미일 안보협력 강화, 자주국방 역량 강화를 통한 국가 안보 확립',
    category: '외교/안보',
    background: '북한 핵 위협과 주변국 정세 변화에 대응하여 국가 안보를 강화하고, 한반도 평화와 안정을 위한 안보 역량 강화',
    content: [
      '첨단 무기체계 개발 및 국방 예산 확대',
      '한미동맹 강화 및 한미일 안보협력 확대',
      '북핵 위협에 대한 강경 대응 및 억제력 강화',
      '자주국방 역량 강화 및 방위산업 육성'
    ],
    implementation: '국방개혁법 개정, 방위산업육성법 제정, 한미동맹강화특별법 제정',
    period: '취임 즉시 추진, 임기 내 지속적 확대',
    funding: '국방 예산 확대(GDP 대비 3.5%), 방위산업 투자 확대',
    order: 3
  },
  
  // 이준석 후보 공약
  {
    id: 'lee-junseok-pledge-1',
    candidateId: 'lee-junseok',
    title: '디지털 혁신 및 스타트업 생태계 육성',
    summary: '청년 중심 스타트업 생태계 육성, 디지털 전환 지원, 미래산업 투자 확대',
    category: '경제/산업',
    background: '4차 산업혁명 시대에 대응하여 디지털 경제로의 전환을 가속화하고, 청년들이 주도하는 혁신 창업 생태계 조성',
    content: [
      '스타트업 규제 완화 및 투자 지원 확대',
      '청년 창업자 세제 혜택 및 창업 지원금 확대',
      '디지털 전환 중소기업 지원 및 디지털 인프라 확충',
      '미래 산업 투자 펀드 조성 및 글로벌 진출 지원'
    ],
    implementation: '스타트업지원특별법 제정, 벤처투자촉진법 개정, 디지털경제기본법 제정',
    period: '취임 즉시 추진, 임기 내 단계적 확대',
    funding: '미래산업 투자 기금 조성(연간 10조원), 벤처 투자 세제 혜택 확대',
    order: 1
  },
  {
    id: 'lee-junseok-pledge-2',
    candidateId: 'lee-junseok',
    title: 'AI 교육 혁신 및 디지털 인재 양성',
    summary: 'AI 교육 프로그램 도입, 디지털 리터러시 강화, 메타버스 교육 플랫폼 구축',
    category: '교육',
    background: '디지털 시대에 필요한 인재 양성을 위한 교육 혁신과 AI, 메타버스 등 첨단 기술을 활용한 교육 환경 개선',
    content: [
      'AI 교육 프로그램 전국 학교 도입 및 디지털 리터러시 교육 강화',
      '메타버스 기반 교육 플랫폼 구축 및 온라인 교육 확대',
      '평생교육 체계 구축 및 디지털 재교육 프로그램 확대',
      '글로벌 디지털 인재 양성을 위한 국제 협력 강화'
    ],
    implementation: '교육혁신특별법 제정, 디지털교육진흥법 제정, 평생교육법 개정',
    period: '취임 후 1년 내 관련 시스템 구축, 임기 내 단계적 확대',
    funding: '디지털 교육 예산 확대(연간 5조원), 민간 기업 참여 교육 투자 유치',
    order: 2
  },
  {
    id: 'lee-junseok-pledge-3',
    candidateId: 'lee-junseok',
    title: '청년 주거 지원 및 스마트 도시 개발',
    summary: '청년 맞춤형 주택 공급 확대, 스마트 도시 개발, 디지털 기반 주거 서비스 혁신',
    category: '주거/부동산',
    background: '청년 세대의 주거 불안 해소와 도시 경쟁력 강화를 위한 스마트 기술 기반 도시 개발 및 주거 환경 혁신',
    content: [
      '청년 맞춤형 주택 5년간 30만호 공급 및 청년 주거비 지원 확대',
      '스마트시티 시범 도시 10개 개발 및 디지털 기반 도시 관리 시스템 구축',
      '세대별 맞춤형 주택정책 수립 및 생애주기별 주거 지원 확대',
      '도심 재생 프로젝트를 통한 구도심 활성화 및 커뮤니티 중심 주거 환경 조성'
    ],
    implementation: '청년주거지원특별법 제정, 스마트도시법 개정, 도시재생법 개정',
    period: '취임 후 6개월 내 관련 법안 발의, 임기 내 단계적 확대',
    funding: '주택도시기금 확대, 스마트시티 개발 민간 투자 유치, 청년 주거 지원 특별 예산 편성',
    order: 3
  },
  
  // 다른 후보들의 공약은 추가해야 함
  // 나머지 후보들의 공약을 각자 ID에 맞게 추가해주세요

];

/**
 * 후보자 발언 데이터
 * 각 후보별 주요 발언과 인터뷰 내용을 담고 있습니다.
 */
export const statements: Statement[] = [
  // 이재명 후보 발언
  {
    id: 'lee-jaemyung-statement-1',
    candidateId: 'lee-jaemyung',
    content: '경제 회복과 일자리 창출이 최우선 과제입니다. 중소기업과 소상공인의 경쟁력 강화를 통해 지역 경제를 활성화하고, 양질의 일자리를 만들어 나가겠습니다.',
    source: 'KBS 토론회',
    date: '2025년 4월 15일'
  },
  {
    id: 'lee-jaemyung-statement-2',
    candidateId: 'lee-jaemyung',
    content: '청년들이 꿈을 펼칠 수 있는 환경을 만드는 것이 중요합니다. 청년 창업 지원과 주거 안정 정책을 통해 청년들의 미래를 지원하고, 저출산 문제 해결에도 기여하겠습니다.',
    source: 'MBC 인터뷰',
    date: '2025년 4월 20일'
  },
  {
    id: 'lee-jaemyung-statement-3',
    candidateId: 'lee-jaemyung',
    content: '교육은 미래를 위한 투자입니다. 지역 간 교육 격차를 해소하고, 모든 학생들이 질 높은 교육을 받을 수 있도록 공교육을 강화하겠습니다.',
    source: '교육정책 토론회',
    date: '2025년 4월 22일'
  },
  
  // 다른 후보들의 발언은 추가해야 함
  // 나머지 후보들의 발언을 각자 ID에 맞게 추가해주세요
];

/**
 * 후보자 Q&A 데이터
 * 각 후보별 인터뷰 및 토론회 질의응답 내용을 담고 있습니다.
 */
export const qnas: QnA[] = [
  // 이재명 후보 Q&A
  {
    id: 'lee-jaemyung-qna-1',
    candidateId: 'lee-jaemyung',
    question: '당선되면 가장 먼저 추진할 정책은 무엇인가요?',
    answer: '경제 회복과 일자리 창출을 위한 정책을 가장 먼저 추진하겠습니다. 특히 코로나19로 어려움을 겪고 있는 중소기업과 소상공인을 위한 지원 정책을 강화하고, 청년 일자리 창출을 위한 정책을 적극적으로 추진하겠습니다. 또한 디지털 전환 지원을 통해 기업의 경쟁력을 강화하고, 새로운 산업 생태계를 조성하여 지속가능한 경제 성장의 기반을 마련하겠습니다.'
  },
  {
    id: 'lee-jaemyung-qna-2',
    candidateId: 'lee-jaemyung',
    question: '지역 경제 활성화를 위한 구체적인 방안은 무엇인가요?',
    answer: '지역 경제 활성화를 위해 다양한 정책을 추진하겠습니다. 첫째, 지역 화폐 활성화를 통해 지역 내 소비를 촉진하고 지역 경제 순환을 강화하겠습니다. 둘째, 지역 특화 산업 육성을 통해 지역 경제의 경쟁력을 강화하겠습니다. 셋째, 소상공인 디지털 전환 지원을 통해 온라인 판로를 확대하고 경쟁력을 강화하겠습니다. 넷째, 지역 관광 자원 개발을 통해 관광 산업을 활성화하고 지역 경제에 활력을 불어넣겠습니다.'
  },
  
  // 다른 후보들의 Q&A는 추가해야 함
  // 나머지 후보들의 Q&A를 각자 ID에 맞게 추가해주세요
];

/**
 * 후보자 ID로 후보자 정보 찾기
 * @param id 후보자 ID
 * @returns 후보자 정보 또는 undefined
 */
export const getCandidateById = (id: string): Candidate | undefined => {
  return candidates.find(candidate => candidate.id === id);
};

/**
 * 후보자 ID로 해당 후보의 모든 정보 찾기
 * @param id 후보자 ID
 * @returns 후보자 정보, 공약, 발언, Q&A를 포함한 데이터
 */
export const getCandidateDataById = (id: string) => {
  const candidate = getCandidateById(id);
  const candidatePledges = pledges.filter(pledge => pledge.candidateId === id);
  const candidateStatements = statements.filter(statement => statement.candidateId === id);
  const candidateQnAs = qnas.filter(qna => qna.candidateId === id);

  return {
    candidate,
    pledges: candidatePledges,
    statements: candidateStatements,
    qnas: candidateQnAs
  };
};

/**
 * 비교를 위한 후보자 정책 데이터
 * 카테고리별로 각 후보의 정책 요약을 담고 있습니다.
 */
export const comparisonData = {
  "경제": {
    "lee-jaemyung": "디지털 경제 전환 가속화 · AI 산업 육성 · 중소기업 혁신 지원 · 공정경제 생태계 구축",
    "kim-moonsoo": "대기업 규제 완화 · 투자 활성화 · 세금 감면 · 기업 중심 경제 회복",
    "lee-junseok": "스타트업 생태계 육성 · 디지털 혁신 기업 지원 · 청년 창업 지원 · 미래산업 투자 확대",
    "ahn-cheolsoo": "디지털 기술기반 경제 혁신 · 벤처기업 지원 확대 · R&D 투자 증가 · 규제 샌드박스 도입"
  },
  "행정": {
    "lee-jaemyung": "지방분권 강화 · 행정 디지털화 · 국민참여 정책플랫폼 구축 · 공직 윤리 강화",
    "kim-moonsoo": "정부조직 효율화 · 규제개혁 추진 · 공공기관 혁신 · 행정서비스 간소화",
    "lee-junseok": "디지털 행정혁신 · 스마트 정부 구현 · 행정 투명성 제고 · 국민 소통 강화",
    "ahn-cheolsoo": "과학기술 기반 행정 혁신 · 데이터 기반 정책결정 · 행정절차 간소화 · 정부효율성 제고"
  },
  "복지": {
    "lee-jaemyung": "기본소득 도입 · 전국민 재난지원금 · 복지사각지대 해소 · 돌봄노동 공공화",
    "kim-moonsoo": "선별적 복지 확대 · 민간 참여 확대 · 자립형 복지체계 · 고령화 대비 연금개혁",
    "lee-junseok": "청년 기본소득 · 디지털 복지플랫폼 · 맞춤형 복지서비스 · 세대 간 형평성 제고",
    "ahn-cheolsoo": "과학기술 기반 스마트 복지 · 예방중심 의료체계 · 맞춤형 사회안전망 · 삶의 질 향상"
  },
  "교육": {
    "lee-jaemyung": "교육 불평등 해소 · 공교육 강화 · 평생학습 체계 · 디지털 교육 확대",
    "kim-moonsoo": "교육 자율성 확대 · 경쟁력 강화 · 수월성 교육 · 입시제도 안정화",
    "lee-junseok": "AI 교육 혁신 · 디지털 리터러시 · 평생교육 체계 · 메타버스 교육 플랫폼",
    "ahn-cheolsoo": "디지털 교육 혁명 · 창의융합 인재양성 · 글로벌 교육 경쟁력 강화 · 교사 전문성 강화"
  },
  "외교/안보": {
    "lee-jaemyung": "한미동맹 강화 · 남북 평화경제 · 균형외교 · 동북아 협력체계 구축",
    "kim-moonsoo": "한미일 안보협력 강화 · 북핵 강경대응 · 국방력 증강 · 자주국방 역량 강화",
    "lee-junseok": "실용적 대미외교 · 글로벌 디지털 협력 · 신흥 안보 대응 · 스마트 국방",
    "ahn-cheolsoo": "과학기술 외교 강화 · 사이버 안보 강화 · 실용적 대북정책 · 글로벌 협력 확대"
  },
  "환경": {
    "lee-jaemyung": "2050 탄소중립 추진 · 녹색일자리 창출 · 순환경제 활성화 · 신재생에너지 전환",
    "kim-moonsoo": "원전 확대 · 친환경 산업 육성 · 그린뉴딜 추진 · 미세먼지 저감",
    "lee-junseok": "스마트 그린시티 · 그린테크 산업 육성 · 신재생에너지 확대 · 디지털 탄소중립",
    "ahn-cheolsoo": "과학기술 활용 환경문제 해결 · 원전-신재생 조화 · 녹색기술 혁신 · 탄소중립 로드맵"
  },
  "주거/부동산": {
    "lee-jaemyung": "250만호 주택공급 · 공공임대 확대 · 부동산 투기 근절 · 1인 가구 주거 지원",
    "kim-moonsoo": "규제 완화로 주택공급 확대 · 재건축 활성화 · 세제 개편 · 민간 중심 주택시장",
    "lee-junseok": "청년 주택 공급 확대 · 스마트 주거서비스 · 세대별 맞춤형 주택정책 · 도심 재생",
    "ahn-cheolsoo": "기술 기반 주택공급 혁신 · 스마트시티 개발 · 주거복지 향상 · 미래형 주택 보급"
  },
  "일자리": {
    "lee-jaemyung": "공공일자리 100만개 창출 · 디지털 일자리 육성 · 노동권 강화 · 일자리 안전망 확충",
    "kim-moonsoo": "기업 중심 일자리 창출 · 노동시장 유연화 · 소상공인 지원 · 신산업 육성",
    "lee-junseok": "청년 혁신 일자리 · 플랫폼 노동 보호 · 미래형 일자리 교육 · 세대상생형 고용",
    "ahn-cheolsoo": "디지털 혁신 일자리 · 벤처창업 생태계 · AI-인간 협업형 일자리 · 글로벌 인재 양성"
  },
  "보건/의료": {
    "lee-jaemyung": "공공의료 확대 · 감염병 대응체계 구축 · 건강보험 보장성 강화 · 의료격차 해소",
    "kim-moonsoo": "민간 의료 혁신 지원 · 디지털 헬스케어 육성 · 의료 효율성 제고 · 바이오산업 육성",
    "lee-junseok": "디지털 헬스케어 플랫폼 · AI 의료 서비스 · 의료 빅데이터 활용 · 미래 의료 혁신",
    "ahn-cheolsoo": "의사 출신의 전문성 · 디지털 의료 혁신 · 바이오 신약 개발 · 국가 의료체계 효율화"
  }
};

/**
 * 정책 카테고리 설명
 * 각 정책 카테고리에 대한 설명을 제공합니다.
 */
export const categoryDescriptions = {
  "경제": "각 후보의 경제 정책, 산업 육성, 경제 성장, 공정경제 관련 공약",
  "행정": "정부 및 행정 조직 개편, 지방분권, 행정서비스, 공공기관 혁신 관련 정책",
  "복지": "사회 안전망, 기본소득, 연금, 사회보장 관련 정책",
  "교육": "교육 정책, 교육 개혁, 디지털 교육, 학제 개편 등",
  "외교/안보": "외교 정책, 국방, 안보, 한반도 평화, 국제 관계 등",
  "환경": "환경 정책, 탄소중립, 신재생에너지, 환경 보호 등",
  "주거/부동산": "주택 정책, 부동산 규제, 임대 정책, 주거 복지 등",
  "일자리": "고용 정책, 일자리 창출, 노동권, 노동시장 개혁 등",
  "보건/의료": "의료 정책, 건강보험, 공공의료, 감염병 대응, 의료 혁신 등"
};

/**
 * 지역별 공약 데이터
 * 각 후보별 지역 공약 정보를 담고 있습니다.
 */
export const regionalPolicies = {
  capital: [
    {
      candidateId: 'lee-jaemyung',
      name: '이재명',
      policies: [
        { icon: 'ri-train-line', text: 'GTX D노선 추가 및 GTX A·B·C 조기 완공' },
        { icon: 'ri-hospital-line', text: '수도권 공공병원 10개소 추가 설립' },
        { icon: 'ri-building-4-line', text: '수도권 주택 30만호 공급 계획 추진' },
        { icon: 'ri-recycle-line', text: '수도권 미세먼지 저감 특별 대책 추진' },
        { icon: 'ri-government-line', text: '경기도 행정수도 기능 일부 이전 검토' }
      ]
    },
    {
      candidateId: 'kim-moonsoo',
      name: '김문수',
      policies: [
        { icon: 'ri-train-line', text: '수도권 광역철도망 확충 및 고속도로 확장' },
        { icon: 'ri-building-line', text: '수도권 그린벨트 조정을 통한 주택 공급 확대' },
        { icon: 'ri-community-line', text: '수도권 신도시 교통·교육·의료 인프라 확충' },
        { icon: 'ri-building-2-line', text: '수도권 노후 아파트 재건축 규제 완화' },
        { icon: 'ri-seedling-line', text: '수도권 환경 오염 저감 및 친환경 산업단지 조성' }
      ]
    },
    {
      candidateId: 'lee-junseok',
      name: '이준석',
      policies: [
        { icon: 'ri-global-line', text: '수도권 지역 AI 클러스터 조성' },
        { icon: 'ri-building-2-line', text: '청년 주택 공급 확대 및 임대료 지원' },
        { icon: 'ri-taxi-wifi-line', text: '수도권 스마트 교통망 구축' },
        { icon: 'ri-home-8-line', text: '1인 가구 맞춤형 주거 환경 개선' },
        { icon: 'ri-plant-line', text: '도심 속 친환경 공간 확대' }
      ]
    },
  ],
  chungcheong: [
    {
      candidateId: 'lee-jaemyung',
      name: '이재명',
      policies: [
        { icon: 'ri-government-line', text: '행정수도 세종 완성 및 기능 강화' },
        { icon: 'ri-hub-line', text: '충청권 광역철도망 확충 및 KTX 노선 확대' },
        { icon: 'ri-building-4-line', text: '첨단산업 클러스터 조성 및 바이오산업 육성' },
        { icon: 'ri-building-line', text: '대덕 R&D 특구 확대 및 연구개발 지원 강화' },
        { icon: 'ri-award-line', text: '충청 지역 국립대학 경쟁력 강화 및 지원 확대' }
      ]
    },
    {
      candidateId: 'kim-moonsoo',
      name: '김문수',
      policies: [
        { icon: 'ri-government-line', text: '세종시 행정수도 기능 강화' },
        { icon: 'ri-building-line', text: '충청 지역 기업 유치 및 지원 확대' },
        { icon: 'ri-hub-line', text: '천안-아산-대전-세종 광역교통망 구축' },
        { icon: 'ri-plant-line', text: '금강 수질 개선 및 환경 정화 사업' },
        { icon: 'ri-recycle-line', text: '친환경 에너지 산업 육성 및 투자 유치' }
      ]
    },
    {
      candidateId: 'lee-junseok',
      name: '이준석',
      policies: [
        { icon: 'ri-building-4-line', text: '청년 창업 특구 조성 및 스타트업 지원' },
        { icon: 'ri-global-line', text: 'IT 기반 첨단산업 클러스터 조성' },
        { icon: 'ri-route-line', text: '충청 지역 스마트 교통망 구축' },
        { icon: 'ri-city-line', text: '첨단 스마트시티 시범단지 조성' },
        { icon: 'ri-award-line', text: '지역 대학 특성화 및 산학협력 강화' }
      ]
    }
  ],
  yeongnam: [
    {
      candidateId: 'lee-jaemyung',
      name: '이재명',
      policies: [
        { icon: 'ri-building-line', text: '부·울·경 메가시티 추진 및 지원' },
        { icon: 'ri-hub-line', text: '영남 지역 KTX·SRT 확대 및 고속도로망 확충' },
        { icon: 'ri-ship-line', text: '부산항 글로벌 경쟁력 강화 및 해양산업 육성' },
        { icon: 'ri-building-4-line', text: '첨단 제조업 혁신 클러스터 조성' },
        { icon: 'ri-hotel-line', text: '영남 관광벨트 구축 및 관광 인프라 확충' }
      ]
    },
    {
      candidateId: 'kim-moonsoo',
      name: '김문수',
      policies: [
        { icon: 'ri-building-4-line', text: '영남권 경제 활성화 특별 지원' },
        { icon: 'ri-ship-line', text: '부산항 인프라 확충 및 글로벌 물류 허브 육성' },
        { icon: 'ri-hub-line', text: '대구·경북 통합 신공항 조기 완공' },
        { icon: 'ri-city-line', text: '구미·포항 산업단지 고도화 및 첨단화' },
        { icon: 'ri-award-line', text: '영남 지역 특성화 대학 육성 및 산학협력 강화' }
      ]
    },
    {
      candidateId: 'lee-junseok',
      name: '이준석',
      policies: [
        { icon: 'ri-city-line', text: '부·울·경 디지털 혁신 도시 조성' },
        { icon: 'ri-global-line', text: '대구·경북 AI·로봇 산업 클러스터 구축' },
        { icon: 'ri-building-line', text: '청년 창업 지원 및 혁신 산업 육성' },
        { icon: 'ri-ship-line', text: '해양도시 스마트화 및 친환경 항만 구축' },
        { icon: 'ri-train-line', text: '영남권 광역철도망 구축 및 교통망 확충' }
      ]
    }
  ]
}; 
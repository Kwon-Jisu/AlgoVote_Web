import Image from 'next/image';
import Link from 'next/link';

type Policy = {
  icon: string;
  text: string;
};

type RegionalPolicy = {
  candidateId: string;
  policies: Policy[];
};

type Candidate = {
  id: string;
  name: string;
  profileImage?: string;
};

type RegionalPolicyCardProps = {
  candidate: Candidate;
  selectedRegion: string;
  regionalPolicy?: RegionalPolicy;
  showChatbotLink?: boolean;
  showProfile?: boolean;
};

export default function RegionalPolicyCard({
  candidate,
  selectedRegion,
  regionalPolicy,
  showChatbotLink = true,
  showProfile = true,
}: RegionalPolicyCardProps) {
  const getRegionName = (region: string) => {
    switch (region) {
      case 'capital': return '수도권 공약';
      case 'chungcheong': return '충청 공약';
      case 'yeongnam': return '영남 공약';
      case 'honam': return '호남 공약';
      case 'gangwon': return '강원 공약';
      case 'jeju': return '제주 공약';
      default: return '지역 공약';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {showProfile && (
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-100 mr-4">
              {candidate.profileImage && (
                <Image 
                  src={candidate.profileImage} 
                  alt={candidate.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <h3 className="text-xl font-bold">{candidate.name}</h3>
          </div>
        </div>
      )}
      <div className={`p-6 ${!showProfile && 'pt-5'}`}>
        <h4 className={`font-medium text-gray-700 mb-4 ${!showProfile && 'text-lg'}`}>
          {getRegionName(selectedRegion)}
        </h4>
        <ul className="space-y-3">
          {regionalPolicy?.policies.map((policy, index) => (
            <li key={index} className="flex items-start">
              <div className="w-6 h-6 flex items-center justify-center text-primary mt-0.5 mr-2">
                <i className={policy.icon}></i>
              </div>
              <span>{policy.text}</span>
            </li>
          )) || (
            <li className="flex items-start">
              <div className="w-6 h-6 flex items-center justify-center text-primary mt-0.5 mr-2">
                <i className="ri-information-line"></i>
              </div>
              <span>해당 지역 공약 정보가 없습니다.</span>
            </li>
          )}
        </ul>
        {showChatbotLink && (
          <Link
            href="/chatbot"
            className="inline-flex items-center text-primary mt-6"
          >
            <span>AI 챗봇으로 정책 질문하기</span>
            <div className="w-5 h-5 flex items-center justify-center ml-1">
              <i className="ri-robot-2-line"></i>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
} 
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Candidate } from '@/types';

interface CandidateCardProps {
  candidate: Candidate;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden group">
      <Image 
        src={candidate.profileImage} 
        alt={`${candidate.name} 후보`} 
        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-110"
        width={400}
        height={600}
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition"></div>
      
      {/* 데스크탑 호버 시 내용 */}
      <div className="absolute inset-0 flex-col items-center justify-center p-6 hidden md:flex opacity-0 group-hover:opacity-100 transition">
        <h3 className="text-2xl font-bold text-white mb-3">{candidate.name} 후보</h3>
        <p className="text-white text-center mb-6">{candidate.slogan}</p>
        <Link 
          href={`/candidates/${candidate.id}`} 
          className="bg-primary text-white px-6 py-2 rounded-button font-medium hover:bg-opacity-90 transition"
        >
          공약 보기
        </Link>
      </div>
      
      {/* 모바일에서 클릭 시 보이는 내용 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center md:hidden">
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition"></div>
        <h3 className="text-xl font-bold text-white mb-3 opacity-0 group-hover:opacity-100 transition z-10">{candidate.name} 후보</h3>
        <Link 
          href={`/candidates/${candidate.id}`} 
          className="bg-primary text-white px-3 py-2 rounded-button font-medium hover:bg-opacity-90 transition opacity-0 group-hover:opacity-100 z-10"
        >
          공약 보기
        </Link>
      </div>
    </div>
  );
} 
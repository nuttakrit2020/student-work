import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book, ChevronRight, ArrowLeft } from 'lucide-react';

const MOCK_SUBJECTS = [
  { id: 'math', name: 'คณิตศาสตร์ (Math)', teacher: 'ครูสมปอง' },
  { id: 'sci', name: 'วิทยาศาสตร์ (Science)', teacher: 'ครูวิชัย' },
  { id: 'thai', name: 'ภาษาไทย (Thai)', teacher: 'ครูสมหญิง' },
  { id: 'eng', name: 'ภาษาอังกฤษ (English)', teacher: 'ครูจอห์น' },
  { id: 'com', name: 'วิทยาการคำนวณ (Computing)', teacher: 'ครูสมชาย' },
];

export default function SubjectSelection() {
  const { gradeId, roomId } = useParams();
  const navigate = useNavigate();

  const handleSubjectSelect = (subjectId) => {
    navigate(`/class/${gradeId}/${roomId}/subject/${subjectId}`);
  };

  const formattedGrade = gradeId.replace('m', 'ม.');

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ padding: '0.5rem 1rem' }}>
          <ArrowLeft size={18} />
          กลับ
        </button>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>ชั้น {formattedGrade} ห้อง {roomId}</h1>
          <p className="text-muted">กรุณาเลือกรายวิชาเพื่อดูงานหรือส่งงาน</p>
        </div>
      </div>

      <div className="grid-cards delay-1">
        {MOCK_SUBJECTS.map((subject) => (
          <button 
            key={subject.id} 
            className="card"
            onClick={() => handleSubjectSelect(subject.id)}
            style={{ border: 'none', textAlign: 'left', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="card-title">
                <Book size={24} className="header-icon" />
                {subject.name}
              </span>
              <ChevronRight size={20} color="var(--text-muted)" />
            </div>
            <span className="card-subtitle">ผู้สอน: {subject.teacher}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

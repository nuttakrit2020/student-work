import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Upload, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const MOCK_ASSIGNMENTS = [
  { id: 'assign_1', title: 'ใบงานที่ 1.1 - แนะนำตัว', dueDate: '2026-07-15', status: 'pending' },
  { id: 'assign_2', title: 'แบบฝึกหัดท้ายบทที่ 1', dueDate: '2026-07-20', status: 'pending' },
];

export default function AssignmentList() {
  const { gradeId, roomId, subjectId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedGrade = gradeId.replace('m', 'ม.');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('กรุณาแนบไฟล์งานก่อนส่ง');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload File to Firebase Storage
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `${studentNumber}_${studentName.replace(/\s+/g, '_')}_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `assignments/${gradeId}/room_${roomId}/${subjectId}/${selectedAssignment.id}/${fileName}`);
      
      const uploadResult = await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // 2. Save Data to Firestore
      await addDoc(collection(db, 'submissions'), {
        grade: gradeId,
        room: roomId,
        subjectId: subjectId,
        assignmentId: selectedAssignment.id,
        assignmentTitle: selectedAssignment.title,
        studentName: studentName,
        studentNumber: Number(studentNumber),
        fileUrl: downloadURL,
        fileName: selectedFile.name,
        submittedAt: serverTimestamp()
      });

      alert(`ส่งงานสำเร็จ!\nชื่อ: ${studentName}\nเลขที่: ${studentNumber}\nงาน: ${selectedAssignment.title}`);
      
      // Reset form
      setSelectedAssignment(null);
      setSelectedFile(null);
      setStudentName('');
      setStudentNumber('');
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error) {
      console.error("Error submitting assignment: ", error);
      alert('เกิดข้อผิดพลาดในการส่งงาน: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ padding: '0.5rem 1rem' }}>
          <ArrowLeft size={18} />
          กลับ
        </button>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>รายวิชา: {subjectId.toUpperCase()}</h1>
          <p className="text-muted">ชั้น {formattedGrade} ห้อง {roomId} - รายการงานที่ต้องส่ง</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div className="glass-panel delay-1" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} className="header-icon" />
            รายการงาน (Assignments)
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {MOCK_ASSIGNMENTS.map((assignment) => (
              <div 
                key={assignment.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface)'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0' }}>{assignment.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} />
                      กำหนดส่ง: {assignment.dueDate}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="badge badge-warning">ยังไม่ส่ง</span>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setSelectedFile(null);
                    }}
                  >
                    ส่งงาน
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedAssignment && (
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', border: '2px solid var(--secondary)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>ฟอร์มส่งงาน: {selectedAssignment.title}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">เลขที่</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="กรอกเลขที่ของคุณ" 
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  required 
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label className="form-label">ชื่อ - นามสกุล</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="กรอกชื่อ-นามสกุล" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required 
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label className="form-label">แนบไฟล์งาน (PDF, Image, Word)</label>
                
                <input 
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                
                <div 
                  onClick={!isSubmitting ? triggerFileInput : undefined}
                  style={{ 
                  border: `2px dashed ${selectedFile ? 'var(--secondary)' : 'var(--border)'}`, 
                  padding: '2rem', 
                  textAlign: 'center',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: selectedFile ? '#F0F9FF' : '#F8FAFC',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}>
                  {selectedFile ? (
                    <div>
                      <CheckCircle size={32} style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }} />
                      <p style={{ fontWeight: '500', color: 'var(--primary)' }}>เลือกไฟล์แล้ว: {selectedFile.name}</p>
                      <p className="text-muted" style={{ fontSize: '0.875rem' }}>คลิกเพื่อเปลี่ยนไฟล์</p>
                    </div>
                  ) : (
                    <div>
                      <Upload size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                      <p className="text-muted">คลิกเพื่อเลือกไฟล์ที่ต้องการส่ง</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                      กำลังส่งงาน...
                    </>
                  ) : (
                    'ยืนยันการส่งงาน'
                  )}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setSelectedAssignment(null)} disabled={isSubmitting}>
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

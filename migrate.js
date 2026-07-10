// Script to migrate local data to Firebase
import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

if (!firebaseConfig.projectId) {
  console.error("❌ ไม่พบการตั้งค่า Firebase ในไฟล์ .env.local");
  console.error("กรุณาเพิ่ม FIREBASE_PROJECT_ID และอื่นๆ ก่อนรัน Migration");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const dataDir = path.join(process.cwd(), 'data');

function readJSON(filename) {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

async function migrate() {
  console.log("🚀 กำลังเริ่มย้ายข้อมูลไปยัง Firebase...");

  try {
    // 1. Settings
    const settingsPath = path.join(dataDir, 'settings.json');
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
      await setDoc(doc(db, 'config', 'settings'), settings);
      console.log("✅ ย้ายข้อมูล Settings สำเร็จ");
    }

    // 2. Students
    const students = readJSON('students.json');
    if (students.length > 0) {
      const batch = writeBatch(db);
      students.forEach(s => {
        batch.set(doc(db, 'students', s.id), s);
      });
      await batch.commit();
      console.log(`✅ ย้ายข้อมูลนักเรียนสำเร็จ (${students.length} คน)`);
    }

    // 3. Assignments
    const assignments = readJSON('assignments.json');
    if (assignments.length > 0) {
      const batch = writeBatch(db);
      assignments.forEach(a => {
        batch.set(doc(db, 'assignments', a.id), a);
      });
      await batch.commit();
      console.log(`✅ ย้ายข้อมูลใบงานสำเร็จ (${assignments.length} งาน)`);
    }

    // 4. Submissions
    const submissions = readJSON('submissions.json');
    if (submissions.length > 0) {
      const batch = writeBatch(db);
      submissions.forEach(sub => {
        const id = `${sub.studentId}_${sub.assignmentId}`;
        batch.set(doc(db, 'submissions', id), sub);
      });
      await batch.commit();
      console.log(`✅ ย้ายข้อมูลการส่งงานสำเร็จ (${submissions.length} รายการ)`);
    }

    console.log("🎉 การย้ายข้อมูลเสร็จสมบูรณ์! ตอนนี้คุณสามารถใช้งานระบบผ่าน Firebase ได้แล้ว");
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการย้ายข้อมูล:", error);
  }
}

migrate();

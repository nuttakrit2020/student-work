import "./globals.css";

export const metadata = {
  title: "ระบบเก็บงานนักเรียน | ม.1/2569",
  description: "ระบบเว็บแอปพลิเคชันสำหรับส่งงานและตรวจสอบสถานะการส่งงานของนักเรียน",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}

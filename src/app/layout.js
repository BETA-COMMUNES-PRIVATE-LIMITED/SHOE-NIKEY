import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Providers from '@/components/shared/Providers';

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Nike — Just Do It",
  description: "Nike shoe store — shop the latest sneakers and footwear.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0B0B]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import { Inter } from "next/font/google";
import "../../public/css/admin.css";
import ClientProviders from "@/components/Providers/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Zuroona Admin",
  icons: {
    icon: "/assets/images/final_Zuroona.png",
    shortcut: "/assets/images/final_Zuroona.png",
    apple: "/assets/images/final_Zuroona.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

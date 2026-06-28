import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/components/ReduxProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata = {
  title: { template: "%s | RS Admin", default: "RS Admin" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-surface`}>
        <ReduxProvider>
          {children}
          <Toaster position="top-right" />
        </ReduxProvider>
      </body>
    </html>
  );
}

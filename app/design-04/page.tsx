import { Inter } from "next/font/google";
import ClarityDesk from "./clarity-desk";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cd",
});

export default function Design04Page() {
  return (
    <div className={inter.className}>
      <ClarityDesk />
    </div>
  );
}

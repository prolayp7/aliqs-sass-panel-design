import { Plus_Jakarta_Sans } from "next/font/google";
import CalmIntelligence from "./calm-intelligence";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-ci",
});

export default function Design02Page() {
  return (
    <div className={plusJakarta.className}>
      <CalmIntelligence />
    </div>
  );
}

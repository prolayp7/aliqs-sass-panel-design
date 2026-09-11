import { Inter } from "next/font/google";
import TheDocket from "./the-docket";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-td",
});

export default function Design05Page() {
  return (
    <div className={inter.className}>
      <TheDocket />
    </div>
  );
}

import { Inter } from "next/font/google";
import TheRegistry from "./the-registry";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-reg",
});

export default function Design06Page() {
  return (
    <div className={inter.className}>
      <TheRegistry />
    </div>
  );
}

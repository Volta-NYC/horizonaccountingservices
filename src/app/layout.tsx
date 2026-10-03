import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/lib/components/navbar";
import Footer from "@/lib/components/footer";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.horizonaccountingservices.com"),
  title: "Horizon Accounting Services | Clarity for what’s next",
  description:
    "Personal bookkeeping, payroll support, and fractional CFO services for small businesses. Based in Jacksonville, led by Lillian with over 15 years of accounting experience.",
  openGraph: {
    title: "A clearer view of your business. A better horizon.",
    description:
      "Bookkeeping and financial guidance, with a real person in your corner.",
    images: [{ url: "/media/horizon-poster.webp", width: 1536, height: 864 }],
  },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

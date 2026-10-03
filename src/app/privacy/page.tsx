import fs from "node:fs";
import path from "node:path";
export const metadata = {
  title: "Privacy Policy | Horizon Accounting Services",
};
export default function PrivacyPage() {
  const raw = fs.readFileSync(
    path.join(
      process.cwd(),
      "raw messy data/www.horizonaccountingservices.com_privacypolicy.md",
    ),
    "utf8",
  );
  const start = raw.indexOf("**Effective Date:");
  const paragraphs = raw
    .slice(start)
    .replaceAll("**", "")
    .replaceAll("\\.", ".")
    .split(/\n\s*\n/)
    .filter((p) => p.trim() && p.trim() !== "­");
  return (
    <article className="legal-page">
      <span className="eyebrow">HORIZON ACCOUNTING SERVICES</span>
      <h1>Privacy policy</h1>
      {paragraphs.map((p, i) =>
        /^\d+\. /.test(p) ? <h2 key={i}>{p}</h2> : <p key={i}>{p}</p>,
      )}
      <a className="text-link" href="/">
        ← Back to Horizon
      </a>
    </article>
  );
}

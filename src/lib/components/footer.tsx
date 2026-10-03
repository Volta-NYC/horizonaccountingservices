import { HorizonMark, Arrow } from "./icons";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <a className="brand" href="/" aria-label="Horizon home">
          <HorizonMark />
          <span className="brand-type">
            horizon<span>ACCOUNTING SERVICES</span>
          </span>
        </a>
        <p>
          Good numbers.
          <br />A better horizon.
        </p>
        <a href="tel:+19046003533" className="footer-call">
          (904) 600-3533 <Arrow diagonal />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Horizon Accounting Services</span>
        <span>Jacksonville, Florida · Working with you, wherever you are.</span>
        <a href="/privacy">Privacy policy</a>
      </div>
    </footer>
  );
}

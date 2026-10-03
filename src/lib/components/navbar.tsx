import { Arrow, HorizonMark } from "./icons";
export default function Navbar() {
  return (
    <header className="site-header">
      <a
        className="brand"
        href="/"
        aria-label="Horizon Accounting Services home"
      >
        <HorizonMark />
        <span className="brand-type">
          horizon<span>ACCOUNTING SERVICES</span>
        </span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="/#services">Our services</a>
        <a href="/#approach">Our approach</a>
        <a href="/#about">Meet Lillian</a>
      </nav>
      <a className="button button-nav" href="/#contact">
        Let’s talk <Arrow diagonal />
      </a>
      <details className="mobile-nav">
        <summary aria-label="Open navigation">
          <span />
          <span />
        </summary>
        <nav aria-label="Mobile navigation">
          <a href="/#services">Our services</a>
          <a href="/#approach">Our approach</a>
          <a href="/#about">Meet Lillian</a>
          <a href="/#contact">Let’s talk ↗</a>
        </nav>
      </details>
    </header>
  );
}

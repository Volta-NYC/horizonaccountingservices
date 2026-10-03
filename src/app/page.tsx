import HorizonExperience from "@/lib/components/horizon-experience";
import ContactForm from "@/lib/components/contact-form";
import { Arrow, ServiceIcon, HorizonMark } from "@/lib/components/icons";
const services = [
  {
    title: "A strong start.",
    name: "New Business Formation",
    description:
      "Turn your big idea into a business, with the foundations to move forward.",
    items: [
      "Business structure guidance",
      "State registration & EIN assistance",
      "QuickBooks Online setup",
    ],
  },
  {
    title: "Your books, handled.",
    name: "Essential Bookkeeping",
    description:
      "Stay organized, understand your numbers, and get your time back.",
    items: [
      "Monthly transaction categorization",
      "Bank & credit card reconciliations",
      "Profit & Loss and Balance Sheet reports",
      "Secure digital document storage & email support",
    ],
  },
  {
    title: "Room to grow.",
    name: "Growth Package",
    description: "More hands-on support for a business with more moving parts.",
    items: [
      "Essential bookkeeping services",
      "Accounts receivable & payable management",
      "Payroll setup & processing support",
      "Sales tax tracking & filing assistance",
      "Customized reporting & quarterly reviews",
    ],
  },
  {
    title: "The bigger picture.",
    name: "Fractional CFO",
    description: "Forward-looking financial leadership for your next chapter.",
    items: [
      "Growth package services",
      "Budgeting, forecasting & financial strategy",
      "Cash flow planning & scenario analysis",
      "Pricing, margins & growth guidance",
      "Monthly strategy meetings",
      "Coordination with your tax professional",
    ],
  },
];
export default function HomePage() {
  return (
    <>
      <HorizonExperience />
      <section className="trust-strip" aria-label="Our strengths">
        <p>
          A steady hand.
          <br />
          <strong>A fresh perspective.</strong>
        </p>
        <div>
          <span className="trust-number">
            15<span>+</span>
          </span>
          <span>
            Years of accounting
            <br />
            experience
          </span>
        </div>
        <div>
          <svg
            viewBox="0 0 32 32"
            width="32"
            height="32"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M16 3 5 8v8c0 6 11 13 11 13s11-7 11-13V8L16 3Z"
              stroke="currentColor"
            />
            <path d="m11 15 4 4 7-8" stroke="currentColor" />
          </svg>
          <span>
            Personal support.
            <br />
            No judgment. Ever.
          </span>
        </div>
        <div>
          <span className="qb-mark" aria-hidden="true">
            qb
          </span>
          <span>
            QuickBooks Online
            <br />
            setup & support
          </span>
        </div>
      </section>
      <section id="services" className="services section-pad">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / SUPPORT FOR EVERY CHAPTER</span>
            <h2>
              You build the business.
              <br />
              We bring the clarity.
            </h2>
          </div>
          <p>
            From your first big idea to your next big move,
            <br className="desktop-break" /> find financial support that meets
            you where you are.
          </p>
        </div>
        <div className="service-grid">
          {services.map((s, i) => (
            <article className="service-card" key={s.name}>
              <div className="service-top">
                <ServiceIcon type={i} />
                <span>0{i + 1}</span>
              </div>
              <span className="service-name">{s.name}</span>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <details>
                <summary>
                  Explore the service <span className="details-plus">+</span>
                </summary>
                <div className="service-details">
                  <ul>
                    {s.items.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                  <a href="#contact">
                    Talk about your needs <Arrow diagonal />
                  </a>
                </div>
              </details>
            </article>
          ))}
        </div>
        <div className="services-note">
          <span>Not sure where to start? That’s what we’re here for.</span>
          <a className="text-link" href="#contact">
            Let’s figure it out together <Arrow />
          </a>
        </div>
      </section>
      <section id="approach" className="approach section-pad">
        <div className="approach-intro">
          <span className="eyebrow light">02 / MORE THAN THE NUMBERS</span>
          <h2>
            Good accounting
            <br />
            makes room for
            <br />
            <span>better living.</span>
          </h2>
          <p>
            You didn’t start a business to spend your evenings reconciling
            accounts. We help you see the full picture, so you can spend more
            time on what matters.
          </p>
          <a className="text-link light" href="#contact">
            Find your way forward <Arrow diagonal />
          </a>
          <HorizonMark className="approach-watermark" />
        </div>
        <div className="approach-steps">
          <article>
            <span>01</span>
            <div>
              <h3>A real conversation.</h3>
              <p>
                Tell us where you are, what’s working, and what feels
                overwhelming. There’s no such thing as a silly question.
              </p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>A clearer picture.</h3>
              <p>
                We make your numbers approachable, with organized books and
                financial reports you can actually understand.
              </p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>A confident next step.</h3>
              <p>
                With the right support behind you, make informed decisions for
                your business—and the life you want it to support.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section id="about" className="about section-pad">
        <div className="portrait">
          <img
            src="/media/lillian.webp"
            alt="Lillian, accounting professional at Horizon Accounting Services"
            width="700"
            height="800"
            loading="lazy"
          />
          <div className="portrait-label">
            <span>Lillian</span>
            <span>YOUR ACCOUNTING PARTNER</span>
            <Arrow diagonal />
          </div>
          <div className="experience-badge">
            <strong>15+</strong>
            <span>
              YEARS OF
              <br />
              EXPERIENCE
            </span>
          </div>
        </div>
        <div className="about-copy">
          <span className="eyebrow">03 / A PERSON IN YOUR CORNER</span>
          <h2>
            Hi, I’m Lillian.
            <br />
            Let’s make your
            <br />
            numbers make sense.
          </h2>
          <p>
            With over 15 years in private and public accounting, I’ve learned
            that financial confidence starts with understanding—not jargon.
          </p>
          <p>
            My mission is to give business owners the clarity and confidence to
            take control of their finances. With empathy, patience, and a little
            less complexity, we’ll connect the numbers to what you’re really
            working toward.
          </p>
          <blockquote>
            “Every business owner deserves to build not just their dream
            business, but the life they’ve been working toward.”
          </blockquote>
          <a href="#contact" className="text-link">
            Let’s get to know each other <Arrow diagonal />
          </a>
        </div>
      </section>
      <section className="testimonials section-pad">
        <div className="section-heading">
          <div>
            <span className="eyebrow">REAL PEOPLE. REAL PEACE OF MIND.</span>
            <h2>Better together.</h2>
          </div>
          <p>
            A few words from the business owners
            <br />
            we’re proud to work alongside.
          </p>
        </div>
        <div className="quote-grid">
          <figure>
            <span className="quote-mark">“</span>
            <blockquote>
              Horizon Accounting Services has been a great benefit to our
              business. We are a new business taking over a legacy company that
              did everything analog, and Lillian was an expert in getting us
              moved into the digital work of accounting.
            </blockquote>
            <figcaption>
              <span className="avatar">CG</span>
              <span>
                <strong>Charlie G.</strong>
                <small>Owner, Crater Chain Saw Co</small>
              </span>
            </figcaption>
          </figure>
          <figure>
            <span className="quote-mark">“</span>
            <blockquote>
              Love working with Horizon Accounting Services. It’s nice to have
              someone on your side that is willing to explain things thoroughly,
              that I trust and is hard working.
            </blockquote>
            <figcaption>
              <span className="avatar">KR</span>
              <span>
                <strong>Karina R.</strong>
                <small>Owner, KC Real Estate Services LLC</small>
              </span>
            </figcaption>
          </figure>
          <figure className="short-quote">
            <span className="quote-mark">“</span>
            <blockquote>
              Lillian is
              <br />
              the best!
            </blockquote>
            <figcaption>
              <span className="avatar">SB</span>
              <span>
                <strong>Shawn B.</strong>
                <small>Owner, Decibel Farms Inc.</small>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>
      <section id="contact" className="contact section-pad">
        <div className="contact-intro">
          <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
          <h2>
            Let’s put your
            <br />
            business in
            <br />
            <span>perspective.</span>
          </h2>
          <p>
            A question, a fresh start, or a bigger plan.
            <br />
            We’d love to hear what’s on your horizon.
          </p>
          <a className="contact-phone" href="tel:+19046003533">
            (904) 600-3533 <Arrow diagonal />
          </a>
          <a
            className="contact-email"
            href="mailto:info@horizonaccountingservices.com"
          >
            info@horizonaccountingservices.com
          </a>
          <span className="contact-location">
            <span className="location-dot" />
            JACKSONVILLE, FL · VIRTUAL SERVICES
          </span>
        </div>
        <ContactForm />
      </section>
    </>
  );
}

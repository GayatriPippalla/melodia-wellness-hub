const Footer = () => (
  <footer className="bg-sage-dark py-12">
    <div className="container mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-display text-2xl font-semibold text-sand-light">Melodia</p>
          <p className="font-body text-sm text-sand-light/60 mt-1">Tune into your wellness</p>
        </div>
        <div className="flex gap-8">
          {["Home", "About", "Services", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="font-body text-sm text-sand-light/60 hover:text-sand-light transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
        <p className="font-body text-xs text-sand-light/40">
          © {new Date().getFullYear()} Melodia Wellness. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

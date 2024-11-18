import LogoPNG from "../assets/logo.png";
const sections = [
  {
    title: "Our Services",
    links: [
      { name: "Consult A Doctor", href: "#" },
      { name: "Book Appointment", href: "#" },
      { name: "Search Hospitals", href: "#" },
      { name: "Ask a Question", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "#" },
      { name: "Team", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Privacy", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Help", href: "#" },
      { name: "Sales", href: "#" },
      { name: "Advertise", href: "#" },
    ],
  },
  {
    title: "Social",
    links: [
      { name: "Twitter", href: "#" },
      { name: "Instagram", href: "#" },
      { name: "LinkedIn", href: "#" },
    ],
  },
];

const Footer = () => {
  return (
    <section className=" px-5 py-20 md:py-32">
      <div className="container mx-auto">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <img src={LogoPNG} alt="logo" className="mb-4 w-auto h-10" />
              <p className="font-regular">
                PhysioConnect is an innovative online platform designed to
                simplify physiotherapy booking and treatment management. Whether
                you need in-person sessions or virtual consultations,
                PhysioConnect ensures seamless scheduling, access to certified
                physiotherapists, and personalized care plans—all from the
                comfort of your home. Empowering patients and therapists with
                convenience, efficiency, and trust, PhysioConnect is your go-to
                solution for a healthier, pain-free life.
              </p>
            </div>
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <p>© 2024 PhysioConnect. All rights reserved.</p>
            <ul className="flex gap-4">
              <li className="underline hover:text-primary">
                <a href="#"> Terms and Conditions</a>
              </li>
              <li className="underline hover:text-primary">
                <a href="#"> Privacy Policy</a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Footer;

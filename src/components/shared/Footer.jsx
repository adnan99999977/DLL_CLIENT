import { FaLinkedin, FaFacebook, FaTwitter, FaEnvelope } from "react-icons/fa";
import Logo from "../../utils/logo/Logo";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 items-start">
        {/* Logo & description */}
        <div className="flex flex-col space-y-2">
          <Logo />
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            Digital Life Lessons helps you preserve wisdom, share insights, and
            explore growth opportunities.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-lg tracking-wide">
            Quick Links
          </h3>
          <ul className="space-y-1">
            {[
              "Home",
              "Public Lessons",
              "Dashboard",
              "Favorites",
              "Profile",
              "Pricing",
            ].map((link) => (
              <li key={link}>
                <a
                  href={`/${link.toLowerCase().replace(" ", "-")}`}
                  className="hover:text-blue-500 transition-colors duration-300 relative before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-0 before:bg-blue-500 before:transition-all before:duration-300 hover:before:w-full"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-lg tracking-wide">
            Connect with Us
          </h3>
          <div className="flex space-x-4 mt-1">
            {[
              { icon: FaLinkedin, link: "https://linkedin.com" },
              { icon: FaFacebook, link: "https://facebook.com" },
              { icon: FaTwitter, link: "https://twitter.com" },
              { icon: FaEnvelope, link: "mailto:example@gmail.com" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-transform transform hover:scale-110 duration-300"
                >
                  <Icon size={24} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400 text-xs md:text-sm tracking-wide">
        © {new Date().getFullYear()} Digital Life Lessons. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

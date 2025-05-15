import type { FC } from "react";
import { SocialIcon } from "react-social-icons";
import LogoShort from "./LogoShort";

const Footer: FC = () => {
  return (
    <footer className="w-full bg-card border-t border-border px-4 py-4">
      <div className="container mx-auto flex flex-col items-center">
        {/* Logo + Texte - Toujours centré */}
        <div className="flex flex-col items-center text-center">
          <LogoShort />
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TechnoGorafi. Tous droits réservés.
          </span>
        </div>

        {/* Réseaux sociaux - Alignés sous le texte sur mobile, décalés en bas sur desktop */}
        <div className="flex gap-4 text-muted-foreground mt-4 md:absolute md:right-6">
          <SocialIcon
            url="https://x.com/technogorafi"
            className="hover:scale-110 transition-transform duration-300"
            target="_blank"
            rel="noopener noreferrer"
            style={{ width: 28, height: 28 }}
          />
          <SocialIcon
            url="https://www.instagram.com/technogorafi/"
            className="hover:scale-110 transition-transform duration-300"
            target="_blank"
            rel="noopener noreferrer"
            style={{ width: 28, height: 28 }}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

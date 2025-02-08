import Link from "next/link";
import Image from "next/image";
import { InstagramIcon, LinkedinIcon } from "lucide-react";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const linkStyles =
    "text-sm hover:text-udua-orange-primary transition-colors duration-200";

  return (
    <footer className="bg-[#252830] text-sm text-[#afb6cd]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
        {/* Brand Section */}
        <div className="flex flex-col justify-between lg:col-span-2">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-semibold text-white">
              {siteConfig.name}
            </Link>
            <p className="max-w-sm text-xs">{siteConfig.description}</p>
            <SocialLinks />
          </div>
          <Copyright currentYear={currentYear} />
        </div>

        {/* Useful Links */}
        <FooterSection title="Useful links">
          <ul className="space-y-2">
            {siteConfig.footerLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className={linkStyles}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </FooterSection>

        {/* Company Info */}
        <FooterSection title="Company info">
          <ul className="space-y-2">
            {siteConfig.footer.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className={linkStyles}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </FooterSection>

        {/* Payment Methods */}
        <FooterSection title="Payment Methods">
          <ul className="flex flex-wrap gap-2">
            {siteConfig.paymentmethods.map((method) => (
              <li key={method.name}>
                <Image
                  src={method.img}
                  width={40}
                  height={40}
                  alt={method.name}
                  className="h-10 w-10 object-contain"
                  aria-hidden="true"
                />
              </li>
            ))}
          </ul>
        </FooterSection>
      </div>
    </footer>
  );
}

// Reusable Footer Section Component
const FooterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h3 className="mb-6 text-base uppercase text-white">{title}</h3>
    {children}
  </div>
);

// Social Links Component
const SocialLinks = () => (
  <ul className="flex gap-4">
    <li>
      <Link
        href={siteConfig.links.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit our Instagram"
      >
        <InstagramIcon className="h-5 w-5" />
      </Link>
    </li>
    <li>
      <Link
        href={siteConfig.links.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit our LinkedIn"
      >
        <LinkedinIcon className="h-5 w-5" />
      </Link>
    </li>
  </ul>
);

// Copyright Component
const Copyright = ({ currentYear }: { currentYear: number }) => (
  <p className="pt-4 text-xs">
    &copy; {currentYear}{" "}
    <a
      href="https://mishael-joe.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-udua-orange-primary"
    >
      {siteConfig.name} LLC
    </a>
    . All rights reserved.
  </p>
);

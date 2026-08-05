export const navigationItems = [
  { label: "Explore", href: "/explore" },
  { label: "Destinations", href: "/#destinations" },
  { label: "Blog", href: "#footer" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "About", href: "#footer" }
] as const;

export const footerColumns = [
  {
    title: "Explore",
    links: ["All Trips", "Destinations", "Collections", "Travel Guides"]
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Contact"]
  },
  {
    title: "Support",
    links: ["Help Center", "Community", "Terms of Use", "Privacy Policy"]
  }
] as const;

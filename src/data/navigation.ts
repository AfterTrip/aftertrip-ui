export const navigationItems = [
  { label: "Explore", href: "/explore" },
  { label: "My Trips", href: "/dashboard" },
  { label: "Destinations", href: "/#destinations" },
  { label: "Reviews", href: "/#reviews" },
  { label: "How it works", href: "/#how-it-works" }
] as const;

export const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "All Trips", href: "/explore" },
      { label: "Destinations", href: "/#destinations" },
      { label: "Travel Guides", href: "/explore" }
    ]
  },
  {
    title: "Company",
    links: [{ label: "Reviews", href: "/#reviews" }]
  },
  {
    title: "Support",
    links: [
      { label: "hello@aftertrip.com", href: "mailto:hello@aftertrip.com" },
      { label: "Terms of Use", href: "/legal#terms" },
      { label: "Privacy Policy", href: "/legal#privacy" }
    ]
  }
] as const;

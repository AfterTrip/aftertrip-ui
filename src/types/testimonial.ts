export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  avatar: {
    initials: string;
    tone: "coral" | "teal" | "sand";
  };
};

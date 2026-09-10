export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  rating?: number;
  avatar: {
    initials: string;
    tone: "coral" | "teal" | "sand";
    src?: string | null;
  };
};

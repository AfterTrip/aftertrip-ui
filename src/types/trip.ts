export type Trip = {
  slug: string;
  title: string;
  country: string;
  duration: string;
  author: string;
  rating: string;
  views?: string;
  likes?: string;
  image: {
    src: string;
    alt: string;
  };
};

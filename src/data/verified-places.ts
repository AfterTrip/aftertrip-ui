export type VerifiedPlace = {
  id: string;
  name: string;
  region: string;
  country: string;
  label: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export const verifiedPlaces: VerifiedPlace[] = [
  {
    id: "meghalaya-india",
    name: "Meghalaya",
    region: "Meghalaya",
    country: "India",
    label: "Meghalaya, India",
    coordinates: { lat: 25.467, lng: 91.3662 }
  },
  {
    id: "munnar-kerala-india",
    name: "Munnar",
    region: "Kerala",
    country: "India",
    label: "Munnar, Kerala, India",
    coordinates: { lat: 10.0889, lng: 77.0595 }
  },
  {
    id: "vattavada-kerala-india",
    name: "Vattavada",
    region: "Kerala",
    country: "India",
    label: "Vattavada, Kerala, India",
    coordinates: { lat: 10.1649, lng: 77.2551 }
  },
  {
    id: "goa-india",
    name: "Goa",
    region: "Goa",
    country: "India",
    label: "Goa, India",
    coordinates: { lat: 15.2993, lng: 74.124 }
  },
  {
    id: "andaman-islands-india",
    name: "Andaman Islands",
    region: "Andaman and Nicobar Islands",
    country: "India",
    label: "Andaman Islands, India",
    coordinates: { lat: 11.7401, lng: 92.6586 }
  },
  {
    id: "kashmir-india",
    name: "Kashmir",
    region: "Jammu and Kashmir",
    country: "India",
    label: "Kashmir, India",
    coordinates: { lat: 34.0837, lng: 74.7973 }
  },
  {
    id: "bali-indonesia",
    name: "Bali",
    region: "Bali",
    country: "Indonesia",
    label: "Bali, Indonesia",
    coordinates: { lat: -8.3405, lng: 115.092 }
  },
  {
    id: "thailand",
    name: "Thailand",
    region: "Thailand",
    country: "Thailand",
    label: "Thailand",
    coordinates: { lat: 15.87, lng: 100.9925 }
  },
  {
    id: "switzerland",
    name: "Switzerland",
    region: "Switzerland",
    country: "Switzerland",
    label: "Switzerland",
    coordinates: { lat: 46.8182, lng: 8.2275 }
  },
  {
    id: "japan",
    name: "Japan",
    region: "Japan",
    country: "Japan",
    label: "Japan",
    coordinates: { lat: 36.2048, lng: 138.2529 }
  }
];

export function searchVerifiedPlaces(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return verifiedPlaces.slice(0, 5);

  return verifiedPlaces
    .filter((place) =>
      [place.name, place.region, place.country, place.label]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    )
    .slice(0, 5);
}

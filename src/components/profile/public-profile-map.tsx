"use client";

import { Map } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

type ProfileMapPlace = {
  label: string;
  count: number;
  x: number;
  y: number;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export function PublicProfileMap({ places }: { places: ProfileMapPlace[] }) {
  const mapNode = useRef<HTMLDivElement>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const center = useMemo(() => {
    if (!places.length) return { lng: 78.9629, lat: 20.5937 };
    return places.reduce(
      (total, place, index) => ({
        lng:
          total.lng +
          (place.coordinates.lng - total.lng) / Math.max(index + 1, 1),
        lat:
          total.lat +
          (place.coordinates.lat - total.lat) / Math.max(index + 1, 1)
      }),
      { lng: places[0].coordinates.lng, lat: places[0].coordinates.lat }
    );
  }, [places]);
  const zoom = useMemo(() => {
    if (places.length <= 1) return 5.6;
    const lats = places.map((place) => place.coordinates.lat);
    const lngs = places.map((place) => place.coordinates.lng);
    const spread = Math.max(
      Math.max(...lats) - Math.min(...lats),
      Math.max(...lngs) - Math.min(...lngs)
    );
    if (spread < 5) return 5.2;
    if (spread < 15) return 4.2;
    if (spread < 35) return 3.3;
    return 2.4;
  }, [places]);

  useEffect(() => {
    if (!token || !mapNode.current) return;

    let cancelled = false;
    let cleanup = () => {};

    async function loadMapbox() {
      const mapboxgl = await import("mapbox-gl");
      if (cancelled || !mapNode.current) return;

      mapboxgl.default.accessToken = token;
      const map = new mapboxgl.default.Map({
        container: mapNode.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [center.lng, center.lat],
        zoom,
        minZoom: 2,
        maxZoom: 10,
        attributionControl: false,
        cooperativeGestures: true
      });

      map.addControl(
        new mapboxgl.default.NavigationControl({ showCompass: false }),
        "bottom-right"
      );

      const markers = places.map((place) => {
        const element = document.createElement("button");
        element.type = "button";
        element.className = "profile-mapbox-marker";
        element.textContent = String(place.count);
        element.setAttribute(
          "aria-label",
          `${place.label}, ${place.count} trips`
        );

        return new mapboxgl.default.Marker({ element })
          .setLngLat([place.coordinates.lng, place.coordinates.lat])
          .setPopup(
            new mapboxgl.default.Popup({
              closeButton: false,
              offset: 18
            }).setHTML(
              `<strong>${place.label}</strong><span>${place.count} saved journey${place.count === 1 ? "" : "s"}</span>`
            )
          )
          .addTo(map);
      });

      cleanup = () => {
        markers.forEach((marker) => marker.remove());
        map.remove();
      };
    }

    void loadMapbox();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [center.lat, center.lng, places, token, zoom]);

  return (
    <div
      className={
        token ? "profile-mapbox" : "profile-mapbox profile-mapbox-static"
      }
      aria-label="Traveler footprint map"
    >
      <div ref={mapNode} className="profile-mapbox-canvas" />
      {!token ? (
        <div className="profile-mapbox-static-layer">
          <Map aria-hidden="true" size={30} />
          {places.map((place) => (
            <span
              style={{
                left: `${place.x}%`,
                top: `${place.y}%`
              }}
              key={place.label}
            >
              {place.count}
              <small>{place.label}</small>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

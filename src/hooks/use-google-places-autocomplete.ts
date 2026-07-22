"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { loadGoogleMapsScript } from "@/lib/google-maps";
import type { StructuredAddress } from "@/types/address";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function getAddressComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string,
): string | undefined {
  return components.find((component) => component.types.includes(type))?.long_name;
}

function parsePlace(place: google.maps.places.PlaceResult): StructuredAddress {
  const components = place.address_components ?? [];

  return {
    formattedAddress: place.formatted_address ?? "",
    street: getAddressComponent(components, "route"),
    streetNumber: getAddressComponent(components, "street_number"),
    city:
      getAddressComponent(components, "locality") ??
      getAddressComponent(components, "administrative_area_level_2"),
    province: getAddressComponent(components, "administrative_area_level_1"),
    postalCode: getAddressComponent(components, "postal_code"),
    country: getAddressComponent(components, "country"),
    placeId: place.place_id,
    lat: place.geometry?.location?.lat(),
    lng: place.geometry?.location?.lng(),
  };
}

/**
 * Ata Google Places Autocomplete a un input. Si no hay API key configurada
 * (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`), no hace nada y el input queda como
 * campo de texto libre — sin romper el formulario en local sin la key.
 *
 * Usa un callback ref (en vez de un `useRef` + `useEffect` con dependencia
 * estable) para garantizar que el efecto corra justo cuando el input se
 * monta de verdad — con un `useRef` normal, si `current` todavía es `null`
 * en el primer render, el efecto nunca se vuelve a ejecutar porque la
 * identidad del ref no cambia nunca.
 */
export function useGooglePlacesAutocomplete(onPlaceSelected: (address: StructuredAddress) => void) {
  const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const onPlaceSelectedRef = useRef(onPlaceSelected);
  onPlaceSelectedRef.current = onPlaceSelected;

  const inputRef = useCallback((node: HTMLInputElement | null) => {
    setInputElement(node);
  }, []);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || !inputElement) return;

    let isMounted = true;
    let autocomplete: google.maps.places.Autocomplete | null = null;

    loadGoogleMapsScript(GOOGLE_MAPS_API_KEY)
      .then(() => {
        if (!isMounted) return;

        autocomplete = new google.maps.places.Autocomplete(inputElement, {
          componentRestrictions: { country: "ar" },
          fields: ["address_components", "formatted_address", "place_id", "geometry"],
          types: ["address"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete?.getPlace();
          if (place?.address_components) {
            onPlaceSelectedRef.current(parsePlace(place));
          }
        });

        setIsReady(true);
      })
      .catch(() => setIsReady(false));

    return () => {
      isMounted = false;
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [inputElement]);

  return { isAvailable: Boolean(GOOGLE_MAPS_API_KEY), isReady, inputRef, inputElement };
}

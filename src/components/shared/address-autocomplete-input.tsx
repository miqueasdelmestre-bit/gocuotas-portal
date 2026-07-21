"use client";

import { useRef } from "react";

import { Input } from "@/components/ui/input";
import { useGooglePlacesAutocomplete } from "@/hooks/use-google-places-autocomplete";
import type { StructuredAddress } from "@/types/address";

interface AddressAutocompleteInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onValueChange: (value: string) => void;
  onAddressSelected: (address: StructuredAddress) => void;
}

export function AddressAutocompleteInput({
  value,
  onValueChange,
  onAddressSelected,
  placeholder,
  onKeyDown,
  ...rest
}: AddressAutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isAvailable } = useGooglePlacesAutocomplete(inputRef, onAddressSelected);

  return (
    <div className="space-y-1.5">
      <Input
        ref={inputRef}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={(event) => {
          // Evita que Enter (para elegir una sugerencia de Google) mande el formulario.
          if (event.key === "Enter") event.preventDefault();
          onKeyDown?.(event);
        }}
        placeholder={placeholder ?? "Calle, altura y localidad"}
        autoComplete="off"
        {...rest}
      />
      {!isAvailable && (
        <p className="text-xs text-muted-foreground">
          Escribí la dirección completa (calle, altura y localidad) para que llegue bien.
        </p>
      )}
    </div>
  );
}

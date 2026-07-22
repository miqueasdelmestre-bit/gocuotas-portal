"use client";

import { useEffect } from "react";

import { Input } from "@/components/ui/input";
import { useGooglePlacesAutocomplete } from "@/hooks/use-google-places-autocomplete";
import type { StructuredAddress } from "@/types/address";

interface AddressAutocompleteInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "defaultValue"> {
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
  const handlePlaceSelected = (address: StructuredAddress) => {
    onValueChange(address.formattedAddress);
    onAddressSelected(address);
  };

  const { isAvailable, inputRef, inputElement } = useGooglePlacesAutocomplete(handlePlaceSelected);

  // El input queda "no controlado" a propósito: si React le impone `value` en
  // cada tecla, pisa la manipulación interna del DOM que hace el widget de
  // Google al reposicionar su lista de sugerencias y el campo pierde el foco
  // a la primera letra. Solo lo sincronizamos cuando el valor cambia desde
  // afuera (por ejemplo, al elegir una sugerencia o resetear el formulario).
  useEffect(() => {
    if (inputElement && inputElement.value !== value) {
      inputElement.value = value;
    }
  }, [value, inputElement]);

  return (
    <div className="space-y-1.5">
      <Input
        defaultValue={value}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={(event) => {
          // Evita que Enter (para elegir una sugerencia de Google) mande el formulario.
          if (event.key === "Enter") event.preventDefault();
          onKeyDown?.(event);
        }}
        placeholder={placeholder ?? "Calle, altura y localidad"}
        autoComplete="off"
        {...rest}
        ref={inputRef}
      />
      {!isAvailable && (
        <p className="text-xs text-muted-foreground">
          Escribí la dirección completa (calle, altura y localidad) para que llegue bien.
        </p>
      )}
    </div>
  );
}

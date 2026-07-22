"use client";

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
  const { isAvailable, inputRef } = useGooglePlacesAutocomplete(onAddressSelected);

  return (
    <div className="space-y-1.5">
      <Input
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
        // Va después de {...rest}: en React 19 el `ref` que Radix Slot (FormControl)
        // inyecta viaja como prop normal y, si quedara antes, el spread lo pisaría.
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

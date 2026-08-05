"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AddressAutocompleteInput } from "@/components/shared/address-autocomplete-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  physicalMaterialRequestSchema,
  type PhysicalMaterialRequestFormValues,
} from "@/lib/schemas";
import type { StructuredAddress } from "@/types/address";
import type { PhysicalMaterialRequestInput } from "@/types/physical-material-request";

interface PhysicalMaterialRequestFormProps {
  isSubmitting: boolean;
  onSubmit: (values: PhysicalMaterialRequestInput) => void;
}

const BRANCH_COUNT_OPTIONS = Array.from({ length: 10 }, (_, index) => index + 1);

function FieldExample({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted-foreground">Ej: {children}</p>;
}

export function PhysicalMaterialRequestForm({
  isSubmitting,
  onSubmit,
}: PhysicalMaterialRequestFormProps) {
  const [structuredAddress, setStructuredAddress] = useState<StructuredAddress | null>(null);

  const form = useForm<PhysicalMaterialRequestFormValues>({
    resolver: zodResolver(physicalMaterialRequestSchema),
    defaultValues: {
      brandName: "",
      cuit: "",
      confirmCuit: "",
      email: "",
      phone: "",
      addressText: "",
      branchCount: 1,
    },
  });

  function handleSubmit(values: PhysicalMaterialRequestFormValues) {
    onSubmit({
      brandName: values.brandName,
      cuit: values.cuit,
      email: values.email,
      phone: values.phone,
      branchCount: values.branchCount,
      address: structuredAddress ?? { formattedAddress: values.addressText },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="brandName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de tu marca</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de tu marca" {...field} />
              </FormControl>
              <FieldExample>Zapatillas Pomelo</FieldExample>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cuit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">
                CUIT de tu razón social <span className="font-normal">(sin - ni espacios)</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="20123456789"
                  inputMode="numeric"
                  {...field}
                  onChange={(event) => field.onChange(event.target.value.replace(/[^\d]/g, ""))}
                />
              </FormControl>
              <FieldExample>20123456789</FieldExample>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmCuit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Confirmá tu CUIT</FormLabel>
              <FormControl>
                <Input
                  placeholder="20123456789"
                  inputMode="numeric"
                  autoComplete="off"
                  onPaste={(event) => event.preventDefault()}
                  {...field}
                  onChange={(event) => field.onChange(event.target.value.replace(/[^\d]/g, ""))}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Volvé a escribirlo para confirmar que no haya errores de tipeo.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="nombre@tumarca.com" {...field} />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Acá te llegará el seguimiento del envío.
              </p>
              <FieldExample>contacto@tumarca.com</FieldExample>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">
                Teléfono <span className="font-normal">(sin 0 ni 15)</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="1123456789"
                  inputMode="numeric"
                  {...field}
                  onChange={(event) => field.onChange(event.target.value.replace(/[^\d]/g, ""))}
                />
              </FormControl>
              <FieldExample>1123456789</FieldExample>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección (calle y altura)</FormLabel>
              <FormControl>
                <AddressAutocompleteInput
                  id={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  onAddressSelected={(address) => {
                    setStructuredAddress(address);
                    field.onChange(address.formattedAddress);
                  }}
                />
              </FormControl>
              <FieldExample>Av. Corrientes 1234 (elegí la opción correcta de la lista)</FieldExample>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="branchCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad de sucursales</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Elegí una cantidad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BRANCH_COUNT_OPTIONS.map((count) => (
                    <SelectItem key={count} value={String(count)}>
                      {count}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Enviando…" : "Solicitar material"}
        </Button>
      </form>
    </Form>
  );
}

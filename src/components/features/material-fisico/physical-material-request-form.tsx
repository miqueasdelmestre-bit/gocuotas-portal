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
import { Textarea } from "@/components/ui/textarea";
import { PHYSICAL_MATERIAL_TYPES } from "@/constants/physical-material-types";
import { formatCuit } from "@/lib/validators";
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

export function PhysicalMaterialRequestForm({
  isSubmitting,
  onSubmit,
}: PhysicalMaterialRequestFormProps) {
  const [structuredAddress, setStructuredAddress] = useState<StructuredAddress | null>(null);

  const form = useForm<PhysicalMaterialRequestFormValues>({
    resolver: zodResolver(physicalMaterialRequestSchema),
    defaultValues: {
      cuit: "",
      contactName: "",
      phone: "",
      email: "",
      materialType: "",
      notes: "",
      addressText: "",
      addressDetail: "",
    },
  });

  function handleSubmit(values: PhysicalMaterialRequestFormValues) {
    onSubmit({
      cuit: values.cuit,
      contactName: values.contactName,
      phone: values.phone,
      email: values.email,
      materialType: values.materialType,
      notes: values.notes,
      addressDetail: values.addressDetail,
      address: structuredAddress ?? { formattedAddress: values.addressText },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="cuit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CUIT</FormLabel>
                <FormControl>
                  <Input
                    placeholder="30-12345678-9"
                    inputMode="numeric"
                    {...field}
                    onChange={(event) => field.onChange(formatCuit(event.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Persona de contacto</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre y apellido" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="11 2345 6789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="nombre@comercio.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="materialType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de material</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Elegí un tipo de material" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PHYSICAL_MATERIAL_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección de entrega</FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressDetail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Piso, depto o referencia (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Piso 3, depto B / al lado de..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentarios (opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Cantidad aproximada, aclaraciones, etc." {...field} />
              </FormControl>
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

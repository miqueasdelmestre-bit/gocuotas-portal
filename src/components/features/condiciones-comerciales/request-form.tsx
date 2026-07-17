"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatCuit } from "@/lib/validators";
import {
  commercialConditionRequestSchema,
  type CommercialConditionRequestFormValues,
} from "@/lib/schemas";
import type { PlanOption } from "@/types/plan";

import { RequestSummary } from "./request-summary";

interface RequestFormProps {
  plan: PlanOption;
  isSubmitting: boolean;
  onSubmit: (values: CommercialConditionRequestFormValues) => void;
}

export function RequestForm({ plan, isSubmitting, onSubmit }: RequestFormProps) {
  const form = useForm<CommercialConditionRequestFormValues>({
    resolver: zodResolver(commercialConditionRequestSchema),
    defaultValues: {
      cuit: "",
      email: "",
      acceptsCommercialConditions: false,
      commitsToCommunicateConditions: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <RequestSummary plan={plan} />

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

        <FormField
          control={form.control}
          name="acceptsCommercialConditions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-normal">
                  Acepto las condiciones comerciales.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="commitsToCommunicateConditions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-normal">
                  Me comprometo a comunicar las nuevas condiciones comerciales en mi tienda
                  online y/o redes sociales.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Enviando…" : "Enviar solicitud"}
        </Button>
      </form>
    </Form>
  );
}

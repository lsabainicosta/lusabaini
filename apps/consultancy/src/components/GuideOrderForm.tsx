"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@lusabaini/ui/components/button";
import { Input } from "@lusabaini/ui/components/input";
import { Label } from "@lusabaini/ui/components/label";

const orderSchema = z.object({
  name: z.string().min(2, "O nome precisa ter pelo menos 2 caracteres"),
  email: z.string().email("Informe um e-mail válido"),
});

type OrderFormData = z.infer<typeof orderSchema>;

type Order = { orderRef: string; paypalUrl: string; price: string };

type Props = { guideId: string; priceLabel: string };

export default function GuideOrderForm({ guideId, priceLabel }: Props) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [order, setOrder] = React.useState<Order | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: { name: "", email: "" },
  });

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/guides/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, guideId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Falha ao registrar o pedido");
      }

      setOrder(result);
    } catch (error) {
      toast.error("Não foi possível registrar o pedido", {
        description:
          error instanceof Error
            ? error.message
            : "Tente novamente em alguns minutos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (order) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white/70 p-6">
        <p className="heading-3 text-foreground">Pedido {order.orderRef} recebido!</p>
        <p className="mt-3 text-body">
          Enviei um resumo para o seu e-mail. Agora é só pagar {order.price} pelo
          PayPal e colocar o código <strong>{order.orderRef}</strong> na mensagem
          do pagamento. Depois da confirmação, o guia chega no seu e-mail em até
          48 horas.
        </p>
        <Button asChild size="lg" className="mt-6">
          <a href={order.paypalUrl} target="_blank" rel="noopener noreferrer">
            Pagar com PayPal
          </a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`name-${guideId}`} className="text-sm font-medium text-foreground">
            Nome
          </Label>
          <Input
            id={`name-${guideId}`}
            placeholder="Seu nome"
            autoComplete="name"
            className="rounded-xl border-black/10 bg-white/50 focus-visible:border-black/20 focus-visible:ring-black/5"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`email-${guideId}`} className="text-sm font-medium text-foreground">
            E-mail
          </Label>
          <Input
            id={`email-${guideId}`}
            type="email"
            placeholder="Onde você quer receber o guia"
            autoComplete="email"
            className="rounded-xl border-black/10 bg-white/50 focus-visible:border-black/20 focus-visible:ring-black/5"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Enviando..." : `Comprar por ${priceLabel}`}
      </Button>
      <p className="text-center text-xs text-foreground/50 text-balance">
        Pagamento via PayPal · Guia em PDF no seu e-mail em até 48h
      </p>
    </form>
  );
}

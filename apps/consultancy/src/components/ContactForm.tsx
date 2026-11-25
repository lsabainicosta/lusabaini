"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@lusabaini/ui/components/button";
import { Input } from "@lusabaini/ui/components/input";
import { Textarea } from "@lusabaini/ui/components/textarea";
import { Label } from "@lusabaini/ui/components/label";

const contactSchema = z
  .object({
    name: z.string().min(2, "O nome precisa ter pelo menos 2 caracteres"),
    email: z.string().email("Informe um e-mail válido"),
    topics: z.array(z.string()),
    other: z.boolean(),
    message: z.string(),
    website: z.string(),
  })
  .refine(
    (d) => (d.topics.length > 0 && !d.other) || d.message.trim().length >= 10,
    {
      path: ["message"],
      message: "Conte um pouco o que você precisa (pelo menos 10 caracteres)",
    }
  );

type ContactFormData = z.infer<typeof contactSchema>;

type Props = {
  topics: string[];
  initialTopics?: string[];
  className?: string;
};

const chip =
  "cursor-pointer select-none rounded-full border border-black/10 bg-white/50 px-4 py-2 text-sm text-foreground transition-colors hover:border-black/25 has-[:checked]:border-foreground has-[:checked]:bg-foreground has-[:checked]:text-background has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-black/20";

export default function ContactForm({ topics, initialTopics = [], className }: Props) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const defaultValues: ContactFormData = {
    name: "",
    email: "",
    // An array default makes react-hook-form return an array even for one checkbox.
    topics: initialTopics,
    other: false,
    message: "",
    website: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });

  const messageRequired = watch("other") || watch("topics").length === 0;

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Falha ao enviar a mensagem");
      }

      toast.success("Mensagem enviada!", {
        description: "Você vai receber uma confirmação no seu e-mail. Respondo em até 2 dias úteis.",
      });

      reset({ ...defaultValues, topics: [] });
    } catch (error) {
      toast.error("Não foi possível enviar", {
        description:
          error instanceof Error ? error.message : "Tente novamente em alguns minutos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "rounded-xl border-black/10 bg-white/50 focus-visible:border-black/20 focus-visible:ring-black/5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className ?? "space-y-5"}>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-foreground">
          Nome
        </Label>
        <Input
          id="name"
          placeholder="Seu nome"
          className={inputClass}
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          className={inputClass}
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-foreground">
          Sobre o que você quer conversar?
        </legend>
        <p className="text-xs text-muted-foreground">Pode escolher mais de um tema.</p>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <label key={topic} className={chip}>
              <input type="checkbox" value={topic} className="sr-only" {...register("topics")} />
              {topic}
            </label>
          ))}
          <label className={chip}>
            <input type="checkbox" className="sr-only" {...register("other")} />
            Outro assunto
          </label>
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-foreground">
          {messageRequired ? "Conte o que você precisa" : "Algo que eu deva saber? (opcional)"}
        </Label>
        <Textarea
          id="message"
          placeholder="Conte um pouco sobre o seu momento e o que você precisa..."
          rows={5}
          className={`${inputClass} resize-none`}
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      {/* Honeypot: hidden from people, bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Enviando..." : "Enviar mensagem"}
      </Button>
    </form>
  );
}

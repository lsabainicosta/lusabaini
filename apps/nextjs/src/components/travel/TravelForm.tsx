"use client";

import * as React from "react";
import { useForm, Controller, useWatch, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Matcher } from "react-day-picker";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const estadiaRowSchema = z.object({
  cidade: z.string().min(1, "Informe a cidade"),
  dias: z
    .string()
    .min(1, "Informe os dias")
    .refine((s) => {
      const n = Number.parseInt(s.replace(/\D/g, ""), 10);
      return Number.isFinite(n) && n >= 1 && n <= 60;
    }, "Use um número entre 1 e 60"),
});

const travelFormSchema = z
  .object({
    nomeCompleto: z.string().min(2, "Por favor, insira seu nome completo"),
    email: z.string().email("Por favor, insira um email válido"),
    dataNascimento: z.string().optional(),

    estadias: z
      .array(estadiaRowSchema)
      .min(1, "Adicione pelo menos uma cidade com duração"),

    viagemDataInicio: z.string().optional(),
    viagemDataFim: z.string().optional(),
    quantosDias: z.string().optional(),
    jaVisitouHolanda: z.string().optional(),

    tipoViagem: z.string().optional(),
    comQuemViaja: z.string().optional(),
    objetivoViagem: z.array(z.string()),

    gastoPorDia: z.string().optional(),
    economizarEm: z.array(z.string()),

    preferencias: z.array(z.string()),
    restricaoAlimentar: z.string().optional(),
    lugaresNaoQuerIr: z.string().optional(),

    estiloRoteiro: z.string().optional(),
    estiloDias: z.string().optional(),

    hospedagem: z.string().optional(),
    transporte: z.array(z.string()),

    viagemPerfeita: z.string().optional(),
    ocasiaoEspecial: z.string().optional(),
    recomendacoes: z.array(z.string()),

    extras: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    const iso = /^\d{4}-\d{2}-\d{2}$/;
    const a = data.viagemDataInicio?.trim();
    const b = data.viagemDataFim?.trim();
    if (a && !iso.test(a)) {
      ctx.addIssue({
        code: "custom",
        message: "Data inválida",
        path: ["viagemDataInicio"],
      });
    }
    if (b && !iso.test(b)) {
      ctx.addIssue({
        code: "custom",
        message: "Data inválida",
        path: ["viagemDataFim"],
      });
    }
    if (a && b && iso.test(a) && iso.test(b) && a > b) {
      ctx.addIssue({
        code: "custom",
        message: "Deve ser igual ou depois da data de início",
        path: ["viagemDataFim"],
      });
    }
  });

type TravelFormData = z.infer<typeof travelFormSchema>;

/** Guia / roteiro: preço fixo até 5 dias; dias extras cobrados à parte */
const GUIDE_BASE_EUR = 85;
const INCLUDED_DAYS = 5;
const PER_EXTRA_DAY_EUR = 20;
const PER_EXTRA_OPTION_EUR = 15;
const MAX_DAYS_PARSED = 30;

/** Opções da seção Extras — também usadas na estimativa (€15 cada) */
const EXTRA_OPTIONS: { value: string; label: string }[] = [
  { value: "roteiro-diario", label: "Roteiro dia a dia detalhado" },
  { value: "restaurantes", label: "Lista de restaurantes" },
  { value: "hidden-gems", label: "Lugares escondidos (hidden gems)" },
  { value: "economia", label: "Dicas de economia" },
  { value: "checklist", label: "Checklist de viagem" },
  { value: "transporte-dicas", label: "Dicas de transporte passo a passo" },
  {
    value: "armadilhas-turisticas",
    label: "Dicas para não cair em armadilhas turísticas",
  },
  {
    value: "lugares-pouco-obvios",
    label: "Lugares que não são tão óbvios",
  },
  { value: "dias-de-chuva", label: "Ideias para dias de chuva" },
  {
    value: "bate-volta",
    label: "Sugestões de bate-volta fora da cidade",
  },
];

function parseTripDays(raw: string | undefined): number {
  if (!raw?.trim()) return INCLUDED_DAYS;
  const n = parseInt(raw.replace(/\D/g, ""), 10);
  if (!Number.isFinite(n) || n < 1) return INCLUDED_DAYS;
  return Math.min(n, MAX_DAYS_PARSED);
}

function formatEur(amount: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function buildEstimateLines(
  quantosDias: string | undefined,
  extrasSelected: string[],
): {
  label: string;
  eur: number;
}[] {
  const lines: { label: string; eur: number }[] = [
    {
      label: `Guia personalizado (até ${INCLUDED_DAYS} dias incluídos)`,
      eur: GUIDE_BASE_EUR,
    },
  ];

  const days = parseTripDays(quantosDias);
  if (days > INCLUDED_DAYS) {
    const extraDays = days - INCLUDED_DAYS;
    lines.push({
      label: `${extraDays} dia(s) adicional(is) (€${PER_EXTRA_DAY_EUR}/dia)`,
      eur: extraDays * PER_EXTRA_DAY_EUR,
    });
  }

  const selected = new Set(extrasSelected);
  for (const opt of EXTRA_OPTIONS) {
    if (selected.has(opt.value)) {
      lines.push({
        label: `${opt.label} (extra)`,
        eur: PER_EXTRA_OPTION_EUR,
      });
    }
  }

  return lines;
}

const inputClasses =
  "rounded-xl border-black/10 bg-white/50 focus-visible:border-black/20 focus-visible:ring-black/5";

function isoToLocalDate(iso: string | undefined): Date | undefined {
  if (!iso?.trim()) return undefined;
  const d = parse(iso.trim(), "yyyy-MM-dd", new Date());
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function FormDatePicker({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  calendarDisabled,
}: {
  id: string;
  label: string;
  value: string | undefined;
  onChange: (next: string) => void;
  error?: string;
  placeholder: string;
  calendarDisabled?: Matcher | Matcher[];
}) {
  const [open, setOpen] = React.useState(false);
  const selected = isoToLocalDate(value);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-black">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "h-10 w-full justify-start rounded-xl border-black/10 bg-white/50 px-3 text-left font-normal hover:bg-white/80",
              !selected && "text-black/45",
            )}
          >
            <CalendarIcon
              className="mr-2 size-4 shrink-0 opacity-50"
              aria-hidden
            />
            <span className="truncate">
              {selected
                ? format(selected, "d 'de' MMMM yyyy", { locale: ptBR })
                : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            locale={ptBR}
            selected={selected}
            defaultMonth={selected}
            disabled={calendarDisabled}
            onSelect={(d) => {
              onChange(d ? format(d, "yyyy-MM-dd") : "");
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function SectionHeading({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-baseline gap-3 pt-2">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
        {number}
      </span>
      <h2 className="text-lg font-semibold tracking-tight text-black">
        {title}
      </h2>
    </div>
  );
}

function CheckboxGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {options.map((opt) => {
        const checked = value.includes(opt.value);
        return (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 bg-white/50 px-4 py-3 transition-colors select-none hover:bg-white/80 has-[data-state=checked]:border-black/25 has-[data-state=checked]:bg-white/90"
          >
            <Checkbox
              checked={checked}
              onCheckedChange={(c) => {
                if (c) onChange([...value, opt.value]);
                else onChange(value.filter((v) => v !== opt.value));
              }}
            />
            <span className="text-sm text-black/80">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

function RadioCard({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <RadioGroup value={value ?? ""} onValueChange={onChange}>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 bg-white/50 px-4 py-3 transition-colors select-none hover:bg-white/80 has-[data-state=checked]:border-black/25 has-[data-state=checked]:bg-white/90"
          >
            <RadioGroupItem value={opt.value} />
            <span className="text-sm text-black/80">{opt.label}</span>
          </label>
        ))}
      </div>
    </RadioGroup>
  );
}

export default function TravelForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TravelFormData>({
    resolver: zodResolver(travelFormSchema),
    defaultValues: {
      nomeCompleto: "",
      email: "",
      dataNascimento: "",
      estadias: [{ cidade: "", dias: "" }],
      viagemDataInicio: "",
      viagemDataFim: "",
      quantosDias: "",
      jaVisitouHolanda: "",
      tipoViagem: "",
      comQuemViaja: "",
      objetivoViagem: [],
      gastoPorDia: "",
      economizarEm: [],
      preferencias: [],
      restricaoAlimentar: "",
      lugaresNaoQuerIr: "",
      estiloRoteiro: "",
      estiloDias: "",
      hospedagem: "",
      transporte: [],
      viagemPerfeita: "",
      ocasiaoEspecial: "",
      recomendacoes: [],
      extras: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "estadias",
  });

  const quantosDiasWatched = useWatch({ control, name: "quantosDias" });
  const extrasWatched = useWatch({ control, name: "extras" });
  const viagemDataInicioWatched = useWatch({
    control,
    name: "viagemDataInicio",
  });

  const estimateLines = React.useMemo(
    () => buildEstimateLines(quantosDiasWatched, extrasWatched ?? []),
    [quantosDiasWatched, extrasWatched],
  );

  const estimateTotal = React.useMemo(
    () => estimateLines.reduce((sum, row) => sum + row.eur, 0),
    [estimateLines],
  );

  const onSubmit = async (data: TravelFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/travel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Erro ao enviar formulário");
      }
      setSubmitted(true);
    } catch (error) {
      toast.error("Erro ao enviar", {
        description:
          error instanceof Error
            ? error.message
            : "Por favor, tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-5 py-16 text-center">
        <p className="text-5xl">🌷</p>
        <h2 className="text-3xl font-medium tracking-tight text-black">
          Obrigada!
        </h2>
        <p className="mx-auto max-w-md text-base leading-relaxed text-black/60">
          Recebemos suas informações e em breve entraremos em contato para
          montar o seu roteiro personalizado. Fique de olho no seu email!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* ── Personal info ── */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="nomeCompleto"
            className="text-sm font-medium text-black"
          >
            Nome completo *
          </Label>
          <Input
            id="nomeCompleto"
            placeholder="Seu nome completo"
            className={inputClasses}
            aria-invalid={!!errors.nomeCompleto}
            {...register("nomeCompleto")}
          />
          {errors.nomeCompleto && (
            <p className="text-xs text-red-600">
              {errors.nomeCompleto.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-black">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className={inputClasses}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="dataNascimento"
            className="text-sm font-medium text-black"
          >
            Data de nascimento
          </Label>
          <Input
            id="dataNascimento"
            placeholder="DD/MM/AAAA"
            className={inputClasses}
            {...register("dataNascimento")}
          />
        </div>
      </div>

      <hr className="border-black/5" />

      {/* ── 1. Basic trip info ── */}
      <div className="space-y-4">
        <SectionHeading number={1} title="Informações básicas da viagem" />

        <div className="space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Label className="text-sm font-medium text-black">
                Cidades e tempo em cada uma *
              </Label>
              <p className="text-xs text-black/55">
                Adicione uma linha por cidade e quantos dias você pretende ficar
                em cada uma (na ordem da viagem, se já souber).
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5 rounded-xl border-black/15 bg-white/50"
              onClick={() => append({ cidade: "", dias: "" })}
            >
              <Plus className="size-4" aria-hidden />
              Adicionar cidade
            </Button>
          </div>

          {errors.estadias &&
          typeof errors.estadias === "object" &&
          "message" in errors.estadias &&
          typeof errors.estadias.message === "string" ? (
            <p className="text-xs text-red-600">{errors.estadias.message}</p>
          ) : null}

          <div className="space-y-3">
            {fields.map((fieldRow, index) => {
              const cidadeErr = errors.estadias?.[index]?.cidade;
              const diasErr = errors.estadias?.[index]?.dias;
              return (
                <div
                  key={fieldRow.id}
                  className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white/40 p-3 sm:flex-row sm:items-end"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <Label
                      htmlFor={`estadias.${index}.cidade`}
                      className="text-xs font-medium text-black/70"
                    >
                      Cidade
                    </Label>
                    <Input
                      id={`estadias.${index}.cidade`}
                      placeholder="Ex: Amsterdã"
                      className={inputClasses}
                      aria-invalid={!!cidadeErr}
                      {...register(`estadias.${index}.cidade`)}
                    />
                    {cidadeErr?.message ? (
                      <p className="text-xs text-red-600">
                        {cidadeErr.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="w-full space-y-2 sm:w-28">
                    <Label
                      htmlFor={`estadias.${index}.dias`}
                      className="text-xs font-medium text-black/70"
                    >
                      Dias
                    </Label>
                    <Input
                      id={`estadias.${index}.dias`}
                      inputMode="numeric"
                      placeholder="Ex: 4"
                      className={inputClasses}
                      aria-invalid={!!diasErr}
                      {...register(`estadias.${index}.dias`)}
                    />
                    {diasErr?.message ? (
                      <p className="text-xs text-red-600">{diasErr.message}</p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 self-end text-black/50 hover:text-red-600"
                    disabled={fields.length <= 1}
                    aria-label={`Remover parada ${index + 1}`}
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="viagemDataInicio"
            control={control}
            render={({ field }) => (
              <FormDatePicker
                id="viagemDataInicio"
                label="Data de início da viagem"
                placeholder="Selecione a data"
                value={field.value}
                onChange={field.onChange}
                error={errors.viagemDataInicio?.message}
              />
            )}
          />
          <Controller
            name="viagemDataFim"
            control={control}
            render={({ field }) => (
              <FormDatePicker
                id="viagemDataFim"
                label="Data de fim da viagem"
                placeholder="Selecione a data"
                value={field.value}
                onChange={field.onChange}
                error={errors.viagemDataFim?.message}
                calendarDisabled={
                  viagemDataInicioWatched?.trim()
                    ? {
                        before: parse(
                          viagemDataInicioWatched.trim(),
                          "yyyy-MM-dd",
                          new Date(),
                        ),
                      }
                    : undefined
                }
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="quantosDias"
            className="text-sm font-medium text-black"
          >
            Quantos dias?
          </Label>
          <Input
            id="quantosDias"
            placeholder="Ex: 7 dias"
            className={inputClasses}
            {...register("quantosDias")}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">
            Você já visitou a Holanda antes?
          </Label>
          <Controller
            name="jaVisitouHolanda"
            control={control}
            render={({ field }) => (
              <RadioCard
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "sim", label: "Sim" },
                  { value: "nao", label: "Não" },
                ]}
              />
            )}
          />
        </div>
      </div>

      <hr className="border-black/5" />

      {/* ── 2. Travel profile ── */}
      <div className="space-y-4">
        <SectionHeading number={2} title="Perfil de viagem" />

        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">
            Tipo de viagem
          </Label>
          <Controller
            name="tipoViagem"
            control={control}
            render={({ field }) => (
              <RadioCard
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "economica", label: "Econômica" },
                  { value: "conforto", label: "Conforto" },
                  { value: "luxo", label: "Luxo" },
                ]}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">
            Com quem você está viajando?
          </Label>
          <Controller
            name="comQuemViaja"
            control={control}
            render={({ field }) => (
              <RadioCard
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "sozinho", label: "Sozinho(a)" },
                  { value: "casal", label: "Casal" },
                  { value: "amigos", label: "Amigos" },
                  { value: "familia", label: "Família com crianças" },
                ]}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">
            Qual o objetivo da viagem?
          </Label>
          <Controller
            name="objetivoViagem"
            control={control}
            render={({ field }) => (
              <CheckboxGroup
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "turismo", label: "Turismo clássico" },
                  { value: "gastronomia", label: "Gastronomia" },
                  { value: "compras", label: "Compras" },
                  { value: "vida-noturna", label: "Vida noturna" },
                  { value: "experiencia-local", label: "Experiência local" },
                  { value: "fotos", label: "Fotos / Instagram" },
                ]}
              />
            )}
          />
        </div>
      </div>

      <hr className="border-black/5" />

      {/* ── 3. Budget ── */}
      <div className="space-y-4">
        <SectionHeading number={3} title="Orçamento" />

        <div className="space-y-2">
          <Label
            htmlFor="gastoPorDia"
            className="text-sm font-medium text-black"
          >
            Quanto você pretende gastar por dia (aproximadamente)?
          </Label>
          <Input
            id="gastoPorDia"
            placeholder="Ex: €100, €200"
            className={inputClasses}
            {...register("gastoPorDia")}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">
            Prefere economizar em:
          </Label>
          <Controller
            name="economizarEm"
            control={control}
            render={({ field }) => (
              <CheckboxGroup
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "alimentacao", label: "Alimentação" },
                  { value: "transporte", label: "Transporte" },
                  { value: "hospedagem", label: "Hospedagem" },
                  { value: "passeios", label: "Passeios" },
                ]}
              />
            )}
          />
        </div>
      </div>

      <hr className="border-black/5" />

      {/* ── 4. Personal preferences ── */}
      <div className="space-y-4">
        <SectionHeading number={4} title="Preferências pessoais" />

        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">
            Você gosta de:
          </Label>
          <Controller
            name="preferencias"
            control={control}
            render={({ field }) => (
              <CheckboxGroup
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "museus", label: "Museus" },
                  { value: "ar-livre", label: "Passeios ao ar livre" },
                  { value: "cafes", label: "Cafés fofos" },
                  { value: "restaurantes-insta", label: "Restaurantes" },
                  { value: "baladas", label: "Baladas / Bars" },
                ]}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="restricaoAlimentar"
            className="text-sm font-medium text-black"
          >
            Alguma restrição alimentar?
          </Label>
          <Input
            id="restricaoAlimentar"
            placeholder="Ex: vegetariano, sem glúten..."
            className={inputClasses}
            {...register("restricaoAlimentar")}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="lugaresNaoQuerIr"
            className="text-sm font-medium text-black"
          >
            Lugares que você NÃO quer ir?
          </Label>
          <Input
            id="lugaresNaoQuerIr"
            placeholder="Algum lugar específico que deseja evitar?"
            className={inputClasses}
            {...register("lugaresNaoQuerIr")}
          />
        </div>
      </div>

      <hr className="border-black/5" />

      {/* ── 5. Itinerary style ── */}
      <div className="space-y-4">
        <SectionHeading number={5} title="Estilo de roteiro" />

        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">
            Você prefere:
          </Label>
          <Controller
            name="estiloRoteiro"
            control={control}
            render={({ field }) => (
              <RadioCard
                value={field.value}
                onChange={field.onChange}
                options={[
                  {
                    value: "planejado",
                    label: "Roteiro bem planejado (com horários)",
                  },
                  { value: "flexivel", label: "Sugestões flexíveis" },
                ]}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">
            Você gosta de dias:
          </Label>
          <Controller
            name="estiloDias"
            control={control}
            render={({ field }) => (
              <RadioCard
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "cheios", label: "Cheios (aproveitar ao máximo)" },
                  { value: "tranquilos", label: "Mais tranquilos" },
                ]}
              />
            )}
          />
        </div>
      </div>

      <hr className="border-black/5" />

      {/* ── 6. Logistics ── */}
      <div className="space-y-4">
        <SectionHeading number={6} title="Logística" />

        <div className="space-y-2">
          <Label
            htmlFor="hospedagem"
            className="text-sm font-medium text-black"
          >
            Onde você vai se hospedar?
          </Label>
          <Input
            id="hospedagem"
            placeholder="Bairro, hotel ou ainda não decidiu"
            className={inputClasses}
            {...register("hospedagem")}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">
            Você pretende usar:
          </Label>
          <Controller
            name="transporte"
            control={control}
            render={({ field }) => (
              <CheckboxGroup
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "publico", label: "Transporte público" },
                  { value: "bicicleta", label: "Bicicleta" },
                  { value: "uber-carro", label: "Uber / carro" },
                ]}
              />
            )}
          />
        </div>
      </div>

      <hr className="border-black/5" />

      {/* ── 7. Personalized experience ── */}
      <div className="space-y-4">
        <SectionHeading number={7} title="Experiência personalizada" />

        <div className="space-y-2">
          <Label
            htmlFor="viagemPerfeita"
            className="text-sm font-medium text-black"
          >
            O que tornaria essa viagem PERFEITA pra você?
          </Label>
          <Textarea
            id="viagemPerfeita"
            placeholder="Conte um pouco sobre o que você sonha para essa viagem..."
            rows={3}
            className={`${inputClasses} resize-none`}
            {...register("viagemPerfeita")}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="ocasiaoEspecial"
            className="text-sm font-medium text-black"
          >
            Alguma ocasião especial?
          </Label>
          <Input
            id="ocasiaoEspecial"
            placeholder="Ex: aniversário, lua de mel, formatura..."
            className={inputClasses}
            {...register("ocasiaoEspecial")}
          />
        </div>
      </div>

      <hr className="border-black/5" />

      {/* ── 8. Extras ── */}
      <div className="space-y-4">
        <SectionHeading number={8} title="Extras" />

        <div className="space-y-2">
          <div className="flex flex-col gap-0.5">
            <Label className="text-sm font-medium text-black">Você quer:</Label>
            <p className="text-xs text-black/55">
              Cada opção marcada abaixo adiciona {PER_EXTRA_OPTION_EUR}€ à
              estimativa.
            </p>
          </div>
          <Controller
            name="extras"
            control={control}
            render={({ field }) => (
              <CheckboxGroup
                value={field.value}
                onChange={field.onChange}
                options={EXTRA_OPTIONS}
              />
            )}
          />
        </div>
      </div>

      <div
        className="rounded-2xl border border-black/10 bg-black/3 px-4 py-5 sm:px-5"
        aria-live="polite"
      >
        <p className="text-sm font-semibold tracking-tight text-black">
          Estimativa do serviço
        </p>
        <p className="mt-1 text-xs leading-relaxed text-black/55">
          {GUIDE_BASE_EUR}€ cobre o guia para até {INCLUDED_DAYS} dias; cada dia
          extra custa {PER_EXTRA_DAY_EUR}€. Cada extra marcado na seção
          &quot;Extras&quot; soma {PER_EXTRA_OPTION_EUR}€. Indicativo — o valor
          final é confirmado por email.
        </p>
        <ul className="mt-4 space-y-2 border-t border-black/10 pt-4 text-sm">
          {estimateLines.map((row, i) => (
            <li
              key={`${i}-${row.label}`}
              className="flex justify-between gap-4 text-black/80"
            >
              <span className="min-w-0 flex-1 leading-snug">{row.label}</span>
              <span className="shrink-0 tabular-nums font-medium text-black">
                {formatEur(row.eur)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-black/10 pt-4">
          <span className="text-sm font-semibold text-black">
            Total estimado
          </span>
          <span className="text-lg font-semibold tabular-nums tracking-tight text-black">
            {formatEur(estimateTotal)}
          </span>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Enviando..." : "Enviar formulário"}
        </Button>
      </div>
    </form>
  );
}

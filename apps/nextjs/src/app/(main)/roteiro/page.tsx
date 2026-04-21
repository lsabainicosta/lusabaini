import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import TravelForm from "@/components/travel/TravelForm";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    pathname: "/roteiro",
    title: "Roteiro Personalizado",
    description: "Monte seu roteiro personalizado para a Holanda.",
    index: false,
    follow: false,
  });
}

export default function RoteiroPage() {
  return (
    <section className="w-full pt-20 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-[2.5rem] border-4 border-white bg-white/70 p-6 shadow-2xl sm:p-8">
          <div className="mb-10 space-y-4">
            <h1 className="text-4xl font-medium tracking-[-0.04em] leading-[0.95] text-black sm:text-5xl">
              Roteiro Personalizado
            </h1>
            <p className="text-lg leading-relaxed text-black/65">
              Preencha o formulário abaixo para que possamos montar o roteiro
              perfeito para a sua viagem à Holanda. Quanto mais detalhes, melhor!
            </p>
            <p className="text-sm text-black/50">
              Campos com * são obrigatórios. Após o envio, entraremos em contato
              para finalizar os detalhes.
            </p>
          </div>

          <TravelForm />
        </div>
      </div>
    </section>
  );
}

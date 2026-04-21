import { NextResponse } from "next/server";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function formatIsoForEmail(iso: string | undefined): string | undefined {
  const s = iso?.trim();
  if (!s) return undefined;
  const d = parse(s, "yyyy-MM-dd", new Date());
  if (Number.isNaN(d.getTime())) return iso;
  return format(d, "dd/MM/yyyy", { locale: ptBR });
}

function esc(value: string | undefined | null): string {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function labelList(values: string[] | undefined, map: Record<string, string>): string {
  if (!values?.length) return "<em>—</em>";
  return values.map((v) => esc(map[v] ?? v)).join(", ");
}

const OBJETIVO_MAP: Record<string, string> = {
  turismo: "Turismo clássico",
  gastronomia: "Gastronomia",
  compras: "Compras",
  "vida-noturna": "Vida noturna",
  "experiencia-local": "Experiência local",
  fotos: "Fotos / Instagram",
};

const ECONOMIZAR_MAP: Record<string, string> = {
  alimentacao: "Alimentação",
  transporte: "Transporte",
  hospedagem: "Hospedagem",
  passeios: "Passeios",
};

const PREFERENCIAS_MAP: Record<string, string> = {
  museus: "Museus",
  "ar-livre": "Passeios ao ar livre",
  cafes: "Cafés fofos",
  "restaurantes-insta": "Restaurantes instagramáveis",
  baladas: "Baladas",
};

const TRANSPORTE_MAP: Record<string, string> = {
  publico: "Transporte público",
  bicicleta: "Bicicleta",
  "uber-carro": "Uber / carro",
};

const RECOMENDACOES_MAP: Record<string, string> = {
  secretos: "Spots secretos / menos turísticos",
  diferentoes: "Lugares diferentões",
  instagramaveis: "Lugares instagramáveis",
};

const EXTRAS_MAP: Record<string, string> = {
  "roteiro-diario": "Roteiro dia a dia detalhado",
  restaurantes: "Lista de restaurantes",
  "hidden-gems": "Lugares escondidos (hidden gems)",
  economia: "Dicas de economia",
  checklist: "Checklist de viagem",
  "transporte-dicas": "Dicas de transporte passo a passo",
  "armadilhas-turisticas": "Dicas para não cair em armadilhas turísticas",
  "lugares-pouco-obvios": "Lugares que não são tão óbvios",
  "dias-de-chuva": "Ideias para dias de chuva",
  "bate-volta": "Sugestões de bate-volta fora da cidade",
  "evitar-filas": "Melhores horários para fugir de filas e multidões",
};

const TIPO_MAP: Record<string, string> = {
  economica: "Econômica",
  conforto: "Conforto",
  luxo: "Luxo",
};

const COMPANHIA_MAP: Record<string, string> = {
  sozinho: "Sozinho(a)",
  casal: "Casal",
  amigos: "Amigos",
  familia: "Família com crianças",
};

const ESTILO_ROTEIRO_MAP: Record<string, string> = {
  planejado: "Bem planejado (com horários)",
  flexivel: "Sugestões flexíveis",
};

const ESTILO_DIAS_MAP: Record<string, string> = {
  cheios: "Cheios (aproveitar ao máximo)",
  tranquilos: "Mais tranquilos",
};

type Estadia = { cidade: string; dias: string };

type TravelPayload = {
  nomeCompleto: string;
  email: string;
  dataNascimento?: string;
  estadias?: Estadia[];
  viagemDataInicio?: string;
  viagemDataFim?: string;
  quantosDias?: string;
  jaVisitouHolanda?: string;
  tipoViagem?: string;
  comQuemViaja?: string;
  objetivoViagem?: string[];
  gastoPorDia?: string;
  economizarEm?: string[];
  preferencias?: string[];
  restricaoAlimentar?: string;
  lugaresNaoQuerIr?: string;
  estiloRoteiro?: string;
  estiloDias?: string;
  hospedagem?: string;
  transporte?: string[];
  viagemPerfeita?: string;
  ocasiaoEspecial?: string;
  recomendacoes?: string[];
  extras?: string[];
};

function row(label: string, value: string | undefined | null): string {
  const display = value?.trim() ? esc(value) : "<em>—</em>";
  return `<tr><td style="padding:6px 12px 6px 0;color:#666;white-space:nowrap;vertical-align:top"><strong>${label}</strong></td><td style="padding:6px 0;color:#333">${display}</td></tr>`;
}

function formatEstadiasForEmail(data: TravelPayload): string | undefined {
  const list = data.estadias;
  if (!Array.isArray(list) || list.length === 0) return undefined;
  const parts: string[] = [];
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    const cidade = typeof e?.cidade === "string" ? e.cidade.trim() : "";
    if (!cidade) continue;
    const n = Number.parseInt(String(e?.dias ?? "").replace(/\D/g, ""), 10);
    const diasLabel = Number.isFinite(n) ? String(n) : String(e?.dias ?? "").trim();
    parts.push(`${i + 1}. ${cidade} (${diasLabel} dia(s))`);
  }
  return parts.length ? parts.join("; ") : undefined;
}

function estadiasPayloadValid(estadias: unknown): estadias is Estadia[] {
  if (!Array.isArray(estadias) || estadias.length === 0) return false;
  return estadias.every((item) => {
    if (!item || typeof item !== "object") return false;
    const row = item as Record<string, unknown>;
    const cidade = typeof row.cidade === "string" ? row.cidade.trim() : "";
    const diasRaw = typeof row.dias === "string" ? row.dias : "";
    if (!cidade || !diasRaw.trim()) return false;
    const n = Number.parseInt(diasRaw.replace(/\D/g, ""), 10);
    return Number.isFinite(n) && n >= 1 && n <= 60;
  });
}

function buildLeadEmail(data: TravelPayload): string {
  return `
<div style="font-family:sans-serif;max-width:640px;margin:0 auto;color:#333">
  <h2 style="border-bottom:2px solid #f0f0f0;padding-bottom:10px">
    Novo Pedido de Roteiro Personalizado
  </h2>

  <h3 style="margin-top:24px;color:#555">Dados Pessoais</h3>
  <table style="border-collapse:collapse">
    ${row("Nome", data.nomeCompleto)}
    ${row("Email", data.email)}
    ${row("Nascimento", data.dataNascimento)}
  </table>

  <h3 style="margin-top:24px;color:#555">1. Informações Básicas</h3>
  <table style="border-collapse:collapse">
    ${row("Paradas (cidade × dias)", formatEstadiasForEmail(data))}
    ${row("Data início", formatIsoForEmail(data.viagemDataInicio))}
    ${row("Data fim", formatIsoForEmail(data.viagemDataFim))}
    ${row("Dias", data.quantosDias)}
    ${row("Já visitou?", data.jaVisitouHolanda === "sim" ? "Sim" : data.jaVisitouHolanda === "nao" ? "Não" : undefined)}
  </table>

  <h3 style="margin-top:24px;color:#555">2. Perfil de Viagem</h3>
  <table style="border-collapse:collapse">
    ${row("Tipo", TIPO_MAP[data.tipoViagem ?? ""])}
    ${row("Companhia", COMPANHIA_MAP[data.comQuemViaja ?? ""])}
    ${row("Objetivo", labelList(data.objetivoViagem, OBJETIVO_MAP))}
  </table>

  <h3 style="margin-top:24px;color:#555">3. Orçamento</h3>
  <table style="border-collapse:collapse">
    ${row("Gasto/dia", data.gastoPorDia)}
    ${row("Economizar em", labelList(data.economizarEm, ECONOMIZAR_MAP))}
  </table>

  <h3 style="margin-top:24px;color:#555">4. Preferências</h3>
  <table style="border-collapse:collapse">
    ${row("Gosta de", labelList(data.preferencias, PREFERENCIAS_MAP))}
    ${row("Restrição alimentar", data.restricaoAlimentar)}
    ${row("Não quer ir", data.lugaresNaoQuerIr)}
  </table>

  <h3 style="margin-top:24px;color:#555">5. Estilo de Roteiro</h3>
  <table style="border-collapse:collapse">
    ${row("Roteiro", ESTILO_ROTEIRO_MAP[data.estiloRoteiro ?? ""])}
    ${row("Dias", ESTILO_DIAS_MAP[data.estiloDias ?? ""])}
  </table>

  <h3 style="margin-top:24px;color:#555">6. Logística</h3>
  <table style="border-collapse:collapse">
    ${row("Hospedagem", data.hospedagem)}
    ${row("Transporte", labelList(data.transporte, TRANSPORTE_MAP))}
  </table>

  <h3 style="margin-top:24px;color:#555">7. Experiência Personalizada</h3>
  <table style="border-collapse:collapse">
    ${row("Viagem perfeita", data.viagemPerfeita)}
    ${row("Ocasião especial", data.ocasiaoEspecial)}
    ${row("Recomendações", labelList(data.recomendacoes, RECOMENDACOES_MAP))}
  </table>

  <h3 style="margin-top:24px;color:#555">8. Extras</h3>
  <table style="border-collapse:collapse">
    ${row("Quer", labelList(data.extras, EXTRAS_MAP))}
  </table>

  <hr style="border:none;border-top:1px solid #f0f0f0;margin:30px 0" />
  <p style="color:#999;font-size:12px">
    Enviado pelo formulário de roteiro personalizado.
  </p>
</div>`;
}

function buildConfirmationEmail(name: string): string {
  const firstName = name.split(" ")[0] ?? name;
  return `
<div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#333">
  <h2 style="color:#333">Obrigada pelo seu pedido! 🌷</h2>

  <p style="line-height:1.7">
    Olá <strong>${esc(firstName)}</strong>!
  </p>

  <p style="line-height:1.7">
    Muito obrigada por preencher o formulário! Recebi todas as suas
    informações e em breve entrarei em contato para começarmos a montar
    o seu roteiro personalizado para a Holanda.
  </p>

  <p style="line-height:1.7">
    Se tiver qualquer dúvida, pode responder diretamente a este email.
  </p>

  <p style="line-height:1.7;margin-top:24px">
    Um abraço,<br/>
    <strong>Luiza</strong>
  </p>

  <hr style="border:none;border-top:1px solid #f0f0f0;margin:30px 0" />
  <p style="color:#999;font-size:12px">
    Você recebeu este email porque preencheu o formulário de roteiro
    personalizado.
  </p>
</div>`;
}

export async function POST(request: Request) {
  try {
    const body: TravelPayload = await request.json();

    if (!body.nomeCompleto?.trim() || !body.email?.trim()) {
      return NextResponse.json(
        { error: "Nome e email são obrigatórios." },
        { status: 400 },
      );
    }

    if (!estadiasPayloadValid(body.estadias)) {
      return NextResponse.json(
        {
          error:
            "Informe ao menos uma cidade e quantos dias (1 a 60) em cada parada.",
        },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Por favor, insira um email válido." },
        { status: 400 },
      );
    }

    const toEmail = process.env.CONTACT_EMAIL;
    if (!toEmail) {
      console.error("CONTACT_EMAIL environment variable is not set");
      return NextResponse.json(
        { error: "Erro de configuração do servidor." },
        { status: 500 },
      );
    }

    const from =
      process.env.SMTP_FROM || `"Roteiro Personalizado" <${process.env.SMTP_USER}>`;

    const [leadResult] = await Promise.allSettled([
      transporter.sendMail({
        from,
        to: toEmail,
        replyTo: body.email,
        subject: `Novo pedido de roteiro — ${body.nomeCompleto}`,
        html: buildLeadEmail(body),
      }),
      transporter.sendMail({
        from,
        to: body.email,
        subject: "Obrigada pelo seu pedido de roteiro! 🌷",
        html: buildConfirmationEmail(body.nomeCompleto),
      }),
    ]);

    if (leadResult.status === "rejected") {
      throw leadResult.reason;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Travel form error:", error);
    return NextResponse.json(
      { error: "Falha ao enviar. Por favor, tente novamente." },
      { status: 500 },
    );
  }
}

type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

type Props = {
  data: JsonLdValue;
  id?: string;
};

export default function JsonLd({ data, id }: Props) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

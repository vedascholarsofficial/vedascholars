// Renders schema.org structured data. "<" is escaped so no value can close
// the script element early.
export default function JsonLd({ data }: { data: object | object[] }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\u003c') }}
        />
    );
}

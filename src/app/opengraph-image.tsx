import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Shared social preview (Open Graph and X) for every page; pages reference it
// through SOCIAL_IMAGE in src/lib/seo.ts. Generated once at
// build time from the brand wordmark, colours and typefaces; no runtime cost.
// The fonts are OFL-licensed WOFF files (see src/assets/og) because the image
// renderer cannot read the WOFF2 files that next/font serves to browsers.
export const alt = 'Veda Scholars: education to employment support';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    const [logo, sansBold, sansMedium, serifItalic] = await Promise.all([
        // Literal paths keep build tracing scoped to these four files.
        readFile(join(process.cwd(), 'public/images/veda-logo-light.png')),
        readFile(join(process.cwd(), 'src/assets/og/plus-jakarta-sans-latin-700-normal.woff')),
        readFile(join(process.cwd(), 'src/assets/og/plus-jakarta-sans-latin-500-normal.woff')),
        readFile(join(process.cwd(), 'src/assets/og/source-serif-4-latin-400-italic.woff')),
    ]);

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '72px 80px',
                    backgroundColor: '#24112d',
                    backgroundImage:
                        'radial-gradient(circle at 88% 12%, rgba(139,43,180,0.55) 0%, rgba(36,17,45,0) 55%), radial-gradient(circle at 0% 100%, rgba(139,43,180,0.28) 0%, rgba(36,17,45,0) 45%)',
                    color: '#ffffff',
                    fontFamily: 'Plus Jakarta Sans',
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img elements only */}
                <img src={`data:image/png;base64,${logo.toString('base64')}`} alt="" width={398} height={56} />

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 40, fontWeight: 500, color: 'rgba(255,255,255,0.82)', letterSpacing: '-0.01em' }}>
                        Empowering your journey from
                    </div>
                    <div style={{ fontFamily: 'Source Serif 4', fontStyle: 'italic', fontSize: 88, lineHeight: 1.08, color: '#d9a8f0', marginTop: 8 }}>
                        education to employment
                    </div>
                    <div style={{ width: 120, height: 4, borderRadius: 2, backgroundColor: '#8b2bb4', marginTop: 36 }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 26, fontWeight: 500, color: 'rgba(255,255,255,0.72)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span>Guidance for students and families</span>
                        <span>Partnerships with universities and employers</span>
                    </div>
                    <span style={{ fontWeight: 700, color: '#ffffff' }}>vedascholars.com</span>
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                { name: 'Plus Jakarta Sans', data: sansMedium, weight: 500, style: 'normal' },
                { name: 'Plus Jakarta Sans', data: sansBold, weight: 700, style: 'normal' },
                { name: 'Source Serif 4', data: serifItalic, weight: 400, style: 'italic' },
            ],
        }
    );
}

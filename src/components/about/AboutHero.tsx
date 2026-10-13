import Image from 'next/image';
import JourneyReveal from '@/components/students/JourneyReveal';

export default function AboutHero() {
    return (
        <section className="overflow-hidden bg-[#faf9f6] px-5 py-14 sm:px-6 md:py-20 lg:px-8">
            <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
                <JourneyReveal>
                    <h1 className="text-5xl leading-[1.08] tracking-tight text-primary sm:text-6xl lg:text-7xl">Who We Are</h1>
                    <div className="my-7 h-px w-16 bg-secondary/50" aria-hidden="true" />
                    <p className="max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                        Veda Scholars is a premier education consultancy dedicated to bridging the gap between academic aspirations and professional success. We are not just agents; we are career architects.
                    </p>
                </JourneyReveal>
                <JourneyReveal delay={0.1} className="relative aspect-[5/4] overflow-hidden rounded-[2rem] bg-slate-100 shadow-xl shadow-primary/5">
                    <Image src="/images/about/introduction-v2.webp" alt="A student and mentor discussing education options together" fill loading="eager" sizes="(min-width: 1024px) 640px, (min-width: 640px) 720px, 100vw" className="object-cover" />
                </JourneyReveal>
            </div>
        </section>
    );
}

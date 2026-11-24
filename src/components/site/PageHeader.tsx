import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-hero text-navy-foreground">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6 sm:pb-14 sm:pt-32">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-bright">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-base text-navy-foreground/75 sm:text-lg">{description}</p>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}

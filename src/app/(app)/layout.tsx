export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-max page-gutter flex w-full flex-1 flex-col pt-[calc(var(--nav-pill-offset)+3.5rem)] pb-[var(--space-lg)]">
      {children}
    </div>
  );
}

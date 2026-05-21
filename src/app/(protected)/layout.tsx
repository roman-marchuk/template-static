/** TODO(calculator + auth-ui): Protected shell with user menu in header. */

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b px-6 py-4">
        <p className="text-sm text-muted-foreground">
          Protected layout — calculator/auth-ui agents own this file.
        </p>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}

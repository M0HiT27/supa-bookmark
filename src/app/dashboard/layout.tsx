import AuthSync from "@/components/AuthSync";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AuthSync />
        {children}
      </body>
    </html>
  );
}

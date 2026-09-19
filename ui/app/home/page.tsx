import Navbar from "@/components/navbar";

export default function homePage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar />

        {children}
      </body>
    </html>
  );
}
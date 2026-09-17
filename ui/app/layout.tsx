import type { Metadata } from "next";
import { Be_Vietnam_Pro, Archivo } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import logo from "@/public/image.png"
import { CompassIcon, FolderIcon, HomeIcon } from "lucide-react"
import { NavigationBar, NavigationItem } from "@/components/NavigationBar";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam-pro-sans",
  subsets: ["latin"]
});

const archivo = Archivo({
  variable: "--font-archivo-headings",
  subsets: ["latin"]
})

const pages: NavigationItem[] = [
  {
    label: "Início",
    icon: <HomeIcon size={16} />,
    url: "/"
  },

  {
    label: "Explorar",
    icon: <CompassIcon size={16} />,
    url: "/explore"
  },

  {
    label: "Meus Materiais",
    icon: <FolderIcon size={16} />,
    url: "/materials"
  },
]




export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${beVietnamPro.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full h-full flex flex-col">
        <header className="w-full h-1/10 border-b flex items-center justify-between">
          <div className="flex items-center gap-2 px-8">
            <Image
              src={logo}
              alt="logo"
              width={24}
            />
            <h2 className="font-headings font-semibold text-primary">Banca de Materiais</h2>
          </div>

          <div className="flex items-center justify-center gap-4 h-full text-xs w-1/3">
            <NavigationBar pages={pages} />
          </div>

          <div className="w-1/5">

          </div>
        </header>
        <main className="w-full h-9/10">
          {children}
        </main>
      </body>
    </html>
  );
}

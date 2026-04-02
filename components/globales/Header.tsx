import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import LogoTeko from "@/public/LogoTeko.svg";
export default function Header() {
  return (
    <header className="flex justify-between px-5 py-5 fixed w-full top-0 left-0 z-50 ">
      <div>
        <Image src={LogoTeko} alt="Logo TEKO" />
      </div>
      <div className="flex items-center gap-3 text-white">
        <nav className="flex items-center gap-5">
          <Link href="/servicios">Servicios</Link>
          <Link href="/nosotros">Nosotros</Link>
          <Link href="/portafolio">Portafolio</Link>
          <Link href="/contacto">Contacto</Link>
        </nav>
        <Button className="px-4 py-5 bg-blue-500 text-white hover:bg-blue-600 rounded-full">
          Agenda una llamada
        </Button>
      </div>
    </header>
  );
}

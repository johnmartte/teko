import {
  QrCode,
  Award,
  Image,
  Globe,
  FileText,
  ClipboardList,
  CreditCard,
  Users,
  MessageCircle,
  Bell,
  CreditCard as NfcCard,
  LayoutGrid,
} from "lucide-react";
import type { ElementType } from "react";

export interface MicroservicioItem {
  icon: ElementType;
  title: string;
  description: string;
}

export const microservicios: MicroservicioItem[] = [
  {
    icon: QrCode,
    title: "Menú Digital QR",
    description: "Menú interactivo vía QR para restaurantes, cafeterías y food trucks.",
  },
  {
    icon: Award,
    title: "Badges & Certificados",
    description: "Badges digitales con validación QR para cursos, eventos y diplomas.",
  },
  {
    icon: Image,
    title: "Flyers & Redes Sociales",
    description: "Pack mensual de piezas gráficas para Instagram, Facebook y WhatsApp.",
  },
  {
    icon: Globe,
    title: "Landing Page Única",
    description: "Página web rápida con dominio y hosting incluido por 1 año.",
  },
  {
    icon: FileText,
    title: "Sistema de Facturación",
    description: "Genera cotizaciones y facturas PDF profesionales en segundos.",
  },
  {
    icon: ClipboardList,
    title: "Formulario de Pedidos",
    description: "Página de pedidos o reservas online conectada a WhatsApp o email.",
  },
  {
    icon: CreditCard,
    title: "Link de Cobro",
    description: "Página de pago personalizada para transferencia o tarjeta.",
  },
  {
    icon: Users,
    title: "CRM Básico",
    description: "Panel para gestionar contactos, clientes y seguimientos.",
  },
  {
    icon: MessageCircle,
    title: "Chatbot WhatsApp",
    description: "Flujos de atención al cliente automatizados 24/7.",
  },
  {
    icon: Bell,
    title: "Notificaciones Auto.",
    description: "Recordatorios de citas, pagos o entregas por WhatsApp.",
  },
  {
    icon: NfcCard,
    title: "Tarjeta Digital NFC",
    description: "Tarjeta de presentación digital con NFC y QR personalizado.",
  },
  {
    icon: LayoutGrid,
    title: "Kit Redes Sociales",
    description: "Plantillas de portadas, stories, highlights y posts editables.",
  },
];

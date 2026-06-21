"use client";

import { Video, MapPin, ExternalLink } from "lucide-react";
import { mockMeetings } from "@/Data/portal/mock-data";
import type { MeetingStatus } from "@/shared/portal-types";

const statusLabel: Record<MeetingStatus, { text: string; classes: string }> = {
  programada: { text: "Programada", classes: "bg-[#0047ff]/10 text-[#0047ff] dark:text-[#7aa3ff]" },
  completada: { text: "Completada", classes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  cancelada: { text: "Cancelada", classes: "bg-red-500/10 text-red-600 dark:text-red-400" },
};

const platformIcon: Record<string, typeof Video> = {
  zoom: Video,
  google_meet: Video,
  teams: Video,
  presencial: MapPin,
};

export default function ReunionesPage() {
  const upcoming = mockMeetings
    .filter((m) => m.status === "programada")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = mockMeetings
    .filter((m) => m.status !== "programada")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const MeetingCard = ({ meeting }: { meeting: (typeof mockMeetings)[0] }) => {
    const { text, classes } = statusLabel[meeting.status];
    const PlatformIcon = platformIcon[meeting.platform] ?? Video;
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-[#e6eaf2] bg-white p-5 dark:border-white/10 dark:bg-[#0f1525]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[15px] font-semibold text-[#101828] dark:text-white">
              {meeting.title}
            </h3>
            <p className="mt-0.5 text-[12px] text-[#7a8595] dark:text-white/40">
              {meeting.projectName}
            </p>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${classes}`}>
            {text}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#52607a] dark:text-white/50">
          <span>
            {new Date(meeting.date).toLocaleDateString("es-DO", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>
            {new Date(meeting.date).toLocaleTimeString("es-DO", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" · "}{meeting.durationMinutes} min
          </span>
          <span className="inline-flex items-center gap-1 capitalize">
            <PlatformIcon className="h-3.5 w-3.5" />
            {meeting.platform.replace("_", " ")}
          </span>
        </div>

        {/* Attendees */}
        <div className="flex flex-wrap gap-2">
          {meeting.attendees.map((a, i) => (
            <span
              key={i}
              className="rounded-full bg-[#f4f7ff] px-2.5 py-1 text-[11px] font-medium text-[#52607a] dark:bg-white/5 dark:text-white/50"
            >
              {a.name}
            </span>
          ))}
        </div>

        {meeting.meetingUrl && meeting.status === "programada" && (
          <a
            href={meeting.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 self-start rounded-xl bg-gradient-to-b from-[#1ec4ff] via-[#0b6eff] to-[#0047ff] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_4px_12px_-4px_rgba(11,110,255,0.5)] transition-all hover:brightness-110"
          >
            Unirse
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-[900px] space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#101828] dark:text-white">Reuniones</h1>
        <p className="mt-1 text-sm text-[#7a8595] dark:text-white/40">
          Tus reuniones de seguimiento y revision de proyectos.
        </p>
      </div>

      {upcoming.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-[#101828] dark:text-white">Proximas</h2>
          {upcoming.map((m) => <MeetingCard key={m.id} meeting={m} />)}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-[#7a8595] dark:text-white/40">Pasadas</h2>
          {past.map((m) => <MeetingCard key={m.id} meeting={m} />)}
        </div>
      )}
    </div>
  );
}

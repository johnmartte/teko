"use client";

import { useState, useRef } from "react";
import { Download, FileText, Archive, Image as ImageIcon, Upload } from "lucide-react";
import { mockFiles } from "@/Data/portal/mock-data";
import { formatFileSize } from "@/Data/portal/mock-helpers";
import type { SharedFile } from "@/shared/portal-types";

const fileIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  zip: Archive,
  figma: FileText,
  psd: ImageIcon,
  png: ImageIcon,
};

export default function ArchivosPage() {
  const [files, setFiles] = useState<SharedFile[]>(mockFiles as SharedFile[]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleUpload(list: FileList | null) {
    if (!list || list.length === 0) return;
    const added: SharedFile[] = Array.from(list).map((f, i) => ({
      id: `up-${Date.now()}-${i}`,
      name: f.name,
      fileType: f.name.split(".").pop()?.toLowerCase() ?? "file",
      fileSizeBytes: f.size,
      url: "#",
      projectId: files[0]?.projectId ?? "p1",
      projectName: files[0]?.projectName ?? "Mi proyecto",
      uploadedAt: new Date().toISOString(),
      uploadedBy: "Tú",
      origin: "cliente",
    }));
    setFiles((prev) => [...added, ...prev]);
  }

  // Agrupar por proyecto
  const grouped = files.reduce(
    (acc, file) => {
      (acc[file.projectName] ??= []).push(file);
      return acc;
    },
    {} as Record<string, SharedFile[]>,
  );

  return (
    <div className="mx-auto max-w-[900px] space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-[var(--text-primary)]">Archivos</h1>
        <p className="mt-1 text-sm text-[var(--text-faint)]">
          Sube documentos para tu equipo y descarga los entregables compartidos.
        </p>
      </div>

      {/* Zona de subida del cliente → se refleja en el Planner del equipo */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-10 cursor-pointer transition-colors ${
          dragOver
            ? "border-[var(--brand)] bg-[var(--brand-light)]"
            : "border-[var(--dashed-border)] bg-[var(--bg-subtle)] hover:border-[var(--brand-border)]"
        }`}
      >
        <Upload className="mb-2 h-6 w-6 text-[var(--brand)]" />
        <p className="text-[14px] font-semibold text-[var(--text-primary)]">
          Arrastra archivos o haz clic para subir
        </p>
        <p className="mt-0.5 text-[12px] text-[var(--text-faint)]">
          Tu equipo de TEKO los recibirá al instante · PDF, ZIP, imágenes
        </p>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
      </div>

      {Object.entries(grouped).map(([projectName, projectFiles]) => (
        <div key={projectName} className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            {projectName}
          </h2>
          <div className="space-y-2">
            {projectFiles.map((f) => {
              const Icon = fileIcons[f.fileType] ?? FileText;
              const fromClient = f.origin === "cliente";
              return (
                <div
                  key={f.id}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${fromClient ? "bg-[var(--bg-muted)]" : "bg-[var(--brand-light)]"}`}>
                    <Icon className={`h-5 w-5 ${fromClient ? "text-[var(--text-tertiary)]" : "text-[var(--brand)]"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-[var(--text-primary)]">
                      {f.name}
                    </p>
                    <p className="text-[11px] text-[var(--text-faint)]">
                      {formatFileSize(f.fileSizeBytes)} · Subido por {f.uploadedBy} ·{" "}
                      {new Date(f.uploadedAt).toLocaleDateString("es-DO", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <span
                    className="text-[9.5px] font-bold uppercase tracking-[0.4px] px-2 py-[3px] rounded-[6px]"
                    style={fromClient
                      ? { color: "var(--text-tertiary)", background: "var(--bg-inset)" }
                      : { color: "var(--brand)", background: "var(--brand-light)" }}
                  >
                    {fromClient ? "Enviado por ti" : "Entregable"}
                  </span>
                  <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)] cursor-pointer">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

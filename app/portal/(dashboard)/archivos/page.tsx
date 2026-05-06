"use client";

import { Download, FileText, Archive, Image as ImageIcon } from "lucide-react";
import { mockFiles } from "@/Data/portal/mock-data";
import { formatFileSize } from "@/Data/portal/mock-helpers";

const fileIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  zip: Archive,
  figma: FileText,
  psd: ImageIcon,
  png: ImageIcon,
};

export default function ArchivosPage() {
  // Group by project
  const grouped = mockFiles.reduce(
    (acc, file) => {
      if (!acc[file.projectName]) acc[file.projectName] = [];
      acc[file.projectName].push(file);
      return acc;
    },
    {} as Record<string, typeof mockFiles>,
  );

  return (
    <div className="mx-auto max-w-[900px] space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#101828] dark:text-white">Archivos</h1>
        <p className="mt-1 text-sm text-[#7a8595] dark:text-white/40">
          Todos los archivos compartidos de tus proyectos.
        </p>
      </div>

      {Object.entries(grouped).map(([projectName, files]) => (
        <div key={projectName} className="space-y-3">
          <h2 className="text-sm font-semibold text-[#101828] dark:text-white">
            {projectName}
          </h2>
          <div className="space-y-2">
            {files.map((f) => {
              const Icon = fileIcons[f.fileType] ?? FileText;
              return (
                <div
                  key={f.id}
                  className="flex items-center gap-3 rounded-xl border border-[#e6eaf2] bg-white px-4 py-3 dark:border-white/10 dark:bg-[#0f1525]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4f7ff] dark:bg-white/5">
                    <Icon className="h-5 w-5 text-[#7a8595] dark:text-white/40" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-[#101828] dark:text-white">
                      {f.name}
                    </p>
                    <p className="text-[11px] text-[#99a1af] dark:text-white/30">
                      {formatFileSize(f.fileSizeBytes)} · Subido por {f.uploadedBy} ·{" "}
                      {new Date(f.uploadedAt).toLocaleDateString("es-DO", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#7a8595] transition-colors hover:bg-[#f4f7ff] dark:text-white/40 dark:hover:bg-white/5">
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

import type { ReactNode } from "react";

export default function PageHeader({
  title,
  count,
  description,
  action,
}: {
  title: string;
  count?: number;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between border-b bg-white px-6 py-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold text-slate-900">{title}</h1>
          {typeof count === "number" && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {count} {count === 1 ? "registro" : "registros"}
            </span>
          )}
        </div>
        {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import "@/components/decisive/decisive.css";
import { useTasks } from "@/lib/decisive/store";
import { DragProvider, type DropPayload } from "@/lib/decisive/drag";
import type { QuadrantId, Task } from "@/lib/decisive/types";
import { Capture } from "@/components/decisive/Capture";
import { Matrix, type BoardActions } from "@/components/decisive/Matrix";
import { CalendarView } from "@/components/decisive/CalendarView";
import { Notifications } from "@/components/decisive/Notifications";
import { Archive } from "@/components/decisive/Archive";
import { TaskRow } from "@/components/decisive/TaskRow";
import { UndoToast } from "@/components/decisive/UndoToast";
import { Shortcuts } from "@/components/decisive/Shortcuts";

type View = "matrix" | "calendar";

/* Decisive, running live inside the portfolio.

   This is the same board as the standalone app, minus its own theme toggle:
   here it follows the site's theme rather than keeping one of its own. The
   tasks are still yours and still local, which is the point of showing it as
   a working thing rather than a screenshot. */
export default function DecisivePreview() {
  const store = useTasks();
  const { toggle, patch, schedule, move, remove, undoLast } = store;
  const [view, setView] = useState<View>("matrix");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable ||
        event.metaKey ||
        event.ctrlKey
      ) {
        return;
      }
      if (event.key.toLowerCase() === "v") {
        setView((current) => (current === "matrix" ? "calendar" : "matrix"));
      }
      if (event.key.toLowerCase() === "z") undoLast();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [undoLast]);

  const actions = useMemo<BoardActions>(
    () => ({
      toggle,
      rename: (id, text) => patch(id, "Task renamed", { text }),
      schedule,
      move,
      remove,
    }),
    [toggle, patch, schedule, move, remove],
  );

  const onDrop = useCallback(
    (taskId: string, target: DropPayload) => {
      if (target.kind === "quadrant") actions.move(taskId, target.value as QuadrantId);
      else actions.schedule(taskId, target.value);
    },
    [actions],
  );

  const renderGhost = useCallback((task: Task) => <TaskRow task={task} ghost />, []);
  const active = store.tasks.filter((t) => !t.done).length;

  return (
    <div className="dcv">
      <DragProvider onDrop={onDrop} renderCard={renderGhost}>
        <div className="shell">
          <header className={clsx("topbar", scrolled && "is-scrolled")}>
            <div className="topbar-inner">
              <div className="mr-auto min-w-0">
                <h1 className="wordmark">Decisive</h1>
                <p className="hidden text-[13px] text-[var(--label)] sm:block">
                  One capture field, four consequence quadrants, a calendar of deadlines.
                </p>
              </div>

              <nav aria-label="View" className="segment">
                {(["matrix", "calendar"] as View[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setView(id)}
                    aria-pressed={view === id}
                    className={clsx("tap segment-item", view === id && "is-on")}
                  >
                    {id === "matrix" ? "Matrix" : "Calendar"}
                  </button>
                ))}
              </nav>

              <Link href="/" aria-label="Back to the portfolio" className="tap pill-icon">
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 3.5 5.5 8l4.5 4.5" />
                </svg>
              </Link>

              <a
                href="https://github.com/JulianGiraldo96/decisive"
                target="_blank"
                rel="noreferrer"
                aria-label="Source on GitHub"
                className="tap pill-icon"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                </svg>
              </a>
            </div>
          </header>

          <main className="board">
            {!store.ready ? (
              <Skeleton />
            ) : (
              <>
                <Notifications
                  tasks={store.tasks}
                  onToggle={store.toggle}
                  onSchedule={store.schedule}
                />

                <div className="mt-3">
                  <Capture onAdd={store.add} />
                </div>

                {view === "matrix" ? (
                  <Matrix tasks={store.tasks} actions={actions} />
                ) : (
                  <CalendarView tasks={store.tasks} actions={actions} />
                )}

                <Archive
                  tasks={store.tasks}
                  onToggle={store.toggle}
                  onRemove={store.remove}
                  onClear={store.clearArchive}
                />

                <footer className="foot">
                  <span className="tabular-nums">
                    {active} {active === 1 ? "task" : "tasks"} open
                  </span>
                  <Dot />
                  <span>Stored in this browser only</span>
                  <Dot />
                  <button type="button" onClick={store.restoreDemo} className="foot-link">
                    Restore demo content
                  </button>
                  <Dot />
                  <Shortcuts />
                  <Dot />
                  <a
                    href="https://github.com/JulianGiraldo96/decisive"
                    target="_blank"
                    rel="noreferrer"
                    className="foot-link"
                  >
                    Run it yourself
                  </a>
                </footer>

                <UndoToast
                  label={store.undo?.label ?? null}
                  onUndo={store.undoLast}
                  onDismiss={store.dismissUndo}
                />
              </>
            )}
          </main>
        </div>
      </DragProvider>
    </div>
  );
}

function Dot() {
  return (
    <span aria-hidden className="text-[var(--line-strong)]">
      ·
    </span>
  );
}

function Skeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="h-[52px] rounded-2xl bg-[var(--surface)]" />
      <div className="mt-3 h-[92px] rounded-2xl bg-[var(--surface)]" />
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[220px] rounded-2xl bg-[var(--surface)]" />
        ))}
      </div>
    </div>
  );
}

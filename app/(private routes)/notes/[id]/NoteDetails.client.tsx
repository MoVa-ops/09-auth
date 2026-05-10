// app/(private routes)/notes/[id]/NoteDetails.client.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { notesApi } from "@/lib/api/clientApi";
import { Note } from "@/types/note";
import styles from "@/app/(private routes)/notes/[id]/NoteDetails.client.module.css";

interface NoteDetailsClientProps {
  note: Note; // Залишаємо повний об'єкт нотатки
  noteId: string; // Додаємо ID для клієнтських запитів
}

export default function NoteDetailsClient({
  note,
  noteId,
}: NoteDetailsClientProps) {
  const {
    data: noteData,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => notesApi.fetchNoteById(noteId),
    initialData: note, // Використовуємо initialData з серверного рендерингу
    staleTime: 60 * 1000, // 1 хвилина, щоб уникнути зайвих запитів
  });

  // Відображаємо дані з initialData поки йде завантаження
  const displayNote = noteData || note;

  if (isFetching) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>{displayNote.title}</h1>
        <p className={styles.content}>{displayNote.content}</p>
        <div className={styles.meta}>
          <span className={styles.tag}>Tag: {displayNote.tag}</span>
          {displayNote.updatedAt && (
            <span className={styles.date}>
              Updated: {new Date(displayNote.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className={styles.loading}>Updating...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>Error: {(error as Error).message}</div>
    );
  }

  if (!displayNote) {
    return <div className={styles.error}>Note not found</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{displayNote.title}</h1>
      <p className={styles.content}>{displayNote.content}</p>
      <div className={styles.meta}>
        <span className={styles.tag}>Tag: {displayNote.tag}</span>
        {displayNote.updatedAt && (
          <span className={styles.date}>
            Updated: {new Date(displayNote.updatedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
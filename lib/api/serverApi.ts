// lib/api/serverApi.ts

import { cookies } from "next/headers";
import { AxiosResponse } from "axios";

import { nextServer } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface SessionResponse {
  user: User;
  valid: boolean;
  expires?: string;
}

interface ApiError extends Error {
  config?: {
    url?: string;
  };
  response?: {
    status?: number;
    data?: {
      error?: string;
    };
  };
}

const getCookiesString = async () => {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
};

export const serverApi = {
  fetchNotes: async (
    page = 1,
    perPage = 12,
    search = "",
    tag?: string
  ): Promise<NotesResponse> => {
    try {
      const cookiesString = await getCookiesString();

      const params: Record<string, string> = {
        page: page.toString(),
        perPage: perPage.toString(),
        search,
      };

      if (tag && tag !== "All") {
        params.tag = tag;
      }

      const response = await nextServer.get<NotesResponse>("/notes", {
        params,
        headers: {
          Cookie: cookiesString,
        },
      });

      return response.data;
    } catch (error) {
      const apiError = error as ApiError;

      console.error("Failed to fetch notes:", {
        url: apiError.config?.url,
        status: apiError.response?.status,
        data: apiError.response?.data,
        message: apiError.message,
      });

      throw new Error(
        apiError.response?.data?.error ||
          apiError.message ||
          "Failed to fetch notes"
      );
    }
  },

  fetchNoteById: async (id: string): Promise<Note> => {
    try {
      const cookiesString = await getCookiesString();

      const response = await nextServer.get<Note>(`/notes/${id}`, {
        headers: {
          Cookie: cookiesString,
        },
      });

      return response.data;
    } catch (error) {
      const apiError = error as ApiError;

      console.error("Failed to fetch note:", {
        url: apiError.config?.url,
        status: apiError.response?.status,
        data: apiError.response?.data,
        message: apiError.message,
      });

      throw new Error(
        apiError.response?.data?.error ||
          apiError.message ||
          "Failed to fetch note"
      );
    }
  },

  getMe: async (): Promise<User | null> => {
    try {
      const cookiesString = await getCookiesString();

      const response = await nextServer.get<User>("/users/me", {
        headers: {
          Cookie: cookiesString,
        },
      });

      return response.data;
    } catch (error) {
      const apiError = error as ApiError;

      console.error("Failed to fetch user:", {
        status: apiError.response?.status,
        message: apiError.message,
      });

      if (apiError.response?.status === 401) {
        return null;
      }

      return null;
    }
  },

  checkSession: async (): Promise<AxiosResponse<SessionResponse> | null> => {
    try {
      const cookiesString = await getCookiesString();

      const response = await nextServer.get<SessionResponse>("/auth/session", {
        headers: {
          Cookie: cookiesString,
        },
      });

      return response;
    } catch (error) {
      const apiError = error as ApiError;

      console.error("Failed to check session:", {
        url: apiError.config?.url,
        status: apiError.response?.status,
        data: apiError.response?.data,
        message: apiError.message,
      });

      if (apiError.response?.status === 401) {
        return null;
      }

      return null;
    }
  },
};

export const { fetchNotes, fetchNoteById, getMe, checkSession } = serverApi;
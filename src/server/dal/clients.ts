import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/types/database.types";

import { requireUser } from "./auth";

/**
 * Clients data access. Every call runs as the signed-in user, so RLS limits
 * results to rows they own — `requireUser` just fails fast with a redirect.
 */
export async function listClients() {
  await requireUser();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getClient(id: string) {
  await requireUser();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createClientRecord(
  input: Omit<
    TablesInsert<"clients">,
    "id" | "owner_id" | "created_at" | "updated_at"
  >,
) {
  await requireUser();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateClientRecord(
  id: string,
  input: Omit<
    TablesUpdate<"clients">,
    "id" | "owner_id" | "created_at" | "updated_at"
  >,
) {
  await requireUser();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

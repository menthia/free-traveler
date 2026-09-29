import { createClient } from "@/lib/supabase/server";

export interface UserBlock {
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export async function createBlock(blockerId: string, blockedId: string): Promise<UserBlock> {
  if (blockerId === blockedId) {
    throw new Error("CANNOT_BLOCK_SELF");
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_block")
    .insert({ blocker_id: blockerId, blocked_id: blockedId })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function removeBlock(blockerId: string, blockedId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("user_block")
    .delete()
    .eq("blocker_id", blockerId)
    .eq("blocked_id", blockedId);
  if (error) throw error;
}

export async function listBlocksByBlocker(blockerId: string): Promise<UserBlock[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_block")
    .select("*")
    .eq("blocker_id", blockerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function isBlockedPair(userIdA: string, userIdB: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_block")
    .select("blocker_id")
    .or(
      `and(blocker_id.eq.${userIdA},blocked_id.eq.${userIdB}),and(blocker_id.eq.${userIdB},blocked_id.eq.${userIdA})`,
    )
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

export const createConfig = async (config: TablesInsert<"configuration">) => {
  const { data, error } = await supabase
    .from("configuration")
    .insert([config])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}


export const getConfigByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("configuration")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (!data) {
    return {}
  }

  return data
}


export const updateConfigDeatils = async (
  configId: string,
  config: TablesUpdate<"configuration">
) => {
  const { data, error } = await supabase
    .from("configuration")
    .update(config)
    .eq("id", configId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
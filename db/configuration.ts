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
    .is('chat_id', null)
    .eq("type", "configuration")
    .eq("user_id", userId)
    .single()

  if (!data) {
    return {}
  }

  return data
}
export const getConfigByChatIdOrUserId = async (userId: string, chatId: string) => {
  try {
    if (chatId) {
      const { data: chatConfig } = await supabase
        .from("configuration")
        .select("*")
        
        .eq("chat_id", chatId)
        .single()

      if (chatConfig) return chatConfig
    }
    const { data: chatTypeConfig } = await supabase
      .from("configuration")
      .select("*")
      .eq("user_id", userId)
      .eq("type", "chat-default-config")
      .single()

    if (chatTypeConfig) return chatTypeConfig

    const { data: userConfig } = await supabase
      .from("configuration")
      .select("*")
      .is('chat_id', null)
      .eq("user_id", userId)
      .single()
    if (!userConfig) {
      return {}
    }
    return userConfig
  } catch (error) {
    return {}
  }
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
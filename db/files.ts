import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"
import mammoth from "mammoth"
import { toast } from "sonner"
import { uploadFile } from "./storage/files"

export const getFileById = async (fileId: string) => {
  const { data: file, error } = await supabase
    .from("files")
    .select("*")
    .eq("id", fileId)
    .single()

  if (!file) {
    throw new Error(error.message)
  }

  return file
}

export const getFileWorkspacesByWorkspaceId = async (workspaceId: string) => {
  const { data: workspace, error } = await supabase
    .from("workspaces")
    .select(
      `
      id,
      name,
      files (*)
    `
    )
    .eq("id", workspaceId)
    .single()

  if (!workspace) {
    throw new Error(error.message)
  }

  return workspace
}

export const getFilesByChatId = async (chatId: string) => {
  
  // Step 1: Get file_item_ids from message_file_items
  const { data: messageFileItems, error: messageFileItemsError } = await supabase
    .from("chat_file_items")
    .select("file_item_id")
    .eq("chat_id", chatId)

  if (messageFileItemsError) {
    throw new Error(messageFileItemsError.message)
  }

  const fileItemIds = messageFileItems.map((item) => item.file_item_id)

  if (fileItemIds.length === 0) {
    return [] // No file items found
  }

  // Step 2: Get file_ids from file_items
  const { data: fileItems, error: fileItemsError } = await supabase
    .from("file_items")
    .select("file_id")
    .in("id", fileItemIds)

  if (fileItemsError) {
    throw new Error(fileItemsError.message)
  }

  const fileIds = fileItems.map((item) => item.file_id)

  if (fileIds.length === 0) {
    return [] // No files found
  }

  // Step 3: Fetch actual files from files table
  const { data: files, error: filesError } = await supabase
    .from("files")
    .select("*")
    .in("id", fileIds)

  if (filesError) {
    throw new Error(filesError.message)
  }

  return files
}

export const deleteFilesByChatId = async (chatId: string) => {
  // Step 1: Get file_item_ids from chat_file_items
  const { data: chatFileItems, error: chatFileItemsError } = await supabase
    .from("chat_file_items")
    .select("file_item_id")
    .eq("chat_id", chatId)

  if (chatFileItemsError) {
    throw new Error(chatFileItemsError.message)
  }

  const fileItemIds = chatFileItems.map((item) => item.file_item_id)

  if (fileItemIds.length === 0) {
    return { success: true, message: "No files to delete" }
  }

  // Step 2: Get file_ids from file_items
  const { data: fileItems, error: fileItemsError } = await supabase
    .from("file_items")
    .select("file_id")
    .in("id", fileItemIds)

  if (fileItemsError) {
    throw new Error(fileItemsError.message)
  }

  const fileIds = fileItems.map((item) => item.file_id)

  if (fileIds.length === 0) {
    return { success: true, message: "No files to delete" }
  }

  // Step 3: Delete records from files table
  const { error: filesDeleteError } = await supabase
    .from("files")
    .delete()
    .in("id", fileIds)

  if (filesDeleteError) {
    throw new Error(filesDeleteError.message)
  }

  // Step 4: Delete records from file_items table
  const { error: fileItemsDeleteError } = await supabase
    .from("file_items")
    .delete()
    .in("id", fileItemIds)

  if (fileItemsDeleteError) {
    throw new Error(fileItemsDeleteError.message)
  }

  // Step 5: Delete records from chat_file_items table
  const { error: chatFileItemsDeleteError } = await supabase
    .from("chat_file_items")
    .delete()
    .eq("chat_id", chatId)

  if (chatFileItemsDeleteError) {
    throw new Error(chatFileItemsDeleteError.message)
  }

  return { success: true, message: "Files deleted successfully" }
}


export const getFileWorkspacesByFileId = async (fileId: string) => {
  const { data: file, error } = await supabase
    .from("files")
    .select(
      `
      id, 
      name, 
      workspaces (*)
    `
    )
    .eq("id", fileId)
    .single()

  if (!file) {
    throw new Error(error.message)
  }

  return file
}

export const createFileBasedOnExtension = async (
  file: File,
  fileRecord: TablesInsert<"files">,
  workspace_id: string,
  embeddingsProvider: "openai" | "local"
) => {
  const fileExtension = file.name.split(".").pop()

  if (fileExtension === "docx") {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({
      arrayBuffer
    })

    return createDocXFile(
      result.value,
      file,
      fileRecord,
      workspace_id,
      embeddingsProvider
    )
  } else {
    return createFile(file, fileRecord, workspace_id, embeddingsProvider)
  }
}

// For non-docx files
export const createFile = async (
  file: File,
  fileRecord: TablesInsert<"files">,
  workspace_id: string,
  embeddingsProvider: "openai" | "local"
) => {
  let validFilename = fileRecord.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase()
  const extension = file.name.split(".").pop()
  const extensionIndex = validFilename.lastIndexOf(".")
  const baseName = validFilename.substring(0, (extensionIndex < 0) ? undefined : extensionIndex)
  const maxBaseNameLength = 100 - (extension?.length || 0) - 1
  if (baseName.length > maxBaseNameLength) {
    fileRecord.name = baseName.substring(0, maxBaseNameLength) + "." + extension
  } else {
    fileRecord.name = baseName + "." + extension
  }
  const { data: createdFile, error } = await supabase
    .from("files")
    .insert([fileRecord])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  await createFileWorkspace({
    user_id: createdFile.user_id,
    file_id: createdFile.id,
    workspace_id
  })

  const filePath = await uploadFile(file, {
    name: createdFile.name,
    user_id: createdFile.user_id,
    file_id: createdFile.name
  })

  await updateFile(createdFile.id, {
    file_path: filePath
  })

  const formData = new FormData()
  formData.append("file_id", createdFile.id)
  formData.append("embeddingsProvider", embeddingsProvider)
  
  const response = await fetch("/api/retrieval/process", {
    method: "POST",
    body: formData
  })
  if (!response.ok) {
    const jsonText = await response.text()
    const json = JSON.parse(jsonText)
    console.error(
      `Error processing file:${createdFile.id}, status:${response.status}, response:${json.message}`
    )
    toast.error("Failed to process file. Reason:" + json.message, {
      duration: 10000
    })
    await deleteFile(createdFile.id)
  }

  const fetchedFile = await getFileById(createdFile.id)

  return fetchedFile
}

// // Handle docx files
export const createDocXFile = async (
  text: string,
  file: File,
  fileRecord: TablesInsert<"files">,
  workspace_id: string,
  embeddingsProvider: "openai" | "local"
) => {
  const { data: createdFile, error } = await supabase
    .from("files")
    .insert([fileRecord])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  await createFileWorkspace({
    user_id: createdFile.user_id,
    file_id: createdFile.id,
    workspace_id
  })

  const filePath = await uploadFile(file, {
    name: createdFile.name,
    user_id: createdFile.user_id,
    file_id: createdFile.name
  })

  await updateFile(createdFile.id, {
    file_path: filePath
  })

  const response = await fetch("/api/retrieval/process/docx", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: text,
      fileId: createdFile.id,
      embeddingsProvider,
      fileExtension: "docx"
    })
  })

  if (!response.ok) {
    const jsonText = await response.text()
    const json = JSON.parse(jsonText)
    console.error(
      `Error processing file:${createdFile.id}, status:${response.status}, response:${json.message}`
    )
    toast.error("Failed to process file. Reason:" + json.message, {
      duration: 10000
    })
    await deleteFile(createdFile.id)
  }

  const fetchedFile = await getFileById(createdFile.id)

  return fetchedFile
}

export const createFiles = async (
  files: TablesInsert<"files">[],
  workspace_id: string
) => {
  const { data: createdFiles, error } = await supabase
    .from("files")
    .insert(files)
    .select("*")

  if (error) {
    throw new Error(error.message)
  }

  await createFileWorkspaces(
    createdFiles.map(file => ({
      user_id: file.user_id,
      file_id: file.id,
      workspace_id
    }))
  )

  return createdFiles
}

export const createFileWorkspace = async (item: {
  user_id: string
  file_id: string
  workspace_id: string
}) => {
  const { data: createdFileWorkspace, error } = await supabase
    .from("file_workspaces")
    .insert([item])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdFileWorkspace
}

export const createFileWorkspaces = async (
  items: { user_id: string; file_id: string; workspace_id: string }[]
) => {
  const { data: createdFileWorkspaces, error } = await supabase
    .from("file_workspaces")
    .insert(items)
    .select("*")

  if (error) throw new Error(error.message)

  return createdFileWorkspaces
}

export const updateFile = async (
  fileId: string,
  file: TablesUpdate<"files">
) => {
  const { data: updatedFile, error } = await supabase
    .from("files")
    .update(file)
    .eq("id", fileId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedFile
}

export const deleteFile = async (fileId: string) => {
  const { error } = await supabase.from("files").delete().eq("id", fileId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export const deleteFileWorkspace = async (
  fileId: string,
  workspaceId: string
) => {
  const { error } = await supabase
    .from("file_workspaces")
    .delete()
    .eq("file_id", fileId)
    .eq("workspace_id", workspaceId)

  if (error) throw new Error(error.message)

  return true
}

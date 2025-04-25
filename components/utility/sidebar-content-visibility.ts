import { ContentType } from "@/types"

/**
 * Returns an array of content types that should be hidden based on environment configuration
 */
export const getHiddenContentTypes = (): ContentType[] => {  
    return ['assistants', 'tools', 'collections']
}

/**
 * Checks if a specific content type should be displayed
 */
export const shouldShowContentType = (
  contentType: ContentType, 
  hiddenTypes: ContentType[]
): boolean => {
  return !hiddenTypes.includes(contentType)
}

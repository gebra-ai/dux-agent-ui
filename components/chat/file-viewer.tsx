import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "../ui/sheet";
import { getFileFromStorage } from "@/db/storage/files"
import { FileIcon } from "@/components/ui/file-icon"
import { cn } from "@/lib/utils"
import { FC, useEffect, useContext, useRef, useState } from "react";
import Loading from "@/app/[locale]/loading"
import { Button } from "../ui/button"
import { ChatbotUIContext } from "@/context/context"


interface FileViewerProps {
    open?: boolean;
    onOpenChange: (open: boolean) => void;
    fileData?: any;
    isShowfull?: boolean;
    fileList?: Array<any>;
  }

export const FileViewer: FC<FileViewerProps> = (props) => {
    const { fileData, onOpenChange, open, isShowfull, fileList } = props;
    // const fileUrl = "http://127.0.0.1:54321/storage/v1/object/sign/files/56fd3c57-0ee4-4f28-b2bb-7188a6ea04f1/c2FtcGxlX2RhdGEuanNvbg==?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJmaWxlcy81NmZkM2M1Ny0wZWU0LTRmMjgtYjJiYi03MTg4YTZlYTA0ZjEvYzJGdGNHeGxYMlJoZEdFdWFuTnZiZz09IiwiaWF0IjoxNzM1OTY3NjY5LCJleHAiOjE3MzYwNTQwNjl9.SjmoXo4nwIOqL4QQaGY-_Oc_S-Hh57qDN54GanwZTjQ";
    const {
        files
      } = useContext(ChatbotUIContext)
    const [fileUrl, setFileUrl] = useState("")
    const [loading, setLoading] = useState(true)
    const [highLight, setHighLight] = useState('')
    const loadFile = async (file: any) => {
        const fileRecord = files.find(f => f.id === file.id)
        const link = await getFileFromStorage(fileRecord?.file_path??'')
        setFileUrl(link)
        setLoading(false)
        setHighLight(file.id)
    }

    useEffect(() => {
        if (isShowfull) {
            loadFile(fileList?.[0]??{})
        } else {
            setLoading(false)
        }
    }, [])
    return (
        <Sheet open={open} onOpenChange={onOpenChange} >
            {isShowfull ? <SheetContent
                className="flex flex-col justify-between"
                side="rightv1"
            >
                <div className="grow overflow-auto">
                    <SheetHeader>
                        <SheetTitle className="flex items-center justify-between p-2">
                            <div>Generated File Review</div>
                            <Button
                                tabIndex={-1}
                                className="text-xs"
                                size="sm"
                                variant={"secondary"}
                                onClick={() => onOpenChange(false)}
                            >
                                Close
                            </Button>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex w-full border-t border-gray-300">
                            <div className="w-1/3 border-r border-gray-300 p-4">
                                {fileList && fileList.map((vl, i) => <div
                                    className={cn(
                                        `hover:bg-accent flex w-full cursor-pointer items-center rounded p-2 hover:opacity-50 focus:outline-none ${highLight == vl.id ? 'bg-accent' : ''}`
                                    )}
                                    tabIndex={i}
                                    onClick={() => loadFile(vl)}
                                >
                                    <FileIcon type={'plain'} size={22} />
                                    <div className="ml-1 flex-1 truncate text-sm font-semibold">
                                        {vl.name}
                                    </div>
                                </div>)}
                            </div>
                            <div className="w-2/3 p-4">
                                {!loading ? <iframe
                                    src={fileUrl}
                                    className="w-full h-[88vh] border-none"
                                    title="Supabase File Viewer"
                                ></iframe> :
                                    <div className="h-[93vh]">
                                        <Loading />
                                    </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
                : <SheetContent
                    className="flex flex-col justify-between p-2"
                    side="right"
                >
                    <div className="grow overflow-auto">
                        <SheetHeader>
                            <SheetTitle className="flex items-center justify-between space-x-2">
                                <div>{fileData.name}</div>
                                <Button
                                    tabIndex={-1}
                                    className="text-xs"
                                    size="sm"
                                    variant={"secondary"}
                                    onClick={() => onOpenChange(false)}
                                >
                                    Close
                                </Button>
                            </SheetTitle>
                        </SheetHeader>
                        <iframe
                            src={fileData.link}
                            className="mt-6 w-full h-[90vh] border-none"
                            title="Supabase File Viewer"
                        ></iframe>
                    </div>
                </SheetContent>}
        </Sheet>
    )
}
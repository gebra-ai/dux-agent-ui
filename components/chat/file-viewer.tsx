import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "../ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {
    IconTrash,IconLoader2
} from "@tabler/icons-react"
import React from "react";
import { getFileFromStorage } from "@/db/storage/files"
import { FileIcon } from "@/components/ui/file-icon"
import { cn } from "@/lib/utils"
import { FC, useEffect, useContext, useRef, useState } from "react";
import Loading from "@/app/[locale]/loading"
import { Button } from "../ui/button"
import { ChatbotUIContext } from "@/context/context"
import { getFileWorkspacesByWorkspaceId } from "@/db/files"

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
        files,
        setFiles,
        workspaces
    } = useContext(ChatbotUIContext)
    const [fileUrl, setFileUrl] = useState("")
    const [loading, setLoading] = useState(true)
    const [highLight, setHighLight] = useState('')
    const [showDialog, setShowDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteFile, setDeleteFile] = useState<any>({});
    const [deleteFileType, setDeleteFileType] = useState(0);
    const buttonRef = useRef<HTMLButtonElement>(null)
    const loadFile = async (file: any) => {
        const fileRecord = files.find(f => f.id === file.id)
        if (fileRecord?.description == "generated-file") {
            const res = await fetch(process.env.NEXT_PUBLIC_SERVER_END_POINT + "/get-file", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Ensure proper content type
                },
                body: JSON.stringify({
                    filepath: fileRecord?.file_path ?? ''
                }),
            });
            const data = await res.json();

            setFileUrl(data.file_path)
            setLoading(false)
            setHighLight(file.id)
        } else {
            const link = await getFileFromStorage(fileRecord?.file_path ?? '')
            setFileUrl(link)
            setLoading(false)
            setHighLight(file.id)
        }

    }
    const deleteSingleFile = async () => {
        const workspaceId = workspaces[0].id
        await fetch(process.env.NEXT_PUBLIC_SERVER_END_POINT + "/delete-file", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Ensure proper content type
            },
            body: JSON.stringify({
                "workspace_id": workspaceId,
                "file_id": deleteFile.id
            }),
        });
        setDeleteFile({})
        setShowDialog(false)
        setDeleteFileType(0)
        const fileData: any = await getFileWorkspacesByWorkspaceId(workspaceId)
        setFiles(fileData.files)
        if(highLight == deleteFile.id){
            setHighLight('')
            loadFile(fileData?.files?.[0] ?? {})
        }   
    }

    const deleteAllFile = async () => {
        const workspaceId = workspaces[0].id
        await fetch(process.env.NEXT_PUBLIC_SERVER_END_POINT + "/delete-file-all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Ensure proper content type
            },
            body: JSON.stringify({
                "workspace_id": workspaceId,
                "user_id": workspaces[0].user_id
            }),
        });
        setDeleteFile({})
        setShowDialog(false)
        const fileData = await getFileWorkspacesByWorkspaceId(workspaceId)
        setFiles(fileData.files)
        setDeleteFileType(0)
        setFileUrl('')
    }

    const handleDelete = async (file: any, type: number) => {
        setDeleteFile(file)
        setDeleteFileType(type)
        setDeleteLoading(false)
        setShowDialog(true)
    }

    useEffect(() => {
        if (isShowfull) {
            const fetchFiles = async () => {
                const workspaceId = workspaces[0].id
                const fileData = await getFileWorkspacesByWorkspaceId(workspaceId)
                setFiles(fileData.files)
                loadFile(fileList?.[0] ?? {})
            }
            fetchFiles()
        } else {
            setLoading(false)
        }
    }, [])
    return (
        <React.Fragment>
            <Sheet open={open} onOpenChange={onOpenChange} >
                {isShowfull ? <SheetContent
                    className="flex flex-col justify-between"
                    side="rightv1"
                >
                    <div className="grow overflow-auto">
                        <SheetHeader>
                            <SheetTitle className="flex items-center justify-between p-2">
                                <div>Generated File Review</div>
                                <div>
                                    {(fileList?.length ?? 0) > 0 && <Button
                                        tabIndex={-1}
                                        className="text-xs mr-2"
                                        size="sm"
                                        variant={"secondary"}
                                        onClick={() => handleDelete({}, 2)}
                                    >
                                        Delete All
                                    </Button>}
                                    <Button
                                        tabIndex={-1}
                                        className="text-xs"
                                        size="sm"
                                        variant={"secondary"}
                                        onClick={() => onOpenChange(false)}
                                    >
                                        Close
                                    </Button>
                                </div>
                            </SheetTitle>
                        </SheetHeader>
                        {(fileList?.length ?? 0) > 0 ?  <div className="flex flex-col items-center justify-center">
                            <div className="flex w-full border-t border-gray-300">
                                <div className="w-1/3 border-r border-gray-300 p-4">
                                    {fileList && fileList.map((vl, i) => <div
                                        className={cn(
                                            `hover:bg-accent flex w-full cursor-pointer items-center rounded p-2 hover:opacity-50 focus:outline-none ${highLight == vl.id ? 'bg-accent' : ''}`
                                        )}
                                        tabIndex={i}

                                    >
                                        <FileIcon type={'plain'} size={22} />
                                        <div onClick={() => loadFile(vl)} className="ml-1 flex-1 truncate text-sm font-semibold">
                                            {vl.name}
                                        </div>
                                        <IconTrash size={20} onClick={() => handleDelete(vl, 1)} className="mr-2 cursor-pointer" />
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
                        </div> : 
                        <div className="flex items-center justify-center h-[50vh]">
                            <p>No Data Found</p>
                        </div>
                        }
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
            <Dialog open={showDialog} onOpenChange={() => {
                setShowDialog(false) 
                setDeleteLoading(false)
            }}>
                <DialogTrigger asChild>
                    <Button className="text-red-500" variant="ghost">
                        Delete
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete {deleteFileType != 1 ? 'All' : ''} File</DialogTitle>

                        <DialogDescription>
                            Are you sure you want to delete {deleteFileType != 1 ? 'all file' : deleteFile.name}?
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => {
                            setShowDialog(false)
                            setDeleteLoading(false)
                        }}>
                            Cancel
                        </Button>

                        <Button ref={buttonRef} variant="destructive" disabled={deleteLoading ? true :false} onClick={() => {
                            setDeleteLoading(true)
                            if (deleteFileType == 1) {
                                deleteSingleFile()
                            } else {
                                deleteAllFile()
                            }
                        }}>
                            {!deleteLoading  ?'Delete' :<IconLoader2 size={20} className="animate-spin" />}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}
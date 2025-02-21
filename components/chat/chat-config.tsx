import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "../ui/sheet";
import React from "react";
import { FC, useEffect, useContext, useRef, useState } from "react";
import Loading from "@/app/[locale]/loading"
import { Button } from "../ui/button"
import { ChatbotUIContext } from "@/context/context";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../ui/select"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { getConfigByChatIdOrUserId, createConfig, updateConfigDeatils } from "@/db/configuration"

interface ChatConfigProps {
    open?: boolean;
    onOpenChange: (open: boolean) => void;
    chat_id: string;
}

type EsIndex = {
    index: string,
    health: string,
    status: string,
    docs_count: number,
    size: string,
}

export const ChatConfig: FC<ChatConfigProps> = (props) => {
    const { onOpenChange, open, chat_id } = props;
    const {
        selectedChat,
        profile
    } = useContext(ChatbotUIContext)
    let currentChat = selectedChat ? { ...selectedChat } : null;
    const currentChatId = currentChat ? currentChat.id : "";
    const [loading, setLoading] = useState(true)
    const [configuration, setConfiguration] = useState<any>({})
    const [state, setState] = useState<any>({
        elasticSearchUrl: "",
        databaseName: "",
        gitusername: "",
        githubtoken: "",
        es_indices: "",
    })
    const updateState = (key: string, value: any) => {
        setState((prevState: any) => ({ ...prevState, [key]: value }))
    }

    useEffect(() => {
        fetchFiles();
    }, [])


    const fetchFiles = async () => {
        if (profile) {
            const configuration: any = await getConfigByChatIdOrUserId(profile.user_id, currentChatId);
            setConfiguration(configuration)
            setState({
                elasticSearchUrl: (configuration?.meta as { elasticSearchUrl?: string })?.elasticSearchUrl || "",
                databaseName: (configuration?.meta as { databaseName?: string })?.databaseName || "",
                gitusername: (configuration?.meta as { gitusername?: string })?.gitusername || "",
                githubtoken: (configuration?.meta as { githubtoken?: string })?.githubtoken || "",
            })
            setLoading(false)
        } else {
            setLoading(false)
        }
    }

    const saveChatConfig = async () => {
        if (!profile) return;
        
        if (!(configuration?.id) || (configuration.chat_id !== currentChatId && configuration.type != "chat-default-config") || (configuration.type == "configuration")) {
              const meta = Object.entries(configuration.meta).length > 0 ? configuration.meta : {}
              const CreateConfig = await createConfig({
                chat_id: currentChatId? currentChatId : null,
                user_id: profile.user_id,
                meta: {
                  ...meta,
                  databaseName: state.databaseName,
                  gitusername: state.gitusername,
                  githubtoken: state.githubtoken,
                  elasticSearchUrl: state.elasticSearchUrl,
                  es_indices: state.es_indices,
                },
                type: currentChatId ? "chat-config" : "chat-default-config",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              setConfiguration(CreateConfig);
            } else {
              const updateConfig = await updateConfigDeatils(configuration.id, {
                chat_id: currentChatId? currentChatId :null,
                user_id: profile.user_id,
                meta: {
                  ...((configuration?.meta as object) || {}),
                  elasticSearchUrl: state.elasticSearchUrl,
                  databaseName: state.databaseName,
                  gitusername: state.gitusername,
                  githubtoken: state.githubtoken,
                  es_indices: state.es_indices,
                },
                type: currentChatId ? "chat-config" : "chat-default-config",
                updated_at: new Date().toISOString()
              })
              setConfiguration(updateConfig);
            }
    }
    return (
        <React.Fragment>
            <Sheet open={open} onOpenChange={onOpenChange} >
                <SheetContent
                    className="flex flex-col justify-between p-4"
                    side="rightv2"
                >
                    <div className="grow overflow-auto relative z-50">
                        <SheetHeader>
                            <SheetTitle className="flex items-center justify-between space-x-2">
                                <div>Chat Configuration</div>
                            </SheetTitle>
                        </SheetHeader>
                        {!loading ? <div className="mt-10">
                            {/* <div className="space-y-1">
                                <Label>Elastic Search Url</Label>
                                <Input
                                    placeholder="Elastic Search Url"
                                    value={state["elasticSearchUrl"]}
                                    onChange={e => updateState("elasticSearchUrl", e.target.value)}
                                />
                            </div> */}
                            <div className="space-y-1 mt-3">
                                <Label>Github Username</Label>
                                <Input
                                    placeholder="Github Username"
                                    value={state["gitusername"]}
                                    onChange={e => updateState("gitusername", e.target.value)}
                                />
                            </div>
                            <div className="space-y-1 mt-3">
                                <Label>Github Token</Label>
                                <Input
                                    placeholder="Github Token"
                                    value={state["githubtoken"]}
                                    onChange={e => updateState("githubtoken", e.target.value)}
                                />
                            </div>
                        </div> : <div className="h-[300px]">
                            <Loading />
                        </div>}
                        <div className="ml-auto space-x-2 text-right mt-[41px]">
                            <Button variant="ghost"
                             onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                            disabled={loading}
                            // ref={buttonRef} 
                            onClick={saveChatConfig}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

        </React.Fragment>
    )
}
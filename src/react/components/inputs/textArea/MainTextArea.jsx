import { Textarea } from "@/components/ui/textarea"
import { useState } from "react";
import { useRootContext } from "../../../context/RootContext";
import { geminiGenerateText } from "../../../apis/geminiAi/geminiAi";

const MainTextArea = (props) => {

    const { uuid, chatNameField } = props;

    const [value, setValue] = useState("");

    const rootContextData = useRootContext();


    const sendMessageToAi = async () => {
        const chatUuid = await geminiGenerateText(uuid, chatNameField, [{ text: value }]);
        if(!uuid)
            rootContextData?.setSelectedChat(chatUuid);
        rootContextData?.loadChatsData();
    }

    const onSubmitEvent = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            sendMessageToAi();           
            rootContextData?.setChats((prev) => prev.map(chat => {
                if (chat.uuid === uuid) {
                    return { ...chat, contents: [...chat.contents, { role: "user", parts: [{ text: value }] } ,{ role: "model", parts: [{ text: "..." }] }] }
                }
                return chat;
            }))
            setValue("");
            event.preventDefault();
        }
    }

    return <Textarea value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onSubmitEvent} className="max-h-4 resize-none overflow-hidden" placeholder="Type your message here." />
}

export default MainTextArea;
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react";
import { useRootContext } from "../../../context/RootContext";
import { geminiGenerateText } from "../../../apis/geminiAi/geminiAi";

const MainTextArea = (props) => {

    const [imagesToSend, setImagesToSend] = useState([]);
    // const blobToBase64 = (blob) => {
    //     return new Promise((resolve, reject) => {
    //       const reader = new FileReader();

    //       reader.onloadend = () => resolve(reader.result);

    //       reader.onerror = reject;

    //       reader.readAsDataURL(blob);
    //     });
    //   };

    // const clipboardPasteHandler = async (e) => {
    //         const items = e.clipboardData.items;
    //         for (let i = 0; i < items.length; i++) {
    //             if (items[i].type.indexOf('image') !== -1) {
    //                 const blob =await blobToBase64(items[i].getAsFile());
    //                 console.log("Wykryto obrazek! Można go teraz wysłać.",blob);
    //             }
    //         }
    //     };

    useEffect(() => {
        const inter = setInterval(() => {
            if (window.api && window.api.getClipboardImage) {
                const data = window.api.getClipboardImage();
                if (data) {
                    console.log("Obrazek pobrany!", data);
                    setImagesToSend(prev => [...prev, data]);
                    window.api.clearClipboard();
                }
            } else {
                console.error("API Electrona nie jest dostępne!");
            }
        }, 1000)

        // document.addEventListener('paste', clipboardPasteHandler);
        return () => {
            console.log("Unmount MainTextArea, removing clipboard listener");
            // document.removeEventListener('paste', clipboardPasteHandler);
            clearInterval(inter);
        }
    }, [])

    const { uuid, chatNameField } = props;

    const [value, setValue] = useState("");

    const rootContextData = useRootContext();

    console.log("imagesToSend", imagesToSend)

    const sendMessageToAi = async () => {

        const sendPayload = [{ text: value }];
        if (imagesToSend.length > 0) {
            for (const img of imagesToSend) {
                sendPayload.push({inlineData:{ mimeType: "image/png", data: img?.split(',')[1] }});
            }
            setImagesToSend([]);
        }

        const chatUuid = await geminiGenerateText(uuid, chatNameField, sendPayload);
        if (!uuid)
            rootContextData?.setSelectedChat(chatUuid);
        rootContextData?.loadChatsData();
    }

    const onSubmitEvent = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            sendMessageToAi();
            rootContextData?.setChats((prev) => prev.map(chat => {
                if (chat.uuid === uuid) {
                    return { ...chat, contents: [...chat.contents, { role: "user", parts: [{ text: value }] }, { role: "model", parts: [{ text: "..." }] }] }
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
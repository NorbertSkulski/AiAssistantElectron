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
                    setImagesToSend(prev => [...prev, data]);
                    window.api.clearClipboard();
                }
            } else {
                console.error("API Electrona nie jest dostępne!");
            }
        }, 1000)

        // document.addEventListener('paste', clipboardPasteHandler);
        return () => {
            // document.removeEventListener('paste', clipboardPasteHandler);
            clearInterval(inter);
        }
    }, [])

    const { uuid, chatNameField } = props;

    const [value, setValue] = useState("");

    const rootContextData = useRootContext();

    const sendMessageToAi = async () => {

        const sendPayload = [{ text: value }];
        if (imagesToSend.length > 0) {
            for (const img of imagesToSend) {
                sendPayload.push({ inlineData: { mimeType: "image/png", data: img?.split(',')[1] } });
            }
            setImagesToSend([]);
        }

        const chat = await geminiGenerateText(uuid, chatNameField, sendPayload);
        if (!uuid)
            rootContextData?.setSelectedChat(chat);
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
            if (!uuid) {
                rootContextData?.setChats((prev) => [...prev, { uuid: null, name: chatNameField, contents: [{ role: "user", parts: [{ text: value }] }, { role: "model", parts: [{ text: "..." }] }] }]);
            }
            setValue("");
            event.preventDefault();
        }
    }

    return <div className="relative">
        <Textarea value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onSubmitEvent} className="max-h-4 resize-none overflow-hidden" placeholder="Type your message here." />
        <span className="absolute top-1 right-2 text-sm flex text-gray-400">
            <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>
                attach_file
            </span>
            {Number(imagesToSend?.length)}
        </span>

    </div>
}

export default MainTextArea;
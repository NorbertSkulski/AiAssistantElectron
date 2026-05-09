import { GoogleGenAI } from "@google/genai";
import settingsDb from "../indexedDb/settingsDb";
import chatsDb from "../indexedDb/chatsDb";
import { toast } from "react-toastify";

export const geminiGenerateText = async (chatUuid, name, parts) => {

    const GEMINI_API_KEY = await settingsDb.settings.get({ key: 'GEMINI_API_KEY' });

    const GEMINI_API_MODEL = await settingsDb.settings.get({ key: 'GEMINI_API_MODEL' });

    const GEMINI_API_SYS_INST = await settingsDb.settings.get({ key: 'GEMINI_API_SYS_INST' });


    let contents = [];

    if (Boolean(chatUuid)) {
        const chatData = await chatsDb.chats.get({ uuid: chatUuid });
        contents = chatData.contents;
    }

    contents.push({ role: "user", parts: parts })

    let response;
    try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY?.value });
        response = await ai.models.generateContent({
            model: GEMINI_API_MODEL?.value,
            contents: contents,
            config: {
                systemInstruction: Boolean(GEMINI_API_SYS_INST.value) ? GEMINI_API_SYS_INST.value : "Jesteś sztuczną inteligencją która ma pomagać w rozpoznawaniu chorób na podstawie danych przeslanych przez użytkownika.",
                temperature: 0.1,
            },
        });
    } catch (e) {
        toast.error(String(e));
        return;
    }

    if(!response){
        toast.error("Ai Connection Error !");
    }

    contents.push(response.candidates.at(-1).content)

    if (!chatUuid) {
        const uuid = self.crypto.randomUUID();
        chatUuid = uuid;
        await chatsDb.chats.add({ uuid: uuid, name: name, model: GEMINI_API_MODEL?.value, contents: contents });
    } else {
        await chatsDb.chats.update(chatUuid, { name: name, model: GEMINI_API_MODEL?.value, contents: contents });
    }

    return chatUuid;

}
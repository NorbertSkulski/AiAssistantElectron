import { GoogleGenAI } from "@google/genai";
import settingsDb from "../indexedDb/settingsDb";
import chatsDb from "../indexedDb/chatsDb";

export const geminiGenerateText = async (chatUuid, name, parts) => {

    // temporary solution 

    await settingsDb.settings.add({ key: 'GEMINI_API_MODEL', value: "gemini-3-flash-preview" });

    await settingsDb.settings.add({ key: 'GEMINI_API_KEY', value: "AIzaSyD-7pyxQGfgNY7UZW_SLJQ0Vv5m0BNO9UY" });

    const GEMINI_API_KEY = await settingsDb.settings.get({ key: 'GEMINI_API_KEY' });

    const GEMINI_API_MODEL = await settingsDb.settings.get({ key: 'GEMINI_API_MODEL' });


    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY?.value });

    let contents = [];

    if (Boolean(chatUuid)) {
        const chatData = await chatsDb.chats.get({ uuid: chatUuid });
        contents = chatData.contents;
    }

    contents.push({ role:"user", parts:parts })

    // image example
    // {
    //     "contents": [
    //       {
    //         "role": "user",
    //         "parts": [
    //           { "text": "Co widzisz na tym zdjęciu?" },
    //           {
    //             "inlineData": {
    //               "mimeType": "image/jpeg",
    //               "data": "iVBORw0KGgoAAAANSUhEU..." // Tutaj długi ciąg Base64
    //             }
    //           }
    //         ]
    //       }
    //     ]
    //   }

    const response = await ai.models.generateContent({
        model: GEMINI_API_MODEL?.value,
        contents: contents,
        config: {
            systemInstruction: "Jesteś sztuczną inteligencją która ma pomagać w rozpoznawaniu chorób na podstawie danych przeslanych przez użytkownika.",
            temperature: 0.1,
        },
    });

    contents.push( response.candidates.at(-1).content )

    if(!chatUuid){
        const uuid = self.crypto.randomUUID();
        await chatsDb.chats.add({ uuid: uuid, name:name, model: GEMINI_API_MODEL?.value, contents: contents });
    }else{
        await chatsDb.chats.update(chatUuid,{ name:name, model: GEMINI_API_MODEL?.value, contents: contents });
    }

    return contents;

}
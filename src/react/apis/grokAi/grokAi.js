import { createXai } from '@ai-sdk/xai';
import { generateText } from 'ai';
import settingsDb from '../indexedDb/settingsDb';

export const grokGenerateText = async () => {
    // temporary solution 
    // await settingsDb.settings.add({ key: 'XAI_API_KEY', value: "xai-yA7zLNl3KM5cGkJ29N7P8lV6s33MNpjtG8mZlYbRycYEokt8t5cdKBRS7ubwm9rmHl51t5jTsPedOMru" });
    
    const XAI_API_KEY = await settingsDb.settings.get({ key: 'XAI_API_KEY' })

    const xai = createXai({ apiKey: XAI_API_KEY?.value });
    const { text } = await generateText({
        model: xai.responses('grok-4'),
        messages: [{
            role: 'user',
            content: [                
                { type: 'text', text: "Jak się masz ?" },
            ],
        }],
    });
    return text;
}
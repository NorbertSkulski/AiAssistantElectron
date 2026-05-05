import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import settingsDb from './apis/indexedDb/settingsDb';
import Menu from './components/menu/Menu';
import { Button } from "@/components/ui/button"
import { geminiGenerateText } from './apis/geminiAi/geminiAi';
import Content from './components/content/Content';
import { RootContextProvider, useRootContext } from './context/RootContext';

const App = () => {

    const ref = useRef(null);

    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        const loadSettings = async () => {
            const settingMenu = await settingsDb.settings.get({ key: 'menuClose' });
            if (settingMenu && Boolean(settingMenu?.value)) {
                ref?.current?.classList?.add('CloseMenu');
                return;
            }
        }
        loadSettings();
    }, [])

    const handleAction = (formData, e) => {
        const query = formData.get("query");
        console.log(`You searched for '${query}'`);
        console.log('e', formData)
    }

    const [query, setQuery] = useState("");

    const askChat = async () => {
        const res = await geminiGenerateText("33f939d4-9d1a-4b20-9ffb-3ff4287fecfb", [{ text: "a dodaj do tego 5 ?" }]);
        console.log('text', res);
    }

    return (
        <div className='MainWindow' ref={ref}>
            <RootContextProvider value={{ setSelectedChat, selectedChat }}>
                <div className='MenuArea'>
                    <Menu />
                </div>
                <div className='ContentArea rounded-lg m-3'>
                    <Content />

                    {/* <h1>AI Assistant</h1>
                <p>Witaj w aplikacji AI Assistant!</p>
                <p>Node: {window?.api?.node()}</p>
                <p>test: {env.TEST}</p>

                <form action={handleAction}>
                    <input name="query" value={query} onChange={(e) => setQuery(e.target.value)} />
                    <button type="submit">Search</button>
                </form>

                <Button onClick={() => askChat()}>Ask</Button> */}

                </div>
            </RootContextProvider>
        </div>
    );
}

export default App;
import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import settingsDb from './apis/indexedDb/settingsDb';
import Menu from './components/menu/Menu';

const App = () => {

    const ref = useRef(null);

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

    const handleAction = (formData,e) => {
        const query = formData.get("query");
        console.log(`You searched for '${query}'`);
        console.log('e',formData)
    }

    const [query, setQuery] = useState("");

    
    return (
        <div className='MainWindow' ref={ref}>
            <div className='MenuArea'>
                <Menu/>
            </div>
            <div className='ContentArea'>content

                <h1>AI Assistant</h1>
                <p>Witaj w aplikacji AI Assistant!</p>
                <p>Node: {window?.api?.node()}</p>
                <p>test: {env.TEST}</p>

                <form action={handleAction}>
                    <input name="query" value={query} onChange={(e) => setQuery(e.target.value)}/>
                    <button type="submit">Search</button>
                </form>

            </div>
        </div>
    );
}

export default App;
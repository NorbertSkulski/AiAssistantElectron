import React, { useEffect, useRef } from 'react';
import './App.scss';
import settingsDb from './apis/indexedDb/settingsDb';

const App = () => {

    const ref = useRef(null);

    useEffect(() => {
        const loadSettings = async () => {
            const settingMenu = await settingsDb.settings.get({ key: 'menuOpen' });
            if (settingMenu && Boolean(settingMenu?.value)) {
                ref?.current?.classList?.add('OpenMenu');
                return;
            }
        }
        loadSettings();
    }, [])

    const toggleMenu = async () => {
        const settingMenu = await settingsDb.settings.get({ key: 'menuOpen' });
        if (!settingMenu) {
            await settingsDb.settings.add({ key: 'menuOpen', value: true });
        } else {
            await settingsDb.settings.update(settingMenu.id, { value: !settingMenu.value });
        }
        ref.current.classList.toggle('OpenMenu');
    }

    return (
        <div className='MainWindow' ref={ref}>
            <div className='MenuArea'>menu
                <button onClick={toggleMenu}>click</button>

            </div>
            <div className='ContentArea'>content

                <h1>AI Assistant</h1>
                <p>Witaj w aplikacji AI Assistant!</p>
                <p>Node: {window?.api?.node()}</p>
                <p>test: {env.TEST}</p>

            </div>
        </div>
    );
}

export default App;
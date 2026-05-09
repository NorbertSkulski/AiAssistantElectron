import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import settingsDb from './apis/indexedDb/settingsDb';
import Menu from './components/menu/Menu';
import Content from './components/content/Content';
import { RootContextProvider, useRootContext } from './context/RootContext';
import chatsDb from './apis/indexedDb/chatsDb';
import { ToastContainer, toast } from 'react-toastify';

const App = () => {

    const ref = useRef(null);

    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);

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

    const loadChatsData = async() => {
        const chats = await chatsDb.chats.toArray();
        setChats(chats);
     }
 
     useEffect(()=>{
        loadChatsData();
     },[])

    return (
        <div className='MainWindow' ref={ref}>
            <RootContextProvider value={{ setSelectedChat, selectedChat, chats, setChats, loadChatsData }}>
                <div className='MenuArea'>
                    <Menu />
                </div>
                <div className='ContentArea rounded-lg m-3'>
                    <Content />
                </div>
            </RootContextProvider>
            <ToastContainer/>
        </div>
    );
}

export default App;
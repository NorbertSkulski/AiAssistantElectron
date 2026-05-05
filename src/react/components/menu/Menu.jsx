import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from "@/components/ui/command"
  import { Button } from "@/components/ui/button"
import settingsDb from "../../apis/indexedDb/settingsDb";
import { useEffect, useState } from "react";
import chatsDb from "../../apis/indexedDb/chatsDb";
import { geminiGenerateText } from "../../apis/geminiAi/geminiAi";
import { useRootContext } from "../../context/RootContext";

const Menu = () => {

    const [chats, setChats] = useState([]);
    const rootContextData = useRootContext();


    const toggleMenu = async () => {
        const settingMenu = await settingsDb.settings.get({ key: 'menuClose' });
        if (!settingMenu) {
            await settingsDb.settings.add({ key: 'menuClose', value: true });
        } else {
            await settingsDb.settings.update(settingMenu.id, { value: !settingMenu.value });
        }
        const menu = document.querySelector('.MainWindow');
        menu.classList.toggle('CloseMenu');
    }

    const loadData = async() => {
       const chats = await chatsDb.chats.toArray();
       setChats(chats);
    }

    useEffect(()=>{
        loadData();
    },[])

    console.log(chats)

    // const createChat = async () => {
    //         console.log("Click")

    //     //  const res = await geminiGenerateText(null,"Norbert2 Skulski2",[{text:"2*2 ile to jest ?"}]);
    //     //  console.log(res);
    //      loadData()
    // }

    const openChat = (uuid) => {
        rootContextData.setSelectedChat(uuid);
        const content = document.querySelector('.Content');
        if(content.classList.contains('show')){
            content.classList.remove('show');
        }
        const timeout = setTimeout(()=>{
            content.classList.add('show');
            clearTimeout(timeout);
        },600);
    }


    console.log('rootDataMenu', rootContextData);

    return (
        <Command className="max-w-sm  rounded-none! rounded-r-lg! border relative">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Patients">
                    <CommandItem onSelect={()=>openChat()} >New chat</CommandItem>                    
                    {chats.map((chat) => (
                        <CommandItem onSelect={()=>openChat(chat.uuid)} key={chat.uuid}>{chat.name}</CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">                 
                    <CommandItem>Settings</CommandItem>
                </CommandGroup>
            </CommandList>
            <Button className="mt-auto mb-2 w-full " onClick={toggleMenu}>Close</Button>
        </Command>
    )
}       

export default Menu;
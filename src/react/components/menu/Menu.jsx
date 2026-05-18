import {
    Command,
    CommandShortcut,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import settingsDb from "../../apis/indexedDb/settingsDb";
import { useRootContext } from "../../context/RootContext";
import "./Menu.scss";
import { useEffect, useLayoutEffect, useState } from "react";
import chatsDb from "../../apis/indexedDb/chatsDb";

const Menu = () => {

    const rootContextData = useRootContext();

    const [sortedChats, setSortedChats] = useState([]);

    const [isClose, setIsClose] = useState(false);

    const toggleMenu = async () => {
        const settingMenu = await settingsDb.settings.get({ key: 'menuClose' });
        if (!settingMenu) {
            await settingsDb.settings.add({ key: 'menuClose', value: true });
            setIsClose(true);
        } else {
            await settingsDb.settings.update(settingMenu.id, { value: !settingMenu.value });
            setIsClose(!settingMenu.value);
        }
        const menu = document.querySelector('.MainWindow');
        menu.classList.toggle('CloseMenu');
    }


    const openChat = (uuid) => {
        rootContextData.setSelectedChat(uuid);

        const content = document.querySelector('.Content');
        if (uuid === rootContextData.selectedChat && content.classList.contains('show')) {
            content.classList.remove('show');
            return;
        }
        if (uuid === rootContextData.selectedChat && !content.classList.contains('show')) {
            const timeout = setTimeout(() => {
                content.classList.add('show');
                clearTimeout(timeout);
            }, 400);
            return;
        }
        if (content.classList.contains('show')) {
            content.classList.remove('show');
        }

        const timeout = setTimeout(() => {
            content.classList.add('show');
            clearTimeout(timeout);
        }, 400);
    }


    useLayoutEffect(() => {
        const menu = document.querySelector('.MainWindow');
        if (menu.classList.contains('CloseMenu')) {
            setIsClose(true);
            return;
        }
        setIsClose(false);
    })

    const onDeleteChat = async (e, uuid) => {
        await chatsDb.chats.delete(uuid);
        rootContextData.setChats(prev => prev.filter(chat => chat.uuid !== uuid));
        e.stopPropagation();
    }

    const calcContentsWeight = (chat) => {
        const chatCnt = chat?.contents?.filter(el=>el?.role==="model")?.length;
        const val = chat?.contents?.filter(el=>el?.role==="model")?.reduce((x, y) => {
                const start = y?.parts?.find(elm=>Object.keys(elm).includes("text"))?.text?.indexOf("[");
                const end = y?.parts?.find(elm=>Object.keys(elm).includes("text"))?.text?.indexOf("]");
                if(start < 0 || end < 0) 
                    return x;
                const tmp = Number(y?.parts?.find(elm=>Object.keys(elm).includes("text"))?.text?.slice(start+1, end));
                if(!tmp || isNaN(tmp))
                    return x;
                return x+tmp;
            }, 0)
        return val/chatCnt;
    }

    useEffect(() => {
        const chatsToSort = rootContextData?.chats;
        chatsToSort.sort((a, b) => {
            const valA = calcContentsWeight(a);
            const valB= calcContentsWeight(b);
            return valB-valA;
        });
        setSortedChats(chatsToSort);
    }, [rootContextData?.chats])


    return (
        <Command className="Menu max-w-sm  rounded-none! rounded-r-lg! border relative h-full">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList className="xl:max-h-[85vh] lg:max-h-[80vh] md:max-h-[75vh] sm:max-h-[60vh] max-h-[50vh]" >
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Patients">
                    <CommandItem onSelect={() => openChat()} >New chat</CommandItem>
                    {sortedChats.map((chat) => (
                        <CommandItem onSelect={() => openChat(chat.uuid)} key={chat.uuid}>
                            {chat.name}
                            <CommandShortcut>
                                <Button key={`button-${chat.uuid}`} onClick={(e) => onDeleteChat(e, chat.uuid)} variant="inline" size="xs">
                                    <span className="material-symbols-rounded text-red-700" style={{ fontSize: "15px" }}>
                                        delete
                                    </span>
                                </Button>
                            </CommandShortcut>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <CommandItem onSelect={() => openChat("settings")}>Settings</CommandItem>
                </CommandGroup>
            </CommandList>
            <Button className="mt-auto mb-2 w-full " onClick={toggleMenu}>{isClose ? "Open" : "Close"}</Button>
        </Command>
    )
}

export default Menu;
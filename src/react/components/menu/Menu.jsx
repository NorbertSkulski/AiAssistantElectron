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
import { useRootContext } from "../../context/RootContext";
import "./Menu.scss";

const Menu = () => {

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


    return (
        <Command className="Menu max-w-sm  rounded-none! rounded-r-lg! border relative h-full">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList className="xl:max-h-[85vh] lg:max-h-[80vh] md:max-h-[75vh] sm:max-h-[60vh] max-h-[50vh]" >
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Patients">
                    <CommandItem onSelect={() => openChat()} >New chat</CommandItem>
                    {rootContextData?.chats.map((chat) => (
                        <CommandItem onSelect={() => openChat(chat.uuid)} key={chat.uuid}>{chat.name}</CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <CommandItem onSelect={() => openChat("settings")}>Settings</CommandItem>
                </CommandGroup>
            </CommandList>
            <Button className="mt-auto mb-2 w-full " onClick={toggleMenu}>Close</Button>
        </Command>
    )
}

export default Menu;
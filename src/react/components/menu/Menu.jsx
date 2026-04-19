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

const Menu = () => {

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

    return (
        <Command className="max-w-sm  rounded-none! rounded-r-lg! border relative">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Patients">
                    <CommandItem>New chat</CommandItem>                    
                    <CommandItem>Agata Gromek</CommandItem>

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
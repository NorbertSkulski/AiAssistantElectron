import ChatRoute from "../../routes/chatRoute/ChatRoute";
import { useRootContext } from "../../context/RootContext";
import "./Content.scss";
import SettingsRoute from "../../routes/settingsRoute/SettingsRoute";

const Content = () => {
    const rootContextData = useRootContext();

    const selectRoot = (selected) => {
        switch (selected) {
            case 'settings':
                return <SettingsRoute />;
            default:
                return <ChatRoute uuid={selected} />;
        }
    }

    return <div className="Content bg-white w-full h-full rounded-lg p-4">
        {selectRoot(rootContextData?.selectedChat)}
    </div>

}

export default Content;
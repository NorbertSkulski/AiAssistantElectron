import { useEffect, useState } from "react";
import ChatComponent from "../../components/chatComponent/ChatComponent";
import MainInput from "../../components/inputs/mainInput/MainInput";
import MainTextArea from "../../components/inputs/textArea/MainTextArea";
import { useRootContext } from "../../context/RootContext";



const ChatRoute = (props) => {
    const { uuid } = props;

    const [name, setName] = useState("");

    const rootContextData = useRootContext();

    useEffect(() => {
        const selectedChat = rootContextData?.chats?.find((chat) => chat.uuid === uuid || (chat.name === name && !chat.uuid));
        setName(selectedChat?.name || `Chat nr ${rootContextData?.chats?.length + 1 || 1}`);
    }, [uuid,rootContextData?.chats])

    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const onKeyUp = () => {
        if (name?.length <= 0) {
            setName(`Chat nr ${rootContextData?.chats?.length + 1 || 1}`);
        }
    }

    const onFocus = () => {
        setName("");
    }

    const onBlur = () => {
        if (name?.length <= 0) {
            const selectedChat = rootContextData?.chats?.find((chat) => chat.uuid === uuid);
            setName(selectedChat?.name || `Chat nr ${rootContextData?.chats?.length + 1 || 1}`);
        }
    }

    return <div className="ChatRoute flex flex-col h-full p-4">
        <MainInput onChange={onChangeName} onFocus={onFocus} onBlur={onBlur} onKeyUp={onKeyUp} value={name} type="text" placeholder="Chat Name" label="Name" />
        <ChatComponent uuid={uuid} chatNameField={name} />
        <MainTextArea uuid={uuid} chatNameField={name} />
    </div>
}

export default ChatRoute;
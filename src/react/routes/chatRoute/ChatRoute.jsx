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
        const selectedChat = rootContextData?.chats?.find((chat) => chat.uuid === uuid);
        setName(selectedChat?.name || `Chat nr ${rootContextData?.chats?.length + 1 || 1}`);
    }, [uuid])

    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const onKeyUp = () => {
        if (name?.length <= 0) {
            console.log("name less0", name)
            setName(`Chat nr ${rootContextData?.chats?.length + 1 || 1}`);
        }
    }

    const onFocus = () => {
        console.log("onFocus", name);
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
        <ChatComponent uuid={uuid} />
        <MainTextArea uuid={uuid} chatNameField={name} />
    </div>
}

export default ChatRoute;
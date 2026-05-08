import { useEffect, useLayoutEffect, useState } from "react"
import chatsDb from "../../apis/indexedDb/chatsDb"
import { useRootContext } from "../../context/RootContext"


const MessageUserCloud = ({children}) => {
    return<div className="border rounded-lg p-4 my-3 border-gray-300 w-fit ml-auto mr-1">
        {children}
    </div>
}

const MessageAICloud = ({children}) => {
    return<div className="border rounded-lg p-4 my-3 border-gray-300 w-fit bg-[var(--main-bg-color)] text-white">
         {children}
    </div>
}


const ChatComponent = (props) => {

    const {uuid} = props;

    const [contentChats,setContentChats] = useState([]);

    const rootContextData = useRootContext();

    const scrollRef = useState(null);


    useEffect(()=>{
        loadData(uuid);
    },[uuid,rootContextData?.chats])

    const loadData = (chatUuid) => {
        if (Boolean(chatUuid)) {
            const selectedChat = rootContextData?.chats?.find((chat) => chat.uuid === uuid);
            if(Boolean(selectedChat)){
                setContentChats(selectedChat.contents);
                return;
            }                     
        }
        setContentChats([]);
    }

    useLayoutEffect(()=>{
        scrollRef?.current?.scrollIntoView({ block: 'end' });    
    },[contentChats])

    return (
        <div className="border rounded-lg p-4 my-3 border-gray-300 h-full scroll-auto overflow-y-auto">
            {contentChats?.map((chat)=>{
                if(chat.role === "user"){
                    return <MessageUserCloud>{chat?.parts?.at(-1)?.text}</MessageUserCloud>;
                    
                }
                return <MessageAICloud>{chat?.parts?.at(-1)?.text}</MessageAICloud>;
            })}
            <div ref={scrollRef}/>
        </div>
    )
}

export default ChatComponent;
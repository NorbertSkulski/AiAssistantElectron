import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useRootContext } from "../../context/RootContext"
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const MessageUserCloud = ({ children }) => {

    const rawHtml = marked.parse(children);

    const cleanHtml = DOMPurify.sanitize(rawHtml);

    return <div className="border rounded-lg p-4 my-3 border-gray-300 w-fit ml-auto mr-1" dangerouslySetInnerHTML={{ __html: cleanHtml }}/>

}

const MessageAICloud = ({ children }) => {

    const rawHtml = marked.parse(children);

    const cleanHtml = DOMPurify.sanitize(rawHtml);

    return <div className="border rounded-lg p-4 my-3 border-gray-300 w-fit bg-[var(--main-bg-color)] text-white" dangerouslySetInnerHTML={{ __html: cleanHtml }}/>

}


const ChatComponent = (props) => {

    const { uuid, chatNameField } = props;

    const [contentChats, setContentChats] = useState([]);

    const rootContextData = useRootContext();

    const scrollRef = useRef(null);


    useEffect(() => {
        loadData();
    }, [uuid, rootContextData?.chats])

    const loadData = () => {
        if (Boolean(uuid)) {
            const selectedChat = rootContextData?.chats?.find((chat) => chat.uuid === uuid);
            if (Boolean(selectedChat)) {
                setContentChats(selectedChat.contents);
                return;
            }
        }

        if(Boolean(chatNameField) && !uuid){
            const selectedChat = rootContextData?.chats?.find((chat) => chat.name === chatNameField && !chat.uuid);
            if (Boolean(selectedChat)) {
                setContentChats(selectedChat.contents);
                return;
            }
        }
        setContentChats([]);
    }

    useLayoutEffect(() => {
        scrollRef?.current?.scrollIntoView({ block: 'end' });
    }, [contentChats])


    const chatText = (chat) => {

        const text = chat?.parts?.find(elm=>Object.keys(elm).includes("text"))?.text;
        
        const start = text?.indexOf("[");
        const end = text?.indexOf("]");
        const range = Number(Math.abs(start - end)+1);
        const tmp = text?.split("");
        if(start !== -1 && end !== -1) {
            tmp?.splice(start,range,"")
        }
        return tmp?.join("");
    }

    return (
        <div className="border rounded-lg p-4 my-3 border-gray-300 h-full scroll-auto overflow-y-auto">
            {contentChats?.map((chat) => {
                if (chat.role === "user") {
                    return <MessageUserCloud>{chatText(chat)}</MessageUserCloud>;

                }
                return <MessageAICloud>{chatText(chat)}</MessageAICloud>;
            })}
            <div ref={scrollRef} />
        </div>
    )
}

export default ChatComponent;
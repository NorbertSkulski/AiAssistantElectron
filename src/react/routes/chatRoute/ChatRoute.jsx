import ChatComponent from "../../components/chatComponent/ChatComponent";
import MainInput from "../../components/inputs/mainInput/MainInput";
import MainTextArea from "../../components/inputs/textArea/MainTextArea";



const ChatRoute = (props) => {
    const {uuid} = props;

    return <div className="ChatRoute flex flex-col h-full">
        <MainInput value={"test"} type="text" placeholder="Chat Name" label="Name"/>
        <ChatComponent uuid={uuid}/>
        <MainTextArea uuid={uuid}/>
    </div>
}

export default ChatRoute;
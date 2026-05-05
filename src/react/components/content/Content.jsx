import { useRootContext } from "../../context/RootContext";
import "./Content.scss";

const Content = () => {

    const rootContextData = useRootContext();

    console.log('rootDataContext', rootContextData);

    return <div className="Content bg-white w-full h-full rounded-lg p-4">
        {/* tu komponenty do wyboru z menu */}
        <div >Content area selected uuid: {rootContextData?.selectedChat}</div>
    </div>

}

export default Content;
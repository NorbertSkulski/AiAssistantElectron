import React, { useRef } from 'react';
import './App.scss';

const App = () => {

    const ref = useRef(null);

    const toggleMenu = () => {
        ref.current.classList.toggle('OpenMenu');
    }

    return (
        <div className='MainWindow' ref={ref}>
            <div className='MenuArea'>menu
            <button onClick={toggleMenu}>click</button>

            </div>
            <div className='ContentArea'>content

                <h1>AI Assistant</h1>
                <p>Witaj w aplikacji AI Assistant!</p>
                <p>Node: {window?.api?.node()}</p>
                <p>test: {env.TEST}</p>

            </div>
        </div>
    );
}

export default App;
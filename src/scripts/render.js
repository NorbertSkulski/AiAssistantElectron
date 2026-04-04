console.log('Hello from the renderer process!')
const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${window.api.chrome()}), Node.js (v${window.api.node()}), and Electron (v${window.api.electron()})`

const func = async () => {
    const response = await window.api.ping()
    console.log(response) // prints out 'pong'
  }
  func();

  const buttonClick = document.getElementById('buttonClick');
  
  const click = () => {
    window.location.href = "scene1.html";
    console.log('Button clicked!')
  }

  const loadScene = (name) => {
    const scene = document.getElementById(name)
    scene.classList.add("active");
  }

  buttonClick.addEventListener('click', ()=>loadScene('scene1'));

  class SceneOne extends HTMLElement {
    connectedCallback() {
      fetch("scene1.html")
        .then(res => res.text())
        .then(html => {
          this.innerHTML = html
        });
    }
  }
  
  customElements.define("scene-one", SceneOne);

 
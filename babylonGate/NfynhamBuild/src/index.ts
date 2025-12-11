import { Engine} from "@babylonjs/core";
import createScene1  from "./scene1/createStartScene";
import createScene2  from "./scene2/createStartScene";
import menuScene1 from "./scene1/guiMainMenu";
import menuScene2 from "./scene2/guiBack";
import "./main.css";
import {createCharacterController} from "./scene2/createCharacterController";
import { setupCollisions } from "./scene2/collisions";
import { SceneData } from "./interfaces";

const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("background-canvas");
document.body.appendChild(canvas);

let scene;
let scenes: any[] = [];

let eng = new Engine(canvas, true, {}, true);
let gui1 = menuScene1(eng);
let gui2 = menuScene2(eng);
scenes[0] = createScene1(eng);
scenes[1] = await createScene2(eng);
console.log("Scene 2: ", scenes[1].scene);
scene = scenes[0].scene;
setSceneIndex(0);

export default async function setSceneIndex(i: number) {
  if(i == 1)
  {
    createCharacterController(scenes[i].scene);
    setupCollisions(scenes[i]);
  }
  
  eng.runRenderLoop(() => {
      scenes[i].scene.render();

      if(i == 1){
        gui2.scene.autoClear = false;
        gui2.scene.render();
      }
      else{
        gui1.scene.autoClear = false;
        gui1.scene.render();
      }
  });
}   

import setSceneIndex from "../index";

import {
    Scene,
    ArcRotateCamera,
    Vector3,
    Camera,
    Engine,
    Sound
  } from "@babylonjs/core";
  import * as GUI from "@babylonjs/gui";
 
var text1!: GUI.TextBlock; // recieves external messages

  //----------------------------------------------------
  function createSceneButton(scene: Scene, name: string, note: string, index: number, x: string, y: string, advtex: GUI.AdvancedDynamicTexture) {
    let button = GUI.Button.CreateSimpleButton(name, note);
        button.left = x;
        button.top = y;
        button.width = "110px";
        button.height = "40px";
        button.color = "white";
        button.cornerRadius = 20;
        button.background = "red";


        button.onPointerUpObservable.add(function() {
            console.log("THE BUTTON HAS BEEN CLICKED");
            setSceneIndex(index -1);
        });
        advtex.addControl(button);
        return button;
 }

 function createTextBlock(
   name: string,
   index: string,
   left: string,
   top: string
  ) {
    let text: GUI.TextBlock = new GUI.TextBlock(name, index);
    text.text = index;
    text.color = "white";
    text.fontSize = 24;
    text.left = left;
    text.top = top;
    text.width = "200px";
    text.height = "46px";
    text.fontFamily = "Verdana";
    text.textWrapping = true;
    text.highlightColor = "red";
    text.horizontalAlignment = GUI.TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
    text.verticalAlignment = GUI.TextBlock.VERTICAL_ALIGNMENT_CENTER;
    // event handling
    text.onPointerEnterObservable.add(function () {
      text.isHighlighted = true;
    });
    text.onPointerOutObservable.add(function () {
      text.isHighlighted = false;
    });
    return text;
  }

  function createArcRotateCamera(scene: Scene) {
  let camAlpha = -Math.PI / 2,
    camBeta = Math.PI / 2.5,
    camDist = 10,
    camTarget = new Vector3(0, 0, 0);
  let camera = new ArcRotateCamera(
    "camera1",
    camAlpha,
    camBeta,
    camDist,
    camTarget,
    scene,
  );
  camera.attachControl(false);
  return camera;
}
  export default function menuScene(engine: Engine) {
    interface SceneData {
      scene: Scene;
      advancedTexture: GUI.AdvancedDynamicTexture;
      button1: GUI.Button;
      //text1: GUI.TextBlock;
      camera: Camera;
    }
  
    let scene = new Scene(engine);
    let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI", true);
    var button1 = createSceneButton(scene,"but1", "Back", 1,"-900px", "-450px", advancedTexture);
    text1 = createTextBlock("text1", "Kills: ", "900px", "-450px");
    advancedTexture.addControl(text1);
    var camera = createArcRotateCamera(scene);

    //const textBlock = new GUI.Rectangle();
    //  textBlock.background = "#76d56e88";
    //  textBlock.thickness = 0;
    //  textBlock.addControl(text1);

 
    let that: SceneData = {
      scene,
      advancedTexture,
      button1,
      camera
    };
    
    return that;
  } 

  export function setText(newtext: string) {
        text1.text = newtext;
  }
  

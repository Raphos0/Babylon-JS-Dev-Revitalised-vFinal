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

  //----------------------------------------------------
  function createSceneButton(scene: Scene, name: string, note: string, index: number, x: string, y: string, advtex: GUI.AdvancedDynamicTexture) {
    let button = GUI.Button.CreateSimpleButton(name, note);
        button.left = x;
        button.top = y;
        button.width = "110px";
        button.height = "40px";
        button.color = "darkred";
        button.cornerRadius = 20;
        button.background = "grey";

        button.onPointerUpObservable.add(function() {
            console.log("THE BUTTON HAS BEEN CLICKED");
            setSceneIndex(index -1);
        });
        advtex.addControl(button);
        return button;
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
    var button1 = createSceneButton(scene,"but1", "Back", 1,"100px", "80px", advancedTexture);
    button1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    button1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    advancedTexture.addControl(button1);
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
  

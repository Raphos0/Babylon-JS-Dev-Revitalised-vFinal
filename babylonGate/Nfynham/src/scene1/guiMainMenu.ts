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
    let buttonImage = GUI.Button.CreateImageButton(name, note, "./assets/mainmenu/GoB_Button.png");
      buttonImage.left = x;
      buttonImage.top = y;
      buttonImage.width = "393px";
      buttonImage.height = "100px";
      buttonImage.image!.width = "393px";
      buttonImage.image!.height = "100px";
      buttonImage.cornerRadius = 20;
      buttonImage.color = "grey";


    buttonImage.onPointerUpObservable.add(function() {
        console.log("THE BUTTON HAS BEEN CLICKED");
        setSceneIndex(index -1);
    });
    advtex.addControl(buttonImage);
    return buttonImage;
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
  export default function menuScene1(engine: Engine) {
    interface SceneData {
      scene: Scene;
      advancedTexture: GUI.AdvancedDynamicTexture;
      button1: GUI.Button;
      camera: Camera;
    }
  
    let scene = new Scene(engine);
    let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI", true);
    var button1 = createSceneButton(scene,"but2", "", 2,"0", "250px", advancedTexture);
    var camera = createArcRotateCamera(scene);

 
    let that: SceneData = {
      scene,
      advancedTexture,
      button1,
      camera
    };
    
    return that;
  } 

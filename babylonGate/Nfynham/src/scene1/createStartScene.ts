// import "@babylonjs/core/Debug/debugLayer";
// import "@babylonjs/inspector";
import {
    Scene,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    SpriteManager,
    Sprite,
    Mesh,
    Light,
    Camera,
    Engine,
  } from "@babylonjs/core";
  
  
  function createBox(scene: Scene) {
    let box = MeshBuilder.CreateBox("box",{size: 1}, scene);
    box.position.y = 3;
    return box;
  }

  
  function createLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    return light;
  }
  
  function createSphere(scene: Scene) {
    let sphere = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 2, segments: 32 },
      scene,
    );
    sphere.position.y = 1;
    return sphere;
  }
  
  function createGround(scene: Scene) {
    let ground = MeshBuilder.CreateGround(
      "ground",
      { width: 6, height: 6 },
      scene,
    );
    return ground;
  }

  function createMainMenuBG(scene: Scene) {
    const spriteManagerMainMenu = new SpriteManager(
      "MainMenuBG",
      "./assets/mainmenu/GoB_MainMenu.png",
      1,
      { width: 2560, height: 1440 },
      scene
    );
    const mainMenuBG = new Sprite("MainMenuBG", spriteManagerMainMenu);
    mainMenuBG.position = new Vector3(0, 0, 0);
    mainMenuBG.width = 18;
    mainMenuBG.height = 8.8;  
  }
  
  function createArcRotateCamera(scene: Scene) {
    let camAlpha = 0,
      camBeta = 0,
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

    //camera.attachControl(true); -- camera rotation is disabled as it is not needed for the main menu
    return camera;
  }
  
  export default function createStartScene(engine: Engine) {
    interface SceneData {
      scene: Scene;
      box?: Mesh;
      light?: Light;
      sphere?: Mesh;
      ground?: Mesh;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    // that.scene.debugLayer.show();
  
    //that.box = createBox(that.scene);
    that.light = createLight(that.scene);
    //that.sphere = createSphere(that.scene);
    createMainMenuBG(that.scene);
    //that.ground = createGround(that.scene);
    that.camera = createArcRotateCamera(that.scene);
    return that;
  }

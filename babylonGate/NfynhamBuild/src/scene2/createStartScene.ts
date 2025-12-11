//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF/2.0";
import HavokPhysics, { HavokPhysicsWithBindings } from "@babylonjs/havok";
import { createCharacterController } from "./createCharacterController";

import {
    Scene,
    ArcRotateCamera,
    AssetsManager,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Mesh,
    Camera,
    Engine,
    HavokPlugin,
    SceneLoader,
    AbstractMesh,
    ISceneLoaderAsyncResult,
    PhysicsAggregate,
    PhysicsShapeType,
    Light,
    PointLight,
    ShadowGenerator,
    StandardMaterial,
    Color3,
    Texture,
    CubeTexture,
  } from "@babylonjs/core";
    import { taaPixelShader } from "@babylonjs/core/Shaders/taa.fragment";
  
  function createLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.05;
    light.diffuse = new Color3(0.41, 0.47, 0.62);
    return light;
  }

  function createPointLight(scene: Scene, x: number, y: number, z: number) {
    const pointLight = new PointLight("pointLight", new Vector3(0, 0, 0), scene);
    pointLight.intensity = 10;
    pointLight.position.x = x;
    pointLight.position.y = y;
    pointLight.position.z = z;
    pointLight.diffuse = new Color3(0.79, 0.45, 0.2);
    return pointLight;
  }

  function createLampLights(scene: Scene)
  {
    createPointLight(scene, -2.74, 5.5, -5.1);
    createPointLight(scene, -16.97, 5.5, 5.46);
    createPointLight(scene, -54.13, 13, -26.31);
    createPointLight(scene, -34.75, 13, -22.85);
    createPointLight(scene, -29.57, 13, -94.01);
    createPointLight(scene, 14.86, 8.8, -73.89);
    createPointLight(scene, 38.2, 8.8, -93.57);
    createPointLight(scene, 43.93, 8.8, -81.19);
    createPointLight(scene, 60.01, 8.8, -85.42);
  }

  function createShadowGenerator(light: PointLight, sphere: Mesh ,box: Mesh, nailBlade: Mesh, nailHandle: Mesh, needleBlade: Mesh, needleHandle: Mesh, needleThread: Mesh) {
    const shadower = new ShadowGenerator(1024, light);
    const sm : any = shadower.getShadowMap();
    sm.renderList.push(sphere, box, nailBlade, nailHandle, needleBlade, needleHandle, needleThread);

    shadower.setDarkness(0.1);
    shadower.useBlurExponentialShadowMap = true;
    shadower.blurScale = 2;
    shadower.blurBoxOffset = 1;
    shadower.useKernelBlur = true;
    shadower.blurKernel = 32;
    shadower.bias = 0;
    return shadower;
}
  
  function createSky(scene: Scene) {
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 300 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture(
      "./assets/skybox/DeepDusk",
      scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode =
      Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    skybox.position = new Vector3(13.1, 0, -54); // Position skybox at the center of the scene

    return skybox;
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
    camera.attachControl(true);
    return camera;
  }

  function createRedMan(scene: Scene, x: number, y: number, z: number) {
    let item: Promise<void | ISceneLoaderAsyncResult> =
    SceneLoader.ImportMeshAsync(
      "",
      "./assets/hunter/",
      "RedManBabylonJS.gltf",
      scene
    );

  item.then((result) => {
    let redMan: AbstractMesh = result!.meshes[0];
    redMan.position.x = x;
    redMan.position.y = y; 
    redMan.position.z = z;
    redMan.scaling = new Vector3(1, 1, 1); // Sets scale to 1
    redMan.rotation = new Vector3(0, 0, 0); // Resets rotation

    //let redManAggregate = new PhysicsAggregate(redMan, PhysicsShapeType.BOX, {mass: 0.2, restitution:0.1, friction:0.4}, scene);
    //redManAggregate.body.setCollisionCallbackEnabled(true);
  });

    return item;
  }

  function createGround(scene: Scene) {
  let ground = MeshBuilder.CreateGround(
    "ground",
    { width: 16, height: 16 },
    scene
  );

  var texture = new StandardMaterial("grass", scene);
    texture.ambientTexture = new Texture(
      "./assets/textures/grass.jpg",
      scene
    );
    texture.diffuseColor = new Color3(1, 1, 1);
    ground.material = texture;
  
    // Create a static box shape.
  let groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);
  return groundAggregate;
}

  function importAssets(scene: Scene) {
    const assetsManager = new AssetsManager(scene);

    // ============================ GAME MAP ============================
    const gameMap = assetsManager.addMeshTask(
      "gameMap task",
      "",
      "./assets/gameMap/",
      "Nfynham.gltf"
    );
    
    gameMap.onSuccess = function(task){
      task.loadedMeshes[0].position = new Vector3(0,5,0);
      task.loadedMeshes[0].scaling = new Vector3(1,1,-1);
      task.loadedMeshes[0].rotation = new Vector3(0, 0, 0);

      // ensures all child meshes are visible, as a failsafe
      task.loadedMeshes.forEach((mesh: any) => {
      mesh.isVisible = true;
      });

      // Merge all submeshes into a single mesh to create physics aggregate on whole game map
      task.loadedMeshes.forEach((mesh: any) => {
        if (mesh instanceof AbstractMesh && mesh.geometry) // checks if "mesh" is an Abstract Mesh (should include all types of complex meshes) and if "mesh" contains geometry
        {
          const compAggregate = new PhysicsAggregate( // creates a physics aggregate for this component of gameMap
            mesh,
            PhysicsShapeType.MESH,
            { mass: 0 }, // mass: 0 to make it a static object
            scene
          );
 
          console.log("Physics aggregate created for", mesh.name);
        }
      });
    }

    return assetsManager;
  }

  export default async function createScene2(engine: Engine) {
  interface SceneData {
    scene: Scene;
    light?: HemisphericLight;
    sky?: Mesh
    camera?: Camera;
  }

  let that: SceneData = { scene: new Scene(engine) };

  let initializedHavok: any;

  HavokPhysics().then((havok) => {
    initializedHavok = havok;
  });

  const havokInstance: HavokPhysicsWithBindings = await HavokPhysics();
  const hk: HavokPlugin = new HavokPlugin(true, havokInstance);
  that.scene.enablePhysics(new Vector3(0, -9.81, 0), hk);

  //that.scene.debugLayer.show();

  that.light = createLight(that.scene);
  that.sky = createSky(that.scene);
  that.camera = createArcRotateCamera(that.scene);
  createLampLights(that.scene);
  createRedMan(that.scene, 2, 6, 2);

  // creates a player reference for the camera to follow
  const player = await createCharacterController(that.scene);

  // updates camera target every frame to follow player position
  that.scene.onBeforeRenderObservable.add(() => {
    (that.camera as any).setTarget(player.displayCapsule.position);  // sets camera target to player position
  });

  const assetsManager = importAssets(that.scene);
  assetsManager.load();
  return that;
}
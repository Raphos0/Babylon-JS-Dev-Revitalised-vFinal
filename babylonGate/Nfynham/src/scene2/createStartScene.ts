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
    PhysicsCharacterController,
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
    light.intensity = 0.1;
    light.diffuse = new Color3(0.41, 0.47, 0.62);
    return light;
  }

  function createPointLight(scene: Scene, x: number, y: number, z: number) {
    const pointLight = new PointLight("pointLight", new Vector3(0, 0, 0), scene);
    pointLight.intensity = 20;
    pointLight.position.x = x;
    pointLight.position.y = y;
    pointLight.position.z = z;
    pointLight.diffuse = new Color3(1, 0.4, 0.1);
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

  async function createRedMan(scene: Scene, posx: number, posy: number, posz: number, roty:number): Promise<PhysicsAggregate> {
    const result = await SceneLoader.ImportMeshAsync(
      "",
      "./assets/hunter/",
      "RedManBabylonJS.gltf",
      scene
    );

    let compiledMesh : AbstractMesh[] = [];
    result.meshes.forEach((mesh: any) => {
      if (mesh instanceof AbstractMesh && mesh.geometry) // seeks meshes in children of the object which have geometry, to find the actual model
      {
        compiledMesh.push(mesh); 
      }
    });
    let redMan: AbstractMesh = compiledMesh[0]; // a bit meta, but as I know this model only has one mesh with geometry, I only use the first mesh

    redMan.position = new Vector3(posx, posy, posz); // Sets position as defined
    redMan.scaling = new Vector3(1, 1, 1); // Sets scale to 1
    redMan.rotation = new Vector3(0, roty+Math.PI, 0); // Only sets Y rotation to horizontally rotate the object to the defined angle

    const redManAggregate = new PhysicsAggregate(redMan, PhysicsShapeType.MESH, {mass: 0.5, restitution:0.1, friction:0.4}, scene); // Assigns the value for the physics aggregate (0 mass to make it static)
    redManAggregate.body.setCollisionCallbackEnabled(true); // Enables collision callbacks for collision.ts
    return redManAggregate;
  }

  async function createRedMen(scene: Scene): Promise<PhysicsAggregate[]> {
    let redMenList: PhysicsAggregate[] = [];

    redMenList.push(await createRedMan(scene, 20.29, -0.515, 2.45, -Math.PI*0.38));
    redMenList.push(await createRedMan(scene, 20.4, -0.515, -2, -Math.PI*0.75));
    redMenList.push(await createRedMan(scene, 13.92, 1.485, -14.6, -Math.PI*0.9));
    redMenList.push(await createRedMan(scene, 52.14, 6.8, -21.04, -Math.PI*1.5));
    redMenList.push(await createRedMan(scene, 44.39, 6.8, -32.56, -Math.PI*0.95));
    redMenList.push(await createRedMan(scene, 33.81, 6.8, -28.92, -Math.PI*0.77));
    redMenList.push(await createRedMan(scene, 40.55, 6.8, -58.99, -Math.PI*0.83));
    redMenList.push(await createRedMan(scene, 38.47, 6.8, -81.21, -Math.PI*1.3));
    redMenList.push(await createRedMan(scene, 33.68, 6.8, -91.22, -Math.PI*0.9));
    redMenList.push(await createRedMan(scene, 27.6, 6.8, -116.43, -Math.PI*1.18));
    redMenList.push(await createRedMan(scene, 10.16, 5.93, -116.33, -Math.PI*0.59));
    redMenList.push(await createRedMan(scene, 8.44, 5.68, -121.26, -Math.PI*1.22));
    redMenList.push(await createRedMan(scene, -3, 3.85, -115.1, -Math.PI*0.37));
    redMenList.push(await createRedMan(scene, 10.55, 3.77, -78.19, -Math.PI*0.76));
    redMenList.push(await createRedMan(scene, -11.9, 2.52, -75.1, -Math.PI*0.25));
    redMenList.push(await createRedMan(scene, -10.55, 2.52, -89.6, -Math.PI*0.76));
    redMenList.push(await createRedMan(scene, -21, 2.52, -116.4, -Math.PI*0.77));
    redMenList.push(await createRedMan(scene, -37.5, 2.52, -89, -Math.PI*0.72));
    redMenList.push(await createRedMan(scene, -51.3, 2.52, -82.5, -Math.PI*0.59));

    return redMenList;
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
    player?: PhysicsCharacterController;
    redmen?: PhysicsAggregate[];
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
  that.redmen = await createRedMen(that.scene);

  // creates a player reference for the camera to follow
  let playerRef = await createCharacterController(that.scene);
  that.player = playerRef.characterController; // creates a reference of the player's character controller in the scene data for collision.ts

  // updates camera target every frame to follow player position
  that.scene.onBeforeRenderObservable.add(() => {
    (that.camera as any).setTarget(playerRef.displayCapsule.position);  // sets camera target to player position
  });

  const assetsManager = importAssets(that.scene);
  assetsManager.load();
  return that;
}
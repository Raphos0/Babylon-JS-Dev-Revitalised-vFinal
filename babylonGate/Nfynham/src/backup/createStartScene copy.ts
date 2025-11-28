//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF/2.0";
import HavokPhysics, { HavokPhysicsWithBindings } from "@babylonjs/havok";

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
    PhysicsCharacterController,
    Quaternion,
    CharacterSupportedState,
    KeyboardEventTypes,
    PhysicsAggregate,
    PhysicsShapeType,
    Light,
    PointLight,
    ShadowGenerator,
    StandardMaterial,
    Color3,
    Texture,
  } from "@babylonjs/core";
    import { taaPixelShader } from "@babylonjs/core/Shaders/taa.fragment";


    function createMaterial(scene: Scene, diffuse: Color3, specular: Color3, emissive: Color3, ambient: Color3) {
      const myMaterial = new StandardMaterial("myMaterial", scene);

      myMaterial.diffuseColor = diffuse;
      myMaterial.specularColor = specular;
      myMaterial.emissiveColor = emissive;
      myMaterial.ambientColor = ambient;

      return myMaterial;
    }

    function createGroundMaterial(scene: Scene, diffuse: Color3, specular: Color3, emissive: Color3, ambient: Color3) {
      const myMaterial = new StandardMaterial("myMaterial", scene);

      myMaterial.diffuseColor = diffuse;
      myMaterial.specularColor = specular;
      myMaterial.emissiveColor = emissive;
      myMaterial.ambientColor = ambient;
      myMaterial.ambientTexture = new Texture("./assets/nature/grass.jpg", scene);

      return myMaterial;
    }

    function createSceneMaterial(scene: Scene) {
      scene.ambientColor = new Color3(0, 0, 1);
    }
  
  function createLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    return light;
  }

  function createPointLight(scene: Scene) {
    const pointLight = new PointLight("pointLight", new Vector3(0, 10, 0), scene);
    pointLight.intensity = 0.7;
    pointLight.position.y = 5;
    return pointLight;
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
  
function createGround(scene: Scene) {
  let ground = MeshBuilder.CreateGround(
    "ground",
    { width: 16, height: 16 },
    scene
  );
  
    // Create a static box shape.
  let groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);
  return ground;
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

  function importAssets(scene: Scene) {
    const assetsManager = new AssetsManager(scene);
    const tree1 = assetsManager.addMeshTask(
      "tree1 task",
      "",
      "./assets/nature/",
      "TwistedTree_1.gltf"
    );
    const tree2 = assetsManager.addMeshTask(
      "tree2 task",
      "",
      "./assets/nature/",
      "TwistedTree_2.gltf"
    );
    const tree3 = assetsManager.addMeshTask(
      "tree3 task",
      "",
      "./assets/nature/",
      "TwistedTree_4.gltf"
    );
    const rock1 = assetsManager.addMeshTask(
      "rock1 task",
      "",
      "./assets/nature/",
      "Rock_Medium_1.gltf"
    );
    const rockPath1 = assetsManager.addMeshTask(
      "rockPath1 task",
      "",
      "./assets/nature/",
      "RockPath_Round_Small_1.gltf"
    );
     const clover1 = assetsManager.addMeshTask(
      "clover1 task",
      "",
      "./assets/nature/",
      "Clover_1.gltf"
    );
    const clover2 = assetsManager.addMeshTask(
      "clover2 task",
      "",
      "./assets/nature/",
      "Clover_2.gltf"
    );
    tree1.onSuccess = function(task){
      task.loadedMeshes[0].position = new Vector3(-3,0,2);
      task.loadedMeshes[0].scaling = new Vector3(0.2,0.2,0.2);
      task.loadedMeshes[0].rotation = new Vector3(0,Math.PI/4,0);

      const tree1Clone = task.loadedMeshes[0].clone("tree1Clone", null);
      tree1Clone!.position = new Vector3(4,0,-1);
      tree1Clone!.scaling = new Vector3(0.2,0.2,0.2);
      tree1Clone!.rotation = new Vector3(0,-Math.PI/3,0);
    }
    tree2.onSuccess = function(task){
      task.loadedMeshes[0].position = new Vector3(0,0,0);
      task.loadedMeshes[0].scaling = new Vector3(0.5,0.5,0.5);
    }
    tree3.onSuccess = function(task){
      task.loadedMeshes[0].position = new Vector3(-3.2,0,-3.6);
      task.loadedMeshes[0].scaling = new Vector3(0.2,0.2,0.2);
      task.loadedMeshes[0].rotation = new Vector3(0,Math.PI/2,0);

      const tree3Clone = task.loadedMeshes[0].clone("tree3Clone", null);
      tree3Clone!.position = new Vector3(1.3,0,3.2);
      tree3Clone!.scaling = new Vector3(0.2,0.2,0.2);
      tree3Clone!.rotation = new Vector3(0,-Math.PI/5,0);
    }
    rock1.onSuccess = function(task){
      task.loadedMeshes[0].position = new Vector3(5,0,5);
      task.loadedMeshes[0].scaling = new Vector3(0.5,0.5,0.5);
    }
    rockPath1.onSuccess = function(task){
      task.loadedMeshes[0].position = new Vector3(2,0,2);
      task.loadedMeshes[0].scaling = new Vector3(0.7,0.7,0.7);

      // Corners of path
      const rockPath1CloneCorner1 = task.loadedMeshes[0].clone("rockPath1CloneCorner1", null);
      rockPath1CloneCorner1!.position = new Vector3(2,0,-2);
      rockPath1CloneCorner1!.scaling = new Vector3(0.7,0.7,0.7);
      const rockPath1CloneCorner2 = task.loadedMeshes[0].clone("rockPath1CloneCorner2", null);
      rockPath1CloneCorner2!.position = new Vector3(-2,0,-2);
      rockPath1CloneCorner2!.scaling = new Vector3(0.7,0.7,0.7);
      const rockPath1CloneCorner3 = task.loadedMeshes[0].clone("rockPath1CloneCorner3", null);
      rockPath1CloneCorner3!.position = new Vector3(-2,0,2);
      rockPath1CloneCorner3!.scaling = new Vector3(0.7,0.7,0.7);

      // Sides of path
      const rockPath1CloneSide1 = task.loadedMeshes[0].clone("rockPath1CloneSide1", null);
      rockPath1CloneSide1!.position = new Vector3(0,0,2);
      rockPath1CloneSide1!.scaling = new Vector3(0.7,0.7,0.7);
      const rockPath1CloneSide2 = task.loadedMeshes[0].clone("rockPath1CloneSide2", null);
      rockPath1CloneSide2!.position = new Vector3(2,0,0);
      rockPath1CloneSide2!.scaling = new Vector3(0.7,0.7,0.7);
      const rockPath1CloneSide3 = task.loadedMeshes[0].clone("rockPath1CloneSide3", null);
      rockPath1CloneSide3!.position = new Vector3(0,0,-2);
      rockPath1CloneSide3!.scaling = new Vector3(0.7,0.7,0.7);
      const rockPath1CloneSide4 = task.loadedMeshes[0].clone("rockPath1CloneSide4", null);
      rockPath1CloneSide4!.position = new Vector3(-2,0,0);
      rockPath1CloneSide4!.scaling = new Vector3(0.7,0.7,0.7);    

      const rockPath1CloneSide11 = task.loadedMeshes[0].clone("rockPath1CloneSide11", null);
      rockPath1CloneSide11!.position = new Vector3(1,0,2);
      rockPath1CloneSide11!.scaling = new Vector3(0.7,0.7,0.7);
      const rockPath1CloneSide12 = task.loadedMeshes[0].clone("rockPath1CloneSide12", null);
      rockPath1CloneSide12!.position = new Vector3(-1,0,2);
      rockPath1CloneSide12!.scaling = new Vector3(0.7,0.7,0.7);

      const rockPath1CloneSide21 = task.loadedMeshes[0].clone("rockPath1CloneSide21", null);
      rockPath1CloneSide21!.position = new Vector3(2,0,1);
      rockPath1CloneSide21!.scaling = new Vector3(0.7,0.7,0.7);
      const rockPath1CloneSide22 = task.loadedMeshes[0].clone("rockPath1CloneSide22", null);
      rockPath1CloneSide22!.position = new Vector3(2,0,-1);
      rockPath1CloneSide22!.scaling = new Vector3(0.7,0.7,0.7);

      const rockPath1CloneSide31 = task.loadedMeshes[0].clone("rockPath1CloneSide31", null);
      rockPath1CloneSide31!.position = new Vector3(1,0,-2);
      rockPath1CloneSide31!.scaling = new Vector3(0.7,0.7,0.7);
      const rockPath1CloneSide32 = task.loadedMeshes[0].clone("rockPath1CloneSide32", null);
      rockPath1CloneSide32!.position = new Vector3(-1,0,-2);
      rockPath1CloneSide32!.scaling = new Vector3(0.7,0.7,0.7);

      const rockPath1CloneSide41 = task.loadedMeshes[0].clone("rockPath1CloneSide41", null);
      rockPath1CloneSide41!.position = new Vector3(-2,0,1);
      rockPath1CloneSide41!.scaling = new Vector3(0.7,0.7,0.7);
      const rockPath1CloneSide42 = task.loadedMeshes[0].clone("rockPath1CloneSide42", null);
      rockPath1CloneSide42!.position = new Vector3(-2,0,-1);
      rockPath1CloneSide42!.scaling = new Vector3(0.7,0.7,0.7);
    }
    clover1.onSuccess = function(task){
      task.loadedMeshes[0].position = new Vector3(1,0,-1);
      task.loadedMeshes[0].scaling = new Vector3(0.5,0.5,0.5);

      const clover1Clone1 = task.loadedMeshes[0].clone("clover1Clone1", null);
      clover1Clone1!.position = new Vector3(-1.3,0,1.3);
      clover1Clone1!.scaling = new Vector3(0.5,0.5,0.5);
      clover1Clone1!.rotation = new Vector3(0,Math.PI/5,0);

      const clover1Clone2 = task.loadedMeshes[0].clone("clover1Clone2", null);
      clover1Clone2!.position = new Vector3(-0.7,0,0.7);
      clover1Clone2!.scaling = new Vector3(0.5,0.5,0.5);
      clover1Clone2!.rotation = new Vector3(0,Math.PI/3,0);

      const clover1Clone3 = task.loadedMeshes[0].clone("clover1Clone3", null);
      clover1Clone3!.position = new Vector3(-0.7,0,1.3);
      clover1Clone3!.scaling = new Vector3(0.5,0.5,0.5);
      clover1Clone3!.rotation = new Vector3(0,Math.PI/4,0);

      const clover1Clone4 = task.loadedMeshes[0].clone("clover1Clone4", null);
      clover1Clone4!.position = new Vector3(-1.3,0,0.7);
      clover1Clone4!.scaling = new Vector3(0.5,0.5,0.5);
      clover1Clone4!.rotation = new Vector3(0,Math.PI/3,0);

    }
    clover2.onSuccess = function(task){
      task.loadedMeshes[0].position = new Vector3(-1,0,1);
      task.loadedMeshes[0].scaling = new Vector3(0.5,0.5,0.5);

      const clover2Clone1 = task.loadedMeshes[0].clone("clover2Clone1", null);
      clover2Clone1!.position = new Vector3(1.3,0,-1.3);
      clover2Clone1!.scaling = new Vector3(0.5,0.5,0.5);
      clover2Clone1!.rotation = new Vector3(0,Math.PI/6,0);

      const clover2Clone2 = task.loadedMeshes[0].clone("clover2Clone2", null);
      clover2Clone2!.position = new Vector3(0.7,0,-0.7);
      clover2Clone2!.scaling = new Vector3(0.5,0.5,0.5);
      clover2Clone2!.rotation = new Vector3(0,Math.PI/5,0);

      const clover2Clone3 = task.loadedMeshes[0].clone("clover2Clone3", null);
      clover2Clone3!.position = new Vector3(0.7,0,-1.3);
      clover2Clone3!.scaling = new Vector3(0.5,0.5,0.5);
      clover2Clone3!.rotation = new Vector3(0,Math.PI/2,0);

      const clover2Clone4 = task.loadedMeshes[0].clone("clover2Clone4", null);
      clover2Clone4!.position = new Vector3(1.3,0,-0.7);
      clover2Clone4!.scaling = new Vector3(0.5,0.5,0.5);
      clover2Clone4!.rotation = new Vector3(0,Math.PI/3,0);

    }

    // ========================= HUNTER ASSET =========================
    const hunter = assetsManager.addMeshTask(
      "hunter task",
      "",
      "./assets/hunter/",
      "HunterRig2.gltf"
    );
    hunter.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(0, 0, -6);
      task.loadedMeshes[0].scaling = new Vector3(0.02, 0.02, 0.02);
      task.loadedMeshes[0].rotation = new Vector3(0, Math.PI, 0);
    }

    assetsManager.onTaskErrorObservable.add(function (task){
      console.log("task " + task.name + " failed: " + task.errorObject.message);
    });

    return assetsManager;
  }

  export default async function createStartScene(engine: Engine) {
  interface SceneData {
    scene: Scene;
      plight?: PointLight;
      light?: HemisphericLight;
      ground?: Mesh;
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
    that.plight = createPointLight(that.scene);
    that.ground = createGround(that.scene);
    that.camera = createArcRotateCamera(that.scene);

  const assetsManager = importAssets(that.scene);
  assetsManager.load();
  return that;
}
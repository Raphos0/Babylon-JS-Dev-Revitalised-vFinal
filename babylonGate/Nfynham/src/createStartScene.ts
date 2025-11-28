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
    SpecularPowerToRoughness,
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
    pointLight.position.y = 8;
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

  function createBox1(scene: Scene) {
    let box = MeshBuilder.CreateBox("box", { width: 1, height: 1 }, scene);
    box.position.x = -1;
    box.position.y = 3;
    box.position.z = 1;

    var texture = new StandardMaterial("rock", scene);
    texture.ambientTexture = new Texture(
      "./assets/textures/rock.png",
      scene
    );
    texture.diffuseColor = new Color3(1, 1, 1);
    box.material = texture;
    let box1Aggregate = new PhysicsAggregate(box, PhysicsShapeType.BOX, {mass: 0.2, restitution:0.1, friction:0.4}, scene);
    box1Aggregate.body.setCollisionCallbackEnabled(true);
    return box1Aggregate;
  }

  function createBox2(scene: Scene) {
    let box = MeshBuilder.CreateBox("box", { width: 1, height: 1 }, scene);
    box.position.x = -0.7;
    box.position.y = 5;
    box.position.z = 1;

    var texture = new StandardMaterial("rock", scene);
    texture.ambientTexture = new Texture(
      "./assets/textures/rock.png",
      scene
    );
    texture.diffuseColor = new Color3(1, 1, 1);
    box.material = texture;
    let box2Aggregate = new PhysicsAggregate(box, PhysicsShapeType.BOX, {mass: 0.2, restitution:0.1, friction:0.4}, scene);
    box2Aggregate.body.setCollisionCallbackEnabled(true);
    return box2Aggregate;
  }

  function importAssets(scene: Scene) {
    const assetsManager = new AssetsManager(scene);

    // ============================ GAME MAP ============================
    
    // Optional: explicit fetch check (logs HTTP status / content-type)
    fetch("./assets/gameMap/Nfynham.gltf").then(res => {
      console.log("Nfynham.gltf fetch check:", res.status, res.headers.get("content-type"));
    }).catch(err => {
      console.error("Nfynham.gltf fetch error:", err);
    });

    const gameMap = assetsManager.addMeshTask(
      "gameMap task",
      "",
      "./assets/gameMap/",
      "Nfynham.gltf"
    );
    
    gameMap.onSuccess = function(task){
      task.loadedMeshes[0].position = new Vector3(0,5,0);
      task.loadedMeshes[0].scaling = new Vector3(-1,1,-1);
      task.loadedMeshes[0].rotation = new Vector3(0, -Math.PI/2, 0);

      // ensures all child meshes are visible, as a failsafe
      task.loadedMeshes.forEach((mesh: any) => {
      mesh.isVisible = true;
      });

      // Merge all submeshes into a single mesh to create physics aggregate on whole game map
      task.loadedMeshes.forEach((mesh: any) => {
        if (mesh instanceof Mesh && mesh.geometry) // checks if "mesh" is a Mesh (if it is constructed from the Mesh class) and if "mesh" contains geometry
        {
          const compAggregate = new PhysicsAggregate( // creates a physics aggregate for this component of gameMap
            mesh,
            PhysicsShapeType.MESH,
            { mass: 0 }, // mass: 0 to make it a static object
            scene
          );
 
          console.log("Physics aggregate created for", mesh.name);
        }
        
        // else, attempts to make a physics aggregate anyways using a BOX shape type
        else{
          const compAggregate = new PhysicsAggregate( 
            mesh,
            PhysicsShapeType.BOX,
            { mass: 0 },
            scene
          );
        }
      });
    }

    // ========================= HUNTER ASSET =========================

    // Optional: explicit fetch check (logs HTTP status / content-type)
    fetch("./assets/hunter/HunterBabylonJS.gltf").then(res => {
      console.log("HunterBabylonJS.gltf fetch check:", res.status, res.headers.get("content-type"));
    }).catch(err => {
      console.error("HunterBabylonJS.gltf fetch error:", err);
    });

    const hunter = assetsManager.addMeshTask(
      "hunter task",
      "",
      "./assets/hunter/",
      "HunterBabylonJS.gltf"
    );
    hunter.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(6, 0, -6);
      task.loadedMeshes[0].scaling = new Vector3(1, 1, 1);
      task.loadedMeshes[0].rotation = new Vector3(0, -Math.PI/2, 0);
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
      ground?: PhysicsAggregate;
      box1?: PhysicsAggregate;
      box2?: PhysicsAggregate;
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
  //that.plight = createPointLight(that.scene);
  //that.ground = createGround(that.scene);
  //that.box1 = createBox1(that.scene);
  //that.box2 = createBox2(that.scene);
  that.camera = createArcRotateCamera(that.scene);

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
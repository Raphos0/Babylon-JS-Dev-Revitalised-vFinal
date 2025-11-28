//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";
import {
    Scene,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    PointLight,
    SpotLight,
    ShadowGenerator,
    MeshBuilder,
    Mesh,
    Light,
    Camera,
    Engine,
    StandardMaterial,
    Color3,
    Texture,
    ThinScreenSpaceCurvaturePostProcess,
    DirectionalLight,
    CreateGround,
  } from "@babylonjs/core";


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
      myMaterial.ambientTexture = new Texture("src/grass.jpg", scene);

      return myMaterial;
    }

    function createSceneMaterial(scene: Scene) {
      scene.ambientColor = new Color3(0, 0, 1);
    }

    function createSphere(scene: Scene) {
      const sphere = MeshBuilder.CreateSphere(
        "sun",
        { diameter: 3, diameterY: 3, segments: 8 },
        scene,
      );
      sphere.position.x = 0;
      sphere.position.y = 0;
      sphere.material = createMaterial(
      scene,
      new Color3(0.8 ,0.8 , 1),    // diffuse
      new Color3(0.5, 0.5, 0.5),  // specular
      new Color3(0.2, 0.2, 0.2),    // emissive
      new Color3(0.2, 0.2, 0.2)   // ambient
    );
      return sphere;
    }

    function createEgg(scene: Scene) {
    const egg = MeshBuilder.CreateSphere(
      "egg",
      { diameter: 1, diameterY: 1.5, segments: 8 },
      scene,
    );
    egg.position.x = -2;
    egg.position.y = 1;
    egg.material = createMaterial(
      scene,
      new Color3(1, 0.7, 0.2),    // diffuse
      new Color3(0.5, 0.5, 0.5),  // specular
      new Color3(0, 0, 0),    // emissive
      new Color3(0.2, 0.2, 0.2)   // ambient
    );
    return egg;
  }
  
  function createBox(scene: Scene) {
    const box = MeshBuilder.CreateBox(
      "box",
      {size: 1}, scene
    );
    box.position.x = -2;
    box.position.y = 3;
    box.material = createMaterial(
      scene,
      new Color3(0.6, 0, 0),    // diffuse
      new Color3(0.5, 0.5, 0.5),  // specular
      new Color3(0, 0, 0),    // emissive
      new Color3(0.2, 0.2, 0.2)   // ambient
    );
    return box;
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

  function createSpotLight(scene: Scene) {
    const spotLight = new SpotLight("spotLight", new Vector3(0, 10, 0), 
    new Vector3(0, -1, 0), 
    Math.PI / 3, 2, 
    scene
    );
    spotLight.intensity = 0.7;
    spotLight.position.y = -5;
    spotLight.position.x = -2;
    spotLight.angle = Math.PI / 4;
    return spotLight;
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

  function createCylinder(scene: Scene) {
    const cylinder = MeshBuilder.CreateCylinder(
      "cylinder",
      { height: 2, diameter: 1, tessellation: 16 },
      scene,
    );
    cylinder.position.x = 0;
    cylinder.position.z = -3;
    cylinder.material = createMaterial(
      scene,
      new Color3(0, 0.7, 1),    // diffuse
      new Color3(0.5, 0.5, 0.5),  // specular
      new Color3(0.15, 0.15, 0.15),    // emissive
      new Color3(0.2, 0.2, 0.2)   // ambient
    );
    return cylinder;
  }

  function createNailHandle(scene: Scene) {
    const nailHandle = MeshBuilder.CreateCylinder(
      "nailHandle",
      { height: 0.7, diameter: 0.2, tessellation: 16 },
      scene,
    );
    nailHandle.position.x = 3;
    nailHandle.position.y = 0.5;
    nailHandle.material = createMaterial(
      scene,
      new Color3(0.5, 0.3, 1),    // diffuse
      new Color3(0.5, 0.5, 0.5),  // specular
      new Color3(0.15, 0.15, 0.15),    // emissive
      new Color3(0.2, 0.2, 0.2),    // ambient
    );
    return nailHandle;
  }

  function createNailBlade(scene: Scene) {
    const nailBlade = MeshBuilder.CreateCylinder(
      "nailBlade",
      { height: 2, diameter: .8, diameterTop: 0, tessellation: 16},
      scene,
    );
    nailBlade.position.x = 3;
    nailBlade.position.y = 1.75;
    nailBlade.material = createMaterial(
      scene,
      new Color3(0.5, 0.3, 1),    // diffuse
      new Color3(0.5, 0.5, 0.5),  // specular
      new Color3(0.15, 0.15, 0.15),    // emissive
      new Color3(0.2, 0.2, 0.2),    // ambient
    );
    return nailBlade;
  }

  function createNeedleHandle(scene: Scene) {
    const needleHandle = MeshBuilder.CreateCylinder(
      "needleHandle",
      { height: 2, diameter: 0.15, tessellation: 16 },
      scene,
    );
    needleHandle.position.z = 1;
    needleHandle.position.x = 3;
    needleHandle.position.y = 1.5;
    needleHandle.material = createMaterial(
      scene,
      new Color3(0.5, 0.3, 1),    // diffuse
      new Color3(0.5, 0.5, 0.5),  // specular
      new Color3(0.15, 0.15, 0.15),    // emissive
      new Color3(0.2, 0.2, 0.2),    // ambient
    );
    return needleHandle;
  }

  function createNeedleBlade(scene: Scene) {
    const needleBlade = MeshBuilder.CreateCylinder(
      "needleBlade",
      { height: 2, diameter: 0.3, diameterTop: 0, tessellation: 16},
      scene,
    );
    needleBlade.position.z = 1;
    needleBlade.position.x = 3;
    needleBlade.position.y = 3;
    needleBlade.material = createMaterial(
      scene,
      new Color3(0.5, 0.3, 1),    // diffuse
      new Color3(0.5, 0.5, 0.5),  // specular
      new Color3(0.15, 0.15, 0.15),    // emissive
      new Color3(0.2, 0.2, 0.2),    // ambient
    );
    return needleBlade;
  }

  function createNeedleThread(scene: Scene) {
    const needleThread = MeshBuilder.CreateTorus(
      "needleThread",
      { diameter: .2, thickness: 0.1, tessellation: 16 },
      scene,
    );
    needleThread.position.z = 1;
    needleThread.position.x = 3;
    needleThread.position.y = 0.4;
    needleThread.rotation.z = Math.PI / 2;
    needleThread.material = createMaterial(
      scene,
      new Color3(0.5, 0.3, 1),    // diffuse
      new Color3(0.5, 0.5, 0.5),  // specular
      new Color3(0.15, 0.15, 0.15),    // emissive
      new Color3(0.2, 0.2, 0.2),    // ambient
    );
    return needleThread;
  }
  
function createGround(scene: Scene){
    let ground = MeshBuilder.CreateGround("ground", { width: 8, height: 8 }, scene);
    var groundMaterial = createGroundMaterial(
      scene,
      new Color3(0.8, 0.8, 0.8),    // diffuse
      new Color3(0.5, 0.5, 0.5),  // specular
      new Color3(0, 0, 0),    // emissive
      new Color3(0.2, 0.2, 0.2)   // ambient
    );
    groundMaterial.backFaceCulling = false;
    ground.material = groundMaterial;
    ground.receiveShadows = true;
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
  
  export default function createStartScene(engine: Engine) {
    interface SceneData {
      scene: Scene;
      box?: Mesh;
      light?: Light;
      plight? : PointLight;
      slight?: SpotLight;
      shadowGenerator?: ShadowGenerator;
      cylinder?: Mesh;
      nailHandle?: Mesh;
      nailBlade?: Mesh;
      needleHandle?: Mesh;
      needleBlade?: Mesh;
      needleThread?: Mesh;
      egg?: Mesh;
      sphere?: Mesh;
      ground?: Mesh;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    //that.scene.debugLayer.show();
  
    createSceneMaterial(that.scene);
    that.box =createBox(that.scene);
    that.light = createLight(that.scene);
    that.plight = createPointLight(that.scene);
    //createSpotLight(that.scene);
    that.sphere = createSphere(that.scene);
    that.cylinder = createCylinder(that.scene);
    that.nailHandle = createNailHandle(that.scene);
    that.nailBlade = createNailBlade(that.scene);
    that.needleHandle = createNeedleHandle(that.scene);
    that.needleBlade = createNeedleBlade(that.scene);
    that.needleThread = createNeedleThread(that.scene);
    that.egg = createEgg(that.scene);
    that.ground = createGround(that.scene);
    that.camera = createArcRotateCamera(that.scene);
    createShadowGenerator(that.plight, that.egg, that.box, that.nailBlade, that.nailHandle, that.needleBlade, that.needleHandle, that.needleThread);
    return that;
  }
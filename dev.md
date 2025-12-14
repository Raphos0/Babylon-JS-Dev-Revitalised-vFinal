## Babylon JS Element 5 Documentation
On this page I will discuss each component that makes up my Element 5 - "Nfynham" AKA "Gears of Blood: BabylonJS Edition"

The structure of this document will detail every file as a header and have an explanation of that file's purpose, as well as a breakdown of it's functions, along with every reference in other files and why.

### main.css
This is a basic file that holds the two styles that are used in index.ts. It defines the width and the height of the scene, and hides the header.

### interfaces.ts
This is a basic file that simply holds all of the variables in the SceneData in an exported function for all other files to reference.
This is a snippet of all the variables:
```javascript
export interface SceneData {
    scene: Scene;
    light?: Light;
    plight? : PointLight;
    shadowGenerator?: ShadowGenerator;
    ground?: PhysicsAggregate;
    camera?: Camera;
    sky?: Mesh;
    player?: PhysicsCharacterController;
    redmen: PhysicsAggregate[]
    box1?:PhysicsAggregate;
    box2?:PhysicsAggregate;
}
```
It is referenced in: 
 - scene1/createStartScene.ts, to export all variables necessary for the main menu
 - scene1/guiMainMenu.ts, to export the variables required for the main menu Image Button
 - scene2/createStartScene.ts, to export all of the variables necessary for the Nfynham main scene
 - scene2/guiBack.ts, to export the variables required for the back button

### index.ts
This is the file which loads all of the relevant data contained in the scene. It begins by creating variables for the gui elements and the engine of which the scene runs in. 
```javascript
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
```

Then, the scene data for both scenes are assigned to variables, however this time in an async operation.
```javascript
(async () => { 
scenes[0] = createScene1(eng);
scenes[1] = await createScene2(eng);
scene = scenes[0].scene;
setSceneIndex(0);
})();
```
This is so a top-level await call can be used for createScene2, as it is an async function due to it's handling with havok physics.

Finally, the exported function at the bottom is called  to set a new scene index upon a GUI button press. It first checks whether the current scene index is 1 or not (which would correlate
to the Nfynham main game scene) in order to set up collisions. Previously the character controller was also created here, however now it is created within it's own scene.
After this check, a render loop is run to load the scene called, and the corresponding GUI is also rendered afterwards.
```javascript
    export default async function setSceneIndex(i: number) {
    if(i == 1)
    {
        //createCharacterController(scenes[i].scene);
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
```
This exported function is called by:
 - scene1/guiMainMenu.ts, to call this function upon pressing the Image Button on the main menu, when the user wants to load the game scene (passes "1" index)
 - scene2/guiBack.ts, to call this function upon pressing the button in the game screen, whenever the user wishes to return to main menu (passes "0" index)

## Scene 1
### createStartScene.ts
This is the file which creates the elements of the first scene, the Main Menu of Gears of Blood. It starts off by listing a couple of functions creating the different elements of the scene, such as the light, 
camera and main menu background
```javascript
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
```
The createMainMenuBG function creates the main element of this scene, and creates an image of the background that is displayed infront of the static camera. It first creates a variable that holds a SpriteManager, which references the image of the main menu, and is set to have a capacity of 1 as only one main menu needs to exist. Then, another variable is made that creates a new sprite through using the sprite manager. The sprites position is set to 0,0,0 so it is in the center of the scene and it's width/height is configured to fit perfectly on the camera view.

Afterwards, this export function calls all of these into variables and assigns them to the scene data in interfaces.ts
```javascript
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
  
    that.light = createLight(that.scene);
    createMainMenuBG(that.scene);
    that.camera = createArcRotateCamera(that.scene);
    return that;
  }
```
It first declares the variables from scene data with the undefined modifier so the "that" variable can be assigned to hold the scene data, then simply assigns the different elements of the scene data through calling the associated functions.
This function is called by index.ts to create a variable that holds this scene's data, so it may be loaded on a render loop

### guiMainMenu.ts
This is the file that creates the button for the main menu. It starts off by defining the function that creates the button, requiring a name, "note"(what text the button holds) and advanced texture reference, among other references.
```javascript
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
```
The different properties of the button are then defined and an onPointerUpObservable function is called, to perform logic when the button is pressed. in this case, it calls the setSceneIndex function from index.ts as stated previously.

The export function then creates variables for the scene, advanced  texture, button and camera which are assigned to the SceneData. 

The function is then called by index.ts to create a variable for it, so it can be rendered and allow the player to enter the game scene.

## Scene 2
### bakedAnimations.ts
This file is not currently in use by the project in a meaningful way, as I was not able to get animations working on my custom player model. However, this file contains a multitude of export functions which would be referenced by createCharacterController.ts to create baked animations for the player character, and to play them upon inputs.

### collisions.ts
This file handles the interactions between the events that occour during collisions between two physics objects. It contains two functions that define collision callbacks which were used during testing to detect whether collisions were being registered between two objects. There were also plans to implement a collision callback when the player collides with a specific object, however I could not figure out how to detect this collision on the player's side, even after assigning their own physics aggregate. 
```javascript
// Collision callback function
const collideCB = (collision: {
  collider: { transformNode: { name: any } };
  collidedAgainst: { transformNode: { name: any } };
  point: any;
  distance: any;
  impulse: any;
  normal: any;
}): void => {
  //console.log(
  //  "collideCB",
  //  collision.collider.transformNode.name,
  //  collision.collidedAgainst.transformNode.name
  //);
};
```

The export function sets up the collisions for every physics aggregate that is present in the scene which is intended to have a collision callback. It first defines the various filters, then checks if the scene data has a specific element -such as ground- defined, so it can then set this element's collision filters and assign a callback through the getCollisionObservable function.

### createCharacterController.ts
This file creates the character controller that is used in the second scene. It is quite lengthy as it handles all of the inputs of the player, ground and air checks, and physics logic. This is all contained within a single export function, which requires a reference for the camera, and starts off by declaring variables for movement speed, jump height and gravity values, as well as setting initial values for input tracking and setting character orientation to 0.
```javascript
export async function createCharacterController(scene: Scene): Promise<{ displayCapsule: Mesh; characterController: PhysicsCharacterController }> {
  // Character state machine
  let characterState = "ON_GROUND";
  const inAirSpeed = 8.0;
  const onGroundSpeed = 10;
  const jumpHeight = 1.5;
  const characterGravity = new Vector3(0, -18, 0);
  
  // Input tracking
  let keyInput = new Vector3(0, 0, 0);
  let wantJump = false;
  
  // Character orientation
  let characterOrientation = Quaternion.Identity();
  let forwardLocalSpace = new Vector3(0, 0, 1);
```

Afterwards, the player character is created, using a Capsule mesh as a base. This mesh is set to **not** be visible, as it will obscure the players model, but it can still serve as a base for the physics collider.
```javascript
  // Create visual capsule mesh
  const h = 1.8;
  const r = 0.6;
  let displayCapsule = MeshBuilder.CreateCapsule(
    "CharacterDisplay",
    { height: h, radius: r },
    scene
  );
  displayCapsule.position = new Vector3(-2, h/2, 0); 

  displayCapsule.isVisible = false;

  // create physics character controller for capsule
  let characterController = new PhysicsCharacterController(
    displayCapsule.position.clone(),
    { capsuleHeight: h, capsuleRadius: r },
    scene
  );
```
A PhysicsCharacterController is created, using the capsule's cloned position, height and radius to create a collider for physics and a gateway for the player to move the character in the world scene.

Once the character controller is created, the player's mesh is imported using the "obsolete" method for simplicity. Once it is imported, it references the result and loads it into an AbstractMesh variable "hunter", a type which accepts all types of meshes regardless if they have geometry, while still being able to access Mesh properties. 
```javascript
  // imports the player mesh (through "obsolete" means)
  let player: Promise<void | ISceneLoaderAsyncResult> = 
  SceneLoader.ImportMeshAsync(
    "", 
    "./assets/hunter/", 
    "HunterBabylonJS.gltf", 
    scene
  );

  player.then((result) => {
    let hunter: AbstractMesh = result!.meshes[0];
    hunter.position = new Vector3(-2,0,0); // Matches initial capsule position offset
    hunter.scaling = new Vector3(1, 1, 1); // Sets scale to 1
    hunter.rotation = Vector3.Zero(); // Resets rotation

    // add baked in animations to player
    let skeleton: Skeleton = result!.skeletons[0];
    bakedAnimations(scene, skeleton);

    // parents imported mesh to the display capsule for a visual player model
    hunter.setParent(displayCapsule);
  });
```
The hunter variable's position, rotation and scaling it set such that it loads into the world scene at the center, without colliding with any of the terrain. Afterwards, the skeleton for the currently unused animations is created. Then, this mesh is set to be a child of the display capsule to serve as a visible player model.

After the physics controller and the player model is fully set up, physics is handled through on**X**Observable functions which handle logic before the scene is rendered, after any physics logic occours, and upon player input.
```javascript
  scene.onBeforeRenderObservable.add(() => {
    displayCapsule.position.copyFrom(characterController.getPosition());
  });

  // Update physics each frame
  scene.onAfterPhysicsObservable?.add(() => {
    if (scene.deltaTime === undefined) return;
    let dt = scene.deltaTime / 1000.0;
    if (dt === 0) return;

    let down = new Vector3(0, -1, 0);
    let support = characterController.checkSupport(dt, down);

    // Updates the display capsule's forward vector to match character orientation
    characterOrientation = camera.absoluteRotation || Quaternion.Identity(); // Sets the character orientation to match the camera, or identity if undefined
    displayCapsule.setDirection(forwardLocalSpace.applyRotationQuaternion(characterOrientation)); 
    
    // Handles rotation of capsule
    displayCapsule.rotation.x = 0; // Prevents capsule from tilting up/down

    let desiredLinearVelocity = getDesiredVelocity(
      dt,
      support,
      characterController.getVelocity()
    );
    characterController.setVelocity(desiredLinearVelocity);
    characterController.integrate(dt, support, characterGravity);
  });

  // Keyboard input handler
  scene.onKeyboardObservable.add((kbInfo) => {
    const key = kbInfo.event.key;
    let characterMoving: Boolean = false;

    switch (kbInfo.type) {
      case KeyboardEventTypes.KEYDOWN:
        if (key === "s" || key === "ArrowUp") {
          keyInput.z = 1;
          displayCapsule.rotation.y = (0 * Math.PI) / 2;
          characterMoving = true;
        } else if (key === "w" || key === "ArrowDown") {
          keyInput.z = -1;
          displayCapsule.rotation.y = (2 * Math.PI) / 2;
          characterMoving = true;
        } else if (key === "d" || key === "ArrowLeft") {
          keyInput.x = -1;
          displayCapsule.rotation.y = (3 * Math.PI) / 2;
          characterMoving = true;
        } else if (key === "a" || key === "ArrowRight") {
          keyInput.x = 1;
          displayCapsule.rotation.y = (1 * Math.PI) / 2;
          characterMoving = true;
        } else if (key === " ") {
          wantJump = true;
        }
        break;

      case KeyboardEventTypes.KEYUP:
        if (key === "w" || key === "s" || key === "ArrowUp" || key === "ArrowDown") {
          keyInput.z = 0;
          characterMoving = false;
        }
        if (key === "a" || key === "d" || key === "ArrowLeft" || key === "ArrowRight") {
          keyInput.x = 0;
          characterMoving = false;
        }
        if (key === " ") {
          wantJump = false;
        }
        break;
    }
  });

  return { displayCapsule, characterController };
}
```
- The onSceneRenderable property sets the visual player model to sync with the physics controller after every frame. 
- The onAfterPhysicsObservable property updates the physics by first declaring a delta time variable to base the logic around. Next, it will use the cameras absoluteRotation (which was a parameter in the function) to set characterOrientation, which provides a direction for the playerCapsule to face; however, it's X (vertical) rotation is locked so only it's Y (horizontal) rotation gets affected. Then, it updates the linear velocity of the physics controller depending on it's state and the keyInput value (player's input). 
- The onKeyboardObservable awaits keyboard inputs and contains a long switch to register the correct keys (WASD and arrow keys) to set a correct value for keyInput, declared at the start of the script. 

This exported function is then called through scene2/createStartScene.ts to make a character controller and assign it to a variable, so that the camera can reference it as it's target.

### createStartScene.ts
This is the file that creates the elements of the second scene, the town of Nfynham. Once again, all functions to create objects in the scene are listed at the start. However, this has two unique functions that create multiple objects at once.

 ```javascript
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
```
This code creates point lights at set positions around the map to act as the light source from the town's street lights. They are placed slightly above the street lamps, to give the illusion that they are the ones emitting light (otherwise it would be completely blocked by the lamp's mesh). 

```javascript
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

    const redManAggregate = new PhysicsAggregate(redMan, PhysicsShapeType.MESH, {mass: 0.4, restitution:0.1, friction:0.4}, scene); // Assigns the value for the physics aggregate (0 mass to make it static)
    redManAggregate.body.setCollisionCallbackEnabled(true); // Enables collision callbacks for collision.ts
    return redManAggregate;
  }

async function createRedMen(scene: Scene): Promise<PhysicsAggregate[]> {
    let redMenList: PhysicsAggregate[] = [];

    redMenList.push(await createRedMan(scene, 20.29, 0, 2.45, -Math.PI*0.38));
    redMenList.push(await createRedMan(scene, 20.4, 0, -2, -Math.PI*0.75));
    redMenList.push(await createRedMan(scene, 13.92, 2, -14.6, -Math.PI*0.9));
    redMenList.push(await createRedMan(scene, 52.14, 7, -21.04, -Math.PI*1.5));
    redMenList.push(await createRedMan(scene, 44.39, 7, -32.56, -Math.PI*0.95));
    redMenList.push(await createRedMan(scene, 33.81, 7, -28.92, -Math.PI*0.77));
    redMenList.push(await createRedMan(scene, 40.55, 7, -58.99, -Math.PI*0.83));
    redMenList.push(await createRedMan(scene, 38.47, 7, -81.21, -Math.PI*1.3));
    redMenList.push(await createRedMan(scene, 33.68, 7, -91.22, -Math.PI*0.9));
    redMenList.push(await createRedMan(scene, 27.6, 7, -116.43, -Math.PI*1.18));
    redMenList.push(await createRedMan(scene, 10.16, 6, -116.33, -Math.PI*0.59));
    redMenList.push(await createRedMan(scene, 8.44, 6, -121.26, -Math.PI*1.22));
    redMenList.push(await createRedMan(scene, -3, 5, -115.1, -Math.PI*0.37));
    redMenList.push(await createRedMan(scene, 10.55, 4, -78.19, -Math.PI*0.76));
    redMenList.push(await createRedMan(scene, -11.9, 3.5, -75.1, -Math.PI*0.25));
    redMenList.push(await createRedMan(scene, -10.55, 3.5, -89.6, -Math.PI*0.76));
    redMenList.push(await createRedMan(scene, -21, 3.5, -116.4, -Math.PI*0.77));
    redMenList.push(await createRedMan(scene, -37.5, 3.5, -89, -Math.PI*0.72));
    redMenList.push(await createRedMan(scene, -51.3, 3.5, -82.5, -Math.PI*0.59));

    return redMenList;
}
```
These functions begin through createRed**Man**, which imports a custom model (the same as the player model, but coloured red) through setting the ImportMeshAsync function call to a variable with the await prefix. This allows logic to be done directly to the imported mesh that allows for a forEach loop to go through each AbstractMesh in the imported mesh and puts it in a list of compiledMeshes. A new AbstractMesh variable, "redman", is created from taking the first mesh of these compiled meshes. This is potentially irreproducable with other models, however I know that this model only has one mesh with geometry so it is done for simplicity. Then, the redman's variables position, rotation and scale is set as defined by the function parameters. Finally, the physics aggregate is made for this Abstract Mesh and is set to have a unique MESH shapetype for it's collider.

Next, the createRed**Men** function, similar to createLampLights, creates a number of these objects at set positions throughout the map. However, it also puts them in a PhysicsAggregate list, which is returned from the function to be put as a variable.

The final important component of this scene is the importAssets function, which utilises the AssetManager to import a unique game map into the scene - the town of Nfynham.
```javascript
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

      task.loadedMeshes.forEach((mesh: any) => {
      mesh.isVisible = true;
      });

      task.loadedMeshes.forEach((mesh: any) => {
        if (mesh instanceof AbstractMesh && mesh.geometry) 
        {
          const compAggregate = new PhysicsAggregate( 
            mesh,
            PhysicsShapeType.MESH,
            { mass: 0 }, 
            scene
          );
 
          console.log("Physics aggregate created for", mesh.name);
        }
      });
    }

    return assetsManager;
  }
```
The AssetManager can create tasks which import meshes and perform logic if they are successful. Here, the gameMap variable creates a task to load the gameMap.gltf model, which then onSuccess, uses the task's loadedMeshes[] list to perform logic. It first sets the position, scaling and rotation to custom parameters, then makes sure every component of the game map is visible as a fail safe. 
Next, a forEach loop is ran for any mesh that is in loadedMeshes[]; this checks if each mesh is an AbstractMesh and if it contains Geometry to create a physics aggregate for it, if it meets the requirements. This will run through each component of the game map and create physics aggregates for every one of them. The physics aggregates are set to have a mass of 0, so they are static.

Finally, this export function calls all of these into variables and assigns them to the scene data in interfaces.ts
```javascript
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
```
It first declares the variables from scene data with the undefined modifier so the "that" variable can be assigned to hold the scene data, then assigns the elements of "that" sceneData to the functions listed above, through, createLampLights is not included in the scene data. 

Then, a characterController is created in this function (as opposed to creating it in index.ts) to serve as a reference for the camera to follow the player, while referencing the camera for itself so the players orientation can be update to match the cameras. 

Afterwards, before the scene is rendered, the camera's target is set to the player while it's referenced as type "any", as the setTarget function does not exist otherwise.
Lastly, an assetsManager variable is created by calling importAssets, where thereafter it's load() function is called to load all of the tasks created in this function.

This exported function is called by index.ts to create a variable that holds this scene's data, so it may be loaded on a render loop if the current scene index is set to 1, along with other logic.

### guiBack.ts
This is another file that creates the button, this time for the game scene. It first defines the function which creates the button just as the previous gui script.
```javascript
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
```
The different properties of the button are defined, and an onPointerUpObservable function is called, to call the setSceneIndex function from index.ts.

```javascript
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

    let that: SceneData = {
      scene,
      advancedTexture,
      button1,
      camera
    };
    
    return that;
  } 
```
The export function is different however, as besides creating the variables for scene, advanced texture, button and camera, it also sets the vertical and horizontal aligment of the button to be in the top left of the screen, serving as it's anchor. This is so it can scale on a screen of any size, rather than being in a fixed position. However, while the button is assigned to it's variable, a small offset is made so it is not directly in the corner. Once the button is added to the advanced texture, the variables are then assigned to the SceneData. 

This function is also called by index.ts to create a variable for it, so it can be rendered on the game scene and allow the player to return to the main menu.

## This is the end of the documentation, as that was all of the scripts that make up the constitution of my Element 5 - Nfynham.
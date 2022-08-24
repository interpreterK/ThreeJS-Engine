/*
    The engine will setup some basic stuff 1st, such as:
    - Movement
    - Camera look
    - Ground
    - Skybox

    @Author: interpreterK
    (https://github.com/interpreterK)
*/

//ThreeJS init
const Scene = new THREE.Scene()
const Camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, .1, 10000)
const Renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
Renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(Renderer.domElement)
//Top classes
const Instance = {
    Box: function(GeometryArray, MaterialArray) {
        const Geometry = new THREE.BoxGeometry(...GeometryArray)
        const Material = new THREE.MeshLambertMaterial(...MaterialArray)
        const Object = new THREE.Mesh(Geometry, Material)
        Scene.add(Object)
        return Object
    },
    SkyBox: function(GeometryArray) {
        const Geometry = new THREE.BoxGeometry(...GeometryArray)
        const Sky = new THREE.Mesh(Geometry)
        Scene.add(Sky)
        return {Geometry: Geometry,Sky: Sky}
    }
}
//Top variables
const print = console.log
const {PI:pi, sin, cos, min, max} = Math
function clamp(n_min,c,n_max) {
    return min(n_min,max(c,n_max))
}
//3D Objects
const Floor = Instance.Box([150,150,10,10],[{color:0xDEADBEEF}])
const Box = Instance.Box([5,5,10,10],[{color:0xff0000}])
const Box2 = Instance.Box([5,5,10,10],[{color:0x0000ff}])
const Box3 = Instance.Box([5,5,10,10],[{color:0x00ff00}])
const CursorBox = Instance.Box([2,2,2,2],[{color:0xFFFFFF}])

//Lighting
const Ambient = new THREE.HemisphereLight(0xDEADBEEF, 0xFFFFFF, 0.5);
Scene.add(Ambient)

function PathStrings(fileName) {
    const sides = ['ft','bk','up','dn','rt','lf']
    return sides.map(side => {
        return ('images/'+fileName)+'_'+side+'.jpg'
    })
}
const SkyBox = Instance.SkyBox([1e4,1e4,1e4])
const Sky = PathStrings('yonder')

Camera.position.z = 30
Floor.rotation.x -= pi/2 //deg(90)
Floor.position.y = -8
Box2.position.set(8,0,0)
Box3.position.set(-8,0,0)

const [mouse,keys] = [{up:{},down:{}},{keydown:{},keyup:{}}]
let RightDown = false
//RightClick/Mouse2
mouse.up[2] = function() {RightDown = false}
//RightClick/Mouse2
mouse.down[2] = function() {RightDown = true}
keys.keyup["r"] = function() {
    Camera.position.set(0,0,30)
    Camera.rotation.set(0,0,0)
    print("Camera reset")
}
//Camera
const windowHalf = new THREE.Vector2(window.innerWidth/2, window.innerHeight/2)
let sens = 2
let lerpAlpha = 10
document.addEventListener("contextmenu", (e) => {e.preventDefault()})
document.addEventListener('mouseup', (e) => {
    const f = mouse.up[e.button]
    if (f) {f()}
})
document.addEventListener('mousedown', (e) => {
    const f = mouse.down[e.button]
    if (f) {f()}
})
document.addEventListener('mousemove', (e) => {
    const [cX,cY] = [e.clientX,e.clientY]
    if (RightDown) {
        const x = (1-(cX-windowHalf.y))*sens/1e2
        const y = (1-(cY-windowHalf.y))*sens/1e2
        Camera.rotation.x += lerpAlpha/1e2*(y-Camera.rotation.x)
        Camera.rotation.y += lerpAlpha/1e2*(x-Camera.rotation.y)
        Renderer.render(Scene, Camera) 
    }
    //Pointer hitbox
    CursorBox.position.set((cX-windowHalf.x)/30,-(cY-windowHalf.y)/30,0)
    print("x="+CursorBox.position.x,"y="+CursorBox.position.y,"z="+CursorBox.position.z)
})
//Keyboard
let Move = {}
let CameraSpeed = .2
document.addEventListener('keydown', (e) => {
    Move[e.key] = true
    const f = keys.keydown[e.key]
    if (f) {f()}
})
document.addEventListener('keyup', (e) => {
    Move[e.key] = false
    const f = keys.keyup[e.key]
    if (f) {f()}
})
let acout = 0
function RecursiveInput() {
    const rY = Camera.rotation.y
    if (Move["w"]) {
        Camera.position.x += sin(rY)*CameraSpeed
        Camera.position.z += -cos(rY)*CameraSpeed
    }
    if (Move["a"]) {
        Camera.position.x += sin(rY-pi/2)*CameraSpeed
        Camera.position.z += -cos(rY-pi/2)*CameraSpeed
    }
    if (Move["s"]) {
        Camera.position.x -= sin(rY)*CameraSpeed
        Camera.position.z -= -cos(rY)*CameraSpeed
    }
    if (Move["d"]) {
        Camera.position.x += sin(rY+pi/2)*CameraSpeed
        Camera.position.z += -cos(rY+pi/2)*CameraSpeed
    }
    if (Move["Shift"]) {
        Camera.position.y += .1
    }
    if (Move["Control"]) {
        Camera.position.y -= .1
    }
    //Objects
    acout += 1
    CursorBox.rotation.set(cos(acout/50),sin(acout/100)*2,cos(acout/80))
    requestAnimationFrame(RecursiveInput) //Do the funny loop method
    Renderer.render(Scene, Camera)
}
//Resize support
window.addEventListener('resize', () => {
    Renderer.setSize(window.innerWidth, window.innerHeight)
    Camera.aspect = window.innerWidth/window.innerHeight
    Camera.updateProjectionMatrix()
})
window.onload = RecursiveInput
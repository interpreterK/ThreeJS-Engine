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
const Renderer = new THREE.WebGLRenderer({antialias: true})
Renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(Renderer.domElement)

//Top classes
const Instance = {
    Box: function(GeometryArray, MaterialArray) {
        const Geometry = new THREE.BoxGeometry(...GeometryArray)
        const Material = new THREE.MeshBasicMaterial(...MaterialArray)
        const Object = new THREE.Mesh(Geometry, Material)
        Scene.add(Object)
        return Object
    },
    SkyBox: function(GeometryArray) {
        const Geometry = new THREE.BoxGeometry(...GeometryArray)
        const Sky = new THREE.Mesh(Geometry)
        Scene.add(Sky)
        return {
            Geometry: Geometry,
            Sky: Sky
        }
    }
}

//Top variables
const print = console.log
const {PI:pi, sin, cos, min} = Math

//3D Objects
const Floor = Instance.Box([150,150,10,10],[{color:0x696969}])

function PathStrings(fileName) {
    const sides = ['ft','bk','up','dn','rt','lf']
    return sides.map(side => {
        return ('images/'+fileName)+'_'+side+'.jpg'
    })
}
const SkyBox = Instance.SkyBox([1e4,1e4,1e4])
const Sky = {
    ft: new THREE.TextureLoader().load('images/yonder_ft.jpg'),
    bk: new THREE.TextureLoader().load('images/yonder_bk.jpg'),
    up: new THREE.TextureLoader().load('images/yonder_up.jpg'),
    dn: new THREE.TextureLoader().load('images/yonder_dn.jpg'),
    rt: new THREE.TextureLoader().load('images/yonder_rt.jpg'),
    lf: new THREE.TextureLoader().load('images/yonder_lf.jpg')
}

Camera.position.z = 0
Floor.rotation.x -= pi/2 //deg(90)
Floor.position.y = -8

const mouse = {up:{},down:{}}
let sens = 1
let RightDown = false
//RightClick/Mouse2
mouse.up[2] = function() {RightDown = false}
//RightClick/Mouse2
mouse.down[2] = function() {RightDown = true}
//Camera
const windowHalf = new THREE.Vector2(window.innerWidth/2, window.innerHeight/2)
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
    if (RightDown) {
        const x = (1-(e.clientX-windowHalf.x))*.002
        const y = (1-(e.clientY-windowHalf.y))*.002
        Camera.rotation.x += .05*(y-Camera.rotation.x)
        Camera.rotation.y += .05*(x-Camera.rotation.y)
        Renderer.render(Scene, Camera) 
    }
})

//Keyboard
let Move = {}
let CameraSpeed = .2

document.addEventListener('keydown', (e) => {
    Move[e.key] = true
})
document.addEventListener('keyup', (e) => {
    Move[e.key] = false
    if (e.key == "r") {
        Camera.position.set(0,0,0)
        Camera.rotation.set(0,0,0)
        print("Camera reset")
    }
})
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
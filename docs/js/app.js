let viewer;

class Viewer {

    constructor (container, glbfile) {
        var camera, scene, renderer, controls;

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
        camera.position.y = 2.0;
        camera.position.z = 9.0;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x300a24);

        var ambientLight = new THREE.AmbientLight(0xcccccc, 0.3);
        scene.add(ambientLight);

        var pointLight = new THREE.PointLight(0xffffff, 0.8);
        pointLight.position.set(3, 3, 0);
        camera.add(pointLight);
        scene.add(camera);

        var onProgress = function (xhr) {};
        var onError = function (e) {
            console.log(e);
        };

        var loader = new THREE.GLTFLoader();
        loader.setMeshoptDecoder(MeshoptDecoder);
        loader.load(glbfile, (gltf) => {
            var bbox = new THREE.Box3().setFromObject(gltf.scene);
            var scale = 2 / (bbox.max.y - bbox.min.y);

            gltf.scene.scale.set(scale, scale, scale);
            gltf.scene.position.set(0, 0, 0);

            scene.add(gltf.scene);

            this.initDragControls(gltf.scene.children[0].children);
        }, onProgress, onError);


        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);



        // add Orbit controls
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.maxPolarAngle = Math.PI * 0.5;
        controls.minDistance = 1;
        controls.maxDistance = 500;
        controls.enableDamping = true;
        controls.enableKeys = true;
        controls.zoomSpeed = 0.2
        controls.target = new THREE.Vector3( 0, 0, 0 ); 

        this.clock = new THREE.Clock();        
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.controls = controls;
        this.render();


        window.addEventListener('resize', ()=>this.onWindowResize(), false);
    }

    initDragControls(objects) {
        // add Drag controls
        var drag = new THREE.DragControls( objects, this.camera, this.renderer.domElement );
        drag.addEventListener( 'dragstart', e => {
            e.object.material.emissive.set( 0xaaaaaa );
        });

        drag.addEventListener( 'dragend', e => {
            e.object.material.emissive.set( 0x000000 );
        });
        drag.deactivate();
        this.drag = drag;

        document.addEventListener( 'keypress', e => {
            this.drag.deactivate();
            this.controls.enabled = true;

            if (e.charCode == 113)
                this.toggleClippingPlane();

            if (e.charCode == 100) {
                this.drag.activate();
                this.controls.enabled = false;
            }
        });
    }

    toggleClippingPlane() {
        if (!this.renderer.clippingPlanes[0]) {
            this.renderer.clippingPlanes = [new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), 0.1 )];
            return;
        }
        this.renderer.clippingPlanes = Object.freeze( [] );
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        var delta = this.clock.getDelta();
        this.controls.update(delta);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

}


document.addEventListener('DOMContentLoaded', () => {
    var container = document.createElement('div');
    document.body.appendChild(container);
    viewer = new Viewer(container, 'glb/ice-stadium.glb');
});
let viewer;

let taaRenderPass;

window.devicePixelRatio=1.25;

class Viewer {

    constructor (container, glbfile) {
        var camera, scene, renderer, controls, composer;

        scene = new THREE.Scene();
        //scene.background = new THREE.Color(0x300a24);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
        camera.position.y = 2.0;
        camera.position.z = 9.0;
        scene.add(camera);

        var ambientLight = new THREE.AmbientLight(0xcccccc, 0.6);
        scene.add(ambientLight);

        var dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
            dirLight.position.set( 70, 122, -7 );
            dirLight.castShadow = true;
            dirLight.shadow.bias = -0.0001;
            dirLight.shadow.radius = 1;
            dirLight.shadow.camera.top = 15;
            dirLight.shadow.camera.bottom = -15;
            dirLight.shadow.camera.left = -25;
            dirLight.shadow.camera.right = 25;
            dirLight.shadow.mapSize.width = 1024;
            dirLight.shadow.mapSize.height = 1024;
/*
            dirLight.shadow.mapSize.height = 1024;
            dirLight.shadow.camera.top = 3;
            dirLight.shadow.camera.bottom = -3;
            dirLight.shadow.camera.left = -4;
            dirLight.shadow.camera.right = 4;
            */
        scene.add(dirLight);

        var loader = new THREE.GLTFLoader();
        loader.setMeshoptDecoder(MeshoptDecoder);
        loader.load(glbfile, (gltf) => {
            var bbox = new THREE.Box3().setFromObject(gltf.scene);
            var scale = 2 / (bbox.max.y - bbox.min.y);

            gltf.scene.scale.set(scale, scale, scale);
            gltf.scene.position.set(0, 0, 0);
            gltf.scene.children[0].children.map(i=>{
                i.receiveShadow = true;
            })

            scene.add(gltf.scene);

            this.initDragControls(gltf.scene.children[0].children);
        });


        renderer = new THREE.WebGLRenderer(); // { antialias: true }
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.VSMShadowMap;
        container.appendChild(renderer.domElement);

        // add Post-processing effects (temporal: anti-aliasing, shadow map jitter, and SSAO jitter)
        composer = new THREE.EffectComposer( renderer );
        taaRenderPass = new THREE.TAARenderPass( scene, camera );
        taaRenderPass.sampleLevel = 0;
        composer.addPass( taaRenderPass );

        var copyPass = new THREE.ShaderPass( THREE.CopyShader );
        composer.addPass( copyPass );
/*
        var width = window.innerWidth;
        var height = window.innerHeight;
        var ssaoPass = new THREE.SSAOPass( scene, camera, width, height );
        ssaoPass.kernelRadius = 16;
        ssaoPass.minDistance = 0.00001;
        ssaoPass.maxDistance = 0.0005;
        composer.addPass( ssaoPass );
*/        

        


        // add Orbit controls
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.maxPolarAngle = Math.PI * 0.52;
        controls.minDistance = 1;
        controls.maxDistance = 500;
        controls.enableDamping = true;
        controls.enableKeys = true;
        controls.screenSpacePanning = true;
        controls.zoomSpeed = 0.4
        controls.target = new THREE.Vector3( 0, 0, 0 );
        controls.addEventListener( 'change', e => {
            taaRenderPass.accumulate = false;
        });
        setInterval(()=>{
            taaRenderPass.accumulate = true;
            if (taaRenderPass.accumulateIndex>31) {
                this.composer.renderToScreen=false;
            }
        },500);

        document.addEventListener('mousemove',()=>{this.composer.renderToScreen=true});


        this.clock = new THREE.Clock();        
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.composer = composer;
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

        drag.addEventListener( 'drag', e => {
            taaRenderPass.accumulate = false;
        });

        drag.addEventListener( 'dragend', e => {
            e.object.material.emissive.set( 0x000000 );
        });
        drag.deactivate();
        this.drag = drag;

        document.addEventListener( 'keypress', e => {
            this.drag.deactivate();
            this.controls.enabled = true;

            if (e.charCode == 113) {
                taaRenderPass.accumulate = false;
                this.toggleClippingPlane();
            }

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
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.composer.setSize( window.innerWidth, window.innerHeight );
        this.composer.render();
    }

    render() {
        var delta = this.clock.getDelta();
        this.controls.update(delta);
        this.composer.render();
        requestAnimationFrame(this.render.bind(this));
    }

}


document.addEventListener('DOMContentLoaded', () => {
    var container = document.createElement('div');
    document.body.appendChild(container);
    const file = window.location.hash.slice(1) || 'steelcase.glb.bmp';
    viewer = new Viewer(container, `glb/${file}`);//'glb/test.glb'); //
});
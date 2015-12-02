"use strict";

var canvas = (function() {
    var scene, camera, renderer, controls, stats, gui;
    var clock, delta;
    var mouse, raycaster;

    var SCREEN = {
        w: window.innerWidth,
        h: window.innerHeight
    };


    var paused = true;

    var _selectedId = -1; // mesh.id of the currently selected body

    var bodies = [];
    var bodyMeshes = [];

    var zeroVector = null;

    var opt = null;
    var bodyToAdd = null;

    function init() {
        var container = document.createElement('div');

        zeroVector = new THREE.Vector3();

        scene = new THREE.Scene();

        var VIEW_ANGLE = 45,
            ASPECT = SCREEN.w / SCREEN.h,
            NEAR = 1,
            FAR = 20000;

        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        camera.position.set(0, 60, 300);
        camera.lookAt(zeroVector);
        scene.add(camera);
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(SCREEN.w, SCREEN.h);
        // renderer.setClearColor(0x555555);

        clock = new THREE.Clock();

        controls = new THREE.FlyControls(camera, container);
        controls.movementSpeed = 100;
        controls.rollSpeed = Math.PI / 6;

        var light = new THREE.PointLight(0xCC9999);
        light.position.copy(zeroVector);
        scene.add(light);


        scene.add(new THREE.AxisHelper(50));


        var planeGeometry = new THREE.CircleGeometry(1000, 8);
        var planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = Math.PI / 2;
        scene.add(plane);


        var imagePrefix = "data/images/nebula-";
        var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
        var imageSuffix = ".png";
        var skyGeometry = new THREE.BoxGeometry(10000, 10000, 10000);

        var imageURLs = [];
        for (var i = 0; i < 6; i++) {
            imageURLs.push(imagePrefix + directions[i] + imageSuffix);
        }
        var shader = THREE.ShaderLib.cube;
        var loader = new THREE.CubeTextureLoader();
        shader.uniforms.tCube.value = loader.load(imageURLs);
        var skyMaterial = new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: true,
            side: THREE.BackSide
        });
        var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
        scene.add(skyBox);


        addBodies();


        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';


        container.appendChild(stats.domElement);
        container.appendChild(renderer.domElement);


        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        renderer.domElement.addEventListener('mousedown', onCanvasMouseDown);

        window.addEventListener('resize', onWindowResize);
        onWindowResize();

        animate();

        return container;
    }

    function animate() {
        window.requestAnimationFrame(animate);
        update();
        render();
    }

    function update() {
        var i, j;

        delta = clock.getDelta();

        controls.update(delta);

        for (i = bodies.length - 1; i >= 0; --i) {
            if (bodies[i].remove)
                removeBody(i);
        }


        if (paused) return;


        for (i = bodies.length - 1; i >= 0; --i) {
            bodies[i].updateAcceleration(bodies);
        }

        for (i = bodies.length - 1; i >= 0; --i) {
            bodies[i].updatePosition(delta, bodies);

            if (bodies[i].phys.c.distanceTo(zeroVector) > Config.CULL_DIST) {
                bodies[i].remove = true;
            }
        }

        for (i = bodies.length - 1; i >= 0; --i) {
            for (j = bodies.length - 1; j >= 0; --j) {
                if (bodies[i].isTouching(bodies[j])) {
                    bodies[i].remove = true;
                    bodies[j].remove = true;
                }
            }
        }
    }

    function render() {
        renderer.render(scene, camera);
        stats.update();
    }

    function onWindowResize() {
        SCREEN.w = window.innerWidth;
        SCREEN.h = window.innerHeight;

        renderer.setSize(SCREEN.w, SCREEN.h);
        camera.aspect = SCREEN.w / SCREEN.h;
        camera.updateProjectionMatrix();
    }

    function onCanvasMouseDown(event) {
        event.preventDefault();

        // body selection
        mouse.x = (event.clientX / renderer.domElement.width) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(bodyMeshes);

        selectedBody(intersects.length ? intersects[0].object.id : -1);
    }

    function selectedBody(id) {
        // get
        if (typeof id === "undefined") {
            for (var i = bodies.length - 1; i >= 0; i--) {
                if (_selectedId === bodies[i].mesh.id)
                    return i;
            }
            return -1;
        }

        // set
        _selectedId = id;
        for (var i = bodies.length - 1; i >= 0; i--) {
            bodies[i].mesh.children[0].material.color.setHex(0xAAAAAA);

            if (bodies[i].mesh.id === id) {
                bodies[i].mesh.children[0].material.color.setHex(0xFF0000);
            }
        }
    }

    function hideDatGUI(revert) {
        if (gui) {
            gui.close();
            dat.GUI.toggleHide();
            if (revert) gui.revert();
        }
    }

    function addDatGUI() {
        gui = new dat.GUI();
        hideDatGUI();

        opt = {
            cx: 0,
            cy: 0,
            cz: 0,
            r: Config.NEW_BODY_RADIUS,
            significand: 5,
            exponent: 12,
            vx: 0,
            vy: 0,
            vz: 0,
            add: function() {
                bodyToAdd.phys.m = opt.significand * Math.pow(10, opt.exponent >> 0);
                bodyToAdd.phys.v.set(opt.vx, opt.vy, opt.vz);

                bodies.push(bodyToAdd);
                bodyMeshes.push(bodyToAdd.mesh);
                bodyToAdd = null;

                hideDatGUI(true);

                // statusBar.pauseToggle();
            }
        };

        gui.remember(opt);

        function updateBodyPos() {
            if (bodyToAdd) {
                bodyToAdd.phys.c.set(opt.cx, opt.cy, opt.cz);
            }
        }

        function updateBodyRad() {
            if (bodyToAdd) {
                bodyToAdd.mesh.geometry.dispose();
                bodyToAdd.mesh.geometry = new THREE.SphereGeometry(opt.r, 16, 16);

                var scale = opt.r * Config.BODY_GLOW_SCALE_FACTOR;
                bodyToAdd.mesh.children[0].scale.set(scale, scale, 1);

                bodyToAdd.phys.r = opt.r;
            }
        }

        var folder = gui.addFolder('Position');
        folder.add(opt, 'cx').onChange(updateBodyPos);
        folder.add(opt, 'cy').onChange(updateBodyPos);
        folder.add(opt, 'cz').onChange(updateBodyPos);

        gui.add(opt, 'r', 0.5, 8).name('Radius').onChange(updateBodyRad);

        folder = gui.addFolder('Mass');
        folder.add(opt, 'significand', 1, 10);
        folder.add(opt, 'exponent', 8, 18);

        folder = gui.addFolder('Initial Velocity');
        folder.add(opt, 'vx');
        folder.add(opt, 'vy');
        folder.add(opt, 'vz');

        gui.add(opt, 'add').name('Confirm');

        canvas.gui = gui;
    }

    function addBody() {
        abortAddingBody();

        focusAndMoveCamera();

        var physics = {
            radius: Config.NEW_BODY_RADIUS,
            mass: 0,
            velocity: new THREE.Vector3(),
            coordinates: new THREE.Vector3()
        };

        bodyToAdd = new Body(physics);

        scene.add(bodyToAdd.mesh);

        // will continue in opt.add() in addDatGUI() if confirmed
    }

    function abortAddingBody() {
        // console.assert(paused);
        if (bodyToAdd) {
            scene.remove(bodyToAdd.mesh);
            hideDatGUI(true);
            bodyToAdd = null;
        }
    }

    function focusAndMoveCamera() {
        controls.enabled = false;

        var m1 = new THREE.Matrix4();
        m1.lookAt(camera.position, zeroVector, new THREE.Vector3(0, 1, 0));

        var quaternion = new THREE.Quaternion();
        quaternion.setFromRotationMatrix(m1);

        var endRot = new THREE.Euler();
        endRot.setFromQuaternion(quaternion);

        TweenLite.to(camera.rotation, 1, {
            x: endRot.x,
            y: endRot.y,
            z: endRot.z,
            onComplete: function() {
                var direction = camera.getWorldDirection();

                TweenLite.to(camera.position, 1, {
                    x: 0,
                    y: 40,
                    z: 200,
                    ease: Power2.easeInOut,
                    onUpdate: function() {
                        camera.lookAt(direction);
                    },
                    onComplete: function() {
                        camera.lookAt(zeroVector);
                    }
                });

                TweenLite.to(direction, 1, {
                    x: 0,
                    y: 0,
                    z: 0,
                    onComplete: function() {
                        camera.lookAt(zeroVector);
                        controls.enabled = true;
                    }
                });
            }
        });
    }

    function addBodies() {
        var physics = {
            radius: 0,
            mass: 0,
            velocity: null,
            coordinates: null
        };

        var data = initialBodies;

        for (var i = 0, body = null; i < data.length; i++) {
            physics.radius = data[i].r;
            physics.mass = data[i].m;

            physics.coordinates =
                new THREE.Vector3(data[i].c.x, data[i].c.y, data[i].c.z);

            physics.velocity =
                new THREE.Vector3(data[i].v.x, data[i].v.y, data[i].v.z);

            body = new Body(physics);

            scene.add(body.mesh);
            bodies.push(body);
            bodyMeshes.push(body.mesh);
        }
    }

    function removeBody(i) {
        if (i < 0 || i >= bodies.length) return;

        scene.remove(bodyMeshes[i]);
        bodies.splice(i, 1);
        bodyMeshes.splice(i, 1);
    }


    function pauseToggle() {
        abortAddingBody();
        return (paused = !paused);
    }

    function isPaused() {
        return paused;
    }

    function flagForRemoval(i) {
        if (i < 0 || i >= bodies.length) return;

        bodies[i].remove = true;
    }

    function flagAllForRemoval() {
        for (var i = bodies.length - 1; i >= 0; i--) {
            bodies[i].remove = true;
        }
    }

    function getBodyPhys(i) {
        if (i < 0 || i >= bodies.length) return null;

        var body = bodies[i];

        return {
            x: body.phys.c.x,
            y: body.phys.c.y,
            z: body.phys.c.z,
            m: body.phys.m,
            r: body.phys.r,
            s: body.phys.v.length()
        };
    }

    function getNumBodies() {
        return bodies.length;
    }

    return {
        domElement: init(),
        isPaused: isPaused,
        pauseToggle: pauseToggle,
        selectedBody: selectedBody,
        addBody: addBody,
        flagForRemoval: flagForRemoval,
        flagAllForRemoval: flagAllForRemoval,
        getBodyPhys: getBodyPhys,
        getNumBodies: getNumBodies,
        addDatGUI: addDatGUI,
        gui: null // updated in addDatGUI()
    };
})();

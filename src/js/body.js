"use strict";

function Body(physics) {
    var geometry = new THREE.SphereGeometry(physics.radius, 16, 16);

    var loader = new THREE.TextureLoader();

    var material = new THREE.MeshLambertMaterial({
        map: loader.load('data/images/moon.jpg')
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(physics.coordinates);

    // glow
    var spriteMaterial = new THREE.SpriteMaterial({
        map: loader.load('data/images/glow.png'),
        color: 0xAAAAAA,
        transparent: false,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    var scale = physics.radius * Config.BODY_GLOW_SCALE_FACTOR;
    sprite.scale.set(scale, scale, 1);
    this.mesh.add(sprite);

    this.phys = {
        r: physics.radius, // Radius
        m: physics.mass, // Mass
        a: new THREE.Vector3(), // Acceleration
        v: physics.velocity, // Velocity
        c: this.mesh.position // Coordinates
    };

    this.remove = false;
}

Body.prototype.updateAcceleration = function(bodies) {
    var F, r2;

    for (var i = bodies.length - 1; i >= 0; --i) {
        if (bodies[i] !== this) {
            r2 = this.phys.c.distanceToSquared(bodies[i].phys.c);

            F = (Config.G * this.phys.m * bodies[i].phys.m) / r2;

            F = bodies[i].phys.c.clone().sub(this.phys.c).multiplyScalar(F);
            F = F.divideScalar(Math.sqrt(r2));

            this.phys.a.add(F.divideScalar(this.phys.m));
        }
    }
};

Body.prototype.updatePosition = function(delta, bodies) {
    this.phys.v.add(this.phys.a.multiplyScalar(delta));
    this.phys.c.add(this.phys.v.clone().multiplyScalar(delta));
    this.phys.a.set(0, 0, 0);
};

Body.prototype.isTouching = function(body) {
    if (this !== body) {
        if (this.phys.c.distanceTo(body.phys.c) < this.phys.r + body.phys.r)
            return true;
    }

    return false;
};

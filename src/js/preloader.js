"use strict";

var preloader = (function() {

    var preload = new createjs.LoadQueue();

    var libs = [
        'js/lib/stats.min.js',
        'js/lib/dat.gui.js',
        'js/lib/three.min.js',
        'js/lib/FlyControls.js',
        'js/lib/TweenLite.min.js',
        'js/lib/CSSPlugin.min.js'
    ];

    var scripts = [
        'js/config.js',
        'js/data/initialbodies.js',
        'js/body.js',
        'js/canvas.js',
        'js/data/statusbarhtml.js',
        'js/statusbar.js',
        'js/main.js'
    ];

    var images = [
        'data/images/nebula-xneg.png',
        'data/images/nebula-xpos.png',
        'data/images/nebula-yneg.png',
        'data/images/nebula-ypos.png',
        'data/images/nebula-zneg.png',
        'data/images/nebula-zpos.png',
        'data/images/moon.jpg',
        'data/images/glow.png'
    ];

    var progressBar = null;

    function loadAssets() {
        progressBar = document.getElementsByClassName('progress-bar-wrapper')[0];
        progressBar = progressBar.children[0];

        preload.addEventListener('progress', onProgress);
        preload.addEventListener('complete', onComplete);

        preload.loadManifest(libs);
        preload.loadManifest(scripts);
        preload.loadManifest(images);
    }

    function onProgress(event) {
        progressBar.style.left = (preload.progress * 100) + '%';
    }

    function onComplete(event) {
        init();

        var wrapper = document.getElementById('splash-wrapper');

        TweenLite.to(wrapper, 0.8, {
            autoAlpha: 0,
            display: 'none',
            delay: 0.5,
            onComplete: function() {
                document.body.removeChild(wrapper);
            }
        });
    }

    return {
        loadAssets: loadAssets
    };
})();

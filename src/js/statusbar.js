"use strict";

var statusBar = (function() {

    var pauseBtn = null;
    var field = [];
    var numBodies = 0;

    function init() {
        var container = document.createElement('div');
        container.id = 'status';

        /* bad code follows */

        container.innerHTML = statusBarHTML;

        var subMenus = container.getElementsByClassName('status-btn-sub');

        // Menu Button
        subMenus[0].onclick = function() {
            subMenus[1].children[1].style.display = 'none';
            subMenus[2].children[1].style.display = 'none';
            subMenus[3].children[1].style.display = 'none';
            var style = subMenus[0].children[1].style;
            style.display = style.display === 'block' ? 'none' : 'block';
            return false;
        };

        // Body Info button
        subMenus[1].children[0].onclick = function() {
            subMenus[0].children[1].style.display = 'none';
            subMenus[2].children[1].style.display = 'none';
            subMenus[3].children[1].style.display = 'none';
            var style = subMenus[1].children[1].style;
            style.display = style.display === 'block' ? 'none' : 'block';
            return false;
        };

        // Settings button
        subMenus[2].children[0].onclick = function() {
            subMenus[0].children[1].style.display = 'none';
            subMenus[1].children[1].style.display = 'none';
            subMenus[3].children[1].style.display = 'none';
            var style = subMenus[2].children[1].style;
            style.display = style.display === 'block' ? 'none' : 'block';
            return false;
        };

        // Help button
        subMenus[3].children[0].onclick = function(event) {
            subMenus[0].children[1].style.display = 'none';
            subMenus[1].children[1].style.display = 'none';
            subMenus[2].children[1].style.display = 'none';
            var style = subMenus[3].children[1].style;
            style.display = style.display === 'block' ? 'none' : 'block';
            return false;
        };


        pauseBtn = container.getElementsByClassName('status-btn-pause')[0];
        pauseBtn.onclick = pauseToggle;

        numBodies = container.getElementsByClassName('status-info-bodycount')[0];
        numBodies = numBodies.children[0];


        // Sub-menu

        var addBtn = container.getElementsByClassName('status-btn-add')[0];
        addBtn.onclick = function() {
            if (!canvas.isPaused())
                pauseToggle();

            canvas.addBody();

            dat.GUI.toggleHide();
            canvas.gui.open();
        };

        var removeSelected = container.getElementsByClassName('status-btn-remove-sel')[0];
        removeSelected.onclick = function() {
            canvas.flagForRemoval(canvas.selectedBody());
        };

        var removeAll = container.getElementsByClassName('status-btn-remove-all')[0];
        removeAll.onclick = canvas.flagAllForRemoval;

        var infoCard = container.getElementsByClassName('status-body-info')[0].children;
        for (var j = 0; j < infoCard.length; j++) {
            field.push(infoCard[j].children[0].children[0]);
        }

        var settings = container.getElementsByClassName('status-settings')[0];
        var input = settings.getElementsByTagName('input');

        // Hide helper plane
        input[0].onchange = function() {
            canvas.toggleHelperPlane();
            return false;
        };

        // Hide axis helper
        input[1].onchange = function() {
            canvas.toggleAxisHelper();
            return false;
        };


        window.setInterval(updateBodyInfo, 250);

        return container;
    }

    function pauseToggle() {
        pauseBtn.textContent = canvas.pauseToggle() ? 'Resume' : 'Pause';
    }

    function updateBodyInfo() {
        var phys = canvas.getBodyPhys(canvas.selectedBody());

        if (phys) {
            field[0].textContent = phys.x.toFixed(2);
            field[1].textContent = phys.y.toFixed(2);
            field[2].textContent = phys.z.toFixed(2);
            field[3].textContent = phys.m.toExponential(2);
            field[4].textContent = phys.r.toFixed(2);
            field[5].textContent = phys.s.toFixed(2);
        } else {
            for (var i = field.length - 1; i >= 0; i--) {
                field[i].textContent = '-';
            }
        }

        numBodies.textContent = canvas.getNumBodies();
    }

    return {
        domElement: init(),
        pauseToggle: pauseToggle
    };
})();

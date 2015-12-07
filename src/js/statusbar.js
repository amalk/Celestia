"use strict";

var statusBar = (function() {

    var pauseBtn = null;
    var field = [];
    var numBodies = null;
    var curPos = null;
    var posVector = new THREE.Vector3(0, 60, 300);

    function init() {
        var container = document.createElement('div');
        container.id = 'status';
        container.innerHTML = statusBarHTML;

        var subMenus = container.getElementsByClassName('status-btn-sub');

        function handleClick(e) {
            for (var i = 0, clickedOn = 0; i < subMenus.length; i++) {
                if (!subMenus[i].contains(e.target)) {
                    subMenus[i].children[1].style.display = 'none';
                } else {
                    clickedOn = i;
                }
            }

            var style = subMenus[clickedOn].children[1].style;
            style.display = style.display === 'block' ? 'none' : 'block';

            return false;
        }

        for (var i = 0; i < subMenus.length; i++) {
            if (i === 0) // Menu button
                subMenus[i].onclick = handleClick;
            else
                subMenus[i].children[0].onclick = handleClick;
        }


        pauseBtn = container.getElementsByClassName('status-btn-pause')[0];
        pauseBtn.onclick = pauseToggle;

        numBodies = container.getElementsByClassName('status-info-bodycount')[0];
        numBodies = numBodies.children[0];

        var posBtn = container.getElementsByClassName('status-btn-pos')[0];
        var posCard = container.getElementsByClassName('status-cur-pos')[0];
        posBtn.onclick = function() {
            var style = posCard.style;
            style.display = style.display === 'block' ? 'none' : 'block';
            return false;
        };
        curPos = container.getElementsByClassName('status-pos');
        for (var i = 0; i < curPos.length; i++) {
            curPos[i].children[0].onkeypress = function(e) {
                return (e.charCode >= 48 && e.charCode <= 57) ||
                    e.charCode === 45;
            };
            curPos[i].children[0].onchange = function() {
                posVector.setX(parseInt(curPos[0].children[0].value));
                posVector.setY(parseInt(curPos[1].children[0].value));
                posVector.setZ(parseInt(curPos[2].children[0].value));
            };
            curPos[i].children[0].onblur = function() {
                canvas.focusAndMoveCamera(posVector);
            };
        }


        // Sub-menu buttons

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

        var cameraPos = canvas.getCameraPosition();
        if (curPos[0].children[0] !== document.activeElement)
            curPos[0].children[0].value = cameraPos.x >> 0;
        if (curPos[1].children[0] !== document.activeElement)
            curPos[1].children[0].value = cameraPos.y >> 0;
        if (curPos[2].children[0] !== document.activeElement)
            curPos[2].children[0].value = cameraPos.z >> 0;
    }

    return {
        domElement: init(),
        pauseToggle: pauseToggle
    };
})();

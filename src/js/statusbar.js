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

        subMenus[0].onclick = function() {
            subMenus[1].children[1].style.display = 'none';
            var style = subMenus[0].children[1].style;
            style.display = style.display === 'block' ? 'none' : 'block';
            return false;
        };

        subMenus[1].onclick = function() {
            subMenus[0].children[1].style.display = 'none';
            var style = subMenus[1].children[1].style;
            style.display = style.display === 'block' ? 'none' : 'block';
            return false;
        };

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

        var helpBtn = container.getElementsByClassName('status-btn-help')[0];
        var helpCard = container.getElementsByClassName('status-help-card')[0];
        helpBtn.onclick = function() {
            helpCard.style.display = helpCard.style.display === 'block' ? 'none' : 'block';
        };

        pauseBtn = container.getElementsByClassName('status-btn-pause')[0];
        pauseBtn.onclick = pauseToggle;

        var popup = container.getElementsByClassName('status-body-info')[0].children;
        for (var j = 0; j < popup.length; j++) {
            field.push(popup[j].children[0].children[0]);
        }

        numBodies = container.getElementsByClassName('status-info-bodycount')[0];
        numBodies = numBodies.children[0];

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

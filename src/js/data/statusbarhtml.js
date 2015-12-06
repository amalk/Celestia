var statusBarHTML =
  '<ul>\
    <li class="status-btn-sub">\
      <div class="hover-on">Menu</div>\
      <ul>\
        <li><div class="hover-on status-btn-add">Add Body</div></li>\
        <li>\
          <div class="hover-on">Remove Body</div>\
          <ul>\
            <li>\
              <div class="hover-on status-btn-remove-sel">Remove Selected</div>\
            </li>\
            <li>\
              <div class="hover-on status-btn-remove-all">Remove All</div>\
            </li>\
          </ul>\
        </li>\
      </ul>\
    </li>\
\
    <li class="status-btn-sub">\
      <div class="hover-on">Body Info</div>\
      <ul class="status-body-info">\
        <li><div>X: <span>-</span></div></li>\
        <li><div>Y: <span>-</span></div></li>\
        <li><div>Z: <span>-</span></div></li>\
        <li><div>Mass: <span>-</span></div></li>\
        <li><div>Radius: <span>-</span></div></li>\
        <li><div>Speed: <span>-</span></div></li>\
      </ul>\
    </li>\
\
    <li class="status-btn-sub">\
      <div class="hover-on">Settings</div>\
      <div class="status-settings">\
        <label>\
          <input type="checkbox" name="hide-plane" /> Hide helper plane\
        </label>\
        <label>\
          <input type="checkbox" name="hide-axis" /> Hide axis helper\
        </label>\
      </div>\
    </li>\
\
    <li class="status-btn-sub">\
      <div class="hover-on status-btn-help">Help</div>\
      <div class="status-help-card">\
          <span>Controls:</span>\
          <p>Use arrow keys for looking around.</p>\
          <p>W, S, A, D for moving forward, backward, left and right.</p>\
          <p>R, F for moving up and down.</p>\
          <p>Q, E for rolling left and right.</p>\
          <span>Other:</span>\
          <p>Bodies can be selected by clicking on them.</p>\
          <p>Simulation is paused after adding a body; use the Resume button to unpause.</p>\
      </div>\
    </li>\
\
    <li class="status-info">\
      <div class="status-info-bodycount">\
        # of bodies: <span>0</span>\
      </div>\
      <div class="status-pos status-pos-x">\
        X: <span>-</span>\
      </div>\
      <div class="status-pos status-pos-y">\
        Y: <span>-</span>\
      </div>\
      <div class="status-pos status-pos-z">\
        Z: <span>-</span>\
      </div>\
    </li>\
\
    <li class="status-btn-pause-wrap">\
      <div class="hover-on status-btn-pause">Start</div>\
    </li>\
\
  </ul>\
';

var statusBarHTML =
  '<ul>\
    <li class="status-btn-sub">\
      <div>Menu</div>\
      <ul>\
        <li><div class="status-btn-add">Add Body</div></li>\
        <li>\
          <div>Remove Body</div>\
          <ul>\
            <li><div class="status-btn-remove-sel">Remove Selected</div></li>\
            <li><div class="status-btn-remove-all">Remove All</div></li>\
          </ul>\
        </li>\
      </ul>\
    </li>\
\
    <li class="status-btn-sub">\
      <div>Body Info</div>\
      <ul class="status-body-info">\
        <li><div class="status-div-nohover">X: <span>-</span></div></li>\
        <li><div class="status-div-nohover">Y: <span>-</span></div></li>\
        <li><div class="status-div-nohover">Z: <span>-</span></div></li>\
        <li><div class="status-div-nohover">Mass: <span>-</span></div></li>\
        <li><div class="status-div-nohover">Radius: <span>-</span></div></li>\
        <li><div class="status-div-nohover">Speed: <span>-</span></div></li>\
      </ul>\
    </li>\
\
    <li class="status-btn-sub">\
      <div>Settings</div>\
      <div class="status-settings status-div-nohover">\
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
      <div class="status-btn-help">Help</div>\
      <div class="status-help-card status-div-nohover">\
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
      <div class="status-div-nohover status-info-bodycount">\
        # of bodies: <span>0</span>\
      </div>\
    </li>\
\
    <li class="status-btn-pause-wrap"><div class="status-btn-pause">Start</div></li>\
\
  </ul>\
';

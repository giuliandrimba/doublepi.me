import jQuery from "jquery";
import * as routes from "scripts/shared/routes";

jQuery(function() {
  document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
  if(window.screen.availWidth > 1000)
    routes.init()
})

document.domain = "doublepi.me"

import ways from "ways";
import waysBrowser from "ways-browser";
import layout from "scripts/views/layout";
import welcome from "scripts/views/welcome";
import about from "scripts/views/about";
import Work from "scripts/views/work";

let workView = undefined;

export function init() {

  // ways.use(waysBrowser);
  ways.mode("destroy+run");
  ways("/", requestIn, requestOut);
  ways("/welcome", requestIn, requestOut, "/");
  ways("/about", requestIn, requestOut, "/");
  ways("/:work", requestIn, requestOut, "/");
  ways.go("/welcome");

  history.pushState(null, null, location.href);
}

export var prevSection = undefined;
export var currentSection = undefined;
export var currentSectionName = undefined;

function requestIn(req, done) {

  currentSectionName = req.url.substring(1)

  window.ga('send', 'pageview', `/${currentSectionName}`);

  if (/welcome/.test(req.pattern)){
    currentSection = welcome;
    welcome.intro(req, done);
    return;
  } else if (/about/.test(req.pattern)){
    currentSection = about;
    about.intro(req, done);
    return;
  } else if (/:work/.test(req.pattern)){
    currentSection = workView;
    workView = new Work()
    workView.intro(req, done);
    return;
  } else if(/\//.test(req.pattern)) {
    layout.intro(req, done);
    return;
  }
}

function requestOut(req, done) {
  prevSection = req.url.substring(1);

  if (/welcome/.test(req.pattern)){
    welcome.outro(req, done);
    return;
  } else if (/:work/.test(req.pattern)){
    if(workView) {
      workView.outro(req, done);
      return;
    }
  } else if (/about/.test(req.pattern)){
    about.outro(req, done);
    return;
  } else if (/\//.test(req.pattern)) {
    layout.outro(req, done);
  }
}

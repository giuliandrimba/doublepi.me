import {$,TM} from "scripts/shared/vendors";
import happens from "happens";

class Frame {
  constructor(dom, id) {
    happens(this);
    this.id = id;
    this.el = dom;
    this.el.data("id", id);
    this.events()
  }

  events() {
    $(window).bind("resize", this.resize.bind(this));
    this.resize();
    this.el.bind("click", this.onClick.bind(this))
  }

  dispose() {
    $(window).unbind("resize", this.resize);
  }

  onClick () {
    this.emit("select", this);
  }

  disable() {

  }

  enable() {

  }

  resize() {

  }
}

export default Frame;

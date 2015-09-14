import tmpl from "templates/views/layout";
import {$,_} from "scripts/shared/vendors";
import * as data from "scripts/shared/data";
import ways from "ways";
import invertColor from "scripts/shared/lib/invertColor";

class Layout {

  constructor() {

    this.el = undefined;
    this.btPrev = undefined;
    this.btNext = undefined;
  }

  render() {
    this.el = $(tmpl());
    $("body").append(this.el);
  }

  intro(req, done) {
    this.render();
    this.setup()
    this.events()
    done()
  }

  outro(req, done) {
    done()
  }

  setup() {

  }

  events() {

  }

  transitionIn() {

  }

  transitionOut() {

  }

}

export default new Layout;

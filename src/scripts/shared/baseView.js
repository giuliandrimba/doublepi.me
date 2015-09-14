import * as routes from "scripts/shared/routes";
import {$,_,TM} from "scripts/shared/vendors";

export default class BaseView {
  constructor () {
    this.el = undefined;
    this.name = undefined;
    this.transitionInDone = false;
  }

  intro (req, done) {

    this.name = req.url.substring(1);

    this.render(req);
    this.setup();

    this.preload(()=> {
      this.events();
        this.el.offset().top
        this.transitionIn(()=> {
          this.transitionInDone = true;
          this.addScrollEvent()
          done();
        });
    })
  }

  outro (req, done) {
    this.removeEvents()
    this.transitionOut(()=>{
      this.transitionInDone = false;
      done()
    });
  }

  addScrollEvent() {
    VirtualScroll.on(this.scroll.bind(this));
  }

  scroll(e) {
    if(routes.currentSectionName === this.name && this.transitionInDone) {
      this.onScroll(e);
    }
  }

  render () {

  }

  checkNav() {
    if(this.paging.currentPageIndex === 0) {
      this.btPrev.addClass("hidden")
    } else {
      this.btPrev.removeClass("hidden")
    }

    if(this.paging.currentPageIndex === this.paging.totalPages - 1) {
      this.btNext.addClass("hidden")
    } else {
      this.btNext.removeClass("hidden")
    }
  }

  preload (done) {
    done()
  }

  setup() {

  }

  events () {

  }

  removeEvents() {

  }

  transitionIn (done) {
    done()
  }

  transitionOut (done) {
    done()
  }

  dispose (done) {
    done()
  }
}

import BaseView from "scripts/shared/baseView";
import tmpl from "templates/views/welcome.jade";
import {$,_} from "scripts/shared/vendors";
import paging from "2pi-paging";
import * as data from "scripts/shared/data";
import layout from "scripts/views/layout";
import ways from "ways";
import logo from "scripts/shared/comp/logo";
import key from "keymaster";

class Welcome extends BaseView {

  constructor() {
    this.el = undefined;
    this.paging = undefined;
    this.iframe = undefined;
    this.btNext = undefined;
    this.btPrev = undefined;
    this.exit = false;
    this.blocked = false;
    this.btWorks = undefined;
    this.direction = "";
  }

  render () {
    this.el = $(tmpl())
    $(".pages").append(this.el);
    this.el.append(logo.render())
    this.container = this.el.find(".iframe-container");
  }

  setup () {
    this.btNext = this.el.find(".next");
    this.btPrev = this.el.find(".prev");
    this.btWorks = this.el.find(".works-link")
    this.exit = false;
  }

  events() {

    this.paging.on("change", this.checkNav.bind(this));

    this.btNext.bind("click", this.next.bind(this));
    this.btPrev.bind("click", this.prev.bind(this));
    key('right', this.next.bind(this));
    key('left', this.prev.bind(this));
    key('d', this.next.bind(this));
    key('a', this.prev.bind(this));
    key('s', this.gotoWorks.bind(this));

    this.btWorks.bind("click", this.gotoWorks.bind(this))

    $(window).bind("resize", this.resize.bind(this));
    this.resize()
  }

  onScroll(e) {
    if(e.deltaY < -50) {
      this.gotoWorks()
    }

  }

  gotoWorks() {
    if(!this.exit)
    {
      this.exit = true;
      ways.go("/menonitas");
    }
  }

  removeEvents() {
    this.btNext.unbind("click");
    this.btPrev.unbind("click");

    key.unbind('right');
    key.unbind('left');
    key.unbind('d');
    key.unbind('a');
    key.unbind('s');

    this.paging.off("change", this.checkNav);
  }

  preload(done) {
    this.el.addClass("intro")
    logo.intro( ()=> {
      logo.startMorphing();
      data.load(this.dataLoaded.bind(this, done));
    })

  }

  introArrows() {

    this.btPrev.addClass("tween");

    _.delay( ()=> this.btPrev.addClass("tween-out"), 100);
    _.delay( ()=> this.btNext.addClass("tween"), 400);
    _.delay( ()=> this.btNext.addClass("tween-out"), 500);
  }

  showWorkButtom() {
    this.btWorks.addClass("intro");
  }

  dataLoaded(done) {
    this.model = data.find("welcome")
    this.paging = paging(this.model.data);
    this.checkNav()
    this.showWorkButtom()
    this.loadiFrame(done);
  }

  loadiFrame(done) {

    let current = this.paging.pages[0][0];

    this.iframe = $('<iframe/>', {
      src:current.url,
      frameBorder:"0",
      width:$(window).width(),
      height:$(window).height(),
      load: done
    }).appendTo(this.container)

    logo.stopMorphing()
    this.introArrows()

  }

  transitionIn(done) {
    done()
  }

  transitionOut(done) {
    logo.outro()
    _.delay(this.dispose.bind(this), 1000);
    done()
  }

  next() {
    if(!this.blocked && this.paging.hasNext()) {
      this.direction = "Next";
      this.blocked = true;
      this.paging.next()
      logo.nextMorph(()=>{
        setTimeout(()=>this.blocked = false, 1200)
      })
      this.changeLab()
    }
  }

  prev() {
    if(!this.blocked && this.paging.hasPrev()) {
      this.direction = "Prev";
      this.blocked = true;
      this.paging.prev()
      logo.nextMorph(()=> {
        setTimeout(()=>this.blocked = false, 1200)
      })
      this.changeLab()
    }
  }

  changeLab() {
    let page = this.paging.pages[this.paging.currentPageIndex]
    let url = page[0].url.replace("http://lab.doublepi.me", "");
    this.iframe[0].contentWindow.navigate(url);
    window.ga("send", "event", '/welcome/slide', this.direction, url);
  }

  dispose() {
    this.el.remove()
  }

  resize() {

    if(this.iframe) {
      this.iframe.width($(window).width());
      this.iframe.height($(window).height());
    }

  }

}

export default new Welcome

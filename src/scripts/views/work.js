import BaseView from "scripts/shared/baseView";
import scale from "2pi-scale";
import tmpl from "templates/views/work.jade";
import {$,_,TM} from "scripts/shared/vendors";
import ways from "ways";
import * as data from "scripts/shared/data";
import Slide from "scripts/shared/comp/slide";
import layout from "scripts/views/layout";
import logo from "scripts/shared/comp/logo";
import * as routes from "scripts/shared/routes";
import welcome from "scripts/views/welcome";
import invertColor from "scripts/shared/lib/invertColor";
import video from "video.js"
import key from "keymaster";

class Work extends BaseView {
  constructor() {
    this.el = undefined;
    this.bg = undefined;
    this.exit = false;
    this.slide = undefined;
    this.btDown = undefined;
    this.frame = undefined;
    this.direction = undefined;
  }

  render (req) {
    let name = req.params.work;
    this.model = data.find(name);
    this.el = $(tmpl({data:this.model}));
    $(".pages").append(this.el);
    this.slide = new Slide(this.model, this.el);
    this.changeColor()
  }

  changeColor() {
    if(this.model.background.type === "color") {
      this.slide.changeColor(invertColor(this.model.background.url))
    } else {
      this.slide.changeColor("#ffffff")
    }
  }

  setup () {
    this.bg = this.el.find(".background")
    this.btDown = this.el.find(".down");
    this.frame = $(this.el.find(".frame").get(0));
    if(this.bg.find("video").length) {
      this.video = video(this.bg.find("video").attr("id"))
      this.video.play()
    }
    this.setupTransitionIntro()
  }

  setupTransitionIntro() {

    let y = 100

    if(this.model.next && routes.prevSection === this.model.next) {
      y = -100
    }

    this.slide.setupIntro(y)

    this.bg.css({"transform":`translate3d(0,${y}%,0)`})
    this.bg.find("img").css("transform",`translate3d(0,${y}%,0)`)
    this.bg.find("video").css("transform",`translate3d(0,${y}%,0)`)
  }

  events() {

    $(window).bind("resize",this.resize.bind(this))

    this.btDown.bind("click", ()=> {
      this.direction = "next";
      this.gotoNext();
    })
    this.resize()

  }

  addScrollEvent() {
    key('w', this.gotoPrev.bind(this));
    key('s', this.gotoNext.bind(this));
    super.addScrollEvent()
  }

  gotoNext(e) {
    this.direction = "next";
    if(!this.exit && this.model.next) {
      this.exit = true;
      ways.go(`/${this.model.next}`);
    }
  }

  gotoPrev() {
    this.direction = "prev";
    if(!this.exit && this.model.prev) {
      this.exit = true;
      ways.go(`/${this.model.prev}`);
    }
  }

  transitionIn(done) {
    this.el.addClass("intro");
    this.slide.intro()
    _.delay(this.introDown.bind(this), 500)
    _.delay(done, 1200);
  }

  introDown() {
    this.btDown.addClass("tween");
    _.delay( ()=> this.btDown.addClass("tween-out"), 150);
  }

  introSlide() {
    this.slide.intro()
  }

  next() {
    window.ga("send", "event", `/${this.model.name}/slide`, "Next");
    this.slide.next()
  }

  prev() {
    window.ga("send", "event", `/${this.model.name}/slide`, "Prev");
    this.slide.prev()
  }

  transitionOut(done) {

    $(window).unbind("resize",this.resize.bind(this))

    key.unbind('w');
    key.unbind('s');

    this.slide.stop()
    if(this.direction === "prev")
      this.el.addClass("outro-down");
    else
      this.el.addClass("outro-up");

    this.slide.destroy();
    _.delay( ()=> this.dispose(), 1100);
    done();

  }

  onScroll(e) {
    if(e.deltaY > 50) {
      this.gotoPrev();
    } else if(e.deltaY < -50) {
      this.gotoNext();
    }
  }

  dispose() {
    if(this.video)
      this.video.dispose()
    this.el.remove();
    this.btDown.unbind("click")
  }

  resize() {
    let size = scale(1920,1200,$(window).width(), $(window).height())

    if(this.model.background && this.model.background.type === "video")
      size = scale(1280,720,$(window).width(), $(window).height())

    this.bg.css({width:size.width, height:size.height})
  }
}

export default Work;

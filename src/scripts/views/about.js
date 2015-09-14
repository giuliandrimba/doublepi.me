import BaseView from "scripts/shared/baseView";
import tmpl from "templates/views/about.jade";
import * as data from "scripts/shared/data";
import ways from "ways";
import {$,_,TM} from "scripts/shared/vendors";
import Words from "scripts/shared/comp/words";
import key from "keymaster";

class About extends BaseView {
  constructor() {
    this.el = undefined;
    this.bg = undefined;
    this.model = undefined;
    this.exit = false;
    this.words = new Words();
    this.wordsAr = ["WEBGL", "MATH", "PIXI", "CODE", "FRACTAL", "ART", "DESIGN", "PHYSICS", "NATURE", "CANVAS", "UI", "MOTION", "TYPOGRAPHY", "UNITY 3D", "FP", "THREE.JS", "CSS"]
    this.TOTAL_WORDS = this.wordsAr.length;
    this.wordsIndex = 0;
  }

  render(req) {
    let name = req.pattern.toString().substring(1);
    this.model = data.find(name);
    this.el = $(tmpl({data:this.model}));

    $(".pages").append(this.el);

    _.delay(()=> {
      this.words.initialize()
      this.el.append(this.words.render())
      this.el.find("canvas").css({"width":$(window).width(), "height":$(window).height()})
      this.updateWords()
    }, 900)
  }

  setup() {
    this.bg = this.el.find(".background")
  }

  events() {
    this.el.bind("click", this.updateWords.bind(this))
    $(window).bind("resize", this.resize.bind(this))
  }

  onScroll(e) {

    if(e.deltaY > 50) {
      this.gotoPrev()
    }

  }

  gotoPrev() {
    if(!this.exit) {
      this.exit = true;
      ways.go(`/${this.model.prev}`)
    }
  }

  addScrollEvent() {
    key('w', this.gotoPrev.bind(this));
    super.addScrollEvent();
  }

  updateWords() {
    if(this.words.enabled) {
      window.ga("send", "event", `/about/words`, "Clicked");
      this.words.write(this.getWord())
    }
  }

  resize() {
    this.words.resize()
  }

  getWord() {
    this.wordsIndex++;
    if(this.wordsIndex > this.TOTAL_WORDS - 1) {
      this.wordsIndex = 0;
    }

    return this.wordsAr[this.wordsIndex];
  }

  removeEvents() {

  }

  transitionIn(done) {
    this.el.addClass("intro");
    _.delay(done, 1200);
  }

  transitionOut(done) {
    this.words.disable()
    this.el.addClass("outro");
    _.delay( ()=> this.dispose(), 1100);
    done();
  }

  dispose() {
    this.exit = false;
    this.el.remove()
  }
}

export default new About;

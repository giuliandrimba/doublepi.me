import SlideText from "scripts/shared/comp/slide/text";
import SlidePlayer from "scripts/shared/comp/slide/player";
import SlideFrame from "scripts/shared/comp/slide/frame";
import paging from "2pi-paging";
import {$,TM,_} from "scripts/shared/vendors";
import key from "keymaster";
import Hammer from "hammerjs"

class Slide {

  constructor(data, dom) {
    this.model = data;
    this.el = dom.find(".comps");
    this.sections = [];
    this.hammer = new Hammer(this.el.get(0))
    this.setup();
  }

  setup() {
    this.el.find(".comp").map((i, el)=> {
      let el = $(el);

      if(el.hasClass("text")) {
        this.sections.push(new SlideText(el, i))
      }

      if(el.hasClass("player")) {
        this.sections.push(new SlidePlayer(el, i))
      } else if(el.hasClass("frame")){
        this.sections.push(new SlideFrame(el, i))
      }

    })

    this.btNext = $(".next");
    this.btPrev = $(".prev");

    this.paging = paging(this.sections, {loop:false});
    this.events();
  }

  introArrows() {
    this.btPrev.addClass("tween");

    _.delay( ()=> this.btPrev.addClass("tween-out"), 100);
    _.delay( ()=> this.btNext.addClass("tween"), 400);
    _.delay( ()=> this.btNext.addClass("tween-out"), 500);
  }

  setupIntro(y) {
    this.el.find(".comps-container").css("transform",`translate3d(0,${y}%,0)`)
  }

  intro() {
    this.el.find(".comps-container").addClass("tween")
    this.introArrows()
    _.delay(()=>this.enableComp(this.paging.pages[0][0]),1000)
  }

  events () {
    $(window).bind("resize", ()=> this.resize());
    this.resize();
    this.paging.on("change", (page, index)=> this.change(page, index))
    this.btNext.bind("click", this.next.bind(this));
    this.btPrev.bind("click", this.prev.bind(this));

    this.hammer.on('swipeleft', this.next.bind(this))
    this.hammer.on('swiperight', this.prev.bind(this))

    key('d', this.next.bind(this));
    key('a', this.prev.bind(this));
    key('right', this.next.bind(this));
    key('left', this.prev.bind(this));
    this.addSectionEvents()
    this.checkNav()
  }

  addSectionEvents() {
    let total = this.sections.length;
    for(var i = 0; i < total; i++) {
      this.sections[i].on("select", this.sectionClick.bind(this))
    }
  }

  sectionClick(e) {
    this.paging.go(e.id);
  }

  next() {
    if(!this.blocked) {
      this.blocked = true;
      this.paging.next()
    }
  }

  prev() {
    if(!this.blocked) {
      this.blocked = true;
      this.paging.prev()
    }
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

  next() {
    this.paging.next()
  }

  prev() {
    this.paging.prev()
  }

  change(page, index) {
    this.checkNav()
    this.transition(page, index);
    this.enableComp(page[0])
  }

  enableComp(currentComp) {
    this.stop()

    currentComp.enable()
  }

  stop() {
    for(var i = 0; i < this.paging.pages.length; i++) {
      let comp = this.paging.pages[i][0]
      comp.disable()
    }
  }

  changeColor(color) {
    this.el.find(".comp").find(".intro").css("background-color",`${color}`)
    this.el.find(".comp").find(".border").css("border",`6px solid ${color}`)
    this.el.find(".comp").find("p").css("color",`${color}`)
    this.el.find(".comp").find("p").find("a").css("color",`${color}`)
    $(".prev").find(".icon").css("border-right",`4px solid ${color}`)
    $(".down").find(".icon").css("border-top",`4px solid ${color}`)
    $(".next").find(".icon").css("border-left",`4px solid ${color}`)
    $(".arrow").find(".line").css("background-color",`${color}`)

    if(color === "#000000") {
      $(".link").addClass("black")
    } else {
      $(".link").removeClass("black")
    }

  }

  transition(page, index) {
    TM.to(this.el, 0.5, {x: -(this.TRANSITION_AMOUT * this.paging.currentPageIndex), ease:Expo.easeOut, onComplete:()=> this.blocked = false});
  }

  checkNavigation() {

  }

  reset(done) {
    if(this.paging.currentPageIndex > 0)
    {
      this.paging.go(0);
      setTimeout(done, 700);
    }
    else
    {
      done()
    }
  }

  position() {

    this.offset = 12 * $(window).width() / 100;
    let margin = this.FRAME_WIDTH / 2;

    this.el.find(".comp").map((i, el)=> {

      $(el).css({
        width:this.FRAME_WIDTH,
        height:this.FRAME_HEIGHT,
      })

      $(el).css({
        left: margin + ((this.FRAME_WIDTH + this.offset) * i)
      })

    })

    this.el.width(this.FRAME_WIDTH * this.el.find(".comp").length);
  }

  resize() {
    this.FRAME_WIDTH = (50 * $(window).width()) / 100
    this.FRAME_HEIGHT = (63 * this.FRAME_WIDTH) / 100
    this.position()
    this.TRANSITION_AMOUT = this.FRAME_WIDTH + this.offset;
    this.transition()
  }

  destroy() {
    for(var i = 0; i < this.sections.length; i++) {
      this.sections[i].dispose();
    }
    key.unbind('left');
    key.unbind('right');
    key.unbind('a');
    key.unbind('d');
    this.paging.off("next")
    this.paging.off("prev")
    this.sections = [];
  }

}

export default Slide;

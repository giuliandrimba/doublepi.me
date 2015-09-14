import tmpl from "templates/comp/logo";
import {$,_,TM} from "scripts/shared/vendors";
import * as matrix from "scripts/shared/lib/matrix2array";
import invertColor from "scripts/shared/lib/invertColor";

class Logo {

  constructor() {
    this.el = undefined;
    this.lines = [];
    this.interval = undefined;
    this.formatIndex = 0;
    this.FRAME_WIDTH = 950;
    this.FRAME_HEIGHT = 600;
    this.WIDTH = 302;
    this.HEIGHT = 204;
    this.STATE = "logo";
  }

  render() {
    this.el = $(tmpl())
    this.setup()
    this.events()
    let _y = 1000
    if($(window).height() > 1000) {
      _y = $(window).height()
    }
    TM.set(this.el, {y:-_y, height:1000, opacity: 1})
    return this.el;
  }

  setup() {
    this.formats = [
      [
        ["25%","0%","60%","0%"],
        ["75%","34%","100%","0%"],
        ["50%","0%","90%","0%"],
        ["50%","32%","90%","0"],
        ["0%","0%","0%","0%"],
        ["0%","0%","0%","0%"]
      ],
      [
        ["0%","0%","100%","0%"],
        ["60%","0%","100%","0%"],
        ["90%","0%","100%","0%"],
        ["-100%","0%","0%","0%"],
        ["-100%","25%","0%","25%"],
        ["-100%","65%","0%","65%"],
      ],
      [
        ["0%","0%","0%","0%"],
        ["0%","0%","0%","0%"],
        ["0%","0%","0%","0%"],
        ["0%","0%","0%","0%"],
        ["0%","25%", "0%","0%"],
        ["0%","65%","0%","48%"],
      ],
      [
        ["25%%","100%","25%%","0%"],
        ["50%%","100%","50%%","0%"],
        ["75%%","100%","75%%","0%"],
        ["0%","0%","0%","0%"],
        ["0%","48%", "0%","-150%"],
        ["0%","100%","0%","0%"],
      ],
      [
        ["25%%","0%","75%","0%"],
        ["50%%","0%","100%","0%"],
        ["75%%","0%","100%","0%"],
        ["0%","0%","0%","0%"],
        ["0%","0%","0%","0%"],
        ["0%","0%","0%","0%"],
      ],
      [
        ["75%","0%","100%","0%"],
        ["0%","0%","68%","0%"],
        ["0%","0%","34%","0%"],
        ["0%","0%","0%","0%"],
        ["0%","0%","0%","0%"],
        ["0%","0%","0%","0%"],
      ],
      [
        ["0%","0%","0%","0%"],
        ["68%","0%","68%","34%"],
        ["34%","0%","34%","0%"],
        ["34%","0%","34%","32%"],
        ["0%","0%","0%","0%"],
        ["0%","0%","0%","0%"],
      ],
      [
        ["0%","0%","25%","0%"],
        ["68%","34%","75%","34%"],
        ["34%","0%","50%","0%"],
        ["34%","32%","50%","32%"],
        ["0%","0%","0%","0%"],
        ["0%","0%","0%","0%"],
      ],
    ]

    this.lines = this.el.find(".line")
    this.elProps = window.tsung(".logo")
    this.WIDTH = parseInt(this.elProps.width);
    this.HEIGHT = parseInt(this.elProps.height);
    this.FRAME_WIDTH = (50 * $(window).width()) / 100
    this.FRAME_HEIGHT = (63 * this.FRAME_WIDTH) / 100
    this.setupFormats()
  }

  setupFormats() {

    for(let i = 0; i < this.formats.length; i++) {
      let form = this.formats[i];
      for(let j = 0; j < form.length; j++) {
        form[j][0] = (parseInt(form[j][0]) * this.WIDTH) / 100;
        form[j][2] = (parseInt(form[j][2]) * this.WIDTH) / 100;
        form[j][1] = (parseInt(form[j][1]) * this.HEIGHT) / 100;
        form[j][3] = (parseInt(form[j][3]) * this.HEIGHT) / 100;
      }
    }
  }

  changeColor(color) {
    this.el.find(".border").css("background-color", invertColor(color));
  }


  events() {
    $(window).bind("resize", ()=> this.resize())
    this.resize();
  }

  startMorphing() {
    this.stopMorphing();
    this.interval = setInterval((()=> this.nextMorph(null, true, 0.5)), 500)
  }

  stopMorphing() {
    window.clearInterval(this.interval);
  }

  morph(to, animate=true, done, time=1) {
    let format = this.formats[to];

    this.lines.map( (i, el)=> {
      TM.set($(el), {x:format[i][0], y:format[i][1]})
      if(animate) {
        TM.to($(el), time, {x:format[i][2], y:format[i][3], ease:Expo.easeInOut, onComplete:done})
      } else {
        TM.set($(el), {x:format[i][2], y:format[i][3], ease:Expo.easeOut})
      }
    })

  }

  intro(done) {
    this.morph(0, false)
    let left = $(window).width() / 2 - this.WIDTH / 2
    let top = $(window).height() / 2 - this.HEIGHT / 2
    TM.set(this.el, {x:left})
    TM.to(this.el, 2, {y:top, height:this.HEIGHT, ease:Expo.easeInOut, onComplete:done})
  }

  outro() {
    TM.to(this.el, 1.5, {y:(- $(window).height() * 1.5), height:1000, ease:Expo.easeOut})
  }

  nextMorph(done, animate=true, time=1) {
    this.formatIndex++
    if(this.formatIndex > this.formats.length - 1) {
      this.formatIndex = 0;
    }
    this.morph(this.formatIndex, animate, done, time)
  }

  resize () {
    let left = $(window).width() / 2 - this.WIDTH / 2
    let top = $(window).height() / 2 - this.HEIGHT / 2
    TM.set(this.el, {x:left, y: top})
  }

  resizeFrame() {

    this.FRAME_WIDTH = Math.floor((50 * $(window).width()) / 100);
    this.FRAME_HEIGHT = Math.floor((63 * this.FRAME_WIDTH) / 100);

    let left = $(window).width() / 2 - this.FRAME_WIDTH / 2;
    let top = $(window).height() / 2 - this.FRAME_HEIGHT / 2;
    TM.to(this.el,0.5,{width:this.FRAME_WIDTH, height:this.FRAME_HEIGHT, x:left, y:top, ease:Expo.easeOut});
  }
}

export default new Logo

import {$,_,TM} from "scripts/shared/vendors";

class Words {
  constructor() {
    this.renderer = undefined;
    this.stage = undefined;
    this.text = [];
    this.letters = undefined
    this.renderer = new PIXI.WebGLRenderer($(window).width(), $(window).height(), {transparent:true, resolution:2});
  }

  initialize() {
    this.resize()
    this.stage = new PIXI.Stage(0xFFFFFF);
    this.bgTexture = new PIXI.Texture.fromImage("/images/bg-test.png");
    this.bg = new PIXI.TilingSprite(this.bgTexture, $(window).width(), $(window).height());
    this.filter = new PIXI.TwistFilter()
    this.container = new PIXI.DisplayObjectContainer()
    this.letters = new PIXI.DisplayObjectContainer()
    this.container.width = $(window).width()
    this.container.height = $(window).height()
    this.container.addChild(this.bg)
    this.container.addChild(this.letters)
    this.container.filters = [this.filter];
    this.stage.addChild(this.container);
    this.enabled = false;
  }

  updateFilter() {
    TM.fromTo(this.filter, 1.5, {angle:0, radius:0, ease:Expo.easeOut}, {angle:(2 + Math.random() * 3), radius:(0.5 + Math.random() * 0.2), ease:Expo.easeOut})
    TM.to(this.filter.offset, 1, {x:(0.5 + Math.random() * 0.5), y:(0.5 + Math.random() * 0.5), ease:Expo.easeOut})
  }

  resize() {
    this.renderer.resize($(window).width(), $(window).height())
    this.HALF_Y = $(window).height() / 2
    this.HALF_X = $(window).width() / 2
  }

  write(text) {
    this.updateFilter()
    let pos = - ($(window).width() / 4 * Math.random())
    this.letters.removeChildren()
    this.text = []
    for(var i = 0; i < text.length; i++) {
      let size = 30 + Math.random() * 190
      let letter = new PIXI.Text(text[i],{font:`${size}px HelveticaNeueBold`, fill:"black"})
      this.letters.addChild(letter);
      this.text.push(letter);
      pos += this.text[i].width + 250 * Math.random()
      letter.x = pos;
      letter.y = Math.random() * 500
      TM.to(letter, 0.7, {y: (-50 * i), ease:Expo.easeOut})
    }
    this.letters.x = (this.HALF_X) - (this.letters.width / 2)
    this.letters.y = (this.HALF_Y)
  }

  render() {

    this.enable()

    return this.renderer.view;
  }

  animate() {
    this.renderer.render(this.stage);

    this.rAF = requestAnimationFrame(this.animate.bind(this));
  }

  enable() {
    this.enabled = true;
    this.rAF = requestAnimationFrame(this.animate.bind(this))
  }

  disable() {
    this.enabled = false;
    cancelAnimationFrame(this.rAF);
    this.stage = undefined;
    this.text = [];
    this.letters = undefined
    this.bgTexture = undefined;
    this.bg = undefined;
    this.filter = undefined;
    this.container = undefined;
    this.letters = undefined;
  }
}

export default Words;

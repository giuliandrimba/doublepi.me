import calc from "2pi-calc";
import {$,TM} from "scripts/shared/vendors";
import happens from "happens";

class Text {
  constructor(dom, id) {
    happens(this);
    this.id = id;
    this.el = dom;
    this.el.data("id", id);
    this.enabled = false;

    let self = this;

    this.resize = function() {
      let percentage = calc.percent($(window).width(), 1920);
      let fontSize = Math.round((percentage * 60) / 100);
      self.el.find("p").css("font-size",fontSize + "px");
    }

    this.events();
    this.createLinkHover()
  }

  createLinkHover() {

    let links = this.el.find("a")

    for(var i = 0; i < links.length; i++) {

      let hoverTop = $("<div class='link link-border-top'></div>")
      let hoverBottom = $("<div class='link link-border-bottom'></div>")
      let hoverLeft = $("<div class='link link-border-left'></div>")
      let hoverRight = $("<div class='link link-border-right'></div>")
      let text = $(links[i]).text()
      let span = $(`<span>${text}</span>`)

      $(links[i]).empty()
      $(links[i]).append(hoverTop)
      $(links[i]).append(hoverBottom)
      $(links[i]).append(hoverLeft)
      $(links[i]).append(hoverRight)
      $(links[i]).append(span)
    }

  }

  events() {
    $(window).bind("resize", this.resize);
    this.resize();
    this.el.bind("click", this.onClick.bind(this))
  }

  onClick(e) {
    if(!this.enabled) {
      this.emit("select", this);
      e.preventDefault()
      return false;
    }
  }

  dispose() {
    $(window).unbind("resize", this.resize);
  }

  disable() {
    this.enabled = false;
    this.el.removeClass("enabled")
  }

  enable() {
    this.enabled = true;
    this.el.addClass("enabled")
  }
}

export default Text;

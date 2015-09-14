import {$,_,TM} from "scripts/shared/vendors";
import video from "video.js"
import happens from "happens";
import scale from "2pi-scale";

window.VIDEOJS_NO_BASE_THEME = false

class Player {
  constructor(dom, id) {
    happens(this);
    this.id = id;
    this.el = dom;
    this.el.data("id", id);
    this.enabled = false;
    this.el.find("video").attr("id", "video-"+id)
    this.loaded = false;
    this.loadCallback = undefined;
    let src = this.el.find(".video").data("src");
    this.video = video("video-"+id)
    this.events();
  }

  events() {
    this.el.bind("click", this.onClick.bind(this))
    $(window).bind("resize",this.resize.bind(this))
    _.delay(()=> this.resize(), 100)
    this.video.on('loadedmetadata', ()=> this.el.find(".video").css("opacity",1))
  }

  resize() {
    let size = scale(1280,720,this.el.width(), this.el.height())
    this.el.find(".video").css({
      width:size.width,
      height:size.height,
      marginLeft:size.targetleft
    })
  }

  onClick() {
    if(!this.enabled) {
      this.emit("select", this)
      return
    }

    if(this.video.paused()) {
      this.video.play()
    } else {
      this.video.pause()
    }
  }

  enable() {
    this.enabled = true;
    this.video.play()
  }

  disable() {
    this.enabled = false;
    if(this.video)
      this.video.pause()
  }

  dispose() {
    this.video.dispose()
    this.el.unbind("click", this.onClick.bind(this))
  }
}

export default Player;

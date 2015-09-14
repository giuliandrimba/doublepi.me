export var content = undefined
var queue = undefined;

export function load(done) {

  if(content)
    return done(content)

  fetch('/data.json')
  .then(function(response) {
    var json = response.json();
    json.then( response => {
      content = response;
      content = content.map(transform);
      loadImages(done);
    })
  })
}

function loadImages(done) {
  queue = new createjs.LoadQueue(false)
  queue.addEventListener("complete", ()=> {
    done(content)
  });

  let total = content.length;
  for(var i = 0; i < total; i++) {
    if(content[i].background && content[i].background.type === "image") {
      queue.loadFile(content[i].background.url);
    }
  }
  queue.load();
}

function transform(el, i) {
  if(i > 0) {
    el.prev = content[i - 1].name
  }

  if(i < content.length - 1) {
    el.next = content[i + 1].name
  }
  return el;
}

export function find(name) {
  for(var i = 0; i < content.length; i++) {
    if(content[i].name === name) {
      return content[i];
    }
  }
}

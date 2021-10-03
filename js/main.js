(function() {
 var DEBUG, before, c, clamp, collides, ctx, delta, draw, elapsed, keysDown, keysPressed, load, loading, now, ogre, setDelta, tick, update;

 var BULLET_SPEED = 360.0;
 var ENEMY_SPEED = 50.0;
 var GRAVITY = 0.4;

 c = document.getElementById('draw');

 ctx = c.getContext('2d');

 delta = 0;

 now = 0;

 before = Date.now();

 elapsed = 0;

 loading = 0;

 DEBUG = false;
//  DEBUG = true;

 c.width = 800;

 c.height = 600;

 keysDown = {};

 keysPressed = {};

 images = [];

 audios = [];

 framesThisSecond = 0;
 fpsElapsed = 0;
 fps = 0

 click = null

 particles = []
 windParticles = []

 fired = false;

 window.addEventListener("keydown", function(e) {
         keysDown[e.keyCode] = true;
         return keysPressed[e.keyCode] = true;
         }, false);

 window.addEventListener("keyup", function(e) {
         return delete keysDown[e.keyCode];
         }, false);

 c.addEventListener("click", function(e) {
   click = {
     'x': e.offsetX,
     'y': e.offsetY,
   }
 })

 setDelta = function() {
     now = Date.now();
     delta = (now - before) / 1000;
     return before = now;
 };

 if (!DEBUG) {
     console.log = function() {
         return null;
     };
 }

 ogre = false;

var player, cog;

init = function() {
  elapsed = 0;

 player = {
   x: 400,
   y: 590,
   w: 100,
   h: 20,
 }

 cog = {
    x: 400,
    y: 400,
 }

  ogre = false;
  particles = []
  windParticles = []

  fired = false;

  for(var i = 0; i < 100; ++i) {
    windParticles.push({
      x: Math.random() * 800,
      y: Math.random() * 600,
      w: 16,
      h: 2,
    })
  }
 }

 tick = function() {
     setDelta();
     elapsed += delta;
     update(delta);
     draw(delta);
     keysPressed = {};
     click = null;
        return window.requestAnimationFrame(tick);
 };

 points = 0;

  speed = 300;
  cspeed = 3;
  wind = -20;

 update = function(delta) {

     framesThisSecond += 1;
     fpsElapsed += delta;

     if(fpsElapsed >= 1) {
        fps = framesThisSecond / fpsElapsed;
        framesThisSecond = fpsElapsed = 0;
     }

     if(!ogre)
     {
      if(keysDown[68]) {
        player.x += delta * speed;
        if (player.x + player.w / 2 > 800) {
          player.x = 800 - player.w / 2;
        }
      } else if(keysDown[65]) {
        player.x -= delta * speed;
        if (player.x - player.w / 2 < 0) {
          player.x = player.w / 2;
        }
      }

      wind = 2 * (elapsed + 10) * Math.sin(elapsed / 10);

      d = player.x - cog.x;
      cog.x -= d * delta * cspeed;
      cog.x += wind * delta;
      cog.y = -(Math.sqrt(Math.pow(200, 2) - Math.pow(cog.x - player.x, 2)) - player.y);

      points = 100 * elapsed;

      ogre = isNaN(cog.y);
     } else {
       if(keysDown[82]) {
         init();
       }
     }

     if(ogre && !fired) {
       fired = true;
       for(var i = 0; i < 200; ++i) {
            particles.push({
            x: cog.x,
            y: player.y,
            w: 2,
            h: 2,
            dx: (Math.random() - 0.5) * 500,
            dy: (Math.random() - 0.5) * 500,
            ttl: Math.random() + 0.8,
            speed: 1,
        })
       }
     }

     for(var i = windParticles.length - 1; i >= 0; i--) {
       windParticles[i].x += wind * delta;

       if(windParticles[i].x < 0) {
         windParticles[i].x += 800;
       } else if(windParticles[i].x > 800) {
         windParticles[i].x -= 800;
       }
     }

     for(var i = particles.length - 1; i >= 0; i--) {
       particles[i].ttl -= delta;

       if(particles[i].ttl <= 0) {
         particles.splice(i, 1)
         continue;
       }

       particles[i].x += particles[i].dx * particles[i].speed * delta;
       particles[i].y += particles[i].dy * particles[i].speed * delta;
     }

 };

 draw = function(delta) {
     ctx.fillStyle = "#000000";
     ctx.fillRect(0, 0, c.width, c.height);

     ctx.fillStyle = "#fafafa";
     ctx.textAlign = "center";

     particles.forEach(function(particle) {
       ctx.fillRect(particle.x, particle.y, particle.w, particle.h);
     })

     ctx.fillStyle = "#444444";

     windParticles.forEach(function(particle) {
       ctx.fillRect(particle.x, particle.y, Math.abs(wind), particle.h);
     })

     ctx.fillStyle = "#ffffff";

     ctx.strokeStyle = "#bababa";
     ctx.lineWidth = 10;

    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(cog.x, cog.y + 10);
    ctx.stroke();

     ctx.fillStyle = "#fafafa";

     ctx.fillRect(player.x - player.w / 2, player.y - player.h / 2, player.w, player.h);

     ctx.fillStyle = "#fafafa";


        ctx.fillStyle = "#ffffff";
        ctx.font = "32px Visitor";
        ctx.fillText(Math.round(points), 400, 100);

     if(ogre) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "80px Visitor";
        ctx.fillText("oh no", 400, 350);

        ctx.fillStyle = "#ffffff";
        ctx.font = "20px Visitor";
        ctx.fillText("[r] to restart", 400, 400);
     }
 };

 (function() {
  var targetTime, vendor, w, _i, _len, _ref;
  w = window;
  _ref = ['ms', 'moz', 'webkit', 'o'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  vendor = _ref[_i];
  if (w.requestAnimationFrame) {
  break;
  }
  w.requestAnimationFrame = w["" + vendor + "RequestAnimationFrame"];
  }
  if (!w.requestAnimationFrame) {
  targetTime = 0;
  return w.requestAnimationFrame = function(callback) {
  var currentTime;
  targetTime = Math.max(targetTime + 16, currentTime = +(new Date));
  return w.setTimeout((function() {
          return callback(+(new Date));
          }), targetTime - currentTime);
  };
  }
 })();

 loadImage = function(name, callback) {
    var img = new Image()
    console.log('loading')
    loading += 1
    img.onload = function() {
        console.log('loaded ' + name)
        images[name] = img
        loading -= 1
        if(callback) {
            callback(name);
        }
    }

    img.src = 'img/' + name + '.png'
 }

 load = function() {
     if(loading) {
         window.requestAnimationFrame(load);
     } else {
         window.requestAnimationFrame(tick);
     }
 };

 init();
 load();

}).call(this);

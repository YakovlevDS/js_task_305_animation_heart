let c = document.querySelector('canvas'),
  $ = c.getContext('2d'),
  w = (c.width = innerWidth),
  h = (c.height = innerHeight),
  r = Math.random,
  cos = Math.cos,
  sin=Math.sin,
  pi=Math.PI,
  p=pi*2,
  time = 0,
  e = [],
  traceCount = 50,
  pointsOrigin = [],
  dr = 0.1,
  i,
  config = {
    traceK: 0.4,
    timeDelta: 0.01
  }

$.fillStyle = 'black'
$.fillRect(0, 0, w, h)

const heartPos = rad => 
   [
    Math.pow(sin(rad), 3),
    -(
      15 * cos(rad) -
      5 * cos(2 * rad) -
      2 * cos(3 * rad) -
      cos(4 * rad)
    )
  ]


const scaleAndTranslate = (pos, sx, sy, dx, dy)=> 
  [dx + pos[0] * sx, dy + pos[1] * sy]





// const pointPosition=(a,b)=>{
//   for (let i = 0; i < p; i += dr)
//   pointsOrigin.push(scaleAndTranslate(heartPos(i), a, b, 0, 0))
// }
// pointPosition=(210,13)
for (i = 0; i < p; i += dr)
  pointsOrigin.push(scaleAndTranslate(heartPos(i), 210, 13, 0, 0))

for (i = 0; i < p; i += dr)
  pointsOrigin.push(scaleAndTranslate(heartPos(i), 150, 9, 0, 0))

for (i = 0; i < p; i += dr)
  pointsOrigin.push(scaleAndTranslate(heartPos(i), 90, 5, 0, 0))

let heartPointsCount = pointsOrigin.length,
  targetPoints = []

const pulse = (kx, ky)=>{
  for (i = 0; i < pointsOrigin.length; i++) {
    targetPoints[i] = []
    targetPoints[i][0] = kx * pointsOrigin[i][0] + w / 2
    targetPoints[i][1] = ky * pointsOrigin[i][1] + h / 2
  }
}


for (i = 0; i < heartPointsCount; i++) {
  let x = r() * w
  let y = r() * h

  e[i] = {
    vx: 0,
    vy: 0,
    R: 2,
    speed: r() + 5,
    q: ~~(r() * heartPointsCount),
    D: 2 * (i % 2) - 1,
    force: 0.2 * r() + 0.7,
    f:
      'hsla(0,' +
      ~~(40 * r() + 60) +
      '%,' +
      ~~(60 * r() + 20) +
      '%,.3)',
    trace: []
  }

  for (let k = 0; k < traceCount; k++)
    e[i].trace[k] = {
      x: x,
      y: y
    }
}




const loop = () => {
  let n = -cos(time)

  pulse((1 + n) * 0.5, (1 + n) * 0.5)

  time += (sin(time) < 0 ? 9 : n > 0.8 ? 0.2 : 1) * config.timeDelta

  $.fillStyle = 'rgba(0,0,0,.1)'
  $.fillRect(0, 0, w, h)

  for (i = e.length; i--; ) {
    let u = e[i],
      q = targetPoints[u.q],
      dx = u.trace[0].x - q[0],
      dy = u.trace[1].y - q[1],
      length = Math.sqrt(dx * dx + dy * dy)

    if (10 > length) {
      if (0.95 < r()) {
        u.q = ~~(r() * heartPointsCount)
      } else {
        if (0.99 < r()) {
          u.D *= -1
        }

        u.q += u.D
        u.q %= heartPointsCount

        if (0 > u.q) {
          u.q += heartPointsCount
        }
      }
    }

    u.vx += (-dx / length) * u.speed
    u.vy += (-dy / length) * u.speed

    u.trace[0].x += u.vx
    u.trace[0].y += u.vy

    u.vx *= u.force
    u.vy *= u.force

    for (k = 0; k < u.trace.length - 1; ) {
      let T = u.trace[k]
      let N = u.trace[++k]
      N.x -= config.traceK * (N.x - T.x)
      N.y -= config.traceK * (N.y - T.y)
    }

    $.fillStyle = u.f
    for (k = 0; k < u.trace.length; k++) {
      $.fillRect(u.trace[k].x, u.trace[k].y, 1, 1)
    }
  }

  requestAnimationFrame(loop, c)
}

window.addEventListener('resize',  ()=> {
  w = c.width = innerWidth
  h = c.height = innerHeight
  $.fillStyle = 'black'
  $.fillRect(0, 0, w, h)
})

loop()

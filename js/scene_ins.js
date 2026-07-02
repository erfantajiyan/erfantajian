(function(){
  const canvas = document.getElementById('hero-canvas');
  const hero = document.querySelector('.hero');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, hero.clientWidth/hero.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 7.5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(hero.clientWidth, hero.clientHeight);

  const key = new THREE.PointLight(0xf2c230, 1.3, 20);
  key.position.set(4, 3, 5);
  scene.add(key);
  const fill = new THREE.PointLight(0x4c7a96, 1.2, 20);
  fill.position.set(-4, -2, 4);
  scene.add(fill);
  scene.add(new THREE.AmbientLight(0x12161a, 0.7));

  // Signature: a mechanical "inspection gauge" — hex-nut core, gear-tooth ring,
  // and a pointer, reading clearly as an engineering/inspection instrument.
  const group = new THREE.Group();

  const coreGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.55, 6);
  const coreMat = new THREE.MeshStandardMaterial({ color:0xc7ccd0, flatShading:true, metalness:0.65, roughness:0.3 });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.rotation.x = Math.PI/2;
  group.add(core);

  const boreGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.6, 24);
  const boreMat = new THREE.MeshStandardMaterial({ color:0x12161a, metalness:0.2, roughness:0.6 });
  const bore = new THREE.Mesh(boreGeo, boreMat);
  bore.rotation.x = Math.PI/2;
  group.add(bore);

  const ringGeo1 = new THREE.TorusGeometry(2.0, 0.02, 8, 100);
  const ringMat1 = new THREE.MeshBasicMaterial({ color:0x4c7a96, transparent:true, opacity:0.85 });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  group.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(2.55, 0.02, 8, 100);
  const ring2 = new THREE.Mesh(ringGeo2, ringMat1.clone());
  ring2.rotation.x = Math.PI/2.3;
  group.add(ring2);

  const ringGeo3 = new THREE.TorusGeometry(3.05, 0.015, 8, 100);
  const ring3mat = new THREE.MeshBasicMaterial({ color:0xf2c230, transparent:true, opacity:0.7 });
  const ring3 = new THREE.Mesh(ringGeo3, ring3mat);
  ring3.rotation.x = Math.PI/1.7;
  ring3.rotation.y = Math.PI/5;
  group.add(ring3);

  // Gear teeth around the outer ring — the detail that reads as "mechanical"
  const toothMat = new THREE.MeshStandardMaterial({ color:0xf2c230, metalness:0.5, roughness:0.3 });
  const toothGeo = new THREE.BoxGeometry(0.28, 0.42, 0.16);
  const toothCount = 20;
  for (let i=0; i<toothCount; i++){
    const a = (i/toothCount) * Math.PI * 2;
    const tooth = new THREE.Mesh(toothGeo, toothMat);
    tooth.position.set(Math.cos(a)*3.05, Math.sin(a)*3.05, 0);
    tooth.rotation.z = a;
    group.add(tooth);
  }

  // Needle / inspection pointer
  const needleGeo = new THREE.ConeGeometry(0.05, 1.8, 8);
  const needleMat = new THREE.MeshStandardMaterial({ color:0xf2c230, metalness:0.5, roughness:0.25 });
  const needle = new THREE.Mesh(needleGeo, needleMat);
  needle.position.set(0.7, 0.6, 0.2);
  needle.rotation.z = -0.6;
  group.add(needle);

  const wireGeo = new THREE.IcosahedronGeometry(1.7, 0);
  const wireMat = new THREE.MeshBasicMaterial({ color:0xedeff0, wireframe:true, transparent:true, opacity:0.15 });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  group.add(wire);

  scene.add(group);

  let dragging = false;
  let prevX = 0, prevY = 0;
  let velX = 0.0007, velY = 0.0003;
  let targetVelX = velX, targetVelY = velY;

  function pointerDown(x, y){ dragging = true; prevX = x; prevY = y; }
  function pointerMove(x, y){
    if (!dragging) return;
    const dx = x - prevX, dy = y - prevY;
    group.rotation.y += dx * 0.006;
    group.rotation.x += dy * 0.006;
    targetVelX = dx * 0.0003;
    targetVelY = dy * 0.0003;
    prevX = x; prevY = y;
  }
  function pointerUp(){ dragging = false; }

  canvas.addEventListener('mousedown', e => pointerDown(e.clientX, e.clientY));
  window.addEventListener('mousemove', e => pointerMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', pointerUp);
  canvas.addEventListener('touchstart', e => { const t=e.touches[0]; pointerDown(t.clientX, t.clientY); }, {passive:true});
  canvas.addEventListener('touchmove', e => { const t=e.touches[0]; pointerMove(t.clientX, t.clientY); }, {passive:true});
  canvas.addEventListener('touchend', pointerUp);

  let scrollT = 0;
  window.addEventListener('scroll', () => {
    scrollT = Math.min(window.scrollY / hero.clientHeight, 1);
  }, { passive:true });

  function resize(){
    camera.aspect = hero.clientWidth / hero.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(hero.clientWidth, hero.clientHeight);
  }
  window.addEventListener('resize', resize);

  function animate(){
    requestAnimationFrame(animate);
    if (!reduceMotion){
      velX += (targetVelX - velX) * 0.02;
      velY += (targetVelY - velY) * 0.02;
      targetVelX *= 0.98; targetVelY *= 0.98;
      if (!dragging){
        group.rotation.y += Math.max(velX, 0.0006);
        group.rotation.x += velY * 0.3;
      }
      wire.rotation.z += 0.0007;
    }
    camera.position.z = 7.5 + scrollT * 3.2;
    group.position.y = -scrollT * 0.5;
    renderer.render(scene, camera);
  }
  animate();
})();

(() => {
  const $ = s => document.querySelector(s);
  const menuToggle = $('.menu-toggle'), nav = $('.main-nav');
  menuToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); menuToggle?.setAttribute('aria-expanded','false');
  }));
  const year = $('#year'); if (year) year.textContent = new Date().getFullYear();
  const dateInput = document.querySelector('input[name="date"]');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
  $('#booking-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const form=e.currentTarget; if(!form.reportValidity()) return;
    const data=Object.fromEntries(new FormData(form).entries());
    $('#form-status').textContent=`Thank you, ${data.name}. Your ${data.service.toLowerCase()} request for ${data.date} is ready for the salon team. This is a demo confirmation only — no booking was sent.`;
    form.reset(); if(dateInput) dateInput.min=new Date().toISOString().split('T')[0];
  });
  if(window.gsap){
    if(window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    gsap.from('.page-hero > *, .hero-copy > *',{y:24,opacity:0,duration:.9,stagger:.1,ease:'power3.out'});
    if(window.ScrollTrigger) gsap.utils.toArray('.service-card,.detail-row,.team-card,.look,.value-grid article,.about-copy,.booking-form').forEach(el=>{
      gsap.from(el,{y:32,opacity:0,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}});
    });
  }
  const stage=$('#three-stage');
  if(stage && window.THREE){
    const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(36,1,.1,100);
    camera.position.set(0,0,9);
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
    renderer.setSize(stage.clientWidth,stage.clientHeight);
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
    stage.appendChild(renderer.domElement);
    scene.add(new THREE.AmbientLight(0xffffff,1.3));
    const key=new THREE.PointLight(0xffd58b,55,30);key.position.set(3,3,5);scene.add(key);
    const rim=new THREE.PointLight(0x9d642a,35,25);rim.position.set(-4,-2,-2);scene.add(rim);
    const group=new THREE.Group();scene.add(group);
    const mats=[new THREE.MeshStandardMaterial({color:0xc99a4b,metalness:.88,roughness:.2}),new THREE.MeshStandardMaterial({color:0xf0d69a,metalness:.82,roughness:.16}),new THREE.MeshStandardMaterial({color:0x755022,metalness:.9,roughness:.25})];
    [[1.18,.035,mats[0]],[.83,.025,mats[1]],[.53,.045,mats[2]]].forEach(([r,t,m],i)=>{const mesh=new THREE.Mesh(new THREE.TorusGeometry(r,t,16,120),m);mesh.rotation.set(.8+i*.5,.3+i*.4,.2-i*.3);group.add(mesh)});
    const geo=new THREE.IcosahedronGeometry(.12,2);
    for(let i=0;i<13;i++){const bead=new THREE.Mesh(geo,mats[i%2]);const a=i/13*Math.PI*2;bead.position.set(Math.cos(a)*1.48,Math.sin(a)*1.48,Math.sin(a*2)*.28);group.add(bead)}
    group.position.set(.7,-.05,0);let px=0,py=0;
    stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();px=((e.clientX-r.left)/r.width-.5)*.35;py=((e.clientY-r.top)/r.height-.5)*.25});
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches, clock=new THREE.Clock();
    function resize(){const w=stage.clientWidth||1,h=stage.clientHeight||1;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)}
    addEventListener('resize',resize);
    function draw(){const t=clock.getElapsedTime();if(!reduced){group.rotation.y=t*.16+px;group.rotation.x=Math.sin(t*.35)*.12+py;group.position.y=-.05+Math.sin(t*.65)*.08}renderer.render(scene,camera);requestAnimationFrame(draw)}
    draw();
  }
})();
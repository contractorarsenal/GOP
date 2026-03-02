document.addEventListener('DOMContentLoaded', function() {

// TYPEWRITER
(function(){
  var phrases=['Interior Painters.','Exterior Painters.','Cabinet Refinishers.','Deck Refinishers.','Drywall Experts.','Painting Done Right.'];
  var pauses=[1900,1900,1900,1900,1900,3000];
  var el=document.getElementById('twText');
  if(!el) return;
  var pi=0,ci=0,del=false;
  function tick(){
    var w=phrases[pi];
    if(!del){
      el.textContent=w.slice(0,++ci);
      if(ci===w.length){del=true;setTimeout(tick,pauses[pi]);return;}
      setTimeout(tick,70);
    } else {
      el.textContent=w.slice(0,--ci);
      if(ci===0){del=false;pi=(pi+1)%phrases.length;setTimeout(tick,380);return;}
      setTimeout(tick,36);
    }
  }
  setTimeout(tick,800);
})();

// LIGHTBOX
function openLightbox(src,cap){
  document.getElementById('lbImg').src=src;
  document.getElementById('lbCap').textContent=cap;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow='';
}
window.openLightbox=openLightbox;
window.closeLightbox=closeLightbox;
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeLightbox();});

// SCROLL
window.addEventListener('scroll',function(){
  var pct=window.scrollY/(document.body.scrollHeight-window.innerHeight)*100;
  var pb=document.getElementById('progressBar');
  if(pb) pb.style.width=pct+'%';
  var st=document.getElementById('scrollTop');
  if(st) st.classList.toggle('visible',window.scrollY>400);
  document.querySelectorAll('.nav-links a').forEach(function(a){
    a.classList.remove('active');
    var href=a.getAttribute('href');
    if(!href||href==='#') return;
    var s=document.querySelector(href);
    if(s&&window.scrollY>=s.offsetTop-120&&window.scrollY<s.offsetTop+s.offsetHeight-120)
      a.classList.add('active');
  });
  var mm=document.getElementById('mobileMenu');
  if(mm&&mm.classList.contains('open')) closeMobileMenu();
});

// REVEAL
var io=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      e.target.classList.remove('animate-hidden');
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
},{threshold:0.05,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(function(el){
  el.classList.add('animate-hidden');
  io.observe(el);
});

// FAQ
function toggleFaq(el){
  var item=el.parentElement;
  var was=item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('open');});
  if(!was) item.classList.add('open');
}
window.toggleFaq=toggleFaq;

});

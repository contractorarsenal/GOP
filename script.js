document.addEventListener('DOMContentLoaded', function() {

// HERO SLIDESHOW
(function(){
  var imgs=[
    'https://github.com/user-attachments/assets/edc5689a-cc10-43bc-8f87-94d6bda41c6c',
    'https://github.com/user-attachments/assets/594c9943-683b-40e5-8a3e-a8ce4863684b',
    'https://github.com/user-attachments/assets/2580df62-14e5-4881-a9ec-a0139858db0a',
    'https://github.com/user-attachments/assets/76ce2e78-4462-41d4-82ba-4cb5584ec370',
    'https://github.com/user-attachments/assets/deedef0b-42ae-4114-9a8f-1952c4f5044b',
    'https://github.com/user-attachments/assets/c3b91a44-8db6-40e8-a0db-5de35dd7b4cf'
  ];
  var container=document.getElementById('heroSlides');
  if(!container) return;
  var slides=imgs.map(function(src){
    var d=document.createElement('div');
    d.className='hero-slide';
    d.style.backgroundImage='url('+src+')';
    container.appendChild(d);
    return d;
  });
  var cur=0;
  slides[0].classList.add('active');
  setInterval(function(){
    slides[cur].classList.remove('active');
    cur=(cur+1)%slides.length;
    slides[cur].classList.add('active');
  },6000);
})();

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

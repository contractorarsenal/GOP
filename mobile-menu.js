document.addEventListener('DOMContentLoaded', function() {

// MOBILE MENU
function toggleMobileMenu(){
  var m=document.getElementById('mobileMenu');
  var b=document.getElementById('hamburger');
  var open=m.classList.contains('open');
  m.classList.toggle('open',!open);
  b.classList.toggle('open',!open);
  document.body.style.overflow=open?'':'hidden';
}
function closeMobileMenu(){
  var m=document.getElementById('mobileMenu');
  var b=document.getElementById('hamburger');
  if(m) m.classList.remove('open');
  if(b) b.classList.remove('open');
  document.body.style.overflow='';
}
window.toggleMobileMenu=toggleMobileMenu;
window.closeMobileMenu=closeMobileMenu
document.addEventListener('click',function(e){
  var m=document.getElementById('mobileMenu');
  var b=document.getElementById('hamburger');
  if(m&&m.classList.contains('open')&&!m.contains(e.target)&&!b.contains(e.target))
    closeMobileMenu();
});

});

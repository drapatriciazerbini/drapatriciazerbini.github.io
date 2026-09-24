const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); navigation.classList.toggle('is-open', open); });
navigation.addEventListener('click', e => { if(e.target.closest('a')) { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label','Abrir menu'); navigation.classList.remove('is-open'); } });
document.addEventListener('keydown', e => { if(e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {menu.click();menu.focus();} });
const video = document.querySelector('#hero-video');
const toggle = document.querySelector('#video-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function updateVideoControl(){ const paused = video.paused; toggle.setAttribute('aria-label', paused ? 'Reproduzir vídeo de fundo' : 'Pausar vídeo de fundo'); document.querySelector('#video-icon').textContent = paused ? '▷' : 'Ⅱ'; document.querySelector('#video-label').textContent = paused ? 'Reproduzir vídeo' : 'Pausar vídeo'; }
if(reducedMotion.matches){video.autoplay=false;video.pause();}
/* Pede o play explicitamente. O atributo autoplay sozinho falha em parte das
   maquinas: Chrome com economia de energia, aba aberta em segundo plano, ou o
   video ainda sem dados suficientes no primeiro instante. Nesses casos o site
   ficava na imagem de capa parada e a pessoa precisava achar o botao. A
   tentativa se repete uma vez, quando o video avisa que ja da para tocar.
   Quem pediu menos movimento continua de fora: a condicao abaixo respeita isso,
   e um play recusado nao gera erro, so atualiza o rotulo do botao. */
else{
  const tentarTocar = () => { const p = video.play(); if(p && p.catch) p.catch(updateVideoControl); };
  tentarTocar();
  video.addEventListener('canplay', () => { if(video.paused && !video.dataset.pausadoPelaPessoa) tentarTocar(); }, {once:true});
}
toggle.addEventListener('click', () => {if(video.paused){delete video.dataset.pausadoPelaPessoa;video.play().catch(updateVideoControl);}else{video.dataset.pausadoPelaPessoa='1';video.pause();}});
video.addEventListener('play',updateVideoControl);video.addEventListener('pause',updateVideoControl);updateVideoControl();
const config=window.SITE_CONFIG||{};
const phone=String(config.whatsapp||'').replace(/\D/g,'');
if(/^55\d{10,11}$/.test(phone)){
 const schedule=document.querySelector('#schedule-link');
 schedule.href='https://wa.me/'+phone+'?text='+encodeURIComponent('Olá! Gostaria de informações sobre uma consulta com a Dra. Patrícia Zerbini.');
 schedule.target='_blank';schedule.rel='noopener noreferrer';schedule.hidden=false;

}
const secretaria=String(config.secretaria||'').replace(/\D/g,'');
if(/^55\d{10,11}$/.test(secretaria)){
 const link=document.querySelector('#secretary-link');
 if(link){link.href='https://wa.me/'+secretaria+'?text='+encodeURIComponent('Olá! Gostaria de falar com a secretária da Dra. Patrícia Zerbini.');link.hidden=false;}
}
const officePhone=String(config.phone||'').replace(/\D/g,'');
if(/^55\d{10,11}$/.test(officePhone)){
 document.querySelectorAll('#phone-link,#contact-phone').forEach(link=>{link.href='tel:+'+officePhone;});
 if(config.phoneDisplay)document.querySelector('#contact-phone').textContent=config.phoneDisplay;
}
if(config.region){document.querySelector('#region-answer').textContent='Atendimento em '+config.region+'. Em outras cidades a visita também é possível, com acréscimo no valor. Consulte a disponibilidade para o seu endereço antes de agendar.';const region=document.querySelector('#contact-region');region.textContent=config.region;region.hidden=false;}
if(config.crmUf){document.querySelectorAll('.hero-signature,.doctor-register,.footer p').forEach(element=>{element.textContent=element.textContent.replace('CRM 90998','CRM-'+config.crmUf+' 90998');});}
video.addEventListener('error',()=>{video.hidden=true;document.querySelector('.hero-media').style.background="url('assets/hero-danca-poster.jpg') 72% center / cover";toggle.hidden=true;});
reducedMotion.addEventListener('change',e=>{if(e.matches)video.pause();});


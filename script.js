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
// Quem chegou pelo Google (19/10/2026): anuncio (gclid, gbraid, wbraid ou
// utm_source=google) ou busca do Google como pagina de origem. A mensagem do
// WhatsApp leva a frase "Encontrei a Dra. Patricia Zerbini no Google", que o
// sistema reconhece e mostra na aba Google da Visao geral. Nada e enviado a
// lugar nenhum: so muda o texto pronto do botao.
function veioDoGoogle(){
 let marcado=false;
 try{marcado=sessionStorage.getItem('veio_do_google')==='1';}catch(e){}
 if(marcado)return true;
 let sim=false;
 try{
  const p=new URLSearchParams(location.search);
  sim=['gclid','gbraid','wbraid'].some(k=>p.has(k))||/google/i.test(p.get('utm_source')||'');
  if(!sim&&document.referrer){const host=new URL(document.referrer).hostname;sim=/(^|\.)google\.[a-z.]+$/i.test(host);}
 }catch(e){}
 if(sim){try{sessionStorage.setItem('veio_do_google','1');}catch(e){}}
 return sim;
}
const doGoogle=veioDoGoogle();
const textoDoWhatsApp=doGoogle
 ?'Olá! Encontrei a Dra. Patrícia Zerbini no Google e gostaria de informações sobre uma consulta.'
 :'Olá! Gostaria de informações sobre uma consulta com a Dra. Patrícia Zerbini.';
if(/^55\d{10,11}$/.test(phone)){
 const schedule=document.querySelector('#schedule-link');
 schedule.href='https://wa.me/'+phone+'?text='+encodeURIComponent(textoDoWhatsApp);
 schedule.target='_blank';schedule.rel='noopener noreferrer';schedule.hidden=false;

}
// O numero em destaque abre o mesmo WhatsApp do botao: o numero do robo
// nao recebe ligacao, entao um link tel: levaria a uma chamada sem resposta.
if(/^55\d{10,11}$/.test(phone)){
 const destaque=document.querySelector('#contact-phone');
 if(destaque){destaque.href='https://wa.me/'+phone+(doGoogle?'?text='+encodeURIComponent(textoDoWhatsApp):'');destaque.target='_blank';destaque.rel='noopener noreferrer';if(config.phoneDisplay)destaque.textContent=config.phoneDisplay;}
}
if(config.region){document.querySelector('#region-answer').textContent='Atendimento em '+config.region+'. Em outras cidades a visita também é possível, com acréscimo no valor. Consulte a disponibilidade para o seu endereço antes de agendar.';const region=document.querySelector('#contact-region');region.textContent=config.region;region.hidden=false;}
if(config.crmUf){document.querySelectorAll('.hero-signature,.doctor-register,.footer p').forEach(element=>{element.textContent=element.textContent.replace('CRM 90998','CRM-'+config.crmUf+' 90998');});}
video.addEventListener('error',()=>{video.hidden=true;document.querySelector('.hero-media').style.background="url('assets/hero-danca-poster.jpg') 72% center / cover";toggle.hidden=true;});
reducedMotion.addEventListener('change',e=>{if(e.matches)video.pause();});


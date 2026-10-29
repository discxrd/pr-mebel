export const YandexMetrikaId = 111452570;
export const YandexMetrika = `
(function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym');

    ym(${YandexMetrikaId}, 'init', {webvisor:true, trackHash:true, clickmap:true, accurateTrackBounce:true, trackLinks:true});
`;

export const MarquizId = '6a58ca8d47cd9f00192456bb';

export const MarquizInit = `
(function(w, d, s, o){
  var j = d.createElement(s); j.async = true; j.src = '//script.marquiz.ru/v2.js'; j.onload = function() {
    if (document.readyState !== 'loading') Marquiz.init(o);
    else document.addEventListener("DOMContentLoaded", function() { Marquiz.init(o); });
  };
  d.head.insertBefore(j, d.head.firstElementChild);
})(window, document, 'script', {
  host: '//quiz.marquiz.ru',
  region: 'ru',
  id: '${MarquizId}',
  autoOpen: false,
  autoOpenFreq: 'once',
  openOnExit: false,
  disableOnMobile: false
});
`;

export const MarquizWidget = `
(function(t, p) {
  window.Marquiz ? Marquiz.add([t, p]) : document.addEventListener('marquizLoaded', function() { Marquiz.add([t, p]); });
})('Widget', {
  id: '${MarquizId}',
  position: 'right',
  delay: 15,
  disableOnMobile: false,
  disableIfClosed: false,
  gradientEnabled: true,
  gradientColor: '#303537',
  gradientIntensity: 40,
  titleColor: '#ffffff',
  hiddenArrowOnMobile: false
});
`;

export const RoistatProjectId = '4ead3703db96d46fa27003830e283153';

export const RoistatMetrika = `
(function(w, d, s, h, id) {
    w.roistatProjectId = id; w.roistatHost = h; w.roistatPage = d.location.href; w.roistatReferrer = d.referrer;
    var p = d.location.protocol == "https:" ? "https://" : "http://";
    var u = /^.*roistat_visit=[^;]+(.*)?$/.test(d.cookie) ? "/dist/module.js" : "/api/site/1.0/"+id+"/init?referrer="+encodeURIComponent(d.location.href);
    var js = d.createElement(s); js.charset="UTF-8"; js.async = 1; js.src = p+h+u; var js2 = d.getElementsByTagName(s)[0]; js2.parentNode.insertBefore(js, js2);
})(window, document, 'script', 'cloud.roistat.com', '${RoistatProjectId}');
`;

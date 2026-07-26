// MegaWebCreations — shared interactions (multi-page safe)
(function(){
  var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  var nav = document.getElementById("nav");
  if (nav){ var onS = function(){ nav.classList.toggle("scrolled", window.scrollY > 8); }; onS(); addEventListener("scroll", onS, {passive:true}); }

  var tg = document.getElementById("navToggle"), links = document.getElementById("navLinks");
  if (tg && links){
    tg.addEventListener("click", function(){ var o = links.classList.toggle("open"); tg.classList.toggle("open", o); tg.setAttribute("aria-expanded", String(o)); });
    links.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", function(){ links.classList.remove("open"); tg.classList.remove("open"); tg.setAttribute("aria-expanded","false"); }); });
  }

  // reveal on scroll (robust)
  var revealEls = [].slice.call(document.querySelectorAll(".reveal"));
  function vh(){ return window.innerHeight || document.documentElement.clientHeight; }
  var ticking = false;
  function checkReveal(){ ticking = false; var h = vh(); revealEls.forEach(function(el){ if(el.classList.contains("in")) return; var r = el.getBoundingClientRect(); if(r.top < h - 60 && r.bottom > 0) el.classList.add("in"); }); }
  function raf(){ if(ticking) return; ticking = true; requestAnimationFrame(checkReveal); }
  checkReveal(); addEventListener("scroll", raf, {passive:true}); addEventListener("resize", raf, {passive:true}); addEventListener("load", checkReveal);
  setTimeout(function(){ revealEls.forEach(function(el){ el.classList.add("in"); }); }, 2600);

  // magnetic + tilt (fine pointers only)
  if (matchMedia("(pointer:fine)").matches){
    document.querySelectorAll(".mag").forEach(function(b){
      b.addEventListener("pointermove", function(e){ var r = b.getBoundingClientRect(); b.style.transform = "translate(" + (e.clientX-r.left-r.width/2)*.3 + "px," + (e.clientY-r.top-r.height/2)*.45 + "px)"; });
      b.addEventListener("pointerleave", function(){ b.style.transform = "translate(0,0)"; });
    });
    document.querySelectorAll(".tcard").forEach(function(c){
      c.addEventListener("pointermove", function(e){ var r = c.getBoundingClientRect(); var px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5; c.style.transform = "perspective(800px) rotateY(" + (px*8) + "deg) rotateX(" + (-py*8) + "deg)"; });
      c.addEventListener("pointerleave", function(){ c.style.transform = "perspective(800px) rotateY(0) rotateX(0)"; });
    });
  }

  // FAQ
  document.querySelectorAll(".qa").forEach(function(qa){
    var btn = qa.querySelector(".qa__q"), ans = qa.querySelector(".qa__a");
    btn.addEventListener("click", function(){
      var open = qa.classList.contains("open");
      document.querySelectorAll(".qa.open").forEach(function(o){ if(o!==qa){ o.classList.remove("open"); o.querySelector(".qa__q").setAttribute("aria-expanded","false"); o.querySelector(".qa__a").style.maxHeight=null; } });
      qa.classList.toggle("open", !open); btn.setAttribute("aria-expanded", String(!open));
      ans.style.maxHeight = open ? null : ans.scrollHeight + "px";
    });
  });

  // contact form (only where present)
  var form = document.getElementById("contactForm");
  if (form){
    var FORM_ENDPOINT = "https://formspree.io/f/mzdlnajd";
    var note = document.getElementById("formNote"), submitBtn = form.querySelector('button[type="submit"]');
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name")||"").toString().trim(), email = (data.get("email")||"").toString().trim(), message = (data.get("message")||"").toString().trim();
      var first = name.split(" ")[0], emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if(!name || !emailOk || !message){ note.classList.add("error"); note.textContent = "Please add your name, a valid email, and a short message."; return; }
      note.classList.remove("error");
      var label = submitBtn.textContent; submitBtn.disabled = true; submitBtn.textContent = "Sending…"; note.textContent = "";
      fetch(FORM_ENDPOINT, { method:"POST", body:data, headers:{ Accept:"application/json" } })
        .then(function(res){ if(res.ok){ note.textContent = "Thanks, " + first + "! Your request is in — we'll be in touch within one business day."; form.reset(); } else { note.classList.add("error"); note.textContent = "Something went wrong. Please email megawebcreations613@gmail.com."; } })
        .catch(function(){ note.classList.add("error"); note.textContent = "Network error. Please email megawebcreations613@gmail.com."; })
        .finally(function(){ submitBtn.disabled = false; submitBtn.textContent = label; });
    });
  }
})();

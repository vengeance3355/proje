(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const preloader = document.querySelector(".preloader");

  function hidePreloader() {
    if (!preloader) return;
    preloader.style.transform = "translate3d(0, -101%, 0)";
    preloader.style.transition = "transform 800ms cubic-bezier(0.22, 1, 0.36, 1)";
    window.setTimeout(() => {
      preloader.style.display = "none";
    }, 850);
  }

  window.setTimeout(hidePreloader, 3200);

  if (window.lucide) {
    window.lucide.createIcons();
  }

  const splitTargets = document.querySelectorAll("[data-split]");
  splitTargets.forEach((target) => {
    const words = target.textContent.trim().split(" ");
    target.textContent = "";

    words.forEach((word, index) => {
      const line = document.createElement("span");
      const inner = document.createElement("span");
      line.className = "line";
      inner.textContent = `${word}${index === words.length - 1 ? "" : "\u00a0"}`;
      line.appendChild(inner);
      target.appendChild(line);
    });
  });

  function initLenis() {
    if (prefersReducedMotion || !window.Lenis) return null;

    const lenis = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return lenis;
  }

  function initMotion() {
    if (!window.gsap) {
      hidePreloader();
      return;
    }

    const gsap = window.gsap;
    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
    }

    if (prefersReducedMotion) {
      gsap.set(".preloader", { display: "none" });
      return;
    }

    gsap.set("[data-reveal]", { y: 28, opacity: 0 });
    gsap.set("[data-split] .line span", { yPercent: 110, opacity: 0 });

    const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
    intro
      .to(".preloader__mark i", { rotate: 360, duration: 0.9, ease: "power2.inOut" })
      .to(".preloader", { yPercent: -101, duration: 1.15, ease: "expo.inOut" }, "-=0.08")
      .set(".preloader", { display: "none" })
      .to(".hero [data-split] .line span", {
        yPercent: 0,
        opacity: 1,
        stagger: 0.032,
        duration: 1.05
      }, "-=0.52")
      .to(".site-header[data-reveal], .hero [data-reveal]", {
        y: 0,
        opacity: 1,
        stagger: 0.06,
        duration: 0.9
      }, "-=0.75");

    if (!window.ScrollTrigger) {
      gsap.set(".section [data-reveal], .section [data-split] .line span", { clearProps: "all" });
      return;
    }

    document.querySelectorAll(".section").forEach((section) => {
      const revealItems = section.querySelectorAll("[data-reveal]");
      const splitItems = section.querySelectorAll("[data-split] .line span");

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%"
        }
      })
        .to(splitItems, {
          yPercent: 0,
          opacity: 1,
          stagger: 0.025,
          duration: 0.9,
          ease: "power4.out"
        })
        .to(revealItems, {
          y: 0,
          opacity: 1,
          stagger: 0.055,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.68");
    });

    gsap.to(".hero__content", {
      yPercent: -8,
      opacity: 0.68,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to(".monogram-stage", {
      rotate: 12,
      scale: 0.94,
      ease: "none",
      scrollTrigger: {
        trigger: ".trust",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    initMagnetic(gsap);
    initTilt(gsap);
  }

  function initMagnetic(gsap) {
    if (isTouch || prefersReducedMotion) return;

    document.querySelectorAll(".magnetic").forEach((item) => {
      item.addEventListener("mousemove", (event) => {
        const rect = item.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        gsap.to(item, { x: x * 0.18, y: y * 0.24, duration: 0.45, ease: "power3.out" });
      });

      item.addEventListener("mouseleave", () => {
        gsap.to(item, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });
      });
    });
  }

  function initTilt(gsap) {
    if (isTouch || prefersReducedMotion) return;

    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;

        gsap.to(card, {
          rotateY: px * 7,
          rotateX: py * -7,
          z: 22,
          duration: 0.55,
          ease: "power3.out"
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          z: 0,
          duration: 0.75,
          ease: "elastic.out(1, 0.55)"
        });
      });
    });
  }

  function initCursorLight() {
    const light = document.querySelector(".cursor-light");
    if (!light || isTouch || prefersReducedMotion) return;

    let x = window.innerWidth * 0.62;
    let y = window.innerHeight * 0.42;
    let tx = x;
    let ty = y;

    window.addEventListener("pointermove", (event) => {
      tx = event.clientX;
      ty = event.clientY;
    });

    function animate() {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      light.style.transform = `translate3d(${x - light.offsetWidth / 2}px, ${y - light.offsetHeight / 2}px, 0)`;
      requestAnimationFrame(animate);
    }

    animate();
  }

  function initScene() {
    const canvas = document.getElementById("rayne-scene");
    if (!canvas || !window.THREE) return;

    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.2, 8);

    const group = new THREE.Group();
    scene.add(group);

    const champagne = new THREE.Color("#d7bd8f");
    const petal = new THREE.Color("#c5969e");
    const sage = new THREE.Color("#8fb19f");

    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: "#2a1719",
      metalness: 0.42,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.16,
      transmission: 0.08,
      transparent: true,
      opacity: 0.9
    });

    const rimMaterial = new THREE.MeshStandardMaterial({
      color: champagne,
      metalness: 0.86,
      roughness: 0.22
    });

    const petalMaterial = new THREE.MeshPhysicalMaterial({
      color: petal,
      metalness: 0.18,
      roughness: 0.28,
      clearcoat: 0.75,
      transparent: true,
      opacity: 0.58
    });

    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.18, 0.09, 180, 18, 2, 3), rimMaterial);
    knot.rotation.set(0.7, 0.12, 0.2);
    group.add(knot);

    const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.012, 16, 180), rimMaterial);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.72, 0.008, 16, 180), petalMaterial);
    ringA.rotation.set(1.18, 0.18, -0.22);
    ringB.rotation.set(1.34, -0.22, 0.14);
    group.add(ringA, ringB);

    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.78, 2), coreMaterial);
    core.rotation.set(0.6, 0.2, 0.4);
    group.add(core);

    const petalGeometry = new THREE.ConeGeometry(0.12, 1.55, 4, 1, true);
    for (let i = 0; i < 9; i += 1) {
      const petalMesh = new THREE.Mesh(petalGeometry, petalMaterial);
      const angle = (Math.PI * 2 * i) / 9;
      petalMesh.position.set(Math.cos(angle) * 2.35, Math.sin(angle) * 0.42, Math.sin(angle) * 0.86);
      petalMesh.rotation.set(1.3, 0, -angle);
      petalMesh.scale.setScalar(0.72 + (i % 3) * 0.11);
      group.add(petalMesh);
    }

    const lineMaterial = new THREE.LineBasicMaterial({
      color: sage,
      transparent: true,
      opacity: 0.22
    });

    for (let i = 0; i < 16; i += 1) {
      const points = [];
      const offset = (i - 8) * 0.24;
      for (let j = 0; j < 22; j += 1) {
        const t = j / 21;
        points.push(new THREE.Vector3(
          -5.2 + t * 10.4,
          Math.sin(t * Math.PI * 2 + i * 0.32) * 0.06 + offset,
          -1.8 + Math.cos(t * Math.PI + i) * 0.2
        ));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      line.rotation.z = -0.22;
      line.position.y = -1.35;
      scene.add(line);
    }

    scene.add(new THREE.AmbientLight("#fff4e6", 0.78));

    const keyLight = new THREE.PointLight("#f6d7b1", 2.6, 18);
    keyLight.position.set(3.4, 3.2, 4.8);
    scene.add(keyLight);

    const roseLight = new THREE.PointLight("#c5969e", 1.35, 12);
    roseLight.position.set(-3.5, -0.6, 3.8);
    scene.add(roseLight);

    const pointer = { x: 0, y: 0 };
    window.addEventListener("pointermove", (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * -2;
    });

    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();

    function render() {
      const time = clock.getElapsedTime();
      const scroll = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);

      group.rotation.y = time * 0.11 + pointer.x * 0.18 + scroll * 1.4;
      group.rotation.x = -0.08 + pointer.y * 0.08 + scroll * 0.28;
      group.position.x = window.innerWidth < 900 ? 0.48 : 1.9;
      group.position.y = window.innerWidth < 900 ? -0.25 : 0.16;
      group.scale.setScalar(window.innerWidth < 680 ? 0.72 : 1);

      core.rotation.y -= 0.006;
      knot.rotation.z += 0.0026;
      ringA.rotation.z -= 0.0018;
      ringB.rotation.z += 0.0014;

      keyLight.position.x = 3.2 + pointer.x * 1.6;
      keyLight.position.y = 3 + pointer.y * 1.1;

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    render();
  }

  initLenis();
  initMotion();
  initCursorLight();
  initScene();
})();

/**
 * ============================================================
 * BLOCK 11: JAVASCRIPT – MAIN.JS
 * Datei: js/main.js
 *
 * Enthält: Alle interaktiven Verhaltensweisen der Seite,
 *          aufgeteilt in klar benannte, in sich geschlossene
 *          Initialisierungs-Funktionen.
 *
 * Module (IIFE-gekapselt, kein globaler Namespace-Leak):
 *   1. initHeaderScroll()   – Sticky Shadow beim Scrollen
 *   2. initFadeIn()         – Scroll-triggered Einblendungen
 *   3. initSmoothScroll()   – Sanftes Scrollen zu Ankern
 *   4. initCountUp()        – Zähl-Animation (Proof Stats)
 *
 * ISOLATION: Alle Event-Listener werden auf spezifische
 *            Elemente registriert. Keine window-Globals.
 * ============================================================
 */

(function () {
    'use strict';

    /* ----------------------------------------------------------
     * 1. HEADER SCROLL EFFECT
     *    Klasse .hdr-is-scrolled wird gesetzt/entfernt, wenn
     *    der User mehr als 20px gescrollt hat.
     * ---------------------------------------------------------- */
    function initHeaderScroll() {
        const header = document.getElementById('site-header');
        if (!header) return;

        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 20) {
                header.classList.add('hdr-is-scrolled');
            } else {
                header.classList.remove('hdr-is-scrolled');
            }
        }, { passive: true });
    }

    /* ----------------------------------------------------------
     * 2. SCROLL-TRIGGERED FADE-IN
     *    Beobachtet alle Elemente mit .anim-fade-in und fügt
     *    .anim-visible hinzu, sobald sie im Viewport sichtbar
     *    werden. Danach wird die Beobachtung gestoppt.
     * ---------------------------------------------------------- */
    function initFadeIn() {
        const targets = document.querySelectorAll('.anim-fade-in');
        if (!targets.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('anim-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        targets.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ----------------------------------------------------------
     * 3. SMOOTH SCROLL FÜR ANKERLINKS
     *    Alle internen Anker (#...) werden sanft gescrollt.
     *    Header-Höhe wird automatisch als Offset berechnet.
     * ---------------------------------------------------------- */
    function initSmoothScroll() {
        const header = document.getElementById('site-header');

        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.pageYOffset -
                    headerHeight -
                    20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    /* ----------------------------------------------------------
     * 4. COUNT-UP ANIMATION (Proof Stats)
     *    Zählt numerische Werte von 0 auf den Zielwert hoch,
     *    sobald das Element sichtbar wird.
     *    Unterstützt Präfix, Zahl und Suffix im Text-Content.
     *    Beispiel: "150+" → zählt 0 → 150, Suffix "+" bleibt.
     * ---------------------------------------------------------- */
    function initCountUp() {
        const statNumbers = document.querySelectorAll('.proof-bar__stat-number');
        if (!statNumbers.length) return;

        const statsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                const finalText = el.textContent.trim();
                const numericMatch = finalText.match(/\d+/);

                if (numericMatch) {
                    const finalNum = parseInt(numericMatch[0], 10);
                    const matchIndex = finalText.indexOf(numericMatch[0]);
                    const prefix  = finalText.substring(0, matchIndex);
                    const suffix  = finalText.substring(matchIndex + numericMatch[0].length);

                    let current  = 0;
                    const duration = 1500;   // ms
                    const stepTime = 20;     // ms pro Frame
                    const steps    = duration / stepTime;
                    const increment = finalNum / steps;

                    const counter = setInterval(function () {
                        current += increment;
                        if (current >= finalNum) {
                            current = finalNum;
                            clearInterval(counter);
                        }
                        el.textContent = prefix + Math.round(current) + suffix;
                    }, stepTime);
                }

                statsObserver.unobserve(el);
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(function (el) {
            statsObserver.observe(el);
        });
    }

    /* ----------------------------------------------------------
     * BOOTSTRAP – Alle Module nach DOM-Ready starten
     * ---------------------------------------------------------- */
    function init() {
        initHeaderScroll();
        initFadeIn();
        initSmoothScroll();
        initCountUp();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM bereits geladen (defer / async Script)
        init();
    }

}());

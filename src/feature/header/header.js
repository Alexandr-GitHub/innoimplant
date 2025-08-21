import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { CSS_MEDIA_DESKTOP } from '../../consts/medias.js';

gsap.registerPlugin(ScrollTrigger);

export function initHeader() {
    const header = document.querySelector('header.ns-header');

    if(!header) return;

    const headerStripe = header.querySelector('.ns-header__stripe');
    const headerMain = header.querySelector('.ns-header__main');
    const headerNav = header.querySelector('.ns-header__nav');
    const headerMobile = header.querySelector('.ns-header__mobile');
    const headerMobileSearch = header.querySelector('.ns-header__mobile-search');

    const ctx = gsap.context(() => {
        // ANIMATION FOR DESKTOP
        gsap.matchMedia().add(CSS_MEDIA_DESKTOP, () => {
            const tl = gsap.timeline({
                paused: true,
                defaults: {
                    ease: 'none'
                }
            });

            tl
                .to(headerMain, {
                    y: () => -headerStripe.clientHeight
                }, '')
                .to(headerNav, {
                    y: () => -(headerStripe.clientHeight + headerNav.clientHeight),
                }, '')
                .to(header, {
                    height: () => headerMain.clientHeight + 1,
                }, '')

            const stPinned = ScrollTrigger.create({
                trigger: document.body,
                start: 'top top',
                pin: header,
                markers: true,
            })

            const stToggle = ScrollTrigger.create({
                trigger: document.body,
                start: 'top top',
                end: '+=50',
                animation: tl,
                scrub: true,
            })

            return () => {
                stPinned.kill();
                stToggle.kill();

                tl.revert();
            }
        })

        // ANIMATION FOR MOBILE
        gsap.matchMedia().add(CSS_MEDIA_DESKTOP, () => {
            const tl = gsap.timeline({
                paused: true,
                defaults: {
                    ease: 'none'
                }
            });

            tl
                .fromTo(header, 
                    { height: () => headerMobile.clientHeight + 1 }, 
                    { height: 'auto' }
                , '')
                .fromTo(headerMobileSearch, 
                    { y: () => -headerMobileSearch.clientHeight },
                    { y: 0 }
                , '')
            

            const handleClick = (event) => {
                const searchButton = event.target.closest('.ns-header--search-drop');

                if(searchButton) {
                    if(tl.progress === 1) {
                        tl.reverse();
                    } else {
                        tl.play();
                    }
                }
            }

            tl.play(0);

            header.addEventListener('click', handleClick);

            return () => {

                header.removeEventListener('click', handleClick);
            }
        });
    })
}
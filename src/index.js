(function(window) {

    let anim = null;

    document.addEventListener("DOMContentLoaded", () => {
        initializeLightening();
        initializeAnimation();
        initializeMenu();
    });

    function initializeLightening() {
        // Grab the drop down list item element
        const assemblies = document.querySelectorAll(".assembly");
        const light = document.getElementById("light");

        GraphicObjectsProcessor.initialize(assemblies, light);
    }

    function initializeAnimation() {

        anim = anime({
            targets: '.assembly',
            scale: [0, 1],
            translateY: [-100, 0],
            rotateY: '1turn',
            direction: 'reverse',
            duration: 1000,
            elasticity: 300,
            delay: (elem, i, l) => i * 100,
            autoplay: false
        });

        const helpers = document.querySelectorAll(".animation-helper");
        const item = document.querySelector(".list-item");

        // It's assumed all assemblies have equal width and height
        const centerCord = {
            x: item.offsetWidth / 2,
            y: item.offsetHeight / 2
        };

        for (const helper of helpers) {
            const frontFace = helper.querySelector('.front');

            frontFace.addEventListener('mouseleave', function () {
                helper.style.transform = 'none';
            });
            frontFace.addEventListener('mousemove', function (event) {
                let xDelta = ((event.offsetX - centerCord.x) / centerCord.x);
                let yDelta = ((event.offsetY - centerCord.y) / centerCord.y);
                helper.style.transform = 'translateZ(20px) rotateX(' + yDelta * -5 + 'deg) rotateY(' + xDelta * -5 + 'deg)';
            });
        }
    }

    function initializeMenu() {
        const list = document.querySelector('.list');
        const menu = document.querySelector('.menu');

        document.querySelector('.list').addEventListener('dblclick', (event) =>{
            event.stopPropagation();
        });

        let isAnimationStarted = false;
        document.addEventListener('dblclick', (event) => {
            if (isAnimationStarted)
                return;

            isAnimationStarted = true;
            if (menu.classList.contains('hidden')) {
                list.style.top = `${event.clientY}px`;
                list.style.left = `${event.clientX}px`;
                menu.classList.remove('hidden');
            }

            window.setTimeout(() => {
                isAnimationStarted = false;
                if (!menu.classList.contains('hidden') && anim.reversed) {
                    menu.classList.add('hidden');
                }
            }, anim.duration);

            anim.play();
            anim.reverse();
        });
    }
})(window);

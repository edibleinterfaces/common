let pulse;

export default {

    bind: function(el, binding, vnode) {

        const { 

            timeout=300, 
            bgColor='transparent',
            transitionType = 'ease-in-out'

        } = binding.value;

        pulse = function(event) {

            const originalBgColor = event.target.style.background;
            const originalTransitionType = event.target.style.transition;

            event.target.style.background = bgColor;
            event.target.style.transition = `background ${timeout/1000}s ${transitionType}`;

            setTimeout(() => {
                event.target.style.background = originalBgColor;
                event.target.style.transition = originalTransitionType;
            }, timeout/2);


        };

        el.addEventListener('click',pulse); 

    },
    unbind: function(el) {
        console.log(el);
        el.removeEventListener('click', pulse);
    }

};

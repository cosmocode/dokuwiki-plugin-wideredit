jQuery(function () {
    let timer = 0;
    let selected = null;
    let cancelled = false;
    const $buttons = jQuery('.dokuwiki .secedit.editbutton_section .btn_secedit button');

    const LONGPRESS = 350;  // same as CSS transition time

    $buttons
        /**
         * disable standard action
         */
        .on('click', (event) => {
            event.stopPropagation();
            event.preventDefault();
            return false;
        })
        /**
         * Start counter for longpress detection
         */
        .on('mousedown touchstart', (event) => {
            dragging = false;
            if (event.targetTouches && event.targetTouches.length > 1) return; // multitouch
            event.stopPropagation();
            event.preventDefault();

            const target = event.target;
            timer = Date.now();
            cancelled = false;
            // start the CSS transition
            $buttons.not(target).removeClass('selected');
            jQuery(target).toggleClass('selected');
        })
        /**
         * Check if the finger dragged off the button and cancel processing then
         */
        .on('touchmove', (event) => {
            if (cancelled) return;
            const target = event.target;
            if (target !== document.elementFromPoint(
                event.changedTouches[0].clientX,
                event.changedTouches[0].clientY
            )) {
                //dragged off element - cancel
                jQuery(target).toggleClass('selected');
                cancelled = true;
            }
        })
        /**
         * Handle button release
         */
        .on('mouseup touchend', (event) => {
            if (cancelled) return;
            if (event.targetTouches && event.targetTouches.length > 1) return; // multitouch
            event.stopPropagation();
            event.preventDefault();

            const target = event.target;
            const $me = jQuery(target);

            const timed = Date.now() - timer;
            const isLongpress = timed > LONGPRESS;

            $buttons.removeClass('selected');
            if (isLongpress) {
                if (selected === target) {
                    selected = null;
                } else {
                    selected = target;
                    $me.addClass('selected');
                }
            } else {
                if (selected !== null) {
                    // multi edit, replace the range
                    target.form.elements['range'].value = newRange(
                        target.form.elements['range'].value,
                        selected.form.elements['range'].value
                    );
                }
                // submit the form
                target.form.submit();
            }
        })
    ;

    /**
     * Parse the given range strings and return the new range string
     *
     * @param {string} r1
     * @param {string} r2
     * @return {string}
     */
    function newRange(r1, r2) {
        const [r1min, r1max] = r1.split('-');
        const [r2min, r2max] = r2.split('-');

        let min = Math.min(parseInt(r1min), parseInt(r2min));
        let max = 0;
        if (r1max !== '' && r2max !== '') max = Math.max(parseInt(r1max), parseInt(r2max));

        return `${min}-${max}`;
    }
});

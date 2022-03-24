jQuery(function () {
    let timer = 0;
    let selected = null;
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
            const target = event.targetTouches ? event.targetTouches[0].target : event.target;
            timer = Date.now();
            // start the CSS transition
            $buttons.not(target).removeClass('selected');
            jQuery(target).toggleClass('selected');
        })
        /**
         * Handle button release
         */
        .on('mouseup touchstop', (event) => {
            const target = event.targetTouches ? event.targetTouches[0].target : event.target;
            const $me = jQuery(target);

            const timed = Date.now() - timer;
            const isLongpress = timed > LONGPRESS;

            if (isLongpress) {
                $buttons.removeClass('selected');
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

jQuery(function () {
    const $buttons = jQuery('.dokuwiki .secedit.editbutton_section .btn_secedit button');

    $buttons
        /**
         * Set selected button on context click
         */
        .on('contextmenu', (event) => {
            event.stopPropagation();
            event.preventDefault();

            const target = event.target;
            $buttons.not(target).removeClass('selected');
            jQuery(target).toggleClass('selected');
        })
        /**
         * Adjust range if selection exists
         */
        .on('click', (event) => {
            const target = event.target;
            const selected = $buttons.filter('.selected').get(0);
            if (selected !== null) { // multi edit
                // if other section comes first, use its hid and summary
                if (selected.form.elements['range'].value < target.form.elements['range'].value) {
                    target.form.elements['hid'].value = selected.form.elements['hid'].value;
                    target.form.elements['summary'].value = selected.form.elements['summary'].value;
                }
                // replace the range
                target.form.elements['range'].value = newRange(
                    target.form.elements['range'].value,
                    selected.form.elements['range'].value
                );
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

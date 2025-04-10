class BaseFocusableElement extends BaseElement {
    constructor() {
        super();
        this.tabIndex = 0;
        this.addEventListener('keydown',(ev) => {
            if (ev.shiftKey === true && ev.key === 'Tab') {
                if (this.goToPreviousFocusable()) ev.preventDefault();
            }
        });
    }

    goToPreviousFocusable(maxLoop=20) {
        let previousElement = this;
        let tabIndex = this.tabIndex;
        if (tabIndex > 0) for (let i=0; i<maxLoop; i++) {
            previousElement = previousElement.previousElementSibling ?? previousElement.previousSibling;
            if (previousElement == null || previousElement.disabled === true) break;
            if (tabIndex > 1 && previousElement.tabIndex == tabIndex-1) { previousElement.focus(); return true; }
            if (tabIndex === 1 && previousElement.tabIndex === 0) { previousElement.focus(); return true; }
        }

        previousElement = this;
        for (let i=0; i<maxLoop; i++) {
            previousElement = previousElement.previousElementSibling ?? previousElement.previousSibling;
            if (previousElement == null || previousElement.disabled === true) break;
            if (isFocusable(previousElement) === true) { previousElement.focus(); return true; }
        }

        return false;
    }
}
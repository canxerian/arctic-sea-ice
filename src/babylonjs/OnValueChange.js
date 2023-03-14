/**
 * Raise onChangeStart/onChangeEnd events on a value on an object 
 * first changes and then resumes
 */
export default class OnValueChange {
    constructor(obj, key, onChangeBegin, onChangeEnd) {
        this.isChanged = false;
        this.initialValue = obj[key];
        this.obj = obj;
        this.key = key;
        this.onChangeBegin = onChangeBegin;
        this.onChangeEnd = onChangeEnd;
    }

    update() {
        if (this.obj[this.key] !== this.initialValue) {
            if (!this.isChanged) {
                this.isChanged = true;
                this.onChangeBegin?.();
            }
        }
        else if (this.obj[this.key] === this.initialValue && this.isChanged) {
            this.isChanged = false;
            this.onChangeEnd?.();
        }
    }
}
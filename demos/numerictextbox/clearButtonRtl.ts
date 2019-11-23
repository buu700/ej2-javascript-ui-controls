import { NumericTextBox } from '../../src/numerictextbox/numerictextbox';
/**
 * Default NumericTextBox sample
 */

let numeric1: NumericTextBox = new NumericTextBox({
    value: 10,
    floatLabelType: "Auto",
    enableRtl:true,
	showClearButton: true,
});
numeric1.appendTo('#numeric1');
let numeric2: NumericTextBox = new NumericTextBox({
    value: 10,
    floatLabelType: "Auto",
	showClearButton: true,
    enableRtl:true,
	showSpinButton: false
});
numeric2.appendTo('#numeric2');





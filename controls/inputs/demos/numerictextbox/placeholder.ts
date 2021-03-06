import { NumericTextBox } from '../../src/numerictextbox/numerictextbox';
/**
 * Default NumericTextBox sample
 */
let numeric: NumericTextBox = new NumericTextBox({
    floatLabelType: "Auto",
    placeholder: "Enter value"
});
numeric.appendTo('#numeric');

let percent: NumericTextBox = new NumericTextBox({
    format: 'p2',
    min: 0,
    max: 1,
    step: 0.01,
    floatLabelType: "Auto",
    placeholder: "Enter percentage"
});
percent.appendTo('#percent');

let currency: NumericTextBox = new NumericTextBox({
    format: 'c2',
    floatLabelType: "Auto",
    placeholder: "Enter amount"
});
currency.appendTo('#currency');


/**
 * Spreadsheet default sample
 */
import { Spreadsheet, SheetModel, ColumnModel, SortEventArgs, CellSaveEventArgs, SaveCompleteEventArgs, CollaborativeEditArgs, BeforeCellFormatArgs, CellModel, CellInfoEventArgs, overlay } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { defaultData as dataSource } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';
import { Overlay } from '../../../../src/spreadsheet/services';

enableRipple(true);

let wrapper: HTMLElement = document.getElementById('wrapper');

wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;

let columns: ColumnModel[] = [
    {
        width: 130
    },
    {
        width: 92
    },
    {
        width: 96
    }
];

let sheet: SheetModel[] = [{
    name: 'Price Details',
    ranges: [{
        dataSource: dataSource,
        startCell: 'A1'
    }],
    rowCount: 200,
    columns: columns,
    rows: [{ index: 3, cells: [{ wrap: true }] }]
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    beforeDataBound: (): void => {
        if (spreadsheet.sheets[spreadsheet.activeSheetIndex].name === 'Price Details') {
            spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        }
    },
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save',
    actionBegin: (args: object) => {
        console.log(args);
    },
    actionComplete: (args: SortEventArgs | CellSaveEventArgs | SaveCompleteEventArgs | CollaborativeEditArgs | Object) => {
        //spreadsheet.refreshClient(args as CollaborativeEditArgs);
        console.log(args);
    },
    beforeCellFormat: (args: BeforeCellFormatArgs) => {
        console.log(args);
    },
    openComplete: (args: Object) => {
        console.log(args);
    }
});

spreadsheet.appendTo('#spreadsheet');

window.addEventListener('resize', onResize);
(window as any).fn = async () => {
    let arr: String[] = [];
    let val: number = 0;
    let values = await spreadsheet.getData("PriceDetails!D2:D5").then((values: Map<string, CellModel>) => {
        (values as Map<string, CellModel>).forEach((cell: CellModel, key: string): void => {
            arr.push(cell.value);
            val = val + parseInt(cell.value);
        })
        return val;
    });
    console.log(values);

    //console.log('custom fun');
}
function onResize(): void {
    wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;
    spreadsheet.resize();
}
function renderOverlay() {
    let overlay1: Overlay = spreadsheet.serviceLocator.getService(overlay) as Overlay;
    overlay1.insertOverlayElement("imageId", "B2", 1);
}
switchTheme('#select-theme', spreadsheet);
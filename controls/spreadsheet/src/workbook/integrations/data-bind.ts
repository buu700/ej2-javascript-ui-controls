import { DataManager, Query, Deferred, ReturnOption, QueryOptions } from '@syncfusion/ej2-data';
import { Workbook, getCell, CellModel, RowModel, SheetModel, setCell } from '../base/index';
import { getRangeIndexes, checkIsFormula, updateSheetFromDataSource, checkDateFormat, dataSourceChanged } from '../common/index';
import { ExtendedSheet, ExtendedRange, AutoDetectInfo } from '../common/index';
import { getFormatFromType } from './number-format';

/**
 * Data binding module
 */
export class DataBind {
    private parent: Workbook;
    private requestedInfo: RequestedInfo[];

    constructor(parent: Workbook) {
        this.parent = parent;
        this.requestedInfo = [];
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(updateSheetFromDataSource, this.updateSheetFromDataSourceHandler, this);
        this.parent.on(dataSourceChanged, this.dataSourceChangedHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(updateSheetFromDataSource, this.updateSheetFromDataSourceHandler);
            this.parent.off(dataSourceChanged, this.dataSourceChangedHandler);
        }
    }

    /**
     * Update given data source to sheet.
     */
    // tslint:disable-next-line
    private updateSheetFromDataSourceHandler(args: { sheet: ExtendedSheet, indexes: number[], promise: Promise<CellModel>, rangeSettingCount?: number[] }): void {
        let cell: CellModel; let flds: string[]; let sCellIdx: number[];
        let result: Object[]; let remoteUrl: string; let isLocal: boolean; let dataManager: DataManager;
        let requestedRange: boolean[] = []; let sRanges: number[] = []; let rowIdx: number;
        let deferred: Deferred = new Deferred(); let sRowIdx: number; let sColIdx: number;
        let loadedInfo: { isNotLoaded: boolean, unloadedRange: number[] };
        args.promise = deferred.promise;
        if (args.sheet && args.sheet.ranges.length) {
            for (let k: number = args.sheet.ranges.length - 1; k >= 0; k--) {
                let sRange: number = args.indexes[0]; let eRange: number = args.indexes[2];
                let range: ExtendedRange = args.sheet.ranges[k];
                sRowIdx = getRangeIndexes(range.startCell)[0];
                dataManager = range.dataSource instanceof DataManager ? range.dataSource as DataManager
                    : range.dataSource ? new DataManager(range.dataSource) : new DataManager();
                remoteUrl = remoteUrl || dataManager.dataSource.url; args.sheet.isLocalData = isLocal || !dataManager.dataSource.url;
                if (sRowIdx <= sRange) {
                    sRange = sRange - sRowIdx;
                } else {
                    if (sRowIdx <= eRange) {
                        eRange = eRange - sRowIdx; sRange = 0;
                    } else { sRange = -1; }
                }
                if (range.showFieldAsHeader && sRange !== 0) {
                    sRange -= 1;
                }
                let isEndReached: boolean = false; let insertRowCount: number = 0;
                this.initRangeInfo(range);
                let count: number = this.getMaxCount(range);
                loadedInfo = this.getLoadedInfo(sRange, eRange, range);
                sRange = loadedInfo.unloadedRange[0]; eRange = loadedInfo.unloadedRange[1];
                if (range.info.insertRowRange) {
                    range.info.insertRowRange.forEach((range: number[]): void => {
                        insertRowCount += ((range[1] - range[0]) + 1);
                    });
                    sRange -= insertRowCount; eRange -= insertRowCount;
                }
                if (sRange > count) {
                    isEndReached = true;
                } else if (eRange > count) {
                    eRange = count;
                }
                this.requestedInfo.push({ deferred: deferred, indexes: args.indexes, isNotLoaded: loadedInfo.isNotLoaded });
                if (sRange >= 0 && loadedInfo.isNotLoaded && !isEndReached) {
                    sRanges[k] = sRange; requestedRange.push(false);
                    let query: Query = (range.query ? range.query : new Query()).clone();
                    dataManager.executeQuery(query.range(sRange, eRange >= count ? eRange : eRange + 1)
                        .requiresCount()).then((e: ReturnOption) => {
                            if (!this.parent || this.parent.isDestroyed) { return; }
                            result = (e.result && e.result.result ? e.result.result : e.result) as Object[];
                            sCellIdx = getRangeIndexes(range.startCell);
                            sRowIdx = sCellIdx[0]; sColIdx = sCellIdx[1];
                            if (result.length) {
                                if (!range.info.count) { count = e.count; range.info.count = e.count; }
                                flds = Object.keys(result[0]);
                                if (!range.info.fldLen) { range.info.fldLen = flds.length; }
                                if (range.info.insertColumnRange) {
                                    let insertCount: number = 0;
                                    range.info.insertColumnRange.forEach((insertRange: number[]): void => {
                                        for (let i: number = insertRange[0]; i <= insertRange[1]; i++) {
                                            i <= sColIdx ? flds.splice(0, 0, `emptyCell${insertCount}`) : flds.splice(
                                                i - sColIdx, 0, `emptyCell${insertCount}`);
                                            insertCount++;
                                        }
                                    });
                                }
                                if (sRanges[k] === 0 && range.showFieldAsHeader) {
                                    rowIdx = sRowIdx + sRanges[k] + insertRowCount;
                                    flds.forEach((field: string, i: number) => {
                                        cell = getCell(rowIdx, sColIdx + i, args.sheet, true);
                                        if (!cell) {
                                            args.sheet.rows[sRowIdx + sRanges[k]].cells[sColIdx + i] = field.includes('emptyCell') ? {}
                                                : { value: field };
                                        } else if (!cell.value && !field.includes('emptyCell')) {
                                            cell.value = field;
                                        }
                                    });
                                }
                                result.forEach((item: { [key: string]: string }, i: number) => {
                                    rowIdx = sRowIdx + sRanges[k] + i + (range.showFieldAsHeader ? 1 : 0) + insertRowCount;
                                    for (let j: number = 0; j < flds.length; j++) {
                                        cell = getCell(rowIdx, sColIdx + j, args.sheet, true);
                                        if (cell) {
                                            if (!cell.value && !flds[j].includes('emptyCell')) {
                                                setCell(rowIdx, sColIdx + j, args.sheet, this.getCellDataFromProp(item[flds[j]]), true);
                                            }
                                        } else {
                                            args.sheet.rows[rowIdx].cells[sColIdx + j] =
                                                flds[j].includes('emptyCell') ? {} : this.getCellDataFromProp(item[flds[j]]);
                                        }
                                        this.checkDataForFormat({
                                            args: args, cell: cell, colIndex: sColIdx + j, rowIndex: rowIdx, i: i, j: j, k: k,
                                            range: range, sRanges: sRanges, value: item[flds[j]]
                                        });
                                    }
                                });
                            } else {
                                flds = [];
                            }
                            args.sheet.usedRange.rowIndex = Math.max(
                                (sRowIdx + (count || e.count) + (range.showFieldAsHeader ? 1 : 0) + insertRowCount) - 1,
                                args.sheet.usedRange.rowIndex);
                            args.sheet.usedRange.colIndex = Math.max(sColIdx + flds.length - 1, args.sheet.usedRange.colIndex);
                            if (insertRowCount) {
                                loadedInfo = this.getLoadedInfo(sRange, eRange, range);
                                sRange = loadedInfo.unloadedRange[0]; eRange = loadedInfo.unloadedRange[1];
                                if (sRange > count) {
                                    loadedInfo.isNotLoaded = false;
                                }
                                if (loadedInfo.isNotLoaded) {
                                    if (eRange > count) { eRange = count; }
                                    range.info.loadedRange.push([sRange, eRange]);
                                }
                            } else {
                                range.info.loadedRange.push([sRange, eRange]);
                            }
                            requestedRange[k] = true;
                            if (requestedRange.indexOf(false) === -1) {
                                if (eRange + sRowIdx < args.sheet.usedRange.rowIndex) {
                                    if (!args.rangeSettingCount) { args.rangeSettingCount = []; }
                                    args.rangeSettingCount.push(k);
                                    //if (remoteUrl) {
                                    let unloadedArgs: { sheet: ExtendedSheet, indexes: number[], promise: Promise<CellModel>,
                                        rangeSettingCount?: number[] } = {
                                        sheet: args.sheet, indexes: [0, 0, args.sheet.usedRange.rowIndex, args.sheet.usedRange.colIndex],
                                        promise: new Promise((resolve: Function, reject: Function) => { resolve((() => { /** */ })()); }),
                                        rangeSettingCount: args.rangeSettingCount
                                    };
                                    this.updateSheetFromDataSourceHandler(unloadedArgs);
                                    unloadedArgs.promise.then((): void => {
                                        if (this.parent.getModuleName() === 'workbook') { return; }
                                        args.rangeSettingCount.pop();
                                        if (!args.rangeSettingCount.length) { this.parent.notify('created', null); }
                                    });
                                    //}
                                }
                                this.checkResolve(args.indexes);
                            }
                        });
                } else if (k === 0 && requestedRange.indexOf(false) === -1) {
                    this.checkResolve(args.indexes);
                }
            }
        } else { deferred.resolve(); }
    }

    private checkResolve(indexes: number[]): void {
        let resolved: boolean;
        let isSameRng: boolean;
        let cnt: number = 0;
        this.requestedInfo.forEach((info: RequestedInfo, idx: number) => {
            isSameRng = JSON.stringify(info.indexes) === JSON.stringify(indexes);
            if (isSameRng || resolved) {
                if (idx === 0) {
                    info.deferred.resolve();
                    cnt++;
                    resolved = true;
                } else {
                    if (resolved && (info.isLoaded || !info.isNotLoaded)) {
                        info.deferred.resolve();
                        cnt++;
                    } else if (isSameRng && resolved) {
                        info.deferred.resolve();
                        cnt++;
                    } else if (isSameRng) {
                        info.isLoaded = true;
                    } else {
                        resolved = false;
                    }
                }
            }
        });
        this.requestedInfo.splice(0, cnt);
    }

    private getCellDataFromProp(prop: CellModel | string): CellModel {
        let data: CellModel = {};
        if (Object.prototype.toString.call(prop) === '[object Object]') {
            if ((<CellModel>prop).formula) {
                data.formula = (<CellModel>prop).formula;
            } else if ((<CellModel>prop).value) {
                if (typeof ((<CellModel>prop).value) === 'string') {
                    if ((<CellModel>prop).value.indexOf('http://') === 0 || (<CellModel>prop).value.indexOf('https://') === 0 ||
                        (<CellModel>prop).value.indexOf('ftp://') === 0 || (<CellModel>prop).value.indexOf('www.') === 0) {
                        data.hyperlink = (<CellModel>prop).value;
                    } else {
                        data.value = (<CellModel>prop).value;
                    }
                } else {
                    data.value = (<CellModel>prop).value;
                }
            }
        } else {
            if (checkIsFormula(<string>prop)) {
                data.formula = <string>prop;
            } else {
                if (typeof ((<string>prop)) === 'string') {
                    if ((<string>prop).indexOf('http://') === 0 || (<string>prop).indexOf('https://') === 0 ||
                        (<string>prop).indexOf('ftp://') === 0 || (<string>prop).indexOf('www.') === 0) {
                        data.hyperlink = <string>prop;
                    } else {
                        data.value = <string>prop;
                    }
                } else {
                    data.value = <string>prop;
                }
            }
        }
        return data;
    }

    private checkDataForFormat(args: AutoDetectInfo): void {
        if (args.value !== '') {
            let dateEventArgs: { [key: string]: string | number | boolean } = {
                value: args.value,
                rowIndex: args.rowIndex,
                colIndex: args.colIndex,
                isDate: false,
                updatedVal: args.value,
                isTime: false
            };
            this.parent.notify(checkDateFormat, dateEventArgs);
            if (dateEventArgs.isDate) {
                if (args.cell) {
                    args.cell.format = getFormatFromType('ShortDate');
                    args.cell.value = <string>dateEventArgs.updatedVal;
                } else {
                    args.args.sheet.rows[args.rowIndex]
                        .cells[args.colIndex].format = getFormatFromType('ShortDate');
                    args.args.sheet.rows[args.rowIndex]
                        .cells[args.colIndex].value = <string>dateEventArgs.updatedVal;
                }
            } else if (dateEventArgs.isTime) {
                if (args.cell) {
                    args.cell.format = getFormatFromType('Time');
                    args.cell.value = <string>dateEventArgs.updatedVal;
                } else {
                    args.args.sheet.rows[args.rowIndex]
                        .cells[args.colIndex].format = getFormatFromType('Time');
                    args.args.sheet.rows[args.rowIndex]
                        .cells[args.colIndex].value = <string>dateEventArgs.updatedVal;
                }
            }
        }
    }

    private getLoadedInfo(sRange: number, eRange: number, range: ExtendedRange): { isNotLoaded: boolean, unloadedRange: number[] } {
        let isNotLoaded: boolean = true;
        range.info.loadedRange.forEach((range: number[]) => {
            if (range[0] <= sRange && sRange <= range[1]) {
                if (range[0] <= eRange && eRange <= range[1]) {
                    isNotLoaded = false;
                } else {
                    sRange = range[1] + 1;
                }
            } else if (range[0] <= eRange && eRange <= range[1]) {
                eRange = range[0] - 1;
            }
        });
        return { isNotLoaded: isNotLoaded, unloadedRange: [sRange, eRange] };
    }

    private getMaxCount(range: ExtendedRange): number {
        if (range.query) {
            let query: QueryOptions[] = range.query.queries;
            for (let i: number = 0; i < query.length; i++) {
                if (query[i].fn === 'onTake') {
                    return Math.min(query[i].e.nos, range.info.count || query[i].e.nos);
                }
            }
        }
        return range.info.count;
    }

    private initRangeInfo(range: ExtendedRange): void {
        if (!range.info) {
            range.info = { loadedRange: [] };
        }
    }

    /**
     * Remove old data from sheet.
     */
    private dataSourceChangedHandler(args: { oldProp: Workbook, sheetIdx: number, rangeIdx: number }): void {
        let oldSheet: SheetModel = args.oldProp.sheets[args.sheetIdx];
        let row: RowModel;
        let sheet: SheetModel = this.parent.sheets[args.sheetIdx];
        let oldRange: ExtendedRange = oldSheet && oldSheet.ranges && oldSheet.ranges[args.rangeIdx];
        if (oldRange) {
            let indexes: number[] = getRangeIndexes(oldRange.startCell);
            (sheet.ranges[args.rangeIdx] as ExtendedRange).info.loadedRange = [];
            oldRange.info.loadedRange.forEach((range: number[]) => {
                for (let i: number = range[0]; i < range[1]; i++) {
                    row = sheet.rows[i + indexes[0]];
                    for (let j: number = indexes[1]; j < indexes[1] + oldRange.info.fldLen; j++) {
                        row.cells[j].value = '';
                    }
                }
            });
        }
        this.parent.notify('data-refresh', { sheetIdx: args.sheetIdx });
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'dataBind';
    }

    /**
     * Destroys the Data binding module.
     * @return {void}
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
        this.requestedInfo = [];
    }
}

interface RequestedInfo {
  deferred: Deferred;
  indexes: number[];
  isLoaded?: boolean;
  isNotLoaded?: boolean;
}
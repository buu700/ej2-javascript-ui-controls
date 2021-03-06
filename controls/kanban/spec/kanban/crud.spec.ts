/**
 * CRUD actions spec
 */
import { DataManager, UrlAdaptor, Query } from '@syncfusion/ej2-data';
import { Kanban, KanbanModel, ActionEventArgs } from '../../src/kanban/index';
import { kanbanData } from './common/kanban-data.spec';
import { profile, inMB, getMemoryProfile } from './common/common.spec';
import * as util from './common/util.spec';

Kanban.Inject();

describe('CRUD actions module', () => {
    beforeAll(() => {
        // tslint:disable:no-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // tslint:disable-next-line:no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Add action testing', () => {
        let kanbanObj: Kanban;
        let dataSource: Object[] = kanbanData.slice(0, 10);
        beforeAll((done: DoneFn) => {
            kanbanObj = util.createKanban({}, dataSource, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('action begin event testing in add card public method', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            let cardData: { [key: string]: Object } = {
                Id: 76,
                Status: 'Close',
                Summary: 'Check test cases.',
                Type: 'Story',
                Priority: 'Release Breaker',
                Tags: 'Testing',
                Estimate: 0.5,
                Assignee: 'Nancy Davloio',
                RankId: 22
            };
            kanbanObj.addCard(cardData);
            expect(kanbanObj.kanbanData.length).toEqual(10);
        });

        it('action complete event testing in add card public method', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            kanbanObj.actionComplete = (args: ActionEventArgs) => args.cancel = true;
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            let cardData: { [key: string]: Object } = {
                Id: 76,
                Status: 'Close',
                Summary: 'Check test cases.',
                Type: 'Story',
                Priority: 'Release Breaker',
                Tags: 'Testing',
                Estimate: 0.5,
                Assignee: 'Nancy Davloio',
                RankId: 22
            };
            kanbanObj.addCard(cardData);
            expect(kanbanObj.kanbanData.length).toEqual(10);
        });

        it('add card public method testing', (done: DoneFn) => {
            kanbanObj.actionComplete = (args: ActionEventArgs) => args.cancel = false;
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toEqual(12);
                expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(11);
                done();
            };
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            let cardData: { [key: string]: Object } = {
                Id: 77,
                Status: 'Close',
                Summary: 'Check test cases.',
                Type: 'Story',
                Priority: 'Release Breaker',
                Tags: 'Testing',
                Estimate: 0.5,
                Assignee: 'Nancy Davloio',
                RankId: 22
            };
            kanbanObj.addCard(cardData);
        });
    });

    describe('Update action testing', () => {
        let kanbanObj: Kanban;
        let dataSource: Object[] = kanbanData.slice(0, 10);
        beforeAll((done: DoneFn) => {
            kanbanObj = util.createKanban({}, dataSource, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('action begin event testing in update card public method', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            let cardData: { [key: string]: Object }[] = util.cloneDataSource(kanbanData.slice(1, 3)) as { [key: string]: Object }[];
            cardData[0].Status = 'Testing';
            cardData[1].Status = 'Close';
            kanbanObj.updateCard(cardData);
            expect(kanbanObj.kanbanData.length).toEqual(10);
        });

        it('action complete event testing in update card public method', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            kanbanObj.actionComplete = (args: ActionEventArgs) => args.cancel = true;
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            let cardData: { [key: string]: Object }[] = util.cloneDataSource(kanbanData.slice(1, 3)) as { [key: string]: Object }[];
            cardData[0].Status = 'Testing';
            cardData[1].Status = 'Close';
            kanbanObj.updateCard(cardData);
            expect(kanbanObj.kanbanData.length).toEqual(10);
        });

        it('update card public method testing', (done: DoneFn) => {
            kanbanObj.actionComplete = (args: ActionEventArgs) => args.cancel = false;
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toEqual(10);
                expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
                expect(cardData.Id).toEqual(1);
                expect(cardData.Status).toEqual('InProgress');
                done();
            };
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            let cardData: { [key: string]: Object } = util.cloneDataSource(kanbanData.slice(0, 1))[0] as { [key: string]: Object };
            expect(cardData.Id).toEqual(1);
            expect(cardData.Status).toEqual('Open');
            cardData.Status = 'InProgress';
            kanbanObj.updateCard(cardData);
        });
    });

    describe('Delete action testing', () => {
        let kanbanObj: Kanban;
        let dataSource: Object[] = kanbanData.slice(0, 10);
        beforeAll((done: DoneFn) => {
            kanbanObj = util.createKanban({}, dataSource, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('action begin event testing in delete card public method', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            let cardData: { [key: string]: Object }[] = util.cloneDataSource(kanbanData.slice(1, 2)) as { [key: string]: Object }[];
            kanbanObj.deleteCard(cardData[0]);
            expect(kanbanObj.kanbanData.length).toEqual(10);
        });

        it('action complete event testing in delete card public method', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            kanbanObj.actionComplete = (args: ActionEventArgs) => args.cancel = true;
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            let cardData: { [key: string]: Object }[] = util.cloneDataSource(kanbanData.slice(1, 3)) as { [key: string]: Object }[];
            kanbanObj.deleteCard(cardData);
            expect(kanbanObj.kanbanData.length).toEqual(10);
        });

        it('delete card public method testing', (done: DoneFn) => {
            kanbanObj.actionComplete = (args: ActionEventArgs) => args.cancel = false;
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toEqual(7);
                expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(6);
                done();
            };
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            kanbanObj.deleteCard(1);
        });
    });

    describe('Remote data success testing', () => {
        let kanbanObj: Kanban;
        let dataSource: Object[] = kanbanData.slice(0, 10);
        let cardData: { [key: string]: Object }[] = [{
            Id: 1,
            Subject: 'Remote Data Testing',
            StartTime: new Date(2019, 11, 2, 10),
            EndTime: new Date(2019, 11, 2, 11, 30),
            IsAllDay: false
        }];
        beforeAll(() => {
            jasmine.Ajax.install();
            let dataManager: DataManager = new DataManager({
                url: 'api/Kanban/GetData/',
                crudUrl: 'api/Kanban/UpdateData/',
                adaptor: new UrlAdaptor()
            });
            let model: KanbanModel = {
                query: new Query(),
                actionComplete: (args: ActionEventArgs) => {
                    if (args.requestType === 'cardCreated') {
                        jasmine.Ajax.requests.reset();
                    }
                }
            };
            kanbanObj = util.createKanban(model, dataManager);
        });
        beforeEach((done: Function) => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.at(1) || jasmine.Ajax.requests.mostRecent();
            request.respondWith({ 'status': 200, 'responseText': JSON.stringify({ d: dataSource, __count: dataSource.length }) });
            done();
        });
        it('add card using remote data', () => {
            jasmine.Ajax.requests.reset();
            expect(kanbanObj.kanbanData.length).toEqual(10);
            dataSource = dataSource.concat(cardData);
            kanbanObj.addCard(cardData);
        });
        it('action complete checking for add action result', () => {
            expect(kanbanObj.kanbanData.length).toEqual(10);
        });
        it('event get action after adding new card', () => {
            expect(kanbanObj.kanbanData.length).toEqual(11);
        });
        afterAll(() => {
            util.destroy(kanbanObj);
            jasmine.Ajax.uninstall();
        });
    });

    describe('Remote data success with kanban destroy testing', () => {
        let kanbanObj: Kanban;
        let dataSource: Object[] = kanbanData.slice(0, 10);
        let cardData: { [key: string]: Object }[] = [{
            Id: 1,
            Subject: 'Remote Data Testing',
            StartTime: new Date(2019, 11, 2, 10),
            EndTime: new Date(2019, 11, 2, 11, 30),
            IsAllDay: false
        }];
        beforeAll(() => {
            jasmine.Ajax.install();
            let dataManager: DataManager = new DataManager({
                url: 'api/Kanban/GetData/',
                crudUrl: 'api/Kanban/UpdateData/',
                adaptor: new UrlAdaptor()
            });
            let model: KanbanModel = { query: new Query() };
            kanbanObj = util.createKanban(model, dataManager);
        });
        beforeEach((done: Function) => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.at(1) || jasmine.Ajax.requests.mostRecent();
            request.respondWith({ 'status': 200, 'responseText': JSON.stringify({ d: dataSource, __count: dataSource.length }) });
            done();
        });
        it('delete card using remote data', () => {
            jasmine.Ajax.requests.reset();
            expect(kanbanObj.kanbanData.length).toEqual(10);
            kanbanObj.deleteCard(cardData);
            util.destroy(kanbanObj);
        });
        it('action complete checking for delete action result', () => {
            expect(kanbanObj.isDestroyed).toEqual(true);
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
    });

    describe('Remote data failure testing', () => {
        let kanbanObj: Kanban;
        let dataSource: Object[] = kanbanData.slice(0, 10);
        let cardData: { [key: string]: Object }[] = [{
            Id: 1,
            Subject: 'Remote Data Testing',
            StartTime: new Date(2019, 11, 2, 10),
            EndTime: new Date(2019, 11, 2, 11, 30),
            IsAllDay: false
        }];
        let isDataLoad: boolean = true;
        let isChecking: boolean = false;
        let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
        beforeAll(() => {
            jasmine.Ajax.install();
            let dataManager: DataManager = new DataManager({
                url: 'api/Kanban/GetData/',
                crudUrl: 'api/Kanban/UpdateData/',
                adaptor: new UrlAdaptor()
            });
            let model: KanbanModel = {
                query: new Query(),
                actionComplete: (args: ActionEventArgs) => {
                    if (args.requestType === 'cardCreated') {
                        args.cancel = isChecking;
                        jasmine.Ajax.requests.reset();
                    }
                },
                actionFailure: actionFailedFunction
            };
            kanbanObj = util.createKanban(model, dataManager);
        });
        beforeEach((done: Function) => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.at(1) || jasmine.Ajax.requests.mostRecent();
            if (isDataLoad) {
                request.respondWith({ 'status': 200, 'responseText': JSON.stringify({ d: dataSource, __count: dataSource.length }) });
            } else {
                request.respondWith({ 'status': 404, 'contentType': 'application/json', 'responseText': 'Page not found' });
            }
            done();
        });
        it('action complete testing in add card using remote data', () => {
            isChecking = true;
            jasmine.Ajax.requests.reset();
            expect(kanbanObj.kanbanData.length).toEqual(10);
            dataSource = dataSource.concat(cardData);
            kanbanObj.addCard(cardData);
            expect(kanbanObj.kanbanData.length).toEqual(10);
        });
        it('add card actiusing remote data', () => {
            isDataLoad = false;
            isChecking = false;
            expect(kanbanObj.kanbanData.length).toEqual(10);
            kanbanObj.addCard(cardData);
        });
        it('action complete checking for add action result', () => {
            expect(actionFailedFunction).toHaveBeenCalled();
        });
        afterAll(() => {
            util.destroy(kanbanObj);
            jasmine.Ajax.uninstall();
        });
    });

    describe('Remote data failure with kanban destroy testing', () => {
        let kanbanObj: Kanban;
        let dataSource: Object[] = kanbanData.slice(0, 10);
        let cardData: { [key: string]: Object }[] = [{
            Id: 1,
            Subject: 'Remote Data Testing',
            StartTime: new Date(2019, 11, 2, 10),
            EndTime: new Date(2019, 11, 2, 11, 30),
            IsAllDay: false
        }];
        let isDataLoad: boolean = true;
        let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
        beforeAll(() => {
            jasmine.Ajax.install();
            let dataManager: DataManager = new DataManager({
                url: 'api/Kanban/GetData/',
                crudUrl: 'api/Kanban/UpdateData/',
                adaptor: new UrlAdaptor()
            });
            let model: KanbanModel = {
                query: new Query(),
                actionFailure: actionFailedFunction
            };
            kanbanObj = util.createKanban(model, dataManager);
        });
        beforeEach((done: Function) => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.at(1) || jasmine.Ajax.requests.mostRecent();
            if (isDataLoad) {
                request.respondWith({ 'status': 200, 'responseText': JSON.stringify({ d: dataSource, __count: dataSource.length }) });
            } else {
                request.respondWith({ 'status': 404, 'contentType': 'application/json', 'responseText': 'Page not found' });
            }
            done();
        });
        it('action complete testing in update card using remote data', () => {
            isDataLoad = false;
            jasmine.Ajax.requests.reset();
            expect(kanbanObj.kanbanData.length).toEqual(10);
            kanbanObj.updateCard(cardData);
            util.destroy(kanbanObj);
        });
        it('destroy checking for update card action result', () => {
            expect(kanbanObj.isDestroyed).toEqual(true);
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
    });

    describe('Add Card with Priority', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                sortSettings: {
                    sortBy: 'Index',
                    field: 'RankId',
                    direction: 'Ascending'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Passed one data', (done: DoneFn) => {
            expect(kanbanObj.kanbanData.length).toEqual(75);
            kanbanObj.addCard({ Id: 101, Status: 'Open', Assignee: 'Andrew Fuller', RankId: 1 });
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toEqual(76);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][0] as { [key: string]: Object }).Id).toEqual(101);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][0] as { [key: string]: Object }).RankId).toEqual(1);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][1] as { [key: string]: Object }).RankId).toEqual(2);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][2] as { [key: string]: Object }).RankId).toEqual(3);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][3] as { [key: string]: Object }).RankId).toEqual(4);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][4] as { [key: string]: Object }).RankId).toEqual(5);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][5] as { [key: string]: Object }).RankId).toEqual(6);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][6] as { [key: string]: Object }).RankId).toEqual(7);
                done();
            }
        });
        it('Passed two datas', (done: DoneFn) => {
            expect(kanbanObj.kanbanData.length).toEqual(76);
            kanbanObj.addCard([{ Id: 102, Status: 'Open', Assignee: 'Andrew Fuller', RankId: 1 }, { Id: 103, Status: 'Open', Assignee: 'Andrew Fuller', RankId: 3 }]);
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toEqual(78);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][0] as { [key: string]: Object }).Id).toEqual(102);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][0] as { [key: string]: Object }).RankId).toEqual(1);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][1] as { [key: string]: Object }).RankId).toEqual(2);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][2] as { [key: string]: Object }).RankId).toEqual(3);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][2] as { [key: string]: Object }).Id).toEqual(103);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][3] as { [key: string]: Object }).RankId).toEqual(4);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][4] as { [key: string]: Object }).RankId).toEqual(5);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][5] as { [key: string]: Object }).RankId).toEqual(6);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][6] as { [key: string]: Object }).RankId).toEqual(7);
                done();
            }
        });
        it('Passed different column datas', (done: DoneFn) => {
            expect(kanbanObj.kanbanData.length).toEqual(78);
            kanbanObj.addCard([{ Id: 104, Status: 'InProgress', Assignee: 'Andrew Fuller', RankId: 1 }, { Id: 105, Status: 'Testing', Assignee: 'Andrew Fuller', RankId: 3 }]);
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toEqual(80);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][0] as { [key: string]: Object }).Id).toEqual(104);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][0] as { [key: string]: Object }).RankId).toEqual(1);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][1] as { [key: string]: Object }).RankId).toEqual(2);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][2] as { [key: string]: Object }).RankId).toEqual(3);
                expect((kanbanObj.layoutModule.getColumnCards()['Testing'][2] as { [key: string]: Object }).Id).toEqual(105);
                expect((kanbanObj.layoutModule.getColumnCards()['Testing'][2] as { [key: string]: Object }).RankId).toEqual(3);
                expect((kanbanObj.layoutModule.getColumnCards()['Testing'][3] as { [key: string]: Object }).RankId).toEqual(4);
                expect((kanbanObj.layoutModule.getColumnCards()['Testing'][4] as { [key: string]: Object }).RankId).toEqual(5);
                expect((kanbanObj.layoutModule.getColumnCards()['Testing'][5] as { [key: string]: Object }).RankId).toEqual(6);
                expect((kanbanObj.layoutModule.getColumnCards()['Testing'][6] as { [key: string]: Object }).RankId).toEqual(7);
                done();
            }
        });
    });

    describe('Add Card with Priority using swimlane', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                sortSettings: {
                    sortBy: 'Index',
                    field: 'RankId',
                    direction: 'Ascending'
                },
                swimlaneSettings: {
                    keyField: 'Assignee'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Passed one data', (done: DoneFn) => {
            expect(kanbanObj.kanbanData.length).toEqual(75);
            kanbanObj.addCard({ Id: 101, Status: 'Open', Assignee: 'Andrew Fuller', RankId: 1 });
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toEqual(76);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][1] as { [key: string]: Object }).Id).toEqual(101);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][1] as { [key: string]: Object }).RankId).toEqual(1);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][5] as { [key: string]: Object }).Id).toEqual(25);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][5] as { [key: string]: Object }).RankId).toEqual(5);
                done();
            }
        });
    });

    describe('Update Card with Priority', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                sortSettings: {
                    sortBy: 'Index',
                    field: 'RankId',
                    direction: 'Ascending'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Passed one data', (done: DoneFn) => {
            expect(kanbanObj.kanbanData.length).toEqual(75);
            kanbanObj.updateCard({ Id: 1, Status: 'Open', Assignee: 'Andrew Fuller', RankId: 5 });
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toEqual(75);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][0] as { [key: string]: Object }).Id).toEqual(3);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][0] as { [key: string]: Object }).RankId).toEqual(2);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][1] as { [key: string]: Object }).Id).toEqual(13);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][1] as { [key: string]: Object }).RankId).toEqual(3);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][2] as { [key: string]: Object }).Id).toEqual(15);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][2] as { [key: string]: Object }).RankId).toEqual(4);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][3] as { [key: string]: Object }).Id).toEqual(1);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][3] as { [key: string]: Object }).RankId).toEqual(5);
                done();
            }
        });
        it('Passed two datas', (done: DoneFn) => {
            expect(kanbanObj.kanbanData.length).toEqual(75);
            kanbanObj.updateCard([{ Id: 2, Status: 'Open', Assignee: 'Andrew Fuller', RankId: 4 }, { Id: 16, Status: 'Open', Assignee: 'Andrew Fuller', RankId: 1 }]);
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toEqual(75);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][0] as { [key: string]: Object }).Id).toEqual(16);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][0] as { [key: string]: Object }).RankId).toEqual(1);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][1] as { [key: string]: Object }).Id).toEqual(3);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][1] as { [key: string]: Object }).RankId).toEqual(2);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][2] as { [key: string]: Object }).Id).toEqual(13);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][2] as { [key: string]: Object }).RankId).toEqual(3);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][3] as { [key: string]: Object }).Id).toEqual(2);
                expect((kanbanObj.layoutModule.getColumnCards()['Open'][3] as { [key: string]: Object }).RankId).toEqual(4);
                done();
            }
        });
        it('Passed different column datas', (done: DoneFn) => {
            expect(kanbanObj.kanbanData.length).toEqual(75);
            kanbanObj.updateCard([{ Id: 8, Status: 'InProgress', Assignee: 'Andrew Fuller', RankId: 2 }, { Id: 3, Status: 'Testing', Assignee: 'Andrew Fuller', RankId: 2 }]);
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toEqual(75);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][0] as { [key: string]: Object }).Id).toEqual(8);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][0] as { [key: string]: Object }).RankId).toEqual(2);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][1] as { [key: string]: Object }).Id).toEqual(4);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][1] as { [key: string]: Object }).RankId).toEqual(3);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][2] as { [key: string]: Object }).Id).toEqual(14);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][2] as { [key: string]: Object }).RankId).toEqual(4);
                expect((kanbanObj.layoutModule.getColumnCards()['Testing'][0] as { [key: string]: Object }).Id).toEqual(5);
                expect((kanbanObj.layoutModule.getColumnCards()['Testing'][0] as { [key: string]: Object }).RankId).toEqual(1);
                expect((kanbanObj.layoutModule.getColumnCards()['Testing'][1] as { [key: string]: Object }).Id).toEqual(3);
                expect((kanbanObj.layoutModule.getColumnCards()['Testing'][1] as { [key: string]: Object }).RankId).toEqual(2);
                expect((kanbanObj.layoutModule.getColumnCards()['Testing'][2] as { [key: string]: Object }).Id).toEqual(9);
                expect((kanbanObj.layoutModule.getColumnCards()['Testing'][2] as { [key: string]: Object }).RankId).toEqual(3);
                done();
            }
        });
    });

    describe('Drag and drop functionality', () => {
        let kanbanObj: Kanban;
        let dragElement: HTMLElement;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                sortSettings: {
                    sortBy: 'Index',
                    field: 'RankId',
                    direction: 'Ascending'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Dragged clone behavior testing', () => {
            dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="1"]') as NodeListOf<Element>).item(0) as HTMLElement;
            expect(kanbanObj.element.querySelector('.e-kanban-content').classList.contains('e-draggable')).toBe(true);
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
        });

        it('Created Dropped clone on above the column testing and target is card', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="4"]').item(0);
            util.triggerMouseEvent(element, 'mousemove', 250, 400);
        });

        it('Dropped clone testing', (done: DoneFn) => {
            let droppedElement: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="4"]').item(0);
            expect((kanbanObj.layoutModule.getColumnCards()['Open'][0] as { [key: string]: Object }).Id).toEqual(1);
            expect((kanbanObj.layoutModule.getColumnCards()['Open'][0] as { [key: string]: Object }).RankId).toEqual(1);
            expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][0] as { [key: string]: Object }).Id).toEqual(2);
            expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][0] as { [key: string]: Object }).RankId).toEqual(1);
            expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][1] as { [key: string]: Object }).Id).toEqual(4);
            expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][1] as { [key: string]: Object }).RankId).toEqual(2);
            expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][2] as { [key: string]: Object }).Id).toEqual(14);
            expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][2] as { [key: string]: Object }).RankId).toEqual(3);
            kanbanObj.dataBound = () => {
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][0] as { [key: string]: Object }).Id).toEqual(2);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][0] as { [key: string]: Object }).RankId).toEqual(1);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][1] as { [key: string]: Object }).Id).toEqual(4);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][1] as { [key: string]: Object }).RankId).toEqual(2);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][2] as { [key: string]: Object }).Id).toEqual(1);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][2] as { [key: string]: Object }).RankId).toEqual(3);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][3] as { [key: string]: Object }).Id).toEqual(14);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][3] as { [key: string]: Object }).RankId).toEqual(4);
                done();
            };
            util.triggerMouseEvent(droppedElement, 'mouseup', 250, 400);
        });
    });

    describe('Drag and drop functionality', () => {
        let kanbanObj: Kanban;
        let dragElement: HTMLElement;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                sortSettings: {
                    sortBy: 'Index',
                    field: 'RankId',
                    direction: 'Ascending'
                },
                swimlaneSettings: {
                    keyField: 'Assignee'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Dragged clone behavior testing', () => {
            dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="2"]') as NodeListOf<Element>).item(0) as HTMLElement;
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 250, 400);
        });

        it('Created Dropped clone on above the column testing and target is card', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0);
            util.triggerMouseEvent(element, 'mousemove', 250, 550);
        });

        it('Dropped clone testing', (done: DoneFn) => {
            let droppedElement: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0);
            kanbanObj.dataBound = () => {
                expect((kanbanObj.layoutModule.getColumnCards()['Testing'][10] as { [key: string]: Object }).Id).toEqual(2);
                expect((kanbanObj.layoutModule.getColumnCards()['Testing'][10] as { [key: string]: Object }).RankId).toEqual(11);
                expect((kanbanObj.layoutModule.getColumnCards()['Testing'][9] as { [key: string]: Object }).Id).toEqual(45);
                expect((kanbanObj.layoutModule.getColumnCards()['Testing'][9] as { [key: string]: Object }).RankId).toEqual(10);
                done();
            };
            util.triggerMouseEvent(droppedElement, 'mouseup', 250, 550);
        });
        it('Dragged clone behavior testing', () => {
            dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="45"]') as NodeListOf<Element>).item(0) as HTMLElement;
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 250, 100);
        });

        it('Created Dropped clone on above the column testing and target is card', () => {
            let element: Element = (kanbanObj.element.querySelectorAll('.e-card-wrapper') as NodeListOf<Element>).item(1);
            util.triggerMouseEvent(element, 'mousemove', 250, 150);
        });

        it('Dropped clone testing', (done: DoneFn) => {
            let droppedElement: Element = (kanbanObj.element.querySelectorAll('.e-card-wrapper') as NodeListOf<Element>).item(1);
            kanbanObj.dataBound = () => {
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][8] as { [key: string]: Object }).Id).toEqual(45);
                expect((kanbanObj.layoutModule.getColumnCards()['InProgress'][8] as { [key: string]: Object }).RankId).toEqual(10);
                done();
            };
            util.triggerMouseEvent(droppedElement, 'mouseup', 250, 100);
        });
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        expect(average).toBeLessThan(10); //Check average change in memory samples to not be over 10MB
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });

});

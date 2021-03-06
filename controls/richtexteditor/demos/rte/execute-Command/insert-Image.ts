// tslint:disable-next-line:missing-jsdoc
import { RichTextEditor } from './../../../src/rich-text-editor/base/rich-text-editor';
import { ToolbarType } from './../../../src/rich-text-editor/base/enum';
import { Link } from './../../../src/rich-text-editor/renderer/link-module';
import { Image } from './../../../src/rich-text-editor/renderer/image-module';
import { HtmlEditor } from './../../../src/rich-text-editor/actions/html-editor';
// import { MarkdownEditor } from './../../../src/rich-text-editor/actions/markdown-editor';
import { Toolbar } from './../../../src/rich-text-editor/actions/toolbar';
import { QuickToolbar } from './../../../src/rich-text-editor/actions/quick-toolbar';
import { Table } from './../../../src/rich-text-editor/renderer/table-module';
import { NodeSelection } from '../../../src/index';
 
RichTextEditor.Inject(Toolbar);
 RichTextEditor.Inject(Link);
 RichTextEditor.Inject(Image);
RichTextEditor.Inject(HtmlEditor);
 RichTextEditor.Inject(QuickToolbar);
 RichTextEditor.Inject(Table);
 
let innerHTML: string = `<p>The <img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png">Editor </p><p>hello <p>`;
let defaultRTE: RichTextEditor = new RichTextEditor({
    height: 400,
    toolbarSettings: {
        items: [{
                tooltipText: 'Insert Image',
                template: '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%">'
                + '<div class="e-tbar-btn-text" style="font-weight: 500;"> &#937;</div></button>'
            }, '|', 'Undo', 'Redo', '|',
            'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
            'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
            'SubScript', 'SuperScript', '|',
            'LowerCase', 'UpperCase', '|', 
            'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
            'Indent', 'Outdent', '|', 'CreateTable', '|', 'CreateLink', '|', 'Image', '|', 'SourceCode',
            '|', 'ClearFormat', 'Print', 'InsertCode']
    },
    value: innerHTML,
    created: onCreate,
    saveInterval: 10,
    actionComplete: onActionComplete,
    insertImageSettings: {
        width: '300px',
        minHeight: '200px'
    }
});
defaultRTE.appendTo("#defaultRTE");
 
function onActionComplete(args: any): void {
    if (args.requestType === 'SourceCode') {
        defaultRTE.getToolbar().querySelector('#custom_tbar').parentElement.classList.add('e-overlay');
    } else if (args.requestType === 'Preview') {
        defaultRTE.getToolbar().querySelector('#custom_tbar').parentElement.classList.remove('e-overlay');
    }
}
 
function onCreate() {
    let insertImage = document.querySelector('#insertImage') as HTMLElement;
    let insertText = document.querySelector('#insertText') as HTMLElement;
    let insertHtml = document.querySelector('#insertHtml') as HTMLElement;
    let customBtn = defaultRTE.element.querySelector('#custom_tbar') as HTMLElement;

    insertText.onclick = () => {
        defaultRTE.executeCommand('insertHTML', 'hello this is text content');
    };
    
    insertHtml.onclick = () => {
        defaultRTE.executeCommand('insertHTML', '<p>hello this is html content</p>');
    };

    insertImage.onclick = () => {
        var selectedpath = 'https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png';
        let img = document.createElement('img');
        img.setAttribute('src', selectedpath);
        defaultRTE.executeCommand('insertHTML', img);
    };

    customBtn.onclick = () => {
        let selection: NodeSelection = new NodeSelection();
        let ranges: Range;
        let a = defaultRTE.inputElement.querySelector('img');
        let listofimag: Node[] = [];
        listofimag.push(a);
        let saveSelection: NodeSelection;
        ranges = selection.getRange(document);
        saveSelection = selection.save(ranges, document);
        var selectedpath = 'https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png';
        saveSelection.restore();
        defaultRTE.executeCommand('editImage', {
            //url: 'https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png',
            //cssClass: 'revanth',
            width: { minWidth: '200px', maxWidth: '200px', width: 180 },
            height: { minHeight: '200px', maxHeight: '600px', height: 500 },
            altText: 'revanth image',
            selectParent: listofimag
        });
        defaultRTE.executeCommand('insertImage', {
            url: 'https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png',
            cssClass: 'revanth',
            // width: { minWidth: '200px', maxWidth: '200px', width: 180 },
            // height: { minHeight: '200px', maxHeight: '600px', height: 500 },
            //altText: 'revanth image',
            //selectParent: listofimag
        });
        defaultRTE.executeCommand('insertText', ' ');
    };
}
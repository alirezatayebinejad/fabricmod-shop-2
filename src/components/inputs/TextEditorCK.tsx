import { CKEditor } from "@ckeditor/ckeditor5-react";
import coreTranslations from "ckeditor5/translations/fa.js";
import {
  ClassicEditor,
  Alignment,
  Autoformat,
  Bold,
  Italic,
  Underline,
  BlockQuote,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontSize,
  Heading,
  HorizontalLine,
  AutoImage,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  Indent,
  IndentBlock,
  AutoLink,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  MediaEmbedToolbar,
  PageBreak,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  Table,
  TableToolbar,
  TextTransformation,
  Undo,
  Base64UploadAdapter,
  WordCount,
  Plugin,
  ButtonView,
  Link,
  HtmlDataProcessor,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import Flmngr from "@flmngr/flmngr-react";
import { getAuth } from "@/services/auth";

type Props = {
  title: string;
  value: string;
  setData: (val: string) => void;
  disabled?: boolean;
  errorMessage?: string;
  mode?: "simple" | "full";
};
/* TODO: file manager need tests */
export default function TextEditorCK({
  title,
  value,
  setData,
  disabled = false,
  errorMessage,
  mode = "full",
}: Props) {
  class myfiles extends Plugin {
    init() {
      const editor = this.editor;
      // The button must be registered among the UI components of the editor
      // to be displayed in the toolbar.
      editor.ui.componentFactory.add("myfiles", () => {
        // The button will be an instance of ButtonView.
        const button = new ButtonView();

        button.set({
          label: "فایل و عکس",
          withText: true,
        });

        // Execute a callback function when the button is clicked.
        button.on("execute", () => {
          Flmngr.open({
            apiKey: "FLMNFLMN", // default free key
            urlFileManager:
              process.env.NEXT_PUBLIC_BACKEND_BASE + "/api/admin-panel/flmngr",
            urlFiles: process.env.NEXT_PUBLIC_BACKEND_STORAGE,
            isMultiple: false,
            acceptExtensions: [
              "png",
              "jpg",
              "jpeg",
              "gif",
              "webp",
              "pdf",
              "mp3",
              "mkv",
              "mp4",
              "doc",
              "docx",
              "xls",
              "xlsx",
              "ppt",
              "pptx",
            ],
            urlFileManager__CSRF: (onSuccess) => {
              onSuccess({
                headers: {
                  Authorization: `Bearer ${getAuth.session()?.token}`,
                },
              });
            },
            onFinish: (files) => {
              const fileUrl = files[0]?.url;
              const fileExtension = fileUrl?.split(".").pop();

              if (files) {
                editor.model?.change(() => {
                  const htmlString =
                    fileExtension === "pdf" || fileExtension === "mkv"
                      ? `<a href="${fileUrl}" target="_blank"><img src="${"/images/downloadimg.png"}"/></a>`
                      : `<img src="${fileUrl}" />`;

                  const htmlDP = new HtmlDataProcessor(
                    editor.editing.view.document,
                  );
                  const viewFragment = htmlDP.toView(htmlString);

                  const modelFragment = editor.data.toModel(viewFragment);

                  editor.model?.insertContent(
                    modelFragment,
                    editor.model?.document.selection,
                  );
                });
              }
            },
          });
        });

        return button;
      });
    }
  }

  const basicToolbar = [
    "heading",
    "|",
    "bold",
    "italic",
    "link",
    "bulletedList",
    "numberedList",
    "|",
    "outdent",
    "indent",
    "|",
    "undo",
    "redo",
  ];

  const fullToolbar = [
    "heading",
    "|",
    "myfiles",
    "bold",
    "italic",
    "link",
    "imageToolbar",
    "bulletedList",
    "numberedList",
    "|",
    "outdent",
    "indent",
    "|",
    "alignment",
    "imageInsert",
    "insertTable",
    "blockQuote",
    "mediaEmbed",
    "undo",
    "redo",
    "underline",
    "removeFormat",
    "pageBreak",
    "fontBackgroundColor",
    "horizontalLine",
    "fontSize",
    "fontColor",
  ];

  return (
    <div className="min-h-[140px]">
      {title && <p className="my-3 text-TextSize400">{title}</p>}
      <CKEditor
        editor={ClassicEditor}
        config={{
          licenseKey: "GPL",
          toolbar: {
            items: mode === "simple" ? basicToolbar : fullToolbar,
            shouldNotGroupWhenFull: true,
          },
          image: {
            toolbar: [
              "imageTextAlternative",
              "toggleImageCaption",
              "imageStyle:inline",
              "imageStyle:block",
              "imageStyle:side",
              "linkImage",
            ],
          },
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
          link: {
            // Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
            addTargetToExternalLinks: true,

            // Let the users control the "download" attribute of each link.
            decorators: {
              openInNewTab: {
                mode: "manual",
                label: "بازکردن",
                attributes: {
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
              },
            },
          },
          plugins: [
            myfiles,
            Alignment,
            AutoImage,
            Link,
            AutoLink,
            Autoformat,
            Base64UploadAdapter,
            BlockQuote,
            Bold,
            Essentials,
            FontBackgroundColor,
            FontColor,
            FontSize,
            Heading,
            HorizontalLine,
            Image,
            ImageCaption,
            ImageInsert,
            ImageResize,
            ImageStyle,
            ImageToolbar,
            Indent,
            IndentBlock,
            Italic,
            LinkImage,
            List,
            ListProperties,
            MediaEmbed,
            MediaEmbedToolbar,
            PageBreak,
            Paragraph,
            PasteFromOffice,
            RemoveFormat,
            Table,
            TableToolbar,
            TextTransformation,
            Underline,
            Undo,
            WordCount,
          ],

          translations: [coreTranslations],
          language: {
            ui: "fa",
            content: "fa",
          },
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          setData(data);
        }}
        data={value}
        disabled={disabled}
      />
      {errorMessage && (
        <p className="text-textSize3 text-errorText mt-1">{errorMessage}</p>
      )}
    </div>
  );
}

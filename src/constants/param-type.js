/**
 * Created by Cray on 2017/7/20.
 */

export const ParamType = ['string', 'file', 'json', 'int', 'float', 'double', 'date', 'datetime', 'boolean', 'byte', 'short', 'long', 'array', 'object'];
export const quill={
    modules: {
        toolbar: [
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            // ['link', 'image'],
            ['link'],
            ['clean']
        ],
    },
    formats: [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ],
};

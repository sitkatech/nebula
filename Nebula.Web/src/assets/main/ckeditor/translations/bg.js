(function (d) {
    const l = (d["bg"] = d["bg"] || {});
    l.dictionary = Object.assign(l.dictionary || {}, {
        "Block quote": "Цитат",
        Bold: "Удебелен",
        Cancel: "Отказ",
        "Choose heading": "",
        Heading: "",
        "Heading 1": "",
        "Heading 2": "",
        "Heading 3": "",
        "Heading 4": "",
        "Heading 5": "",
        "Heading 6": "",
        Italic: "Курсив",
        Paragraph: "Параграф",
        Save: "Запазване",
    });
    l.getPluralForm = function (n) {
        return n != 1;
    };
})(window.CKEDITOR_TRANSLATIONS || (window.CKEDITOR_TRANSLATIONS = {}));

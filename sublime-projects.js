#! /usr/local/bin/node

const fs = require('fs');
const os = require('os');
const keyword = process.argv[2];
const filter = keyword ? file=>new RegExp(keyword).test(file) : ()=>true;

const default_sublime_session_path = `${os.homedir()}/Library/Application Support/Sublime Text 3/Local/Session.sublime_session`;
const sublime_session_path = process.env['SUBLIME_SESSION_PATH'];
const session_path_to_use = sublime_session_path || default_sublime_session_path;

fs.readFile(session_path_to_use, 'utf-8', function (err, data) {

    const jsonString = data.replace(/\t?|\n?/g, '');
    const session = JSON.parse(jsonString);
    var allFolders = session.folder_history
        .concat(session.workspaces.recent_workspaces)
        .concat(session.settings.new_window_settings.file_history);

    var files = allFolders.filter(filter).map((v, i)=> {

        const title = v.replace(/.*\//, '');

        return `
            <item uid="${i}" valid="YES" type="file">
                <title>${title}</title>
                <subtitle>${v}</subtitle>
                <arg>${v}</arg>
                <icon type="fileicon">${v}</icon>
            </item>
        `
    }).join('');

    console.log(`
        <?xml version="1.0" encoding="UTF-8"?>
        <items>
            ${files}
        </items>
    `);

});
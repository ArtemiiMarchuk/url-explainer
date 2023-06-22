async function getCurrenURL() {
    const queryOptions = {active: true, lastFocusedWindow: true};
    const [tab] = await chrome.tabs.query(queryOptions);

    return tab.pendingUrl || tab.url;
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function insertURLInPopup(url) {
    const urlElement = document.getElementById('url');
    const scheme = document.getElementById('scheme');
    const domain = document.getElementById('domain');
    const port = document.getElementById('port');
    const path = document.getElementById('path');
    const params = document.getElementById('params');
    const anchor = document.getElementById('anchor');

    anchor.innerText = url.hash;
    domain.innerText = url.hostname;
    urlElement.innerText = url.href;
    path.innerText = url.pathname;
    port.innerText = url.port;
    scheme.innerText = url.protocol;
    params.innerText = url.search;

    const paths = url.pathname.split('/');
    const pathHeader = document.getElementById('pathList');

    for (const path of paths) {
        const pathElement = document.createElement('p');
        pathElement.innerText = path;
        pathElement.onclick = () => {
            navigator.clipboard.writeText(pathElement.innerText);
        }

        insertAfter(pathElement, pathHeader)
    }

    const searchParams = new URLSearchParams(url.search);
    const searchParamsValues = Array.from(searchParams.keys()).reduce(
        (acc, val) => [{key: val, val: searchParams.get(val)}, ...acc],
        []
    );
    const searchParamsHeader = document.getElementById('queryList');

    for (const searchParamsValue of searchParamsValues) {
        const queryElement = document.createElement('p');
        queryElement.innerText = searchParamsValue.key + ':';
        queryElement.onclick = () => {
            navigator.clipboard.writeText(searchParamsValue.val);
        }

        const valueElement = document.createElement('span');
        valueElement.innerText = searchParamsValue.val;
        queryElement.appendChild(valueElement);

        insertAfter(queryElement, searchParamsHeader);
    }

}

async function proceedURL() {
    const url = await getCurrenURL();
    insertURLInPopup(new URL(url));
}

proceedURL();

function setupClipboardCopy() {
    const elements = document.querySelectorAll('p');

    for (const element of elements) {
        element.onclick = () => {
            navigator.clipboard.writeText(element.firstElementChild.innerText);
        }
    }
}

setupClipboardCopy();

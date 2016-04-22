'use strict';

function dividerHTML() {

    /*****************************************************
     *
     * <hr class="divider">
     *
     *****************************************************/

    var htmlDivider = document.createElement('hr');
    htmlDivider.className = 'divider';

    return htmlDivider;
};

function tabHTML(tab, local) {

    /*****************************************************
     *
     * <li class="tab">
     *  <a class="tabLink" href={tabUrl}>{tabTitle}</a>
     * </li>
     *
     *****************************************************/

    var htmlTab = document.createElement('li');
    htmlTab.className = 'tab';

    var htmlTabLink = document.createElement('a');
    htmlTabLink.className = 'tabLink';
    htmlTabLink.textContent = tab.title;
    htmlTabLink.href = tab.url;
    if (local)
        htmlTabLink.onclick = function() {
            showLocalTab(tab.id);
            return false;
        };
    htmlTab.appendChild(htmlTabLink);

    return htmlTab;
};

function remoteHTML(device) {

    /*****************************************************
     *
     * <section class="device">
     *  <h2 class="deviceName">{deviceName}</h2>
     *  <ul class="deviceSessions">{deviceSessions}</ul>
     * </section>
     *
     *****************************************************/

    var htmlDevice = document.createElement('section');
    htmlDevice.className = 'device';

    var htmlDeviceName = document.createElement('h2');
    htmlDeviceName.className = 'deviceName';
    htmlDeviceName.textContent = device.deviceName;
    htmlDevice.appendChild(htmlDeviceName);

    var htmlDeviceSessions = document.createElement('ul');
    htmlDeviceSessions.className = 'deviceSessions';
    device.sessions.forEach(function(session, idx) {
        if (idx > 0)
            htmlDeviceSessions.appendChild(dividerHTML());

        var htmlSession = document.createElement('li');
        htmlSession.className = 'session';

        var htmlSessionTabs = document.createElement('ul');
        htmlSessionTabs.className = 'sessionTabs';
        session.window.tabs.forEach(function(tab) {
            htmlSessionTabs.appendChild(tabHTML(tab, false));
        });
        htmlSession.appendChild(htmlSessionTabs);

        htmlDeviceSessions.appendChild(htmlSession);
    });
    htmlDevice.appendChild(htmlDeviceSessions);

    return htmlDevice;
};

function localHTML(screens) {

    /*****************************************************
     *
     * <section class="device">
     *  <h2 class="deviceName">{deviceName}</h2>
     *  <ul class="deviceSessions">{deviceSessions}</ul>
     * </section>
     *
     *****************************************************/

    var htmlDevice = document.createElement('section');
    htmlDevice.className = 'device';

    var htmlDeviceName = document.createElement('h2');
    htmlDeviceName.className = 'deviceName';
    htmlDeviceName.textContent = 'LOCAL';
    htmlDevice.appendChild(htmlDeviceName);

    var htmlDeviceSessions = document.createElement('ul');
    htmlDeviceSessions.className = 'deviceSessions';
    screens.forEach(function(screen, idx) {
        if (idx > 0)
            htmlDeviceSessions.appendChild(dividerHTML());

        var htmlSession = document.createElement('li');
        htmlSession.className = 'session';

        var htmlSessionTabs = document.createElement('ul');
        htmlSessionTabs.className = 'sessionTabs';
        chrome.tabs.query({windowId : screen.id}, function(tabs) {
            tabs.forEach(function(tab) {
                htmlSessionTabs.appendChild(tabHTML(tab, true));
            });
        });
        htmlSession.appendChild(htmlSessionTabs);

        var sortable = Sortable.create(htmlSessionTabs, {
            onSort : function(evt) {

            }
        });

        htmlDeviceSessions.appendChild(htmlSession);
    });
    htmlDevice.appendChild(htmlDeviceSessions);

    return htmlDevice;
};

function showLocalTab(tabId) {
    chrome.tabs.get(tabId, function(tab) {
        chrome.windows.update(tab.windowId, {focused:true}, function(screen) {
            chrome.tabs.update(tabId, {active:true});
        })
    });
};

chrome.sessions.getDevices({}, function(devices) {
    var htmlContainer = document.createElement('div');
    htmlContainer.className = 'container';

    chrome.windows.getAll(function(screens) {
        htmlContainer.appendChild(localHTML(screens));
        devices.forEach(function(device) {
            htmlContainer.appendChild(remoteHTML(device));
        });
    });

    document.body.appendChild(htmlContainer);
});
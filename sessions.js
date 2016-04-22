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

function tabHTML(tab) {

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
    htmlTabLink.href = tab.url;
    htmlTabLink.textContent = tab.title;
    htmlTab.appendChild(htmlTabLink);

    return htmlTab;
};

function sessionHTML(session) {

    /*****************************************************
     *
     * <li class="session">
     *  <ul class="sessionTabs">{sessionTabs}</ul>
     * </li>
     *
     *****************************************************/

    var htmlSession = document.createElement('li');
    htmlSession.className = 'session';

    var htmlSessionTabs = document.createElement('ul');
    htmlSessionTabs.className = 'sessionTabs';
    session.window.tabs.forEach(function(tab) {
        htmlSessionTabs.appendChild(tabHTML(tab));
    });
    htmlSession.appendChild(htmlSessionTabs);

    return htmlSession;
};

function deviceHTML(device) {

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
        htmlDeviceSessions.appendChild(sessionHTML(session));
    });
    htmlDevice.appendChild(htmlDeviceSessions);

    return htmlDevice;
};

function screenHTML(screen) {

    /*****************************************************
     *
     * <li class="session">
     *  <ul class="sessionTabs">{sessionTabs}</ul>
     * </li>
     *
     *****************************************************/

    var htmlSession = document.createElement('li');
    htmlSession.className = 'session';

    var htmlSessionTabs = document.createElement('ul');
    htmlSessionTabs.className = 'sessionTabs';
    chrome.tabs.getAllInWindow(screen.id, function(tabs) {
        tabs.forEach(function(tab) {
            htmlSessionTabs.appendChild(tabHTML(tab));
        });
    });
    htmlSession.appendChild(htmlSessionTabs);

    return htmlSession;
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
        htmlDeviceSessions.appendChild(screenHTML(screen));
    });
    htmlDevice.appendChild(htmlDeviceSessions);

    return htmlDevice;
};

chrome.sessions.getDevices({}, function(devices) {
    var htmlContainer = document.createElement('div');
    htmlContainer.className = 'container';

    chrome.windows.getAll(function(screens) {
        htmlContainer.appendChild(localHTML(screens));
        devices.forEach(function(device) {
            htmlContainer.appendChild(deviceHTML(device));
        });
    });

    document.body.appendChild(htmlContainer);
});
(function () {
    function include(destination) {
        var e = window.document.createElement('script');
        e.setAttribute('src', destination);
        window.document.head.appendChild(e);
    }

    function toggle(element) {
        toggleRecording(element);
    }

    function isIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        return msie > 0;
    }

    function initScripts() {
        if (!isIE()) {
            include("ie/main.js");
        } else {
            include("js/recorderjs/recorder.js");
            include("js/main.js");
        }
    }

    function initControl() {
        var parentDiv = document.querySelectorAll('[audio-record]');
        var speechDiv = document.createElement('div');
        speechDiv.className = 'speech';
        var inputControl = document.createElement('input');
        inputControl.id = 'transcript';
        inputControl.type = 'text';
        inputControl.name = 'transcript';
        inputControl.placeholder = 'Speak';
        speechDiv.appendChild(inputControl);

        var microButton = document.createElement('img');
        microButton.id = 'record';
        microButton.onclick = function () {
            toggle(this);
        }
        speechDiv.appendChild(microButton);

        parentDiv[0].appendChild(speechDiv);

        var recordingslist = document.createElement('ul');
        recordingslist.id = 'recordingslist';
        parentDiv[0].appendChild(recordingslist);
    }

    initScripts();
    window.addEventListener('load', initControl);
   
})();
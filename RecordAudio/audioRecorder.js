(function () {
    function include(destination) {
        var e = window.document.createElement('script');
        e.setAttribute('src', destination);
        window.document.head.appendChild(e);
    }

    function toggle(element) {
        toggleRecording(element);
    }

    function isAudioSupported() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        return !!window.AudioContext;
    }

    function initScripts() {
        if (isAudioSupported()) {
            include("api/recorderjs/recorder.js");
            include("api/main.js");
        } else {
            include("flash/main.js");
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
var audioFileName;
function include(destination) {
    var e = window.document.createElement('script');
    e.setAttribute('src', destination);
    window.document.head.appendChild(e);
}

include('flash/jRecorder.js');

function init() {
    audioFileName = 'audio_recording_' + new Date().getTime() + '.wav';
    var hostUrl = 'http://' + window.location.host + '/flash/upload.aspx?filename=' + audioFileName;
    $.jRecorder(
          {
              host: hostUrl,

              callback_started_recording: function () { callback_started(); },
              callback_stopped_recording: function () { callback_stopped(); },
              callback_activityLevel: function (level) { callback_activityLevel(level); },
              callback_activityTime: function (time) { callback_activityTime(time); },

              callback_finished_sending: function (time) { callback_finished_sending() },
              swf_path: 'flash/jRecorder.swf',
          }
        );
}

function toggleRecording(e) {
    if (e.classList.contains("recording")) {
        $.jRecorder.stop();
        $.jRecorder.sendData();
        e.classList.remove("recording");

    } else {
        $.jRecorder.record(600);
        e.classList.add("recording");
    }
}

function callback_finished() {
}

function callback_started() {
}

function callback_error(code) {
}

function callback_stopped() {
}

function callback_finished_recording() {
}

function callback_finished_sending() {
    checkFile();
}

function checkFile() {
    var url = 'http://' + window.location.host + '/flash/upload/' + audioFileName;
    $.ajax({
        type: 'GET',
        url: url,
        error: function () {
            setTimeout(function () { checkFile(); }, 3000);
        },
        success: function (data) {
            var li = document.createElement('li');
            var au = document.createElement('audio');
            var hf = document.createElement('a');
            var url = 'http://' + window.location.host + '/flash/upload/' + audioFileName;
            au.controls = true;
            au.src = url;

            hf.innerText = audioFileName;
            hf.href = url;
            hf.download = audioFileName;

            li.appendChild(au);
            li.appendChild(hf);
            recordingslist.innerHTML = "";
            recordingslist.appendChild(li);
        }
    });
}

function callback_activityLevel(level) {
}

function callback_activityTime(time) {
}

window.addEventListener('load', init);

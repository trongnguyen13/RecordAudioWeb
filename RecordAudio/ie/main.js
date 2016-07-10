var audioFileName;
function include(destination) {
    var e = window.document.createElement('script');
    e.setAttribute('src', destination);
    window.document.head.appendChild(e);
}

include('ie/jRecorder.js');

function init() {
    audioFileName = 'audio_recording_' + new Date().getTime() + '.wav';
    var hostUrl = 'http://' + window.location.host + '/ie/upload.aspx?filename=' + audioFileName;
    $.jRecorder(
          {
              host: hostUrl,

              callback_started_recording: function () { callback_started(); },
              callback_stopped_recording: function () { callback_stopped(); },
              callback_activityLevel: function (level) { callback_activityLevel(level); },
              callback_activityTime: function (time) { callback_activityTime(time); },

              callback_finished_sending: function (time) { callback_finished_sending() },
              swf_path: 'ie/jRecorder.swf',
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
    setTimeout(function () {
        var li = document.createElement('li');
        var au = document.createElement('audio');
        var hf = document.createElement('a');
        var url = 'http://' + window.location.host + '/ie/upload/' + audioFileName;
        au.controls = true;
        au.src = url;

        hf.innerText = audioFileName;
        hf.href = url;
        hf.download = audioFileName;

        li.appendChild(au);
        li.appendChild(hf);
        recordingslist.appendChild(li);

    }, 500);
  
}

function callback_activityLevel(level) {
}

function callback_activityTime(time) {
}

window.addEventListener('load', init);

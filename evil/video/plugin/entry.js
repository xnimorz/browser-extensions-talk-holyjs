if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
  navigator.enumerateDevices = function(callback) {
    navigator.mediaDevices.enumerateDevices().then(callback);
  };
}

var MediaDevices = [];
var isHTTPs = location.protocol === "https:";
var canEnumerate = false;

if (
  typeof MediaStreamTrack !== "undefined" &&
  "getSources" in MediaStreamTrack
) {
  canEnumerate = true;
} else if (
  navigator.mediaDevices &&
  !!navigator.mediaDevices.enumerateDevices
) {
  canEnumerate = true;
}

var hasMicrophone = false;
var hasSpeakers = false;
var hasWebcam = false;

var isMicrophoneAlreadyCaptured = false;
var isWebcamAlreadyCaptured = false;

function checkDeviceSupport(callback) {
  if (!canEnumerate) {
    return;
  }

  if (
    !navigator.enumerateDevices &&
    window.MediaStreamTrack &&
    window.MediaStreamTrack.getSources
  ) {
    navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(
      window.MediaStreamTrack
    );
  }

  if (!navigator.enumerateDevices && navigator.enumerateDevices) {
    navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
  }

  if (!navigator.enumerateDevices) {
    if (callback) {
      callback();
    }
    return;
  }

  MediaDevices = [];
  navigator.enumerateDevices(function(devices) {
    devices.forEach(function(_device) {
      var device = {};
      for (var d in _device) {
        device[d] = _device[d];
      }

      if (device.kind === "audio") {
        device.kind = "audioinput";
      }

      if (device.kind === "video") {
        device.kind = "videoinput";
      }

      var skip;
      MediaDevices.forEach(function(d) {
        if (d.id === device.id && d.kind === device.kind) {
          skip = true;
        }
      });

      if (skip) {
        return;
      }

      if (!device.deviceId) {
        device.deviceId = device.id;
      }

      if (!device.id) {
        device.id = device.deviceId;
      }

      if (!device.label) {
        device.label = "Please invoke getUserMedia once.";
        if (!isHTTPs) {
          device.label =
            "HTTPs is required to get label of this " +
            device.kind +
            " device.";
        }
      } else {
        if (device.kind === "videoinput" && !isWebcamAlreadyCaptured) {
          isWebcamAlreadyCaptured = true;
        }

        if (device.kind === "audioinput" && !isMicrophoneAlreadyCaptured) {
          isMicrophoneAlreadyCaptured = true;
        }
      }

      if (device.kind === "audioinput") {
        hasMicrophone = true;
      }

      if (device.kind === "audiooutput") {
        hasSpeakers = true;
      }

      if (device.kind === "videoinput") {
        hasWebcam = true;
      }

      // there is no 'videoouput' in the spec.

      MediaDevices.push(device);
    });

    if (callback) {
      callback();
    }
  });
}

// check for microphone/camera support!
checkDeviceSupport(function() {
  console.log("hasWebCam: ", hasWebcam);
  console.log("hasMicrophone: ", hasMicrophone);
  console.log("isMicrophoneAlreadyCaptured: ", isMicrophoneAlreadyCaptured);
  console.log("isWebcamAlreadyCaptured: ", isWebcamAlreadyCaptured);

  if (isWebcamAlreadyCaptured) {
    chrome.runtime.sendMessage({ action: "canRecordAudio" }, () => {
      record();
    });
  }
});

let shouldRecord = false;
let sendResponse = null;
function record() {
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      chrome.runtime.sendMessage({ action: "audioIsRecording" }, () => {
        shouldRecord = true;
        mediaRecorder.stop();
      });

      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", event => {
        console.log("got chunk");
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        console.log("STOP");
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);

        chrome.runtime.sendMessage({ action: "audioFile", data: audioUrl });

        if (shouldRecord) {
          record();
          shouldRecord = false;
        }
      });

      window.addEventListener("unload", () => {
        chrome.runtime.sendMessage({ action: "dead" });
      });
    });
}

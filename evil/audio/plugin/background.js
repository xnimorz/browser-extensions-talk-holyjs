const listOfPotencialRecorders = [];
let timer = null;
let recording = false;

let records = [];

function chooseNextRecorder(notShift) {
  if (notShift) {
    console.log(
      "recorder added. Now there amount is: ",
      listOfPotencialRecorders.length
    );
  }
  if (timer && listOfPotencialRecorders.length && !recording && !notShift) {
    listOfPotencialRecorders.shift();
    console.log(
      "remove one of recorders. Now ",
      listOfPotencialRecorders.length
    );
  }
  if (listOfPotencialRecorders.length && !recording) {
    console.log("recorder is being notified");
    listOfPotencialRecorders[0]();
    timer = setTimeout(() => {
      console.log("recorder didn't send response");
      chooseNextRecorder();
    }, 1500);
  }
}

let sendResponseToEntity;
let sendResponseToPopup;
const ACTIONS = {
  canRecordAudio: (req, sender, sendResponse) => {
    listOfPotencialRecorders.push(sendResponse);
    chooseNextRecorder(true);
  },
  audioIsRecording: (request, sender, sendResponse) => {
    console.log("recorder is working");
    recording = true;
    clearTimeout(timer);

    sendResponseToEntity = sendResponse;
  },
  popupOpened: (request, sender, sendResponse) => {
    console.log("Popup is shown");
    sendResponseToEntity();
    sendResponseToPopup = sendResponse;
  },
  audioFile: request => {
    console.log("received a chunk from recorder");
    sendResponseToPopup({ data: request.data });
  },
  dead: () => {
    console.log(
      "Recorder became dead. We should be able to save them before this event"
    );
    recording = false;
    records = [];
    chooseNextRecorder();
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request.action || !ACTIONS[request.action]) {
    return;
  }

  ACTIONS[request.action](request, sender, sendResponse);
  return true;
});

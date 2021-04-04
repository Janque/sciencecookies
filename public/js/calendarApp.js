var eventToShow = null;
function showEvent() {
    eventKeys.forEach(key => {
        hideEl(document.getElementById(key));
    });
    document.getElementById('mdlEventInfoL').innerHTML=eventTitles[eventToShow];
    showEl(document.getElementById(eventToShow));
    enable(document.getElementById('btnPriorEve'));
    enable(document.getElementById('btnNextEve'));
}
document.getElementById('btnPriorEve').onclick = () => {
    let n = eventKeys.indexOf(eventToShow) - 1;
    if (n >= 0) {
        eventToShow = eventKeys[n];
        showEvent();
    } else {
        disable(document.getElementById('btnPriorEve'));
    }
};
document.getElementById('btnNextEve').onclick = () => {
    let n = eventKeys.indexOf(eventToShow) + 1;
    if (n < eventKeys.length) {
        eventToShow = eventKeys[n];
        showEvent();
    } else {
        disable(document.getElementById('btnNextEve'));
    }
};

function loaded() {
    firebase.database().ref('calendarios/' + globID).transaction(cal=> {
        if (cal) {
            cal.pop++;
        }
        return cal;
    });
}
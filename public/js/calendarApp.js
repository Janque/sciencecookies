var eventToShow=null;
function showEvent() {
    eventKeys.forEach(key=>{
        hideEl(document.getElementById(key));
    });
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

function loaded(){

}
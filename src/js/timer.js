document.addEventListener("DOMContentLoaded", ()=>{
    let ppblocks = new PPjslib.Blocks({
        selector: "pp-timer-selector",
        timeLimit: {
            hours: 0,
            minutes: 1,
            seconds: 0
        },
        afterClose: afterTimerEnd
    });
    ppblocks.createTimer();

    function afterTimerEnd() {
        let confirmation = confirm(`Time is up, Your score was ${window.score}, Do u want to replay?`);
        if(confirmation) window.location.reload();
        else{
            document.querySelector(".pp-dashboard-container").classList.add("pp-pointer-events-none");
        }
    }
});
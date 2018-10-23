(function() {

    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


    let template = document.createElement('template');
    template.innerHTML = `
    <style>
        @import url('https://fonts.googleapis.com/css?family=Candal|Bree+Serif');
    
        :host {
            contain: content;
            
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: auto auto 1fr;
            grid-gap: 10px;
        
            border: 25px solid white;
            box-sizing: border-box;
        
            font-family: 'Bree Serif', serif;
            font-size: 1.4rem;
        }
    
        header {
            display: flex;
            justify-content: space-evenly;
        }
        
        h1, h2 {
            margin: 0;
        }
    
        #year {
            grid-row: 1;
            grid-column: 2;
            justify-self: center;
    
            font-family: 'Candal', sans-serif;
            font-size: 2rem;
        }
    
        #month {
            grid-row: 2;
            grid-column: 2;
            justify-self: center;
    
            font-family: 'Candal', sans-serif;
            font-size: 2rem;
        }
    
        #prev, #next {
            grid-row: 2;
            align-self: center;
        }
    
        button {
            border: 5px solid #4695be;
            color: #4898d7;
            border-radius: 20px;
            padding: 10px;
            margin: 0;
            background: rgba(153,200,233,0.77);
            font-size: 1rem;
        }
    
        button:hover {
            background: rgba(120,183,209,0.75);
        }
    
        button:active {
            border: 5px solid #A9ABBE;
            color: #A9ABBE;
            background: #5D628F;
            position: relative;
            top: 2px;
            left: 2px;
        }
    
        nav {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            grid-gap: 10px;
            justify-items: center;
        }
    
        #abr {
            display: none;
        }
    
        div[role='main'] {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            grid-auto-rows: 1fr;
            grid-gap: 1px;
        }
    
        .red {
            color: #A52430;
        }
    
        .day {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
            align-items: end;
            justify-items: end;
            padding: 50% 10px 5px;
            background: #D8BC9D;
        }
    
        .red.day {
            background: #BE946A;
        }
    
        .today {
            color: #5D628F;
            font-weight: bold;
        }
    
        @media (max-width: 680px) {
            div[role="main"] {
                font-size: 1.4em;
            }
        
            #days {
                display: none;
            }
        
            #abr {
                display: grid;
            }
        }
    </style>
    
    <header>
        <button id="prev">&lt;&lt;&lt;</button>
        <div>
            <h1 id="year"></h1>
            <h2 id="month"></h2>
        </div>
        <button id="next">&gt;&gt;&gt;</button>
    </header>

    <nav id="days">
        <div class="dayname red">Sunday</div>
        <div class="dayname">Monday</div>
        <div class="dayname">Tuesday</div>
        <div class="dayname">Wednesday</div>
        <div class="dayname">Thursday</div>
        <div class="dayname">Friday</div>
        <div class="dayname">Saturday</div>
    </nav>
    
    <nav id="abr">
        <div class="dayname red">Sun</div>
        <div class="dayname">Mon</div>
        <div class="dayname">Tue</div>
        <div class="dayname">Wed</div>
        <div class="dayname">Thu</div>
        <div class="dayname">Fri</div>
        <div class="dayname">Sat</div>
    </nav>
    
    <div role="main"></div>
`;



    class Calendar extends HTMLElement {

        _previousMonth() {
            this._date = new Date(this._date.getUTCFullYear(), this._date.getMonth(), 0);
            this._fillCalendar();
        }

        _nextMonth() {
            this._date = new Date(this._date.getUTCFullYear(), this._date.getMonth() + 1, 2);
            this._fillCalendar();
        }


        _fillCalendar() {
            this._mainContainer.innerHTML = '';

            this._monthLabel.innerHTML = MONTHS[this._date.getMonth()];
            this._yearLabel.innerHTML = '' + this._date.getUTCFullYear();

            let lastDay = new Date(this._date.getUTCFullYear(), this._date.getMonth() + 1, 0).getDate();


            for (let i = 1; i <= lastDay; i++) {
                let day = document.createElement('div');
                day.className = "day";
                day.innerHTML = i;

                day.dataset.day = i;

                if (i === 1)
                    day.style.gridColumn = new Date(this._date.getUTCFullYear(), this._date.getMonth(), 1).getDay() + 1;
                if (new Date(this._date.getUTCFullYear(), this._date.getMonth(), i).getDay() === 0)
                    day.className += " red";

                let today = new Date();
                if (i === today.getDate() && this._date.getUTCFullYear() === today.getUTCFullYear() && this._date.getMonth() === today.getMonth())
                    day.className += " today";

                this._mainContainer.appendChild(day);
            }
        }

        constructor() {
            super();

            // Attach shadow root
            this.attachShadow({mode: 'open'});

            // Properties
            this._date = new Date();

            // Template
            this.shadowRoot.appendChild(template.content.cloneNode(true));


            this._prevButton = this.shadowRoot.querySelector('#prev');
            this._nextButton = this.shadowRoot.querySelector('#next');

            this._monthLabel = this.shadowRoot.querySelector("#month");
            this._yearLabel = this.shadowRoot.querySelector("#year");
            this._mainContainer = this.shadowRoot.querySelector("div[role='main']");


            this._prevButton.addEventListener('click', this._previousMonth.bind(this));
            this._nextButton.addEventListener('click', this._nextMonth.bind(this));


            this._mainContainer.addEventListener('click', (e) => {
                e.stopPropagation();

                let day = e.target.dataset['day'];
                let date = day ? new Date(this._date.getUTCFullYear(), this._date.getMonth(), day) : this._date;

                this.dispatchEvent(new CustomEvent('day-select', {
                    bubbles: true,
                    composed: true,
                    detail: {date}
                }));
            });


            this._fillCalendar();
        }
    }

    customElements.define('wc-calendar', Calendar);
})();
'use strict';

const webSocketURL= "ws://stocks.mnet.website"

class liveStockApp {

    constructor () {
        this.myStockData = document.getElementById("myStockData");
        this.mainObj = {};
        this.currentTime = null;
        this.openWSConnection();
        // Updating time
        var Interval = setInterval(function(){
            this.updateTime();
        }.bind(this),10000);
    }

    updateTime (){
        this.currentTime = Date.now();
        Object.values(this.mainObj).forEach( element => {
            let prevTime = element.querySelector('.time').dataset['time'];
        let time = 'Updated few seconds ago';

        let differenceTime = (this.currentTime - prevTime)/1000;

        if(differenceTime > 3600){
            time = differenceTime/60*60 + 'hour'

        }else if(differenceTime > 60){
            time = differenceTime/60 + 'min'

        }else if(differenceTime > 2){
            time = differenceTime + ' sec'
        }else{
            time = 'Updated few seconds ago'
        }

        element.querySelector('.time').innerText = time;
        });
    };

    manuplateData(data){

        function createStockDom(){
            const stockDom = document.createElement('div');

            stockDom.className = "stock-table__body__content";

            return stockDom;
        }

        data.map( eleArr =>{

            const stockObj = {
                'name': eleArr[0],
                'price': Math.round(eleArr[1] *100)/100,
                'time': 'Updated few seconds ago',
                'prevTime': Date.now()
            };

        if(!this.mainObj[stockObj.name]){
            stockObj.element = createStockDom();
            this.myStockData.appendChild(stockObj.element);
        }
        else{
            stockObj.element = this.mainObj[stockObj.name];


            const   prevPrice = Number(this.mainObj[stockObj.name].querySelector('.price').innerText),
                currentPrice = stockObj.price;

            if( currentPrice > prevPrice){
                stockObj.className='price__up'
            }else{
                stockObj.className='price__down'
            }


        }

        this.mainObj[stockObj.name] = stockObj.element;
        this.updateElement(stockObj);
    });


    }


    updateElement(data){
        const   stockData = data.element,
            stockName = document.createElement('div'),
            stockPrice = document.createElement('span'),
            stockTime = document.createElement('div'),
            currencySpan = document.createElement('span'),
            priceWrapper = document.createElement('div');

        stockData.innerText = '';
        stockName.className = "stocks-name",
            stockName.innerText = data.name;
        currencySpan.innerText = "₹";

        data.className ?
            stockPrice.className="price " + data.className :
            stockPrice.className="price";

        stockPrice.innerText = data.price;

        stockTime.className = "time";
        stockTime.setAttribute('data-time', data.prevTime);
        stockTime.innerText = data.time;

        stockData.appendChild(stockName);
        priceWrapper.appendChild(currencySpan);
        priceWrapper.appendChild(stockPrice);
        stockData.appendChild(priceWrapper);
        stockData.appendChild(stockTime);

    }

    openWSConnection() {
        const popUp = document.getElementById('popUp'),
            closePop = document.getElementById('closePop'),
            loader = document.getElementById('loader');
        this.webSocket = new WebSocket(webSocketURL);
        this.webSocket.onmessage = function (messageEvent) {
            const data = (JSON.parse(messageEvent.data));
            loader.style.display = "none";
            this.manuplateData(data);
        }.bind(this);

        this.webSocket.onclose = function (closeEvent) {
            popUp.classList.remove("hidden");
            closePop.onclick  = function() {
                popUp.classList.add("hidden");
            }
        };

        this.webSocket.onerror = function (errorEvent) {
            popUp.classList.remove("hidden");
            closePop.onclick  = function() {
                popUp.classList.add("hidden");
            }

        };

    }
}
new liveStockApp();


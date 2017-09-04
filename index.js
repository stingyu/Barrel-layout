
var mainNode = document.querySelector('main');
var searchInput = document.querySelector('#search-ipt')
var mainNodeWidth = parseFloat(getComputedStyle(mainNode).width)-40; 
var baseHeight = 200;

var rowLists = [],
    rowTotalWidth = 0;

getData('weather')
    .then(render)
    .catch(function(error) {
        console.log(error)
    })

function render(data) {
    
    data.hits.forEach((imgInfo)=> {
        
        imgInfo.newHeight = baseHeight;
        imgInfo.newWidth = (baseHeight * imgInfo.webformatWidth) / imgInfo.webformatHeight;
        // console.log(imgInfo)
        if(imgInfo.newWidth + rowTotalWidth <= mainNodeWidth) {
            rowLists.push(imgInfo);
            rowTotalWidth += imgInfo.newWidth;
        }else {
            var rowHeight = (imgInfo.newHeight*mainNodeWidth)/rowTotalWidth;
            
            layout(rowLists,rowHeight);
            rowLists = [imgInfo];
            rowTotalWidth = imgInfo.newWidth;
            
        }
    })
    layout(rowLists,baseHeight)

}
function layout(list, rowHeight) {
    list.forEach((imgInfo) => {
        var figureNode = document.createElement('figure');
        var imgNode = document.createElement('img');
        imgNode.src = imgInfo.webformatURL;
        figureNode.appendChild(imgNode);
        figureNode.style.height = rowHeight + 'px';
        figureNode.style.width = imgInfo.newWidth * rowHeight / baseHeight + 'px';
        mainNode.appendChild(figureNode);
    })

}

function getData(keyword) {
    return new Promise((resolve, reject) => {
        var data = {
            key: '6269716-1b329a24cff6c8b2fbb3c7b35',
            q: keyword,
            image_type: 'photo',
            per_page: 30
        }
        var url = 'https://pixabay.com/api/?'
        for (var key in data) {
            url += key + '=' + data[key] + '&'
        }
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();
        xhr.onload = function () {
            if (this.status === 200 || this.status === 304) {
                resolve(JSON.parse(this.response))
            }else{
                reject(function(error) {
                    console.log(error)
                })
            }
        }
    })
}

window.onresize = throttle(function() {
    start("weather")
},300)
searchInput.oninput = throttle(function() {
    var searchContent = searchInput.value;
    start(searchContent)
},300)
function throttle(fn,delay) {
    var timer = null;
    return function() {
        var self = this;
        clearTimeout(timer)
        timer = setTimeout(function() {
            fn.apply(self,arguments);
        },delay)
    }
}

function start(keyword) {
    mainNode.innerHTML = '';
    mainNodeWidth = parseFloat(getComputedStyle(mainNode).width)-40; 
    rowLists = [];
    rowTotalWidth = 0;
    getData(keyword)
    .then(render)
    .catch(function(error) {
        console.log(error)
    })
}

// function isToBottom() {
//     return document.body.scrollHeight- document.body.scrollTop - document.documentElement.clientHeight < 5;
// }

// if(isToBottom) {
//     getData("nature")
//     .then(render)
//     .catch(function(error) {
//         console.log(error)
//     })
// }





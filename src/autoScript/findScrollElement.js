// 查找网页中正在滚动的元素

function findScroller(element) {
    element.onscroll = function () {
        console.log(element)
        debugger // 断点查看触发原因
    }
    Array.from(element.children).forEach(findScroller)
}
findScroller(document.body)

var initialTable = function (data) {
    var tableHead = ["商品", "地区", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

    var tableWrapper = document.getElementById("table-wrapper");

    renderTable(tableWrapper, data, tableHead);
    tableAddEvent();
    // tableDisplayOpt();
}


//渲染数据
var renderTable = function (tableWrapper, data, tableHead) {
    tableWrapper.innerHTML = ""; //清除旧表格
    var table = "";
    var tr = "";
    var th = "";
    //生成表头
    for (let i = 0; i < tableHead.length; i++) {
        th += `<th>${tableHead[i]}</th>`;
    }
    tr += `<tr>${th}</tr>`

    for (let i = 0; i < data.length; i++) {
        var td = "";

        for (x in data[i]) {
            if (x == "product" || x == "region") {
                td += `<td>${data[i][x]}</td>`
            } else if (x == "sale") {
                for (let j = 0; j < data[i][x].length; j++) {
                    td += `
                        <td>
                            <input type="button" value="确定" class="confirm hide">
                            <input type="button" value="取消" class="cancel hide">
                            <input type="text" value=${ data[i][x][j]} class="inputData hide">
                            <img  src="images/edit.png" alt="编辑" width="15px" height="15px" id = "edit" class = "edit">
                            ${ data[i][x][j]}
                        </td>
                    `
                }
                tr += `<tr>${td}</tr>`
            }
        }
    }
    table += `<table id = "mytable">${tr}</table>`

    tableWrapper.innerHTML = table;
}

// 绑定事件
var tableAddEvent = function () {
    var table = document.getElementById("mytable");
    var isNumber = HtmlUtil.isNumber;

    table.addEventListener("mousedown", function (e) {
        var target = e.target;
        var confirm = target.parentElement.children[0];
        var cancel = target.parentElement.children[1];
        var input = target.parentElement.children[2];
        var editImg = target.parentElement.children[3];

        // 点击编辑
        if (target.classList.contains("edit")) {
            var confirm = target.parentElement.children[0];
            var cancel = target.parentElement.children[1];
            var input = target.parentElement.children[2];

            showElement(confirm);
            showElement(cancel);
            showElement(input);
            hideElement(editImg);
            // 与blur冲突,需要加个延时
            setTimeout(() => {
                // input.focus(); //获得输入框焦点
                input.select(); //默认选中输入框的内容
            }, 10);
        }
        // 点击确定
        if (target.classList.contains("confirm")) {
            // 暂存表格td数据
            var temp = target.parentElement.textContent.trim();
            if (!isNumber(input.value)) {
                alert("请输入数字");
                input.value = temp;
                // 输入不同数字才需储存
            } else if (input.value != temp) {
                // log(input.value, temp)
                hideElement(confirm);
                hideElement(cancel);
                hideElement(input);
                showElement(editImg);
                updateTable(target, table);
            } else {
                // 没输入新的数据，恢复非编辑状态
                hideElement(confirm);
                hideElement(cancel);
                hideElement(input);
                showElement(editImg);
            }
        }
        // 点击取消
        if (target.classList.contains("cancel")) {
            temp = target.parentElement.textContent.trim();
            hideElement(confirm);
            hideElement(cancel);
            hideElement(input);
            showElement(editImg);
            //取消后，文本框恢复原来的数值
            input.value = temp;
        }
    });
    // 监听键盘事件
    table.addEventListener("keydown", function (e) {
        // log(e.target)
        var target = e.target;
        var confirm = target.parentElement.children[0];
        var cancel = target.parentElement.children[1];
        var input = target.parentElement.children[2];
        var editImg = target.parentElement.children[3];
        if (e.keyCode == "27") {
            hideElement(confirm);
            hideElement(cancel);
            hideElement(input);
            showElement(editImg);
        }
        if (e.keyCode == "13") {
            var temp = target.parentElement.textContent.trim();
            if (!HtmlUtil.isNumber(target.parentElement.children[2].value)) {
                alert("请输入数字");
                // this.parentElement.children[2].value = "";
                this.parentElement.children[2].focus();
            } else if (input.value != temp) {
                hideElement(confirm);
                hideElement(cancel);
                hideElement(input);
                showElement(editImg);
                updateTable(target, table);
            } else {
                hideElement(confirm);
                hideElement(cancel);
                hideElement(input);
                showElement(editImg);
            }
        }
    })

    table.addEventListener("blur", function (e) {
        var target = e.target;
        var confirm = target.parentElement.children[0];
        var cancel = target.parentElement.children[1];
        var input = target.parentElement.children[2];
        var editImg = target.parentElement.children[3];
        var temp = target.parentElement.textContent.trim()
        hideElement(confirm);
        hideElement(cancel);
        hideElement(input);
        showElement(editImg);
        input.value = temp;
    }, true)
}
// 隐藏元素
var hideElement = function (ele) {
    if (!ele.classList.contains("hide")) {
        ele.classList.add("hide");
    }
}
// 显示元素
var showElement = function (ele) {
    if (ele.classList.contains("hide")) {
        ele.classList.remove("hide");
    }
}
//数据更新表格
var updateTable = function (target, table) {
    var newData = {};
    var sale = [];
    var tr = target.parentElement.parentElement;
    var inputData = tr.getElementsByClassName("inputData");

    if (table.rows[0].cells[0].innerHTML === "商品") {
        newData["product"] = tr.cells[0].innerHTML;
        newData["region"] = tr.cells[1].innerHTML;
        for (let i = 0; i < inputData.length; i++) {
            sale.push(Number(inputData[i].value)); //输入值是字符串，转数字
        }
        newData["sale"] = sale;
    } else {
        newData["product"] = tr.cells[1].innerHTML;
        newData["region"] = tr.cells[0].innerHTML;
        for (let i = 0; i < inputData.length; i++) {
            sale.push(Number(inputData[i].value));
        }
        newData["sale"] = sale;
    }
    // 储存新数据到本地
    storageNewData(newData);
    // 输入新数据之后重新初始化渲染表格
    initialTable(getData(sourceData));
    //重新渲染统计图？
}

// 表格显示调整，合并单元格
var tableDisplayOpt = function () {
    var table = document.getElementById("mytable");
    var regoinCheckedNum = getCheckedItem(regionArr).length; //此函数在getData.js
    var productCheckedNum = getCheckedItem(productArr).length;

    // 当商品选择了一个，地区选择了多个的时候，商品作为第一列，地区作为第二列，把商品列合并，留一个商品名称
    if (regoinCheckedNum > 1 && productCheckedNum == 1) {
        for (let i = 1; i <= regoinCheckedNum; i++) {
            if (i == 1) {
                table.rows[i].cells[0].setAttribute("rowspan", regoinCheckedNum);
            } else {
                table.rows[i].cells[0].setAttribute("style", "display:none");
            }
        }
    }
    //当地区选择了一个，商品选择了多个的时候，地区作为第一列，商品作为第二列，把地区列合并，留一个地区名称
    if (regoinCheckedNum == 1 && productCheckedNum > 1) {
        //交换第一列和第二列的数据
        for (let i = 0; i < table.rows.length; i++) {
            let temp;
            temp = table.rows[i].cells[0].innerHTML;
            table.rows[i].cells[0].innerHTML = table.rows[i].cells[1].innerHTML;
            table.rows[i].cells[1].innerHTML = temp;
        }
        for (let i = 1; i <= productCheckedNum; i++) {
            if (i == 1) {
                table.rows[i].cells[0].setAttribute("rowspan", productCheckedNum);
            } else {
                table.rows[i].cells[0].setAttribute("style", "display:none");
            }
        }
    }
    //当商品和地区都选择了多于一个，以商品为第一列，地区为第二列，商品列对同样的商品单元格进行合并
    if (regoinCheckedNum > 1 && productCheckedNum > 1) {
        for (let j = 0; j < table.rows.length; j++) {
            if (j % regoinCheckedNum == 1) {
                table.rows[j].cells[0].setAttribute("rowspan", regoinCheckedNum);
            } else if (j != 0) { //表头不处理
                table.rows[j].cells[0].setAttribute("style", "display:none");
            }
        }
    }
}
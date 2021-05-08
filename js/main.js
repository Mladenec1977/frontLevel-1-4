async function DataTable(config) {
    let headDiv = document.querySelector(config.parent);
    let elTable = document.createElement('table');
    let elThead = document.createElement('thead');
    let elTbody = document.createElement('tbody');
    let elTr = document.createElement('tr');


    let elTh = document.createElement('th');
    elTh.innerHTML = '№';
    elTr.appendChild(elTh);
    config.columns.forEach(elem => {
        elTh = document.createElement('th');
        elTh.innerHTML = elem.title;
        elTr.appendChild(elTh);
    })
    elTh = document.createElement('th');
    elTh.innerHTML = 'Действия';
    elTr.appendChild(elTh);
    // end Thead
    elThead.appendChild(elTr);

    // for create user
    elTr = document.createElement('tr');
    elTr.setAttribute('hidden', true);
    elTr.setAttribute('id', 'addUser');
    let elTd = document.createElement('td');
    elTd.innerHTML = 'add';
    elTr.appendChild(elTd);
    await config.columns.forEach(elem => {
        elTd = document.createElement('td');
        let alInput = document.createElement('input');
        if (elem.value === 'birthday') {
            alInput.setAttribute('type', 'date');
        } else {
            alInput.setAttribute('type', 'text');
        }
        alInput.setAttribute('name', elem.value);
        // alInput.setAttribute('required', true);
        elTd.appendChild(alInput);
        elTr.appendChild(elTd);
    })
    elTd = document.createElement('td');
    elTd.innerHTML = 'Enter';
    elTr.appendChild(elTd);

    elTbody.appendChild(elTr);

    let data1 = await loadData(config.apiUrl);
    let data = data1.data;

    let findElem = 60;
    let findMaxElem = 65;
    let num = 0;

    for (let i = 1; i <= findElem; i++) {
        if (data[i]) {
            num++;
            elTr = document.createElement('tr');
            elTd = document.createElement('td');
            elTd.innerHTML = num;
            elTr.appendChild(elTd);
            config.columns.forEach(elem => {
                elTd = document.createElement('td');
                if (data[i][elem.value].endsWith(".jpg")) {
                    let addImg = document.createElement('img');
                    addImg.setAttribute('href', data[i][elem.value]);
                    addImg.setAttribute('alt', elem.value);
                    elTd.appendChild(addImg);
                } else {
                    elTd.innerHTML = data[i][elem.value];
                }
                elTr.appendChild(elTd);
            })
            // add delete button
            elTd = document.createElement('td');
            let addBtn = document.createElement('button');
            addBtn.setAttribute('id', data[i].id);
            addBtn.setAttribute('name', 'button' + data[i].id);
            addBtn.setAttribute('class', 'delete');
            addBtn.setAttribute('onclick', 'deleteUser(' + data[i].id + ')');
            addBtn.innerHTML = 'Удалить';

            elTd.appendChild(addBtn);
            elTr.appendChild(elTd);
            elTbody.appendChild(elTr);
        } else if (findElem < findMaxElem) {
            findElem++;
        }
    }

    elTable.appendChild(elThead);
    elTable.appendChild(elTbody);
    headDiv.appendChild(elTable);
}

async function loadData(url) {
    let response = await fetch(url);
    if (response.ok) {
        return response.json();
    } else {
        console.log('Error');
        return null;
    }
}

const config1 = {
    parent: '#usersTable',
    columns: [
        {title: 'Имя', value: 'name'},
        {title: 'Фамилия', value: 'surname'},
        {title: 'Аватар', value: 'avatar'},
        {title: 'Дата рож', value: 'birthday'},
    ],
    apiUrl: "https://mock-api.shpp.me/arozgon/users"
};

DataTable(config1);

async function deleteUser(userId) {
    const url = config1.apiUrl + '/' + userId;
    const response = await fetch(url, {
        method: 'DELETE'
    });

    location.reload();
}

function addFormUser() {
    if (document.getElementById('addUser').hidden){
        document.getElementById('addUser').hidden = false;
        document.getElementById('userCreate').innerHTML = 'Скрыть'
    } else {
        document.getElementById('addUser').hidden = true;
        document.getElementById('userCreate').innerHTML = 'Добавить'
    }
}

window.addEventListener('keydown', function (even){
    if (!document.getElementById('addUser').hidden && even.code === 'Enter'){
        let dataInput = document.getElementById('addUser')
            .getElementsByTagName('input');
        let check = true;
        config1.columns.forEach(elem => {
            if (!dataInput[elem.value].value) {
                console.log('error' + dataInput[elem.value].value);
                dataInput[elem.value].style.background = 'red';
                check = false
            } else {
                dataInput[elem.value].style.background = 'white';
            }
        })
        if (check) {
            let dataSave = {
            'name': dataInput.name.value,
            'surname': dataInput.surname.value,
            'avatar': dataInput.avatar.value,
            'birthday': dataInput.avatar.value
            }
            addUser(config1.apiUrl, dataSave).then(r => {
                location.reload();
            })
        }
    }
})

async function addUser(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}
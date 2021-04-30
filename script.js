let userToken;
let message;
let link;
let pagesToShare = [];

const getTokenAndFetchPages = () => {
    userToken = document.getElementById('access-token').value;
    getAllPages();
    document.querySelector('.token-input').style.display = 'none';
    document.querySelector('.needed-data').style.display = 'block';
    document.querySelector('.buttons-after-login').style.display = 'block';
};

const getUserId = async () => {
    let requestUrl = `https://graph.facebook.com/me?fields=id&access_token=${userToken}`;
    return await fetch(requestUrl);
};

const getPagesList = async (id, token, url) => {
    let requestUrl = url
        ? url
        : `https://graph.facebook.com/${id}/accounts?fields=name,access_token&access_token=${token}`;
    return await fetch(requestUrl);
};

let pagesList = {};

const mergeJson = (oldJson, jsonToAdd) => {
    let oldJsonLength = Object.keys(oldJson).length;
    for (let i = 0; i < jsonToAdd.length; i++) {
        oldJson[`${oldJsonLength + i}`] = jsonToAdd[`${i}`];
    }
};

let postToPages = (list) => {
    let timeToWait = 0;
    // console.log(list);
    for (let pageData of list) {
        timeToWait += Math.round(5000 + Math.random() * 4000);
        setTimeout(() => {
            postToSinglePage(pageData);
        }, timeToWait);
    }
};

let postToSinglePage = (data) => {
    document
        .querySelector(`[data-pageid="${data.id}"]`)
        .parentNode.querySelector('.loader').style.display = 'inline-block';
    fetch(
        `https://graph.facebook.com/${data.id}/feed?message=${message}&link=${link}&access_token=${data.access_token}`,
        { method: 'POST' }
    )
        .then((response) => {
            let responseObj = response.json();
            if (typeof responseObj.error != 'undefined') {
                document
                    .querySelector(`[data-pageid="${data.id}"]`)
                    .parentNode.querySelector('.loader').style.display = 'none';
                document
                    .querySelector(`[data-pageid="${data.id}"]`)
                    .parentNode.querySelector('label')
                    .classList.add('request-error');
                console.log(data);
                console.log(responseObj);
            } else {
                document
                    .querySelector(`[data-pageid="${data.id}"]`)
                    .parentNode.querySelector('.loader').style.display = 'none';
                document
                    .querySelector(`[data-pageid="${data.id}"]`)
                    .parentNode.querySelector('label')
                    .classList.add('request-finished');
            }
        })
        .catch((err) => {
            document
                .querySelector(`[data-pageid="${data.id}"]`)
                .parentNode.querySelector('label')
                .classList.add('request-error');
            console.log(data);
            console.log(err);
        });
};

const renderPagesToScreen = (pages) => {
    let root = document.getElementById('root');
    for (let i = 0; i < Object.keys(pages).length; i++) {
        let element = renderCheckboxElement(pages[i], i);
        root.appendChild(element);
    }
};

const renderCheckboxElement = (pageData, index) => {
    let checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('id', `page${index}`);
    checkbox.setAttribute('name', `${pageData.name}`);
    checkbox.setAttribute('data-pageid', `${pageData.id}`);
    checkbox.setAttribute('value', `${pageData.access_token}`);
    let label = document.createElement('label');
    label.setAttribute('for', `page${index}`);
    label.innerHTML = `${pageData.name}`;
    let loader = document.createElement('div');
    loader.classList.add('loader');
    let wrapper = document.createElement('div');
    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    wrapper.appendChild(loader);
    return wrapper;
};

const getAllPages = (optionalUrl) => {
    getUserId()
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            return getPagesList(response.id, userToken, optionalUrl);
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            mergeJson(pagesList, response.data);
            if (typeof response.paging.next !== 'undefined') {
                console.log('Something in next');
                getAllPages(response.paging.next);
            } else {
                renderPagesToScreen(pagesList);
            }
        });
};

const selectAllPages = () => {
    let allPages = document.querySelectorAll('input[type=checkbox]');
    allPages.forEach((checkbox) => {
        checkbox.checked = true;
    });
};

const deselectAllPages = () => {
    let allPages = document.querySelectorAll('input[type=checkbox]');
    allPages.forEach((checkbox) => {
        checkbox.checked = false;
    });
};

const sendRequestForSelected = () => {
    document.querySelector('.post-to-selected').disabled = true;
    let selectedPages = document.querySelectorAll(
        'input[type=checkbox]:checked'
    );
    message = document.getElementById('post-message').value;
    link = document.getElementById('post-link').value;
    for (let i = 0; i < Object.keys(selectedPages).length; i++) {
        let objectToAdd = {};
        objectToAdd['access_token'] = selectedPages[i].value;
        objectToAdd['id'] = selectedPages[i].dataset.pageid;
        objectToAdd['name'] = selectedPages[i].name;
        pagesToShare.push(objectToAdd);
    }
    postToPages(pagesToShare);
};

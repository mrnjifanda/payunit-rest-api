function addAppFormLoader(element) {
    const elements = element.querySelectorAll('input, textarea, button, select, a');
    const button = element.querySelector('button[type="submit"]');

    elements.forEach(elem => elem.setAttribute('disabled', 'true'));

    const span = document.createElement('span');
    span.setAttribute('style', 'display: inline-block; margin-right: 5px')
    span.innerHTML = '<i class="fa fa-spinner fa-pulse"></i>';
    button.prepend(span);
}

function removeAppFormLoader(element) {
    const elements = element.querySelectorAll('input, textarea, button, select, a');
    const button = element.querySelector('button[type="submit"]');

    elements.forEach(elem => elem.removeAttribute('disabled'));
    remove(button.querySelector("span"));
}

function remove(element) {
    element.parentNode.removeChild(element);
}

const payForm = document.getElementById('pay-form')
payForm.addEventListener('submit', async function (e) {

    e.preventDefault()

    if (!window.fetch) {
        alert('Navigateur trop vieux')
        return false
    }

    const formData = new FormData(payForm)
    const myModal = new bootstrap.Modal(document.getElementById('exampleModal'))
        // myModal.show()
    // const data = Object.fromEntries(formData.entries());

    addAppFormLoader(this)

    await fetch(this.action, {
        method: this.method,
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            // "Content-Type": "application/json; charset=UTF-8",
            // "Accept": "application/json"
        },
        mode: 'no-cors',
        body: formData
    })
    .then(async response => {
        console.log(await response.text())
        console.log(await response.json())
    })
    .then(async jsonData => {
        console.log(await jsonData)
    })
    .catch(async err => {
            console.log(await err)
    })

    // try {
        // const response = await fetch(this.action, {
        //     method: this.method,
        //     headers: {
        //         "X-Requested-With": "XMLHttpRequest",
        //         // "Content-Type": "application/json; charset=UTF-8",
        //         // "Accept": "application/json"
        //     },
        //     mode: 'no-cors',
        //     body: formData
        // })

    //     console.log(response)
    //     const status = await response.status()
    //     console.log(status)

    //     // const text = await response.text()
    //     // console.log(text)


    //     const truc = await response.response
    //     console.log(truc)
        
    //     // const json = await response.json()
    //     // console.log(json)

    // } catch (error) {
    //     console.log(error.status)
    //     console.log(error)
    // }

    removeAppFormLoader(this);
})
let transaction = null

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


/**
 * 
 */

$('.container-modal').on('click', '.button', function () {

    if(transaction === null) {
        alert("No pending transaction")
        return;
    }

    var $btn = $(this),
        $step = $btn.parents('.modal-body'),
        stepIndex = $step.index(),
        $pag = $('.modal-header span').eq(stepIndex);

    if (stepIndex === 0) {
        if (!$('.container-modal .modal-body-step-1 .button').hasClass("disabled")) {
            
            step_two(transaction)
            step1($step, $pag);
        } else {
            alert("Select a payment method")
        }
        return
    }

    if (stepIndex === 0 || stepIndex === 1) {
        step1($step, $pag);
    } else {
        step3($step, $pag);
    }
});

$('.container-modal').on('click', '.payuni-card-item', function () {
    var $card = $(this)

    if(transaction === null) {
        alert("No pending transaction")
        return;
    }

    if($card.hasClass("disabled") ) {
        alert("Payment method not available at the moment")
    } else {
        $('.container-modal .payuni-card-item').removeClass("border border-success")
        $card.addClass("border border-success")
        transaction.gateway = $card.attr("data-gateway")
        transaction.logo = $card.find('img')[0].src
        console.log(transaction)
        $('.container-modal .modal-body-step-1 .button').removeClass("disabled")
    }
});


function step1($step, $pag) {
    console.log('step1');
    // animate the step out
    $step.addClass('animate-out');

    // animate the step in
    setTimeout(function () {
        $step.removeClass('animate-out is-showing')
            .next().addClass('animate-in');
        $pag.removeClass('is-active')
            .next().addClass('is-active');
    }, 600);

    // after the animation, adjust the classes
    setTimeout(function () {
        $step.next().removeClass('animate-in')
            .addClass('is-showing');

    }, 1200);
}


function step3($step, $pag) {
    console.log('3');

    // animate the step out
    $step.parents('.modal-wrap').addClass('animate-up');

    setTimeout(function () {
        $('.rerun-button').css('display', 'inline-block');
    }, 300);
}

$('.container-modal').on('click', '.rerun-button', function () {
    $('.modal-wrap').removeClass('animate-up')
        .find('.modal-body')
        .first().addClass('is-showing')
        .siblings().removeClass('is-showing');

    $('.modal-header span').first().addClass('is-active')
        .siblings().removeClass('is-active');
    $(this).hide();
});


/**
 * 
 */

function step_one(data) {
    const modal = document.querySelector(".container-modal")
    const step1 = modal.querySelector(".modal-body-step-1")

    step1.querySelector(".title").innerText = "Method of payment"
    step1.querySelector(".description").innerText = "Please kindly choose the payment method you want to use."

    let content = '<div>\
        <ul class="row payuni-card">'

    data.forEach(item => {
        content += htmlCard(item.provider_logo, item.provider_short_tag, item.provider_name)
    })

    content += `</ul></div>
        <div class="text-center mb-5">
            <div class="button disabled">Next Step</div>
        </div>`

    step1.querySelector(".step-content").innerHTML = content
}

function step_two(transaction) {
    console.log('eric')
    const modal = document.querySelector(".container-modal")
    const step2 = modal.querySelector(".modal-body-step-2")
    const name = transaction.gateway === "eu" ? `<input type="text" placeholder="Enter your name" required />` : ''

    step2.querySelector(".step-content").innerHTML = `<form action="http://localhost:6200/checkout" method="POST">
        <div class="card-body pb-0 text-center">
            <img src="${transaction.logo}" alt="${transaction.gateway}" style="height: 100px;">
            <h4 class="mt-3">Total: <strong class="text-success" style="font-size: 40px;">${transaction.amount}</strong> ${(transaction.currency || "XAF")}<h4>
        </div>
        <div style="margin-top: 20px; padding: 0 30px">
            <input type="hidden" name="transaction" value="${JSON.stringify(transaction)}" />
            ${name}
            <input type="number" placeholder="Enter the phone number" required />
        </div>
        <div class="text-center mb-5" style="display: flex; justify-content: space-be">
            <button type="button" class="rerun-button mr-1"><i class="fas fa-chevron-left"></i></button>
            <button type="submit" class="button">Pay now</button>
        </div>
    </form>`
}

function htmlCard(logo, short, name) {
    const disabled = (short === "paypal" || short === "stripe" ? true : false)
    const button = (disabled ? `<label${(disabled ? ' style="cursor: not-allowed;"' : "")}>${name}</label>` : `<label for="${logo}">${name}</label> <input type="hidden"  id="${logo}" value="${logo}">`)
    return `<li class="col-4">
        <div class="card payuni-card-item${(disabled ? ' disabled' : '')}" data-gateway="${short}">
            <div class="card-body pb-0 text-center">
                <img src="${logo}" alt="${name}">
                <div>${button}<div>
            </div>
        </div>
    </li>`
}

const payForm = document.getElementById('pay-form')
payForm.addEventListener('submit', async function (e) {

    e.preventDefault()

    if (!window.fetch) {
        alert('Navigateur trop vieux')
        return false
    }

    const formData = new FormData(payForm)

    const form = this
    addAppFormLoader(form)

    $.ajax({
        type: form.method,
        url: form.action,
        data: formData,
        processData: false,
        contentType: false,
        cache: false,
    })
    .done(function(data, text, jqxhr) {

        if (data.status === "SUCCESS" && data.message === 'ok') {

            transaction = data.transaction
            step_one(data.data)
            $(".container-modal").fadeIn()
        } else {

            alert(text)
            console.log(data)
            console.log(text)
            console.log(jqxhr)
        }
    })
    .fail(function(jqxhr) {
        console.log(jqxhr)
    })
    .always(function() {
        removeAppFormLoader(form);
    });
})
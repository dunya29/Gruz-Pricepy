const allModals = document.querySelectorAll(".js-modal")
const successModal = document.querySelector(".success-mod")
const errorModal = document.querySelector(".error-mod")
function checkIOS() {
    let platform = navigator.platform;
    let userAgent = navigator.userAgent;
    return (
        // iPhone, iPod, iPad
        /(iPhone|iPod|iPad)/i.test(platform) ||
        // iPad на iOS 13+
        (platform === 'MacIntel' && navigator.maxTouchPoints > 1 && !window.MSStream) ||
        // User agent проверка
        (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
    );
}
let isIOS = checkIOS()
//enable scroll
function enableScroll() {
    if (!document.querySelector(".modal.open")) {
        if (document.querySelectorAll(".fixed-block")) {
            document.querySelectorAll(".fixed-block").forEach(block => block.style.paddingRight = '0px')
        }
        document.body.style.paddingRight = '0px'
        document.body.classList.remove("no-scroll")
        // для IOS
        if (isIOS) {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            let scrollY = document.body.dataset.scrollY;
            window.scrollTo(0, parseInt(scrollY || '0'));
        }
    }
}
//disable scroll
function disableScroll() {
    if (!document.querySelector(".js-modal.open")) {
        let paddingValue = window.innerWidth > 350 ? window.innerWidth - document.documentElement.clientWidth + 'px' : 0
        if (document.querySelector(".fixed-block")) {
            document.querySelectorAll(".fixed-block").forEach(block => block.style.paddingRight = paddingValue)
        }
        document.body.style.paddingRight = paddingValue
        document.body.classList.add("no-scroll");
        // для IOS
        if (isIOS) {
            let scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${scrollY}px`;
            document.body.dataset.scrollY = scrollY;
        }
    }
}
//open modal
function openModal(modal) {
    disableScroll()
    $(modal).fadeIn(500);
    $(modal).addClass("open")
}
//close modal
function closeModal(modal) {
    if (modal) {
        $(modal).fadeOut(100);
        $(modal).removeClass("open")
    } else {
        $('.js-modal').fadeOut(100);
        $('.js-modal').removeClass("open")
    }
    $('#js-overlay').remove();
    setTimeout(() => {
        enableScroll()
    }, 100);
}
document.querySelectorAll(".main-mod").forEach((mod) => {
    mod.addEventListener("click", (e) => {
        if (!mod.querySelector(".modal__content").contains(e.target)) {
            closeModal(mod);
        }
    });
});
//setSuccessTxt
function setSuccessTxt(title = false, txt = false) {
    successModal.querySelector(".modal__title span").textContent = title ? title : "Заявка отправлена"
    if (txt) {
        successModal.querySelector(".modal__title p").textContent = txt
    }
}
//setErrorTxt
function setErrorTxt(title = false, txt = false) {
    errorModal.querySelector(".modal__title span").textContent = title ? title : "Что-то пошло не так"
    if (txt) {
        errorModal.querySelector(".modal__title p").textContent = txt
    }
}
// openSuccessMod
function openSuccessMod(title = false, txt = false) {
    setSuccessTxt(title, txt)
    openModal(successModal)
}
// openErrorMod
function openErrorMod(title = false, txt = false) {
    setErrorTxt(title, txt)
    openModal(errorModal)
}
// formSuccess
function formSuccess(form, title = false, txt = false) {
    form.querySelectorAll("input").forEach(inp => {
        inp.classList.remove("has-error")
        if (!["hidden", "checkbox", "radio"].includes(inp.type)) {
            inp.value = ""
        }
    })
    if (form.querySelector("[data-error]")) {
        form.querySelectorAll("[data-error]").forEach(err => {
            err.textContent = ""
        })
    }
    openSuccessMod(title, txt)
}
//headermobBtn
const headermobBtn = document.querySelector(".header__mobBtn")
if (headermobBtn) {
    headermobBtn.addEventListener('click', () => document.querySelector(".header__phones").classList.add("open"))
    document.querySelector(".header__phones-close").addEventListener('click', () => {
        document.querySelector(".header__phones").classList.remove("open")
    })
}
//fixed-menu
const fixedMenu = document.querySelector(".fixed-menu")
function showFixedMenu() {
    if (window.innerWidth <= 991 && window.innerHeight - document.querySelector(".footer").getBoundingClientRect().bottom <= 0) {
        fixedMenu.classList.remove("unshow")
    } else {
        fixedMenu.classList.add("unshow")
    }
}
if (fixedMenu) {
    showFixedMenu()
    window.addEventListener("resize", showFixedMenu)
    window.addEventListener("scroll", showFixedMenu)
}
window.addEventListener("resize", () => {
    if (window.innerWidth > 991.98 && document.querySelector('.burger').classList.contains("open")) {
        document.querySelector('.burger').click()
    }
})
//check-phone
const checkPhoneMod = document.querySelector(".check-phone")
let codeResTimeout
function checkVal() {
    checkPhoneMod.querySelector(".check-phone__code").value.length == 0 ?
        document.querySelector(".check-phone .request__btn").setAttribute("disabled", true) :
        document.querySelector(".check-phone .request__btn").removeAttribute("disabled")
    checkPhoneMod.querySelector(".check-phone__code").addEventListener("input", checkVal)
}
function openCheckPhoneMod(tel) {
    clearTimeout(codeResTimeout)
    openModal(checkPhoneMod)
    let val = +checkPhoneMod.getAttribute("data-timeout") || 30
    checkPhoneMod.querySelector(".modal__title span").textContent = `Проверка номера: ${tel}`
    checkPhoneMod.querySelector(".check-phone__content").innerHTML = `<button data-send-code="send" class="request__btn check-phone__send" type="button">Пройти проверку</button>`
    checkPhoneMod.addEventListener("click", e => {
        if (checkPhoneMod.querySelector(".check-phone__send").contains(e.target)) {
            val = +checkPhoneMod.getAttribute("data-timeout") || 30
            clearTimeout(codeResTimeout)
            checkPhoneMod.querySelector(".check-phone__content").innerHTML = `
            <div class="modal__lbl">Код подтверждения</div>
			<form action="" novalidate class="send-code">
                <div class="item-form">
                	<input type="text" pattern="\d*" maxlength="4" name="code" placeholder="0000" class="check-phone__code">
                    <span data-error></span>
                </div>
				<div class="modal__lbl modal__lbl-resend">Повторный запрос кода доступен через <span>${val}</span> сек.</div>
				<button class="request__btn send-code__submit" type="submit">подтвердить</button>
			</form>
            `
            checkPhoneMod.querySelector(".modal__title span").textContent = `Выслали проверочный код на телефон`
            checkVal()
            function changeTimeVal() {
                if (val > 0) {
                    document.querySelector(".modal__lbl-resend span").textContent = val
                    codeResTimeout = setTimeout(changeTimeVal, 1000);
                } else {
                    document.querySelector(".modal__lbl-resend").innerHTML = `<button type="button" data-send-code="resend" class="check-phone__resend check-phone__send">Отправить новый код</button>`
                }
                val--
            }
            changeTimeVal()
        }
    })
}
function setPhoneError(txt) {
    checkPhoneMod.querySelector(".item-form input").classList.add("has-error")
    checkPhoneMod.querySelector(".item-form [data-error]").textContent = txt
}
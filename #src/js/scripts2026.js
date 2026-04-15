const dropdown = document.querySelectorAll(".dropdown")
// === Dropdown === //
function openDropdown(item) {
    item.classList.add("open");
    item.setAttribute("aria-expanded", true);
    item.querySelectorAll(".dropdown__options input").forEach(inp => {
        inp.addEventListener("change", (e) => {
            setActiveOption(item)
        });
    });
    document.addEventListener("click", function clickOutside(e) {
        if (!item.contains(e.target)) {
            closeDropdown(item)
            document.removeEventListener('click', clickOutside);
        }
    });
}
function setActiveOption(item) {
    item.querySelector(".dropdown__header").classList.add("checked")
    if (item.classList.contains("radio-select")) {
        let activeInpTxt = item.querySelector("input:checked").nextElementSibling.innerHTML
        item.querySelector(".dropdown__header span").innerHTML = activeInpTxt
        closeDropdown(item)
    }
}
function closeDropdown(item) {
    item.classList.remove("open");
    item.setAttribute("aria-expanded", false);
}
dropdown.forEach(item => {
    item.querySelector(".dropdown__header").addEventListener("click", () => {
        item.classList.contains("open") ? closeDropdown(item) : openDropdown(item)
    })
})
// === Catalog Filter === //
const catFilter = document.querySelector(".cat-filter")
const catFilterCount = document.querySelector(".catFilter-btn span")
const catFilterSelected = document.querySelector(".filter-selected__items")
const catFilterReset = document.querySelectorAll(".catFilter-reset")
let catFilterObj
if (catFilter && catFilterSelected) {
    catFilterObj = {
        checkInp: function (inp) {
            inp.checked = true
            inp.setAttribute("checked", true)
        },
        uncheckInp: function (inp) {
            inp.checked = false
            inp.removeAttribute("checked")
        },
        setSelected: function (inp) {
            if (inp.type === 'radio' && inp.value === 'all') return
            let txt = inp.nextElementSibling.textContent
            let idx = inp.getAttribute("data-id")
            let inpName = inp.getAttribute("data-name")
            let selectedTxt = inpName ? `${inpName}: <span>${txt}</span>` : `<span>${txt}</span>`
            catFilterSelected.insertAdjacentHTML("afterbegin", `<li data-target="${idx}" data-group="${inpName}">${selectedTxt}<button type="button" class="btn btn-cross"></button></li>`)
        },
        removeSelected: function (id) {
            if (filterSelected.querySelector(`[data-target="${id}"]`)) {
                catFilterSelected.querySelector(`[data-target="${id}"]`).remove()
            }
        },
        selectedOnClick: function (e) {
            catFilterSelected.querySelectorAll("li").forEach(item => {
                if (item.querySelector(".btn-cross").contains(e.target)) {
                    let dataTarget = item.getAttribute("data-target")
                    let input = catFilter.querySelector(`.cat-filter__items label input[data-id='${dataTarget}']`)
                    if (!input) return
                    if (input.type === "radio") {
                        const allRadio = catFilter.querySelector(
                            `.cat-filter__items label input[data-name="${item.dataset.group}"][value="all"]`
                        )
                        if (allRadio) {
                            allRadio.click()
                        }
                    } else {
                        input.click()
                    }
                }
            })
            catFilterObj.checkedCount()
        },
        resetFilter: function () {
            catFilter.querySelectorAll(".cat-filter__items label input").forEach(inp => {
                catFilterObj.uncheckInp(inp)
            })
            const allRadio = catFilter.querySelector(".cat-filter__items label input[value='all']")
            if (allRadio) {
                catFilterObj.checkInp(allRadio)
            }
            catFilterSelected.innerHTML = ""
            catFilterObj.checkedCount()
        },
        checkedCount: function () {
            let count = catFilter.querySelectorAll(".cat-filter__items label input:checked:not([value='all'])").length
            catFilterCount.textContent = count > 0 ? ` ( ${count} )` : ""
            count > 0 ? catFilter.classList.add("show-reset") : catFilter.classList.remove("show-reset")
        }
    }
    catFilter.querySelectorAll(".cat-filter__items label input").forEach(item => {
        if (item.checked) {
            catFilterObj.setSelected(item)
        }
    })
    catFilter.addEventListener("click", e => {
        const catFilterItems = catFilter.querySelector(".cat-filter__items")
        if (catFilterItems) {
            catFilterItems.querySelectorAll("label input").forEach(inp => {
                if (inp.contains(e.target)) {
                    let id = inp.getAttribute("data-id")
                    if (inp.type === 'checkbox') {
                        inp.checked ? catFilterObj.setSelected(inp) : catFilterObj.removeSelected(id)
                    } else if (inp.type === 'radio') {
                        const existing = catFilterSelected.querySelector(`li[data-group="${inp.dataset.name}"]`)
                        if (inp.value === 'all') {
                            if (existing) existing.remove()
                            return
                        }
                        if (existing) {
                            existing.setAttribute("data-target", inp.getAttribute("data-id"))
                            existing.querySelector("span").textContent = inp.nextElementSibling.textContent
                        } else {
                            catFilterObj.setSelected(inp)
                        }
                    }
                }
            })
            catFilterObj.checkedCount()
        }
    })
    catFilterSelected.addEventListener("click", e => catFilterObj.selectedOnClick(e))
    catFilterReset.forEach(btn => btn.addEventListener("click", () => catFilterObj.resetFilter()))
    let resizeTimeout
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
            const modal = document.querySelector("#catFilter-mod")
            if (
                window.innerWidth > 667.98 &&
                modal &&
                typeof closeModal === "function"
            ) {
                closeModal(modal)
            }
        }, 300)
    })
}


const $slider = $('.instock__slider')

if (!$slider.hasClass('slick-initialized')) {
    $slider.slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        focusOnSelect: true,
        prevArrow: $('.instock .nav-btns .prev'),
        nextArrow: $('.instock .nav-btns .next'),
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    })
}

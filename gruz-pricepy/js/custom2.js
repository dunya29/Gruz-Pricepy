function processForm(msg, e, form, FLajax) {
    let messages = msg.messages || [];
    if(messages.length < 1 || messages[0] != 'saved') return;

    //console.log(msg);
    let form_id = messages[1] || false; 
    let phone = messages[2] || false;
    //console.log(form_id);
    $("body").data("formId", form_id);
    openCheckPhoneMod(phone);
}

$(document).ready(function(){
    $("#js-modal-check-phone").on("submit", "form", function(e){
        //отправляем код для проверки
        e.preventDefault();
        let form = $(this);
        let data = form.serialize() + '&action=sms&form_id=' + $("body").data("formId");
        //console.log(data);
        $.ajax({
            url: 'ajax.php',
            data: data,
            dataType: 'json',
            type: 'post',
            cache: false,
            beforeSend: function(){},
            success: function(msg){
                //console.log(msg);
                let status = msg.status || 'error';
                let message = msg.message || '';
                let fail = msg.fail || false;
                if(status == 'ok') {
                    //письмо отправлено
                    //alert('ok ' + message);
                    closeModal();
                    openSuccessMod('Заявка успешно отправлена!');
                    //Попросил повесить одну цель на все формы. Переопределяем с атрибута data-fl-yam-new на хардкод.
                    var FLyaMNew = 'allforms';
                    if (FLyaMNew !== undefined) {
                        FLajax.yaMetrikNew(FLyaMNew);
                    }
                    $(document).find("#form .FLresult").html('<div class="sent">Заявка успешно отправлена!</div>');
                } else {
                    setPhoneError(message);
                    if(fail) {
                        openErrorMod('Что-то пошло не так', message);
                    }
                }
            }
        })
    })

    $("#js-modal-check-phone").on("click", "[data-send-code]", function(){
        //формируем код для данной формы
        $.ajax({
            url: 'ajax.php',
            data: 'action=sms&method=make&form_id=' + $("body").data("formId"),
            dataType: 'json',
            type: 'post',
            cache: false,
            beforeSend: function(){},
            success: function(msg){
                //console.log(msg);
                let status = msg.status || 'error';
                let message = msg.message || '';
                let error_limits = msg.error_limits || false;
                if(status == 'ok') {
                    //код создан и отправлен
                    //alert('ok ' + message);
                } else {
                    if(error_limits) {
                        closeModal();
                        openErrorMod('Что-то пошло не так', message);
                    } else {
                        setPhoneError(message);
                    }
                    //alert('error ' + message);
                }
            }
        })
    })
})
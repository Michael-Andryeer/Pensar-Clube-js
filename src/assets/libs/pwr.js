 //var pwrst = 'https://app.powercrm.com.br/';
// var pwrst = 'https://localhost:8443/';
var pwrst = 'https://app.powercrm.com.br/';
var able = true;
var qttnCode;
var qttnVhclType;



function loadScript(url, callback) {

    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

loadScript(pwrst+'assets/external/js/jquery-3.1.0.min.js', function(){
	loadScript(pwrst+'assets/external/js/jquery.samask-masker.js', function(){
    loadScript('src/scripts/popper.min.js', function(){
      loadScript('src/scripts/bootstrap.min.js', function(){
        loadScript(pwrst+'assets/external/js/chosen.js', function(){
          // $('<link rel="stylesheet" href="'+pwrst+'assets/external/css/chosen.css" />').appendTo('body');
          loadPage();
        });
      });
    });
	});
});

var slsmnId = null;
var slsmnNwId = null;


// POWER CRM
var PowerCRM = PowerCRM || (function(){

    var pwrcrm = {};
    var cmpnHash;// Company hash
    return {
      init : function(Args, link) {
        cmpnHash = Args[0];
        try{if (slsmnId==null) slsmnId = localStorage.getItem('pwrsid');}catch(e){}
        try{if (slsmnNwId==null) slsmnNwId = localStorage.getItem('pwrid');}catch(e){}
        try{if (slsmnId==null || findGetParameter('sid')!=null) slsmnId = findGetParameter('sid');}catch(e){}
        try{if (slsmnNwId==null || findGetParameter('id')!=null) slsmnNwId = findGetParameter('id');}catch(e){}
        
        try{if (slsmnId!=null) localStorage.setItem('pwrsid',slsmnId);}catch(e){}
        try{if (slsmnNwId!=null) localStorage.setItem('pwrid',slsmnNwId);}catch(e){}
        
          // Mask Phone
        $('.pwr_form').find("#pwr_field_mobile").mask('(00) 00000-0000');
        
        $('.pwr_form').find('#pwr_step_2_back').unbind('click').click(function(){
          $(this).closest('.pwr_form').find('#pwr_step_1').show();
          $(this).closest('.pwr_form').find('#pwr_step_2').hide();
        });
        $('.pwr_form').find('#pwr_step_3_back').unbind('click').click(function(){
          $(this).closest('.pwr_form').find('#pwr_step_2').show();
          $(this).closest('.pwr_form').find('#pwr_step_3').hide();
        });

        // Validando o Nome
        $('.pwr_form').find("#pwr_field_name").keypress(function(){
          if($(this).val().length >= 2){
            $(this).addClass('input-true');
          }else{
            $(this).removeClass('input-true');
          }
        });

        // Validando o Nome
        $('.pwr_form').find("#pwr_field_mobile").keypress(function(){
          if($(this).val().length >= 2){
            $(this).addClass('input-true');
          }else{
            $(this).removeClass('input-true');
          }
        });

        // Validando o e-mail
        // $('.pwr_form').find("#pwr_field_email").keypress(function(){
        //   if(validateEmail($(this).val())){
        //     $(this).addClass('input-true');
        //   }else{
        //     $(this).removeClass('input-true');
        //   }
        // });


        $('.pwr_form').find('#pwr_step_1_next').unbind('click').click(function(){
          var obj = {
            h: cmpnHash,
            slsmnId: slsmnId,
            slsmnNwId: slsmnNwId,
            name: $(this).closest('.pwr_form').find('#pwr_field_name').val().trim(),
            email: $(this).closest('.pwr_form').find('#pwr_field_email').val().trim(),
            phone: $(this).closest('.pwr_form').find('#pwr_field_mobile').val().trim()
          }
          if (qttnCode!=null) obj.code = qttnCode;
          if (obj.name.length>1) {
            //if ((obj.email.length>0 && validateEmail(obj.email))) {

              if(obj.phone.length>0){
                var step1 = $(this).closest('.pwr_form').find('#pwr_step_1');
                var step2 = $(this).closest('.pwr_form').find('#pwr_step_2');
                $.ajax({type:'POST',url:pwrst+'qttnStep1',data:JSON.stringify(obj),cache:false,headers: {'Content-Type': 'application/json'},
                  success:function(response){
                    if (response.id>0){
                      qttnCode = response.back;
                      step1.hide();
                      step2.show();
                    }
                    else {
                      alert(response.text);
                    }
                  },error:function(e) {}
                });
              }else $(this).closest('.pwr_form').find('#pwr_field_mobile').attr('class', 'required');   
            //} else $(this).closest('.pwr_form').find('#pwr_field_email').attr('class', 'required');   
          } else $(this).closest('.pwr_form').find('#pwr_field_name').attr('class', 'required');        

        });

        $('.pwr_form').find('#pwr_field_type_car').unbind('change').change(function(){if ($(this).is(':checked')) updateBrands(Number($(this).val()));});
        $('.pwr_form').find('#pwr_field_type_motorcycle').unbind('change').change(function(){if ($(this).is(':checked')) updateBrands(Number($(this).val()));});
        $('.pwr_form').find('#pwr_field_type_truck').unbind('change').change(function(){if ($(this).is(':checked')) updateBrands(Number($(this).val()));});

        $('.pwr_form').find('#pwr_field_brand').unbind('change').change(function(){
          var yearField = $(this).closest('.pwr_form').find('#pwr_field_year');
          yearField.html('<option value="0">Buscando vers&otilde;es..</option>');
          $.ajax({type:'GET',url:pwrst+'bmy',data:{cb:$(this).val()},cache:false,
            success:function(lst){
              yearField.html('');
              yearField.append('<option value="0">Selecione a vers&atilde;o</option>');
              var auto = yearField.attr('auto');
              for (var i = 0; i < lst.length; i++) {var it=lst[i];yearField.append('<option value="'+it.id+'"'+((!isNaN(auto) && auto>0&&it.text.indexOf(auto)>=0)?'selected="selected"':'')+'>'+it.text+'</option>');}
            },error:function(e) {}
          });
        });

        $('.pwr_form').find('#pwr_field_year').unbind('change').change(function(){
          var modelField = $(this).closest('.pwr_form').find('#pwr_field_model');
          modelField.html('<option value="0">Buscando modelos..</option>');
          $.ajax({type:'GET',url:pwrst+'cmby',data:{cb:modelField.closest('.pwr_form').find('#pwr_field_brand').val(), cy:$(this).val()},cache:false,
            success:function(lst){
              modelField.html('');
              modelField.append('<option value="0">Selecione o modelo</option>');
              for (var i = 0; i < lst.length; i++) {var it=lst[i];modelField.append('<option value="'+it.id+'">'+it.text+'</option>');}
            },error:function(e) {}
          });
        });

        $('.pwr_form').find('#pwr_step_2_next').unbind('click').click(function(){
          var obj = {
            code: qttnCode,
            h: cmpnHash,
            vhclTyp: Number(qttnVhclType),
            vhclModel: Number($(this).closest('.pwr_form').find('#pwr_field_model').val()),
            vhclYear: Number($(this).closest('.pwr_form').find('#pwr_field_year').val()),
          }
          if (obj.vhclTyp!=null && !isNaN(obj.vhclTyp) && obj.vhclTyp>0) {
            if (obj.vhclModel!=null && !isNaN(obj.vhclModel) && obj.vhclModel>0 && obj.vhclYear!=null && !isNaN(obj.vhclYear) && obj.vhclYear>0) {
              var step2 = $(this).closest('.pwr_form').find('#pwr_step_2');
              var step3 = $(this).closest('.pwr_form').find('#pwr_step_3');
              $.ajax({type:'POST',url:pwrst+'qttnStep2',data:JSON.stringify(obj),cache:false,headers: {'Content-Type': 'application/json'},
                success:function(response){
                  if (response.id>0){
                    step2.hide();
                    step3.show();
                  }
                  else {
                    alert(response.text);
                  }
                },error:function(e) {}
              });
            } else alert('Qual o seu veículo?');
          } else alert('Qual o tipo do seu veículo?');
        });

        $('.pwr_form').find('#pwr_field_state').unbind('change').change(function(){
          var cityField = $(this).closest('.pwr_form').find('#pwr_field_city');
          cityField.html('<option value="0">Buscando cidades..</option>');
          $.ajax({type:'GET',url:pwrst+'ct',data:{st:$(this).val()},cache:false,
            success:function(lst){
              cityField.html('');
              cityField.append('<option value="0"></option>');
              for (var i = 0; i < lst.length; i++) {
                var it=lst[i];cityField.append('<option value="'+it.id+'">'+it.text+'</option>');
              }
            },error:function(e) {}
          });
        });

        $('.pwr_form').find('#pwr_field_state').html('<option value="0">Buscando estados..</option>');
        $.ajax({type:'GET',url:pwrst+'stt',data:{},cache:false,
          success:function(lst){
            $('.pwr_form').find('#pwr_field_state').html('');
            $('.pwr_form').find('#pwr_field_state').append('<option value="0">Selecione</option>');
            for (var i = 0; i < lst.length; i++) {
              var it=lst[i];$('.pwr_form').find('#pwr_field_state').append('<option value="'+it.id+'">'+it.text+'</option>');
            }
          },error:function(e) {}
        });

        $('.pwr_form').find('#pwr_step_3_go').unbind('click').click(function(){
          var obj = {
            code: qttnCode,
            h: cmpnHash,
            cty: Number($(this).closest('.pwr_form').find('#pwr_field_city').val()),
            workVehicle: $(this).closest('.pwr_form').find('#pwr_field_uber').is(':checked'),
          }
          if (obj.cty!=null && !isNaN(obj.cty) && obj.cty>0) {
            $.ajax({type:'POST',url:pwrst+'qttnStep3',data:JSON.stringify(obj),cache:false,headers: {'Content-Type': 'application/json'},
              success:function(response){
                if (response.id<=0) {
                  if (response.text.trim()=='notable') window.location = pwrst+'noPlan?h='+cmpnHash;
                  else alert(response.text);
                }
                else {
                  window.location = pwrst+'newQuotation?h='+qttnCode;
                }
              },error:function(e) {}
            });
          } else alert('Qual a sua cidade?');
        });

        $.ajax({type:'POST',url:pwrst+'getCompanyGlobalData',data:JSON.stringify({h: cmpnHash,slsmnId: slsmnId,slsmnNwId: slsmnNwId}),cache:false,headers: {'Content-Type': 'application/json'},
          success:function(response){
            $('.pwrImgLogo').attr('src',pwrst+'cmpnImg?h='+response.h);
            $('.cmpnFvIcn').attr('href',pwrst+'cmpnFvIcn?h='+response.h);
            $('.pwrImgLogo').show();
            $('.pwrBackColor').css('background-color',response.color);
            $('.pwrContentName').html(response.name);
            if (response.consultantId!=null) {
              $('.pwrConsultantExists').show();
              $('.pwrConsultantPhone').html(response.consultantPhone);
              if (response.consultantPhone.trim().indexOf("+55")!=0 && response.consultantPhone.trim().indexOf("55")!=0) response.consultantPhone = "55"+response.consultantPhone;
              $('.pwrConsultantExists').attr("href","https://api.whatsapp.com/send?phone="+response.consultantPhone.replace("(","").replace(")","").trim().replace(" ","").replace("-","")+"&text=Olá "+response.consultantName+", quero fazer uma cotação.");
              $('.pwrConsultantName').html(response.consultantName);
              $('.pwrConsultantEmail').html(response.consultantEmail);
              $('.pwrConsultantPicture').attr('src',pwrst+'slsmnPc?i='+response.consultantId);
            }
            else {
              $('.pwrConsultantPhone').html('');
              $('.pwrConsultantName').html('');
              $('.pwrConsultantEmail').html('');
              $('.pwrConsultantExists').hide();
            }
          },error:function(e) {}
        });


        // Aqui


      }
    };
}());

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

function updateBrands(type) {
  qttnVhclType = Number(type);
  $('.pwr_form').find('#pwr_field_brand').html('<option value="0">Buscando marcas..</option>');
  $.ajax({type:'GET',url:pwrst+'cb',data:{type:Number(type)},cache:false,
    success:function(lst){
      $('.pwr_form').find('#pwr_field_brand').html('');
      $('.pwr_form').find('#pwr_field_brand').append('<option value="0">Selecione</option>');
      for (var i = 0; i < lst.length; i++) {var it=lst[i];$('.pwr_form').find('#pwr_field_brand').append('<option value="'+it.id+'">'+it.text+'</option>');}
    },error:function(e) {}
  });
}

function validateEmail(email) {
	var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
}
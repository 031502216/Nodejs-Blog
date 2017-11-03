$(function(){
    $('#login').find('a').on('click', function(){
        $('#register').show();
        $('#login').hide();
    });

    $('#register').find('a').on('click', function(){
        $('#login').show();
        $('#register').hide();
    });

    $('#register').find('button').on('click', function(){
        $.ajax({
            type : 'POST',
            url : '/api/user/register',  
            dataType : 'json',
            data : {
                username : $('#register').find('[name="register_username"]').val(),
                password :  $('#register').find('[name="register_password"]').val(),
                repassword : $('#register').find('[name="reregister_password"]').val()
            },
            success : function(result){
                $('#register').find('.alert').find('p').html(result.message);
                $('#register').find('.alert').removeClass('hide');
                if(result.code == 0){
                    $('#register').find('.alert').addClass('hide');
                    setTimeout(function(){
                        $('#login').show();
                        $('#register').hide();
                    },1000);
                }
                
            }
        });
    })

});
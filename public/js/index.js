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
                console.log(result);
            }
        });
    })

});
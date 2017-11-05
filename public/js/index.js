$(function(){
    $('#login').find('a').on('click', function(){
        $('#register').show();
        $('#login').hide();
    });

    $('#register').find('a').on('click', function(){
        $('#login').show();
        $('#register').hide();
    });

    // 注册
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
                    alert('注册成功');
                    $('#register').find('.alert').addClass('hide');
                    // setTimeout(function(){
                    //     $('#login').show();
                    //     $('#register').hide();
                    // },1000);
                    window.location.reload();
                }
                
            }
        });
    });

    // 登陆
    $('#login').find('button').on('click', function(){
        $.ajax({
            type : 'POST',
            url : '/api/user/login',  
            dataType : 'json',
            data : {
                'username' : $('#login').find('[name="login_username"]').val(),
                'password' :  $('#login').find('[name="login_password"]').val()
            },
            success : function(result){
                if (result.code == 0) {
                    alert('登陆成功');
                    window.location.reload();
                }
                else{
                    $('#login').find('.alert').find('p').html(result.message);
                    $('#login').find('.alert').removeClass('hide');
                }
            }
        });
    });

    //退出登录
    $('#logout').on('click', function(){
        $.ajax({
            url : '/api/user/logout',  
            success : function(result){
                if (result.code == 0) {
                    alert('退出成功');
                    window.location.reload();
                }
            }
        });
    });

    

});
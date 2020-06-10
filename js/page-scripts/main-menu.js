var main_menu = {
    in:{
        0: {
            url: htaccess.home,
            text:'Moje kontakty',
            cache: 0
        },
        1: {
            url: htaccess.tarifs,
            text:'Ceny/tarify',
            cache: 1
        },
        2: {
            url: htaccess.profile,
            text:'Účet',
            cache: 0
        },
        3: {
            url: htaccess.bulletins,
            text: 'bulletins',
            cache: 1
        },
        4: {
            url: logout,
            text: 'Odhlásit <span class="fa fa-logout"></span>',
            cache: 1
        }
    },
    out:{
        0: {
            url: htaccess.tarifs,
            text:'Ceny/tarify',
            cache: 1
        },
        1: {
            url: htaccess.register,
            text:'Nový účet',
            cache: 1
        },
        2: {
            url: htaccess.login,
            text:'Přihlásit <span class="fa fa-login"></span>',
            cache: 1
        }
    }
};